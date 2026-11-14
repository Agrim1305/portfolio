# Aris tool calling

Aris, the chat assistant on agrimsharma.com, can do two things beyond writing
an answer: look a project up, and open a project's case study on the
visitor's screen. It does both through Claude's tool calling. The model
chooses an action, the server checks it and runs it, and the browser acts on
the result. The model never touches the page directly.

The code is in `src/lib/aris-tools.ts` (the tools and the loop),
`src/app/api/chat/route.ts` (the endpoint and its limits) and
`src/components/ask-agrim.tsx` (the browser side). The tests are in
`tests/aris-tools.test.ts` and `e2e/interactions.spec.ts`.

## The two tools

- `get_project(slug)` returns one project's summary, from the same data that
  renders the site and fills the assistant's knowledge base.
- `open_case_study(slug)` returns `{ "action": "open", "url": "/projects/<slug>" }`
  and tells the browser to open that case study.

Each takes one input, `slug`, and its schema lists the allowed values.

## The loop

For each message a visitor sends:

1. The server sends the conversation to the model, with the two tools, and
   reads the reply as a stream.
2. If the reply is plain text, it goes to the browser piece by piece as it
   arrives, and that is the end. A question that needs no tool costs exactly
   one API call, the same as before tools existed.
3. If the reply ends with the model asking for tools (`stop_reason` is
   `tool_use`), the server runs every tool it asked for, adds the model's
   turn and one user turn holding the results (each matched to its request by
   `tool_use_id`) to the conversation, and calls the model again.
4. Steps 2 and 3 repeat until the model answers in text.

A typical tool question is two calls: one where the model asks for the tool,
one where it writes the answer.

If the model says something before asking for a tool ("Let me look that
up"), the browser has already shown it. The server then sends a `reset`
event, the browser clears the bubble, and the visitor sees one answer, not
two halves.

## The 3-step cap

The model gets at most three rounds of tool use per visitor message. After
the third, the server makes one last call with `tool_choice` set to `none`,
which means the model is not allowed to ask for a tool and has to answer in
words. The tools stay in that request because the conversation now contains
tool blocks, and the API needs their definitions to read them.

So one visitor message can never cost more than four API calls, however the
model behaves. Without a cap, a confused model (or a visitor trying to make
it loop) could spend credits without ever answering. The rate limit of 20
messages per 10 minutes counts visitor messages, not API calls, so the cap is
what bounds the cost of each one.

## The allowlist

The only slugs the tools accept are the slugs in `src/lib/projects.ts`, the
file the home page cards and case study pages are built from. The list is
read from that data, not typed by hand, so adding a project adds it to the
tools and nothing else needs to change.

The schema tells the model which slugs exist, but the server does not trust
that: it looks every slug up itself. An unknown slug, a missing one, or
input that is not valid JSON gets a `tool_result` marked `is_error: true`
with a short message, so the model can tell the visitor it could not do it.
Nothing throws, and no action is sent to the browser.

The browser checks again. It opens a case study only if the URL is exactly
`/projects/<slug>` for a listed slug on the site's own origin. Anything else
is dropped. Two checks, because either one failing alone should not be
enough to send a visitor somewhere else.

## Why the tools are read-only

Anyone on the internet can type anything into the chat, including
instructions aimed at the model. The safest answer to "what if someone talks
the model into misusing a tool" is for there to be nothing worth misusing.
Both tools only read data that is already public on the site, and the one
visible effect, opening a case study, is something any visitor can do with a
click. Nothing is written, sent, bought or deleted. The worst a successful
prompt injection can do is open one of Agrim's own project pages.

## Why the server builds the URL

The model only ever supplies a slug. The server checks the slug against the
allowlist and then writes the URL itself, from its own copy of the slug. No
text the model writes is ever used as a URL.

If the model wrote the URL, a visitor could ask it to "open
https://evil.example" and the question would become whether the model
refuses. Models can be talked into things, so that is the wrong place for
the guarantee. This way the model has no way to express an outside address
at all: an unknown slug is rejected, and a known one can only turn into that
project's page.

The same reasoning shapes what the browser receives. The response is a
stream of JSON events, one per line: `text`, `reset` and `action`. The
model's words only travel inside a `text` event's string, so even if the
model writes something that looks like an action event, it arrives as text
and is shown as text.

## Logging

Each tool call writes one line to the server log: the tool's name, the slug
it was given, whether it was allowed or rejected, and the step number.
Visitor messages are never logged, and errors go through `logError`, which
redacts the API key.

## What did not change

The rate limit, the 500-character message cap, the six-turn history window,
`max_tokens`, every existing system prompt rule, and the API key staying on
the server. The system prompt gained one line: use tools only to look up or
open a listed project, and never claim to have opened something unless the
tool returned it.
