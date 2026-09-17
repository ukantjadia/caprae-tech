# Repository Instructions

## Deploy Configuration (configured by /setup-deploy)
- Platform: GitHub Pages
- Production URL: https://ukantjadia.github.io/caprae-tech/
- Deploy workflow: .github/workflows/deploy-pages.yml
- Deploy status command: gh run list --workflow deploy-pages.yml --limit 1
- Merge method: merge
- Project type: static Astro design gallery
- Post-deploy health check: https://ukantjadia.github.io/caprae-tech/

### Custom deploy hooks
- Pre-merge: cd designs && bun run build:pages
- Deploy trigger: automatic on push to main
- Deploy status: check the GitHub Actions workflow
- Health check: https://ukantjadia.github.io/caprae-tech/
