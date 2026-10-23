# Content input plan for the 38-page site

Source: `AI SEO Work Report_Caprae Tech.xlsx` (Downloads, modified 2026-10-15), tab **Content**.
Columns used: G (where each part came from), I (to look out for), J (need content / input),
K (to confirm before launch), L (nice to have). Cross-checked against the claims audit in
`old-design-work/research/section-lab/01-inventory.md` (56 claims, checked against the proof files).

## What the sheet says

- 38 pages. All 38 are "Ready for Review", none "Done". Column N (reviewer notes) is empty.
- 31 pages have column J = "Yes". Four of them (Dashboards, AI Assistants, Internal Tools, FAQ)
  say "Yes" with no detail; what they need is inferred from columns I, K and L.
- Origin: 1 page is the home page word for word, 30 are home text plus new lines, 7 are mostly
  placeholders (the 4 team pages, Simba, Privacy, Terms).

## What the sheet does not show

1. **Column K misses claims the audit already flagged.** Not in K, but not found or contradicted
   in our proof files:
   - Kevin Hong: "$8M+ raised", "#1 Amazon bestseller", "published in Forbes and Inc.",
     "Chapman University", "10+ years", and "$7M ARR" (the proof says $7M in revenue).
   - Zackary Beckham: "co-founder of Destroy Drive" (proof: Director of Service Delivery there).
   - Call Intelligence "In build" (proof: sold standalone since 1 June 2026).
   - "Small team" (proof: publicly reported as 20+ engineers).
   - Tool stack list (Claude, OpenAI, n8n, Supabase, Azure, FastAPI, Twilio).
   - "Founder-led" framing, weekly check-in cadence (Q10), hours × hourly-rate pricing (Q4,
     content file says project-based).
2. **The small pages mostly repeat the home page.** Share of sentences also on the home page:
   Work 81%, Kevin Hong 79%, Zackary Beckham 76%, Founders 72%, Mike Savano 67%, Destroy
   Drive 63%, Hereford Johnson 62%, the other six project pages 56 to 60%. These pages are
   160 to 380 words. Search engines treat heavily repeated, short pages as low value.
   The 10 service and industry pages are fine (600 to 800 words, 18 to 37% repeated).
3. **No keyword data.** 0 of the 201 keywords have search volume or difficulty, so there is no
   way yet to tell which keywords are worth chasing.
4. **Technical issues on the live site** (found 2026-10-15): the home page carries 20 hidden
   Lab variants (three h1 tags, 18 hidden h2 tags); the hero headline sits off screen on phones;
   the Book a Call meta description promises "pick a time" but there is no calendar.

## Category A: only you (or the team) can supply it

Out of my reach: these are private facts, assets, permissions or legal text.

| What | Pages | Count |
|---|---|---|
| Headshots | 4 founders, 4 team members | 8 photos |
| Surnames | Ukant, Hiten, Dejan | 3 |
| Background, past work and builds worked on | 4 team pages | 4 |
| Screenshots of real tools | Caprae CRM client view, Recruitment admin portal, Lead QA scoring view, a dashboard, an internal tool, an MVP | ~6 |
| Measured results | Caprae CRM hours saved per week; Call Intelligence result; the source of "6 → 50+ leads per hour" | 3 |
| Case studies with client sign-off | MVP (plus typical time from call to launch), staffing firm, clinic, acquirer or search fund, service business | up to 5 |
| Client permission to be named | Bankers Edge, Simba (plus Simba's problem, result and build details) | 2 |
| Wording approved by the company | ITSco, Destroy Drive | 2 |
| Business and legal decisions | Where form submissions go; HIPAA / data compliance scope; who owns the code; the "Is my data safe?" answer; Privacy and Terms text from counsel, with dates | 6 |
| Keyword data | Search volume and difficulty for the 201 keywords (an Ahrefs, Semrush or Keyword Planner export, or access) | 1 export |

## Category B: needs your review and sign-off

I prepare the evidence and a recommended wording for each; you decide.

- **Disputed facts:** Mike Savano or Savino, and his title; Zackary's Destroy Drive role; each
  Kevin Hong claim above; ITSco as "founder company" vs portfolio company; Call Intelligence
  status; "small team" vs 20+ engineers; the tool stack; "founder-led"; weekly check-in;
  hours × rate pricing; "a founder on the call"; the four target industries.
- **Proof that may not fit:** Caprae's own tools shown as proof on the staffing and service
  pages; Bankers Edge as proof for Deal & financial tools and Acquirers; ITSco on the clinics page.
- **Publish or hold:** Call Intelligence (no result yet) and Simba (mostly placeholders).
- **Labels:** whether the MVP illustration numbers (1,284 / 6.2% / $18k) and sample-scope
  hours may stay as labelled illustrations.
- **The new "written for this page" lines** flagged in column I (headings, FAQ questions,
  "Where X helps most" links, the 60-hour AI matching line). I grade them first.
- **Call signs** (Overwatch, Pointman, Recon, Sapper) and the hourly rate staying off the site.
- **Founder photos from capraecapitalpartners.com:** Kevin Hong, Hereford Johnson, Zackary
  Beckham and Mike Savino have photos there. Using them needs your OK.

## Category C: what I can do

1. **Fact-check every claim on the 38 pages against public sources** (company sites, Amazon,
   Chapman University, press, ITSco and Destroy Drive sites), with a source link per verdict.
   This turns category B into a yes/no checklist. Limit: LinkedIn and paywalled databases
   mostly block automated reading.
2. **Grade each page for SEO against its keywords from the sheet:** keyword in title, h1, first
   paragraph, headings and URL; meta length and fit; internal links; word count; repeated-text
   share; structured data. One score per page and the fixes, written into column N.
3. **Rewrite to cut repetition:** a unique opening and page-specific sections for the 14 pages
   over 55% repeated. Facts come only from verified or stated sources; no new numbers.
4. **Draft founder bios and team page structure** from public information, marked for your approval.
5. **Keyword sanity check without volumes:** search each page's main keyword, look at what
   ranks, flag keywords whose intent does not match the page, and propose one primary keyword
   per page. Volumes still need category A's export.
6. **Fix the technical issues in `seo/code`:** strip the hidden variants from the home page,
   fix the phone hero, correct the Book a Call meta description.
7. **Write the categories back into a copy of the spreadsheet:** an Owner column (you, review,
   me) per item, and my grades and notes in column N. The original stays untouched.

## Order of work, and why

| Phase | Who | What | Why this order |
|---|---|---|---|
| 1 | Me | C1 fact-check, C2 SEO grades, C5 keyword check, C6 technical fixes | Facts and grades come first: rewriting before claims are settled means rewriting twice, and the grades show which pages deserve your input time |
| 2 | You | One sitting on the category B checklist; start gathering category A | My evidence makes B quick; A takes longest (photos, sign-offs, counsel), so it starts early |
| 3 | Me | C3 rewrites, C4 drafts, apply your verdicts and assets, re-grade, C7 spreadsheet copy | Writes once, on settled facts |
| 4 | Both | Launch checks: form wired, legal text in, domain and SITE_URL set, final read | The things that block a public launch |

## Next step

Approve Phase 1. It needs nothing from you and produces the verdict checklist for Phase 2.
