/* Aris's tools and the loop that runs them (see docs/aris-tool-calling.md).
   The model chooses a tool; this file checks the input against the projects
   the site renders, runs it, and tells the browser what to do.

   The response to the browser is newline-delimited JSON, one event a line:

     {"type":"text","text":"..."}    a piece of the answer, as it arrives
     {"type":"reset"}                drop the text so far: it led into a tool
                                     call, and the real answer follows
     {"type":"action","action":"open","url":"/projects/<slug>"}

   The model's words only ever travel inside a text event's JSON string, so
   nothing it writes can pass for an action. */

import { caseStudyPath, getProject, projectAsKnowledge, projects } from "./projects.ts";

export const MAX_TOOL_STEPS = 3;

const slugInput = {
  type: "object",
  properties: {
    slug: {
      type: "string",
      enum: projects.map((p) => p.slug),
      description: "The project's slug, exactly as listed.",
    },
  },
  required: ["slug"],
  additionalProperties: false,
};

export const TOOLS = [
  {
    name: "get_project",
    description:
      "Look up one of Agrim's listed projects and get its summary: status, role, stack, links, problem, approach and impact. Use it when the visitor asks about a specific project and you want its details in front of you. It changes nothing on the visitor's screen.",
    input_schema: slugInput,
  },
  {
    name: "open_case_study",
    description:
      "Open a project's case study on the visitor's screen. Use it only when the visitor explicitly asks to see, open, show or go to a project or its case study. Never use it for a question about a project, and never for anything that is not one of the listed projects. It returns the action the site performed; if it returns an error, nothing was opened.",
    input_schema: slugInput,
  },
];

type ToolOutcome = {
  content: string;
  is_error?: true;
  action?: { action: "open"; url: string };
};

/* Runs one tool call. The slug must be a listed project's; anything else is
   an error result for the model to read, never an exception. */
export function runTool(name: string, input: unknown): ToolOutcome {
  const slug = (input as { slug?: unknown } | null)?.slug;
  const project = typeof slug === "string" ? getProject(slug) : undefined;
  if (!project) return { content: "Unknown project. Use one of the listed slugs.", is_error: true };
  if (name === "get_project") return { content: projectAsKnowledge(project) };
  if (name === "open_case_study") {
    // Built here from the site's own data, never from the model's text.
    const action = { action: "open" as const, url: caseStudyPath(project.slug) };
    return { content: JSON.stringify(action), action };
  }
  return { content: "Unknown tool.", is_error: true };
}

/* Logs a failure for the server's log: the message only, never the request,
   and the API key redacted in case anything ever echoes it. */
export function logError(label: string, detail: unknown, apiKey: string) {
  const text = detail instanceof Error ? `${detail.name}: ${detail.message}` : String(detail);
  console.error(`${label}: ${text.replaceAll(apiKey, "[redacted]")}`);
}

type TextBlock = { type: "text"; text: string };
type ToolUseBlock = { type: "tool_use"; id: string; name: string; input: unknown };
type Message = { role: "user" | "assistant"; content: string | object[] };

/* Reads one streamed model turn: text goes to `onText` as it arrives, tool
   calls are collected, and the turn's blocks come back whole. */
async function readTurn(body: ReadableStream<Uint8Array>, onText: (text: string) => void) {
  const blocks: (TextBlock | (ToolUseBlock & { json: string }))[] = [];
  let stopReason: string | null = null;
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      let event;
      try {
        event = JSON.parse(trimmed.slice(5));
      } catch {
        continue; // keep-alive lines and any non-JSON data frames
      }
      const block = blocks[event.index];
      if (event.type === "content_block_start") {
        const start = event.content_block;
        blocks[event.index] =
          start?.type === "tool_use"
            ? { type: "tool_use", id: start.id, name: start.name, input: {}, json: "" }
            : { type: "text", text: "" };
      } else if (event.type === "content_block_delta" && block) {
        if (block.type === "text" && event.delta?.type === "text_delta" && event.delta.text) {
          block.text += event.delta.text;
          onText(event.delta.text);
        } else if (block.type === "tool_use" && event.delta?.type === "input_json_delta") {
          block.json += event.delta.partial_json ?? "";
        }
      } else if (event.type === "message_delta") {
        stopReason = event.delta?.stop_reason ?? stopReason;
      } else if (event.type === "error") {
        throw new Error(`Anthropic stream error: ${event.error?.type}`);
      }
    }
  }

  const content: (TextBlock | ToolUseBlock)[] = [];
  for (const block of blocks) {
    if (!block) continue;
    if (block.type === "text") {
      if (block.text) content.push(block);
      continue;
    }
    // Malformed input becomes {}, which runTool rejects like any bad slug.
    let input: unknown = {};
    try {
      const parsed = JSON.parse(block.json || "{}");
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) input = parsed;
    } catch {}
    content.push({ type: "tool_use", id: block.id, name: block.name, input });
  }
  return { content, stopReason };
}

/* Answers one visitor message. Returns the event stream for the browser, or
   null if the first call to the model fails (already logged).

   A question that needs no tool is one call, streamed as it arrives. When a
   turn ends in tool calls they are run, their results go back as one user
   turn, and the model is called again, for at most MAX_TOOL_STEPS rounds;
   the call after the last round forbids tools, so it has to answer. */
export async function answer(
  apiKey: string,
  request: { model: string; max_tokens: number; system: string; messages: Message[] }
): Promise<ReadableStream<Uint8Array> | null> {
  const messages = [...request.messages];

  async function call(final: boolean) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        ...request,
        messages,
        stream: true,
        // The tools stay on the final call because the conversation now
        // holds tool blocks; tool_choice none is what stops another call.
        tools: TOOLS,
        ...(final && { tool_choice: { type: "none" } }),
      }),
    });
    if (res.ok && res.body) return res.body;
    const errText = await res.text().catch(() => "");
    logError("Anthropic API error", `${res.status} ${errText.slice(0, 500)}`, apiKey);
    return null;
  }

  const first = await call(false);
  if (!first) return null;

  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: object) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      try {
        let body = first;
        for (let step = 1; ; step++) {
          let wroteText = false;
          const turn = await readTurn(body, (text) => {
            wroteText = true;
            emit({ type: "text", text });
          });
          const calls = turn.content.filter((b) => b.type === "tool_use");
          if (turn.stopReason !== "tool_use" || !calls.length || step > MAX_TOOL_STEPS) break;
          if (wroteText) emit({ type: "reset" });

          const results = calls.map((c) => {
            const outcome = runTool(c.name, c.input);
            // The slug is the model's, so it is quoted and cut short; the
            // visitor's message is never logged.
            const slug = JSON.stringify(String((c.input as { slug?: unknown }).slug).slice(0, 60));
            console.log(
              `Aris tool: ${c.name} slug=${slug} ${outcome.is_error ? "rejected" : "allowed"} step=${step}`
            );
            if (outcome.action) emit({ type: "action", ...outcome.action });
            return {
              type: "tool_result",
              tool_use_id: c.id,
              content: outcome.content,
              ...(outcome.is_error && { is_error: true }),
            };
          });
          messages.push({ role: "assistant", content: turn.content }, { role: "user", content: results });

          const next = await call(step === MAX_TOOL_STEPS);
          if (!next) throw new Error("the model call after a tool step failed");
          body = next;
        }
      } catch (err) {
        logError("Chat stream error", err, apiKey);
        controller.error(err);
        return;
      }
      controller.close();
    },
  });
}
