# Agrim Sharma — Knowledge Base

This file is the ONLY source of truth for the AI assistant on this portfolio.
The assistant must not answer from anything outside this file. If a question
isn't answered here, the assistant says so honestly instead of guessing.

---

## Identity & Status

Agrim Sharma is a final-year Computer Science student at the University of
Adelaide, majoring in Artificial Intelligence, graduating December 2026.
Based in Adelaide, South Australia. Available for graduate roles and can
start immediately. Looking for graduate and internship roles in software
engineering, AI, data, and analytics.

GPA: 5.2/7.0, holds a 15% International Merit Scholarship.

---

## About

Agrim focuses on full-stack web development and likes building things real
people end up using. His main project is MetaPlay, a full-stack web app
where people can search, track, and review games — built end to end
including the database, login system with Google sign-in, and an admin
area, deployed so anyone can use it.

He is currently building two more products: Baseline, a tool that lets
tennis coaches log sessions by voice instead of typing, and Receipt
Extractor, a tool that reads Australian GST automatically from receipts.

Outside code: Agrim has played tennis for fifteen years. He reached a top
90 national ranking in India at under-18 level, trained at the Rafa Nadal
Academy in Spain, and competed in junior ITF tournaments across India and
Nepal. For the last three years he has coached players of all ages at Tea
Tree Gully Tennis Club in Adelaide.

---

## Projects

### MetaPlay (Flagship — Live)
Status: Live, 2025. Stack: Vue.js, Node.js, Express, MySQL, Passport.js.
Live: https://metaplay-production.up.railway.app/
Source: https://github.com/Agrim1305/Metaplay

Problem: Gamers track what they play across scattered notes, spreadsheets,
and memory. The brief was a single place to discover games, build a
collection, and review them, backed by real game data rather than a static
seed list.

Approach: Agrim worked in a five-person team and owned the front-end and
back-end integration. He built the authentication layer (email/password
plus Google sign-in across three roles: admin, user, guest), and designed
a normalised MySQL schema across eight tables. After the course ended he
came back to it on his own, fixed the remaining issues end to end, wired
it up to live RAWG game data, and deployed it to production.

Impact: Runs live today with personalised dashboards, collections,
reviews, and an admin panel, pulling real-time data from the RAWG API. It
is the deployed version of a team project he took the rest of the way and
shipped himself.

### Virtual Restaurant Simulator (Engineering)
Status: C++, 2025. Stack: C++, OOP, Makefile.
Source: https://github.com/Agrim1305/Virtual_Restaurant_Simulator

Problem: Model a working restaurant in C++ — staff, menus, orders,
inventory — and keep it maintainable as new staff types and behaviours
get added, instead of collapsing into one giant switch statement.

Approach: Designed an object-oriented hierarchy with a Person base class
extended by Employee, Chef, and Head Chef, using inheritance and virtual
methods so each role defines its own behaviour through a shared
interface. State is persisted to and reloaded from files so a session can
be saved and resumed.

Impact: A command-line simulation that runs a full restaurant cycle and
stays easy to extend — adding a new staff type just means adding a class.
This is the project where Agrim learned to think in clean class
boundaries and polymorphism.

### Pathfinder AI Agent (Engineering)
Status: Python, 2026. Stack: Python, Propositional Logic, Search.

Problem: An agent is dropped into a grid it cannot fully see, with hidden
hazards scattered around it. It has to reach the goal without dying by
reasoning from limited clues, tracking what it knows and working out
what's safe to do next.

Approach: Built a propositional knowledge base recording facts the agent
senses, with inference rules deducing which neighbouring cells are safe.
On top of that, a search strategy picks the next move under uncertainty,
preferring proven-safe cells and only taking a calculated risk when
forced.

Impact: The agent navigates hidden environments reliably and scored 10/10
on the course autograder across every hidden test map. Agrim's clearest
example of logic-based AI and reasoning under uncertainty, written and
tested entirely in Python.

Note: this is a separate, simpler implementation from the course's Wumpus
World assignment — the Wumpus World code lives in a university harness
that can't be published publicly, so it isn't linked from the portfolio.
The Pathfinder repo contains only Agrim's own original code.

### GPS Tracker Dashboard (Engineering)
Status: Java, 2026. Stack: Java, Sodium FRP, JUnit.
Source: https://github.com/Agrim1305/gps-frp-tracker

