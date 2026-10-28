// Every page on the site, from the AI SEO Work Report (URL Suggestions and Meta Title &
// Description sheets, 2026-10). One entry per URL: the page file is <path>index.html.
// `label` names the page in menus and breadcrumbs; `parent` builds the breadcrumb trail.
// Titles and descriptions are the sheet's, word for word, except where marked.

// Where the site lives, for canonical URLs, the sitemap and structured data. The brand and domain
// are still open (site plan note 2), so this is the GitHub Pages address until SITE_URL is set.
export const SITE_URL = (process.env.SITE_URL || 'https://ukantjadia.github.io/caprae-tech').replace(/[/]$/, '')

export const ROUTES = {
  '/': {
    label: 'Home',
    title: 'Built by Founders, Not a Dev Shop | Caprae Tech',
    description: 'A founder takes the CTO seat on your product. MVPs, dashboards, deal tools and internal software for owners without a tech team. Priced in hours.',
  },

  // ---- What we build
  '/what-we-build/': {
    label: 'What we build', parent: '/',
    title: 'What We Build: MVPs, Dashboards & AI Tools | Caprae Tech',
    description: 'Five things we build, start to finish: MVPs, dashboards, deal and financial tools, AI assistants and internal tools for owners without a tech team.',
  },
  '/what-we-build/mvp-development/': {
    label: 'MVPs', parent: '/what-we-build/',
    title: 'MVP Development Services for Non-Technical Founders | Caprae Tech',
    description: 'Prove your idea works before you fund all of it. Founder-led MVP development, proofs of concept and AI MVPs costed per use, live in 4–8 weeks.',
    band: { h: 'Tell us the one thing', it: 'your product has to prove.', lead: "Thirty minutes with a founder. You leave knowing what's worth building first." },
  },
  '/what-we-build/business-dashboards/': {
    label: 'Dashboards', parent: '/what-we-build/',
    title: 'Custom Business Dashboards for Owners | Caprae Tech',
    description: 'Sales, ops and finance on one screen, pulled from the tools you already use. Built for owners and ops leads by a founder-led team, priced in hours.',
  },
  '/what-we-build/deal-financial-tools/': {
    label: 'Deal & financial tools', parent: '/what-we-build/',
    title: 'Deal Screeners & Valuation Models | Caprae Tech',
    description: 'Screeners, models and trackers that help you evaluate and acquire businesses. The same kind of tooling Caprae uses to find and buy companies.',
  },
  '/what-we-build/ai-assistants/': {
    label: 'AI assistants', parent: '/what-we-build/',
    title: 'AI Assistants & Business Automation | Caprae Tech',
    description: 'Automations that take repetitive work off your team, added only where they pay back. We do it by hand first, then automate what works.',
  },
  '/what-we-build/internal-tools/': {
    label: 'Internal tools', parent: '/what-we-build/',
    title: 'Custom Internal Tools & Team Portals | Caprae Tech',
    description: 'Portals, trackers and workflows your people use every day, instead of ten spreadsheets. Built by a founder-led team for teams running on sheets.',
  },

  // ---- Who we serve
  '/who-we-serve/': {
    label: 'Who we serve', parent: '/',
    title: 'Software for Owners Without a Tech Team | Caprae Tech',
    description: "Software for cleaning companies, clinics, acquirers and service businesses, built by people who've run companies, for owners who don't want a tech team.",
  },
  // from Facility_Services_Copy_Review.html (meta draft 2); replaces Staffing firms (2026-10-22)
  '/who-we-serve/facility-cleaning/': {
    label: 'Facility cleaning', parent: '/who-we-serve/',
    title: 'Software for Commercial Cleaning Companies | Caprae Tech',
    description: 'Cleaning is the job. We build the software around it: photo-verified checklists, crew scheduling, training and client dashboards, priced in hours.',
    band: { h: 'Show us the night', it: 'your schedule fell apart.', lead: 'Thirty minutes with a founder who runs a cleaning company.' },
  },
  '/who-we-serve/clinics-healthcare/': {
    label: 'Clinics & healthcare', parent: '/who-we-serve/',
    // from Clinics_Healthcare_Copy_Review.html (meta draft 1)
    title: 'Healthcare Software Development for Clinics | Caprae Tech',
    description: 'Software for the work around the chart: intake, scheduling, prior auth, denials and reporting, built around your EHR. Founder-led, priced in hours.',
    band: { h: 'Tell us which part of the day', it: 'costs your staff the most.', lead: 'Thirty minutes with a founder. No tech words needed.' },
  },
  '/who-we-serve/acquirers-search-funds/': {
    label: 'Acquirers & search funds', parent: '/who-we-serve/',
    title: 'Software for Acquirers & Search Funds | Caprae Tech',
    description: "Deal screeners, valuation models and portfolio dashboards for acquirers and search funds, from the team behind Caprae Capital's own deal tools.",
  },
  '/who-we-serve/service-businesses/': {
    label: 'Service businesses', parent: '/who-we-serve/',
    title: 'Software for Service Businesses | Caprae Tech',
    description: 'Quote and job trackers, customer portals and AI follow-up drafts for service businesses. Built by founders, priced feature by feature in hours.',
  },

  // ---- Company
  '/why-founder-led/': {
    label: 'Why founder-led', parent: '/',
    title: 'Why a Founder-Led Studio, Not a Dev Shop | Caprae Tech',
    description: "Same code, different judgment. A founder decides what's worth building, ships what sells first and adds AI only where it pays back.",
  },
  '/work/': {
    label: 'Work', parent: '/',
    title: 'Our Work: Built for Ourselves First | Caprae Tech',
    description: 'Tools running inside a real business today: a CRM, a recruitment pipeline saving ~20 hrs a week, and lead QA cut from 30 to 10 hours a week.',
  },
  '/how-it-works/': {
    label: 'How it works', parent: '/',
    title: 'How It Works: Call, Scope, Build, Launch | Caprae Tech',
    description: 'Thirty minutes with a founder, a scope with hours for every feature, weekly shipping and one check-in a week. You hand it over; we run it.',
  },
  '/pricing/': {
    label: 'Pricing', parent: '/',
    title: 'Software Development Priced in Hours | Caprae Tech',
    description: "You pick the features, you see the hours. Features x hours x one hourly rate, agreed upfront. No lump-sum quote you can't check.",
  },
  '/faq/': {
    label: 'FAQ', parent: '/',
    title: 'FAQ: Founder-Led Software Development | Caprae Tech',
    description: 'Straight answers before you book: do you need to be technical, how much of your time it takes, how pricing works and when AI goes in.',
  },
  '/book-a-call/': {
    label: 'Book a call', parent: '/',
    title: 'Book a Call With a Founder | Caprae Tech',
    description: "Tell us what you're building. Thirty minutes with a founder: four fields, then pick a time. Then a scope with hours for every feature.",
  },

  // ---- Founders
  '/founders/': {
    label: 'Founders', parent: '/',
    title: 'Our Founders: The People in Your CTO Seat | Caprae Tech',
    description: "They've built, bought and grown companies in tech, healthcare, data and acquisitions. Meet the founders who take the CTO seat on your product.",
  },
  '/founders/kevin-hong/': {
    label: 'Kevin Hong', parent: '/founders/',
    title: 'Kevin Hong, Founder | Caprae Tech',
    description: 'Kevin Hong scaled two startups to $31M and $7M ARR, raised $8M+ and wrote the #1 Amazon bestseller The Outlier Approach. MBA, Chicago Booth.',
  },
  '/founders/hereford-johnson/': {
    label: 'Hereford Johnson', parent: '/founders/',
    title: 'Hereford Johnson, Principal Adviser | Caprae Tech',
    description: 'Founder of Third Equity Partners and a trusted voice in the search-fund community, across self-funded and independent-sponsor deals. Kellogg MBA.',
  },
  '/founders/zackary-beckham/': {
    label: 'Zackary Beckham', parent: '/founders/',
    title: 'Zackary Beckham, Founder | Caprae Tech',
    description: 'Chief of Business Development at ITSco and co-founder of Destroy Drive, with 12+ years in operations and program management. Arizona State.',
  },
  '/founders/mike-savino/': {
    label: 'Mike Savino', parent: '/founders/',
    title: 'Mike Savino, ITSco | Caprae Tech',
    description: 'Mike Savino leads ITSco, a healthcare tech and engineering company delivering data analysis and analytics projects.',
  },

  // ---- Build team
  '/build-team/': {
    label: 'Build team', parent: '/',
    title: 'Build Team: Founders Decide, Engineers Ship | Caprae Tech',
    description: 'One chain of accountability, from the founder in your CTO seat to the person writing the code. A small team with senior judgment.',
  },
  '/build-team/siddhant-pahuja/': {
    label: 'Siddhant Pahuja', parent: '/build-team/',
    title: 'Siddhant Pahuja, Head of AI & Automation | Caprae Tech',
    description: 'Siddhant Pahuja owns architecture, feature definition and how every AI step is tested against a human before it ships.',
  },
  '/build-team/ukant/': {
    label: 'Ukant Jadia', parent: '/build-team/',
    title: 'Ukant Jadia, Lead Engineer | Caprae Tech',
    description: 'Ukant Jadia is the lead engineer at Caprae Tech, running day-to-day execution and the core builds for founder-led products.',
  },
  '/build-team/hiten/': {
    label: 'Hiten Mehta', parent: '/build-team/',
    title: 'Hiten Mehta, Engineer | Caprae Tech',
    description: 'Hiten Mehta is an engineer at Caprae Tech, working on front-end and product builds for founder-led products.',
  },
  '/build-team/dejan/': {
    label: 'Dejan Azul Ultamar', parent: '/build-team/',
    title: 'Dejan Azul Ultamar, Engineer | Caprae Tech',
    description: 'Dejan Azul Ultamar is an engineer at Caprae Tech, building platform features and integrations for founder-led products.',
  },

  // ---- Work
  '/work/caprae-crm/': {
    label: 'Caprae CRM', parent: '/work/',
    title: 'Caprae CRM: Client & Account Platform | Caprae Tech',
    description: 'A client and account-manager platform: leads, cold-call results and engagements in one portal, with weekly reports and messaging. One click to see the whole account.',
  },
  '/work/recruitment-pipeline/': {
    label: 'Recruitment pipeline', parent: '/work/',
    title: 'Recruitment Pipeline Automation | Caprae Tech',
    description: 'Applications trigger the role\'s handbook, submissions are tracked, recruiters grade in an admin app and interviews and onboarding follow automatically. ~20 hours a week returned.',
  },
  '/work/lead-qa/': {
    label: 'Lead QA', parent: '/work/',
    title: 'Lead QA: AI Lead Quality Scoring | Caprae Tech',
    description: 'AI scores every lead and a human spot-checks the greens and reds before anything goes out. Lead QA cut from 30 to 10 hours a week.',
  },
  '/work/call-intelligence/': {
    label: 'Call intelligence', parent: '/work/',
    title: 'Call Intelligence: AI Call Scoring | Caprae Tech',
    description: 'Cold-call recordings become transcripts, scored on opener, tone and pitch, then rolled up per caller into a status, coaching priority and best times to call. Live in beta.',
  },
  '/work/caprae-cold-mail/': {
    label: 'Caprae Cold Mail', parent: '/work/',
    title: 'Caprae Cold Mail: Done-for-You Direct Mail | Caprae Tech',
    description: 'Personalized postcards and letters to the business owners you choose: designed, printed, stamped, mailed and tracked, then followed up with a call.',
  },
  '/work/bankers-edge/': {
    label: 'Bankers Edge', parent: '/work/',
    title: 'Bankers Edge: Advisory Firm Website | Caprae Tech',
    description: 'The website for Bankers Edge Advisory, a firm that raises capital for dealmakers: designed and built to show its services, closed deals and partners at a glance. Live.',
  },
  '/work/simba/': {
    label: 'Simba', parent: '/work/',
    title: 'Simba: Landing Page & SEO Build | Caprae Tech',
    description: 'The website for Simba Studio, a storytelling studio for founders: built on its own domain and set up for search from launch. Live at simbastud.io.',
  },
  '/work/itsco/': {
    label: 'ITSco', parent: '/work/',
    title: 'ITSco: Managed IT, Security & Compliance | Caprae Tech',
    description: "ITSco has run IT, security and compliance for businesses in NC, SC and VA since 1996. Run by our founders, it's the security side of our builds.",
  },
  '/work/destroy-drive/': {
    label: 'Destroy Drive', parent: '/work/',
    title: 'Destroy Drive: Data Destruction Services | Caprae Tech',
    description: 'Onsite data wiping, drive destruction and data center decommissioning in 100+ countries. Run by our founders, it shapes how we handle your data.',
  },

  // ---- Legal: not in the sheet's meta tab, so the title follows its pattern and the
  // description is plain fact (the booking form collects names and emails, site note 4)
  '/privacy/': {
    label: 'Privacy Policy', parent: '/',
    title: 'Privacy Policy | Caprae Tech',
    description: 'How Caprae Tech handles the information you share with us, including the name and email you enter when you book a call.',
  },
  '/terms-and-conditions/': {
    label: 'Terms & Conditions', parent: '/',
    title: 'Terms & Conditions | Caprae Tech',
    description: 'The terms that apply when you use the Caprae Tech website.',
  },
}

