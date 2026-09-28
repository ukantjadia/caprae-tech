# Plan: extract the Resend style from Refero

Source: https://styles.refero.design/style/0d914ef0-fa84-4c60-a9aa-cef0b5eb6e5d
(Refero page for Resend, resend.com)

## Goal

Save the four export tabs from the page, in their **Extended** form, verbatim, into:

```
styles-refreo/
  resend/
    DESIGN.md            <- "DESIGN.md" tab, Extended
    tailwind-v4.css      <- "Tailwind v4" tab, Extended
    variables.css        <- "CSS Variables" tab, Extended
    design-tokens.json   <- "Design Tokens" tab, Extended
```

Content is copied as-is. No edits, no reformatting, no summarising.

## Steps

1. **Fetch raw HTML** with `curl` into the scratchpad.
   verify: the four tab contents exist in the HTML.
2. **If the Extended text is in the HTML**, pull each code block out with a small script
   and write it to its file.
   verify: file is non-empty, starts and ends the same way the page does.
3. **If Extended only appears after clicking the toggle** (rendered by JS), drive the page
   with the `browse` headless browser: open page, click Extended, click each tab,
   read the code block text (or the page's copy button output), save each one.
   verify: Extended output is longer than Compact for each tab.
4. **Check each file parses**: JSON through a parser, CSS scanned for balanced braces,
   DESIGN.md read end to end.
5. **Record it**: entry in `LOG.md`. No `DECISION.md` entry, since nothing gets decided.
   Commit only if asked.

## Not doing

- Preview tab (it is a rendered page, not one of the four exports).
- Wiring these styles into any site direction.
- Rewriting WebFetch output. WebFetch summarises, so it is not used for the saved text.