Problem: A live tracking dashboard has to react to a continuous stream of
location updates and raise alerts as they arrive, without the tangle of
shared mutable state and manual event wiring that normally makes
real-time UIs fragile.

Approach: Modelled location updates and alerts as composable event
streams using functional reactive programming in Java, so data flows
through transformations instead of being mutated in place. Designed the
data model and event-handling logic with OOP principles, covered with
unit tests targeting tricky edge cases.

Impact: A real-time dashboard that updates cleanly as new data arrives,
with no shared mutable state and 19 passing unit tests. Where Agrim
learned to handle streaming data and event-driven design properly.

### Baseline (In Development)
Stack: Next.js, TypeScript, FastAPI, Whisper, PostgreSQL.

Problem: Agrim coaches tennis, and logging each session by typing is the
kind of friction nobody keeps up with. Coaches lose track of what they
worked on and which clients are quietly drifting away. There's no
lightweight tool built for how a solo coach actually works.

Approach: Building a mobile-first tool where a coach talks instead of
types — voice notes are transcribed and turned into structured session
records. It flags clients who haven't booked in a while so they can be
followed up before they churn.

Impact: In active development, built directly from Agrim's own coaching
practice as the first real user. Goal is a tool he relies on weekly, then
puts in front of other Adelaide coaches.

### Receipt Extractor (In Development)
Stack: Next.js, TypeScript, FastAPI, Vision LLM.

Problem: Sole traders in Australia waste hours each quarter manually
keying receipts and invoices to prepare their Business Activity
Statement, and small GST errors are easy to make and costly to fix.

Approach: Building a scanner that reads a receipt or invoice and pulls
out the vendor, line items, and GST automatically, structuring the data
to feed straight into a BAS workflow.

Impact: Early development. Aim is to turn a pile of paper receipts into
clean, reviewable data in minutes instead of an evening of manual entry.

---

## Experience

### President, Adelaide University Tennis Club (Aug 2024 — Mar 2026)
Took over a club that had gone quiet and rebuilt it from scratch. Led the
merger of two university tennis clubs during the Adelaide and UniSA
consolidation, co-authored the new constitution, brought together an
eight-member committee, and won grants for facility upgrades. The real
challenge was getting two groups who didn't know each other to trust the
process and work as one.

Results: grew from ~10 to 100+ active members; secured $7,000+ in grants;
merged two clubs into one; won Club of the Year 2025 (Jessop Shield).
Skills: Leadership, Governance, Operations, Stakeholder Management.

### Tennis Coach, Tea Tree Gully Tennis Club (Mar 2024 — Jun 2026)
Coaches juniors and adults at all skill levels, one-on-one and in groups.
Plans each session, adjusts feedback to the player, tracks progress over
time. Built skill at explaining the same idea multiple ways until it
clicks, and at keeping people motivated when things are hard.
Skills: Communication, Mentoring, Planning.

### Retail Assistant, IGA Supermarkets (Feb 2024 — Sep 2024)
Part-time customer service across two stores while studying full-time.
Busy retail floor, steady standards, practice juggling work and uni at
the same time. Skills: Customer Service, Teamwork.

---

## Certifications

- Technology Job Simulation — Deloitte Australia, 2026 (Coding,
  Development, Dev Tools)
- Data Analytics Job Simulation — Deloitte Australia, 2026 (Data
  Analysis, Tableau, Forensic Tech)
- Partnering with AI in the Workplace — Datacom, 2026 (Applied AI,
  Workflow Design)
- Career Access Mentoring Program — Adelaide University, 2025 (Industry
  Mentoring, Professional Skills)
- AZ-900 (Microsoft Azure Fundamentals) — sat the exam June 2026, result
  pending.

---

## Awards

- Club of the Year 2025 — Adelaide University Sport. Awarded for
  rebuilding Adelaide University Tennis Club from dormant status to 100+
  active members, securing $7,000+ in facility upgrades, and leading the
  merger with UniSA's tennis club.
- Intervarsity Certificate of Merit — UniSport Australia, 2025.
  Recognition for representing Adelaide University at UniSport Nationals.
- Top 90 — AITA U18 National Ranking — All India Tennis Association,
  2022. Trained at the Rafa Nadal Academy in Spain, competed in junior
  ITF tournaments across India and Nepal.