// Header menu, from the URL Suggestions sheet. People was dropped (user, 2026-10-09): Founders and
// Build team stand on their own. `blurb` lines are the site's own copy
// (final-draft-2's service and industry text), shortened only by picking one clause.
export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/what-we-build/', label: 'What we build', items: [
    { href: '/what-we-build/mvp-development/', label: 'MVPs', blurb: 'From an idea to a working product' },
    { href: '/what-we-build/business-dashboards/', label: 'Dashboards', blurb: 'Sales, ops and finance on one screen' },
    { href: '/what-we-build/deal-financial-tools/', label: 'Deal & financial tools', blurb: 'Screeners, models and trackers' },
    { href: '/what-we-build/ai-assistants/', label: 'AI assistants', blurb: 'Added only where they pay back' },
    { href: '/what-we-build/internal-tools/', label: 'Internal tools', blurb: 'Instead of ten spreadsheets' },
  ] },
  { href: '/who-we-serve/', label: 'Who we serve', items: [
    { href: '/who-we-serve/facility-cleaning/', label: 'Facility cleaning', blurb: 'Site checklists, photo proof and crew cover' },
    { href: '/who-we-serve/clinics-healthcare/', label: 'Clinics & healthcare', blurb: 'Less admin between the patient and the care' },
    { href: '/who-we-serve/acquirers-search-funds/', label: 'Acquirers & search funds', blurb: 'The tooling Caprae uses to buy companies' },
    { href: '/who-we-serve/service-businesses/', label: 'Service businesses', blurb: 'Win the job, run the job, get paid' },
  ] },
  { href: '/pricing/', label: 'Pricing' },
  // Company is a menu only, no page (sheet: "dropdown, no page")
  { label: 'Company', items: [
    { href: '/why-founder-led/', label: 'Why founder-led' },
    { href: '/work/', label: 'Work' },
    { href: '/how-it-works/', label: 'How it works' },
    { href: '/faq/', label: 'FAQ' },
    { href: '/founders/', label: 'Founders' },
    { href: '/build-team/', label: 'Build team' },
  ] },
]

// Footer menu, from the same sheet
export const FOOTER = {
  tagline: 'Founder-led product studio, priced in hours',
  email: 'partners@capraecapital.com',
  columns: [
    { title: 'What we build', links: NAV[1].items.map(({ href, label }) => ({ href, label })) },
    { title: 'Who we serve', links: NAV[2].items.map(({ href, label }) => ({ href, label })) },
    { title: 'Company', links: [
      { href: '/why-founder-led/', label: 'Why founder-led' },
      { href: '/work/', label: 'Work' },
      { href: '/how-it-works/', label: 'How it works' },
      { href: '/pricing/', label: 'Pricing' },
      { href: '/founders/', label: 'Founders' },
      { href: '/build-team/', label: 'Build team' },
      { href: '/faq/', label: 'FAQ' },
      { href: '/book-a-call/', label: 'Book a call' },
      { href: 'https://capraecapital.com/', label: 'Caprae Capital', external: true },
      { href: '/privacy/', label: 'Privacy Policy' },
      { href: '/terms-and-conditions/', label: 'Terms & Conditions' },
      // plain Markdown for AI assistants (public/ai-information.md), as on capraecapital.com
      { href: '/ai-information.md', label: 'AI Information' },
    ] },
  ],
}
