# Personal Portfolio, agrimsharma.com

My personal portfolio. It introduces who I am, the projects I've built, my
experience, and how to get in touch. Live at
[agrimsharma.com](https://agrimsharma.com).

Built from scratch rather than from a template, so the layout, interactions, and
content are my own.

## Built with

- **Next.js** (App Router) and **React**
- **TypeScript**
- **Tailwind CSS v4**
- A streaming **AI assistant** ("Ask about Agrim") backed by the Anthropic API,
  grounded in a local knowledge base (`src/lib/knowledge-base.md`)
- Hand-written interaction components (drafting-grid cursor field, scroll
  reveals, registration-mark hero entrance) with `prefers-reduced-motion`
  support
- Deployed on **Vercel**

## Running it locally

Requires Node.js 20.9 or newer. Set `ANTHROPIC_API_KEY` in `.env.local` for the
AI assistant.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
npm run build
npm start
```

## Project structure

```
src/
  app/           App Router entry, layout, metadata, and the /api/chat route
  components/    One component per section (hero, projects, leadership, …)
  lib/           Knowledge base the AI assistant answers from
public/          Images and the resume PDF
```

## Notes

- Security headers (CSP, HSTS, X-Frame-Options, and others) are configured in
  `next.config.ts`.
- Images are optimised and served through the Next.js image pipeline.
- `/api/chat` streams responses from Claude and answers only from the knowledge
  base, with a small in-memory rate limit.
