# Personal Portfolio — agrimsharma.com

My personal portfolio site. It introduces who I am, the projects I've built, my
experience, and how to get in touch. Live at
[agrimsharma.com](https://agrimsharma.com).

I built it from scratch rather than using a template, so the layout, animations,
and content are all my own.

## Built with

- **Next.js** (App Router) and **React**
- **TypeScript**
- **Tailwind CSS** for styling
- **shadcn/ui** for base components
- Hand-written animation components (fade-in, typewriter, count-up) with
  reduced-motion support
- Deployed on **Vercel**

## Running it locally

You'll need Node.js 18 or newer.

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
  app/           Next.js app router pages and layout
  components/    Each section of the site (hero, about, projects, etc.)
  components/ui/ shadcn/ui base components
public/          Images and the resume PDF
```

Each section of the page is its own component in `src/components`, which keeps
the content easy to find and edit.

## Notes

- Security headers (CSP, HSTS, X-Frame-Options, and others) are configured in
  `next.config.ts`.
- Images are optimised and served through the Next.js image pipeline.