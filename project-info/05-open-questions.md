# Open Questions

Answer these and the copy writes itself. Updated 2026-09-14 after the second
round of answers.

**Blocking right now:** Q23 blocks all design work. Q7, Q13, Q14 block copy.
Q22 blocks half the work section.

## Answered

**Q1. What counts as success?** ✅ No target set, and not a concern. The site is
a credibility asset first. Recorded. If a conversion target appears later the
page structure will need revisiting.

**Q8. Which portfolio logos can we show?** ✅ Use any. Recorded as D-004, with
one modification: two labelled strips rather than one. Every logo stays on the
page, but "built by our team" and "Caprae Capital portfolio" are separated so no
claim fails on a sales call. Say the word and it collapses to one strip.

**Q11. What else has the team shipped?** ✅ Eight products named. Three
confirmed publicly, one corroborated, four still need spellings and URLs. See
Q22 and `04-proof.md`.

## Facts I still have to get right

**Q7. How do we describe the five people?** Only Kevin Hong and Zackary Beckham
carry the Founder title publicly. Hereford Johnson is Principal Adviser, Felix I.
Odigie is Deal Advisor, Eric Nehrlich is Chief of Staff. Three options: use the
real titles, use a neutral phrase such as "the leadership team our developers
work alongside," or name only the two founders. Which?

**Q9. How long have the developers worked with these founders?** "A long period
of time" cannot go on the page. Three years? Five? Give me the number.

**Q10. What is the actual meeting cadence with founders?** Weekly, biweekly,
sprint reviews, something else. The specific rhythm persuades. "Regular" does not.

**Q12. How many engineers, and how many are available?** Public reporting says
20+. Current? Total headcount or bench capacity? Where are they, and does that
matter to this buyer?

**Q13. Can any client be quoted by name?** One named testimonial from a founder
or searcher outperforms every adjective on the page. If nobody can be named, can
one be quoted by role, for example "Searcher, $4M SDE manufacturing deal"?

**Q14. Is $110M+ in closed deals ours to use?** It belongs to the parent firm's
deal business, not the engineering team. Legitimate as firm context, misleading
as tech-team output. Confirm the framing.

**Q21. Is the CLOVER repository public?** It is described as open-source. If the
repo is public, that is a link to real code written by this team. On a site
selling engineers that outperforms any screenshot. URL?

**Q22. Spellings and URLs for products 5 through 8.** Four items came through
speech and cannot be published as heard:

- "Simba Studio" — correct spelling, URL, one line on what it does
- "Sarsis Coach" — no public record under this spelling. Searcher Coach? SaaS
  Coach? Something else?
- "VDV virtual data" — read as a virtual data room. Product name and URL?
- "Multiple scrapers" and "Joe Finders" — job finders? deal finders? Names, and
  is any public?

Each confirmed item is a section in the work strip. Each unconfirmed one is a
gap.

## Positioning and scope

**Q2. Caprae-branded, or its own brand?** Sub-brand under Caprae Capital,
standalone name with a Caprae endorsement, or a page on the existing site.
Decides the domain, the logo, and how hard the site leans on the parent numbers.

**Q3. What exactly is being sold?** Dedicated developers monthly, fixed-scope
projects, fractional CTO, or all three? The parent site says "MVP to full-stack
platforms, project-based." Still accurate?

**Q4. Does a price go on the page?** The parent site publishes $1,250/mo for
three of six services. Publishing a number beats agencies that hide it. Publish,
publish a floor, or stay custom?

**Q5. What do we refuse?** Naming what you do not take is the fastest
credibility signal available. No staff augmentation under three months, no
one-off WordPress, no fixed bid on undefined scope. What is the real list?

**Q6. Have you talked to anyone who nearly bought this?** The fears in
`03-audience.md` are my inference. Three real conversations beat anything I write.

## Design

**Q23. How do motion and the anti-scroll rules reconcile?** This blocks
everything.

You want 3D, animation and scroll work. Your global rules say never build tall
scroll-heavy layouts, keep all primary actions above the fold, and use compact
spacing. Your audience is 25 to 70, largely on work laptops.

My proposal, in `design/01-direction.md`: motion is proof not packaging. A
contained 3D hero beside the headline that does not push the CTA down. Scroll
animation limited to reveals. One or two genuine spectacle moments, placed at
the work section where showing off is the argument. No scroll-jacking, no pinned
sections.

Three ways to go: take the proposal, override the global rules for this project
and build the full scroll experience, or go further the other way and keep the
3D to the hero alone. Pick one.

**Q15. What should it feel like, and next to what?** My read is restrained and
institutional, closer to a fund's site than a startup's, with the 3D providing
the contrast. Name one or two sites you want this to sit beside.

**Q16. One page or several?** Single dense page with anchors, or Home, Services,
Work, About, Contact. Your density preference points at the first.

**Q17. What is the conversion action?** Calendar embed, short form, or email
link. A booking link removes a step and this audience expects them.

**Q18. Stack and hosting?** Next.js, Astro, plain HTML. Where does it deploy,
who owns the domain, does it need a CMS. Blocks D-005.

**Q24. Which 3D tool?** React Three Fiber, Spline, raw GLSL, or CSS 3D only. I
lean React Three Fiber, because hand-written Three.js is itself part of the pitch
on a site selling engineers. Spline is faster to produce and looks like a
designer tool, which works against the argument.

**Q25. Smooth scroll, yes or no?** Lenis and similar make a page feel premium to
some people and broken to others, particularly on trackpads and particularly for
older users. My default is no. Override?

**Q26. What does the hero 3D element actually depict?** This is a content
question, not a technical one, and it is the one most likely to be skipped. An
abstract blob is the default failure. It should mean something: deal flow, a
network graph, a pipeline, data moving. What is the idea?

## Nice to have

**Q19. Is there an existing brand kit?** Fonts, colours, logo files from either
Caprae site. Real assets beat an invented palette.

**Q20. Deadline?** A date it needs to be live by, or an event it is built for.
