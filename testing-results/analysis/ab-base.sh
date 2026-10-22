#!/usr/bin/env bash
# Setup: S=<scratch dir>; git archive b871b69 seo/code | tar -x -C "$S/base"; junction "$S/base/seo/code/node_modules" to seo/code/node_modules
# (remove the junction with `cmd //c rmdir` before deleting $S/base). Run: bash ab-base.sh "$S"
# Lighthouse A/B, GPU mobile 1.2x, ABBA x2: base = b871b69 (git archive copy), new = working tree.
set -u
S="$1"; R="D:/college_work/4th year/Sem7th/Project/Caprae Capital/caprae-tech-landing-page"; RAW="$R/testing-results/analysis/raw"
(cd "$S/base/seo/code" && bunx vite build --emptyOutDir --outDir "$S/dist-base" >/dev/null 2>&1) || { echo "base build failed"; exit 1; }
(cd "$R/seo/code" && bunx vite build --emptyOutDir --outDir "$S/dist-new" >/dev/null 2>&1) || { echo "new build failed"; exit 1; }
stop() { for p in $(netstat -ano | grep ':4173 .*LISTENING' | awk '{print $5}' | sort -u); do taskkill //PID "$p" //F //T >/dev/null 2>&1; done; }
n=0
for v in base new new base base new new base; do
  n=$((n+1)); (cd "$R/seo/code" && bunx vite preview --outDir "$S/dist-$v" --port 4173 --strictPort >/dev/null 2>&1 &); sleep 4
  out="$RAW/ab2-$v-$n.json"
  bunx lighthouse@13.5.0 http://localhost:4173/ --quiet --output=json --output-path="$out" --only-categories=performance \
    --throttling.cpuSlowdownMultiplier=1.2 --chrome-flags="--headless=new" --max-wait-for-load=45000 >/dev/null 2>&1
  stop
  bun -e "const j=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')),a=j.audits;console.log('$v'.padEnd(4),'#$n','perf',Math.round(j.categories.performance.score*100),'TBT',Math.round(a['total-blocking-time'].numericValue),'FCP',Math.round(a['first-contentful-paint'].numericValue),'LCP',Math.round(a['largest-contentful-paint'].numericValue),'bench',Math.round(j.environment.benchmarkIndex),'long',(a['long-tasks'].details.items||[]).filter(t=>t.duration>150).map(t=>Math.round(t.startTime)+'+'+Math.round(t.duration)).join(' '))" "$out"
done
rm -rf "$S/dist-base" "$S/dist-new"