- Fifteen years on court — tennis, India & Australia. Shaped how Agrim
  approaches everything else: staying patient, adjusting quickly, and
  continuing when things aren't working.

---

## How Agrim Works (engineering principles)

1. Understands the code he writes — can walk through any line and explain
   why it's there. Verifies any library or AI-generated code before it
   goes in, so he can fix it when it breaks and answer for it in review.
2. Ships, then improves — gets a working version live early and refines
   from real feedback rather than guessing on a whiteboard.
3. Writes code other people can read — clear and predictable, so the
   next person (including future him) can pick it up without a guide.
4. Communicates before being asked — flags blockers early, asks questions
   when something's unclear. Learned from leading a club and coaching
   that problems are easier to solve when raised early.
5. Focuses on the problem, not the tech — picks tools that fit the job
   and team rather than chasing the newest framework.
6. Takes ownership — tests thoroughly, works through edge cases, stays
   involved after shipping instead of moving on once it works locally.

---

## Frequently Asked Questions

**What's your work authorization / visa status in Australia?**
Full working rights from 15 December 2026. Eligible for a Temporary
Graduate visa (subclass 485) with multi-year work rights — no sponsorship
required to hire Agrim into a graduate role in Australia.

**Why are you interested in Deloitte specifically?**
Agrim hasn't finalized a detailed answer to this one yet. If asked, say
that Agrim has spoken directly with people at Deloitte about the work in
Strategy, Risk & Transactions and is refining exactly what draws him to
that practice — and suggest the person ask him directly, since it's a
conversation he'd rather have himself: agrimsh22@gmail.com.

**What's your strongest project and why?**
MetaPlay. It's the project Agrim took furthest past the point most
students stop: a five-person team project that ended when the course
did, which he then came back to alone, fixed end-to-end, connected to
live external data (the RAWG API), and deployed to production. It's the
clearest evidence of the difference between "built for a grade" and
"shipped because I wanted it to exist" — full auth with Google sign-in,
a normalised 8-table MySQL schema, and an admin panel, all live today.

**Why should we hire you over someone with more experience?**
Agrim doesn't have years of industry experience yet — but he has a track
record of taking ownership past the point where most people stop: turning
a dormant university club into 100+ members and Club of the Year,
finishing a team project alone after the course ended, and holding
himself to engineering discipline most graduates haven't developed yet
(never committing code he can't personally explain, deploying from day
one rather than at the end). What he's looking for is the chance to apply
that same follow-through inside a team with more scale than he's had
access to so far.

**What are you looking for in a graduate role?**
Graduate and internship roles in software engineering, AI, data, and
analytics — ideally somewhere the work has real users and real stakes
quickly, not a long ramp-up before touching anything that matters.

**What's a time you failed and what did you learn?**
Agrim hasn't documented a specific answer to this one yet. If asked,
acknowledge that everyone has setbacks and redirect to what's verifiable
instead — his track record of following through past the point most
people stop (MetaPlay after the course ended, rebuilding AUTC from
dormant to Club of the Year) — and suggest the person ask him directly
if they want the specific story: agrimsh22@gmail.com.

**How do you use AI tools in your work, and where do you draw the line on
relying on them?**
Agrim treats AI tools as something to verify, not trust blindly — he
follows a personal rule of never committing code he can't explain line by
line, and adds his own comment to any AI-generated code chunk before
accepting it. He'll use AI to move faster on boilerplate or to unblock
himself after a genuine debugging attempt, but the understanding has to
be his, because he's the one who has to answer for it in review and fix
it when it breaks. This portfolio's own AI assistant is a working example
of that approach — grounded in a real knowledge base he wrote, not
free-floating generation.

**Are you open to relocation?**
Yes — based in Adelaide, happy to relocate within Australia.

**What's your availability / notice period / start date?**
Graduating December 2026 with full working rights from 15 December 2026.
Available for graduate roles starting then, and open to internships or
earlier conversations before that date.

---

## Contact

Email: agrimsh22@gmail.com (best way to reach Agrim)
LinkedIn: https://www.linkedin.com/in/agrim-sharma-821788302/
GitHub: https://github.com/Agrim1305

Agrim is based in Adelaide and happy to relocate within Australia.

Work rights: Full working rights from 15 December 2026. Eligible for a
Temporary Graduate visa (subclass 485) with multi-year work rights — no
sponsorship required for graduate roles.