#!/usr/bin/env bash
# Before/after measurement for the perf/keep-3d-fixes branch (D-100).
# Builds seo/code, serves it with `vite preview`, runs Lighthouse 13.5.0 in three graphics setups,
# saves the JSON in testing-results/analysis/raw/ and prints one summary line per run.
#   bash testing-results/analysis/measure.sh <label> [runs] [path]
# Setups: gpu = this machine's graphics card (mobile, PageSpeed's 1.2x CPU), sw = software WebGL
# (SwiftShader, desktop preset: mobile software runs often hang), none = WebGL off (mobile).
set -u
LABEL=${1:?label}; RUNS=${2:-2}; PAGE=${3:-/}
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"; RAW="$ROOT/testing-results/analysis/raw"; mkdir -p "$RAW"
cd "$ROOT/seo/code" && bun run build >/dev/null 2>&1 || { echo "build failed"; exit 1; }
(bunx vite preview --port 4173 --strictPort >/dev/null 2>&1 &) ; sleep 4
URL="http://localhost:4173$PAGE"; SLUG=$(echo "$PAGE" | tr -c 'a-z0-9\n' '-' | sed 's/^-*//;s/-*$//'); SLUG=${SLUG:-home}
declare -A FLAGS=(
  [gpu]="--headless=new"
  [sw]="--headless=new --disable-gpu --use-angle=swiftshader --enable-unsafe-swiftshader"
  [none]="--headless=new --disable-gpu --disable-webgl --disable-3d-apis"
)
declare -A MODE=( [gpu]="--throttling.cpuSlowdownMultiplier=1.2" [sw]="--preset=desktop" [none]="--throttling.cpuSlowdownMultiplier=1.2" )
for v in gpu sw none; do
  for n in $(seq 1 "$RUNS"); do
    out="$RAW/fix-$LABEL-$SLUG-$v-$n.json"
    bunx lighthouse@13.5.0 "$URL" --quiet --output=json --output-path="$out" \
      --only-categories=performance,accessibility,best-practices,seo ${MODE[$v]} \
      --chrome-flags="${FLAGS[$v]}" --max-wait-for-load=45000 >/dev/null 2>&1
    uv run --quiet python - "$out" "$LABEL" "$v" "$n" <<'PY'
import json, sys
f, label, v, n = sys.argv[1:]
try: j = json.load(open(f, encoding="utf-8"))
except Exception: print(f"{label:10} {v:4} #{n}  no report"); sys.exit()
a, c = j["audits"], j["categories"]
num = lambda k: a.get(k, {}).get("numericValue")
reqs = a.get("network-requests", {}).get("details", {}).get("items", [])
shapes = any("shapes" in r.get("url", "") and r["url"].endswith(".bin") for r in reqs)
err = j.get("runtimeError", {}).get("code")
sc = lambda k: round((c.get(k, {}).get("score") or 0) * 100)
fmt = lambda x, d=0: "-" if x is None else (f"{x:.{d}f}" if d else f"{round(x)}")
print(f"{label:10} {v:4} #{n}  perf {sc('performance'):3} a11y {sc('accessibility'):3} bp {sc('best-practices'):3} seo {sc('seo'):3}"
      f"  FCP {fmt(num('first-contentful-paint'))} LCP {fmt(num('largest-contentful-paint'))} TBT {fmt(num('total-blocking-time'))}"
      f" CLS {fmt(num('cumulative-layout-shift'),3)} SI {fmt(num('speed-index'))} DOM {fmt(num('dom-size-insight'))} shapes {'y' if shapes else 'n'}"
      + (f"  ERROR {err}" if err else ""))
PY
  done
done
# stop the preview server started above (port 4173 only)
for p in $(netstat -ano | grep ':4173 .*LISTENING' | awk '{print $5}' | sort -u); do taskkill //PID "$p" //F //T >/dev/null 2>&1; done
rm -rf "$ROOT/seo/code/dist"
