/* The background field, rendered in a Web Worker onto an OffscreenCanvas.
 *
 * Why a worker: this is the single biggest smoothness win available to us. The
 * main thread is where style, layout, paint and every third-party script fight
 * each other. Nothing in here touches it, so a stall in the page cannot stutter
 * the field and the field cannot stutter the page.
 *
 * Three field kinds, one per variant. None of them is a starfield.
 *   flow      oriented dashes aligning to a slow curl field    (E-1 Assay)
 *   halftone  a print dot matrix breathing under a wave        (E-2 Impression)
 *   tape      horizontal dashes in lanes, crossed by a scan    (E-3 Tape)
 *
 * Every field is a PURE FUNCTION of (attributes, time). Nothing accumulates, so
 * scrubbing backwards is exact and the field can never drift. Same contract the
 * orrery adaptation set, kept deliberately.
 */

const raf = typeof requestAnimationFrame === 'function'
  ? requestAnimationFrame
  : (f) => setTimeout(() => f(Date.now()), 16);

let ctx = null, W = 0, H = 0, DPR = 1, KIND = 'flow', REDUCED = false;
let COL = {};
let items = [];
let running = false, t0 = 0, clock = 0, last = 0;

/* deterministic PRNG so every reload draws the same field */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/* Cheap smooth 2D field. Not Perlin: three summed sinusoids at incommensurate
   frequencies, which is enough for a drifting direction field and costs a
   fraction of the price. */
function angleAt(x, y, t) {
  return (
    Math.sin(x * 1.9 + t * 0.13) * 1.1 +
    Math.sin(y * 2.3 - t * 0.09) * 0.9 +
    Math.sin((x + y) * 1.3 + t * 0.07) * 0.7
  );
}

function build() {
  const r = rng(0x5EED1234);
  items = [];
  const area = (W / DPR) * (H / DPR);

  if (KIND === 'flow') {
    const n = Math.min(2600, Math.round(area / 900));
    for (let i = 0; i < n; i++) {
      items.push({ x: r(), y: r(), len: 4 + r() * 12, a: 0.10 + r() * 0.38, hot: r() > 0.978 });
    }
  } else if (KIND === 'halftone') {
    /* a regular matrix, not a scatter of random points: this one is ordered on
       purpose, because it has to read as print rather than as sky */
    const step = 26;
    for (let gx = 0; gx * step < W / DPR + step; gx++) {
      for (let gy = 0; gy * step < H / DPR + step; gy++) {
        items.push({ gx, gy, step, reg: gx % 9 === 0 && gy % 6 === 0 });
      }
    }
  } else {
    const lanes = 15;
    for (let l = 0; l < lanes; l++) {
      const speed = 0.010 + (l / lanes) * 0.055 + r() * 0.006;
      const per = 7 + Math.round(r() * 9);
      for (let k = 0; k < per; k++) {
        items.push({
          lane: l, lanes,
          x0: r(), speed,
          len: 12 + r() * 46,
          a: 0.08 + (l / lanes) * 0.30,
          hot: r() > 0.94,
        });
      }
    }
  }
}

function drawFlow(t) {
  const w = W / DPR, h = H / DPR;
  ctx.lineCap = 'round';
  ctx.lineWidth = 1;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const x = it.x * w, y = it.y * h;
    const a = angleAt(it.x * 3.1, it.y * 3.1, t);
    const dx = Math.cos(a) * it.len, dy = Math.sin(a) * it.len;
    ctx.strokeStyle = it.hot ? COL.accent : COL.mark;
    ctx.globalAlpha = it.hot ? it.a * 1.5 : it.a;
    ctx.beginPath();
    ctx.moveTo(x - dx / 2, y - dy / 2);
    ctx.lineTo(x + dx / 2, y + dy / 2);
    ctx.stroke();
  }
  /* one slow horizon rule, the second layer */
  const hy = h * (0.5 + Math.sin(t * 0.05) * 0.16);
  ctx.globalAlpha = 0.07;
  ctx.strokeStyle = COL.mark;
  ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(w, hy); ctx.stroke();
}

function drawHalftone(t) {
  const w = W / DPR, h = H / DPR;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const x = it.gx * it.step, y = it.gy * it.step;
    /* a travelling wave sets each dot's radius, so soft bands sweep the sheet */
    const v = Math.sin((x / w) * 5.2 - t * 0.42) * 0.5 + Math.sin((y / h) * 3.4 + t * 0.29) * 0.5;
    const rr = Math.max(0, 0.5 + v * 2.4);
    if (rr < 0.12) continue;
    ctx.globalAlpha = 0.34;
    ctx.fillStyle = COL.mark;
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.fill();
  }
  /* registration crosses, the second layer: printer's marks, fixed */
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = COL.accent;
  ctx.lineWidth = 1;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it.reg) continue;
    const x = it.gx * it.step, y = it.gy * it.step;
    ctx.beginPath();
    ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y);
    ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4);
    ctx.stroke();
  }
}

function drawTape(t) {
  const w = W / DPR, h = H / DPR;
  const scan = ((t * 0.055) % 1) * w;
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'butt';
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const y = ((it.lane + 0.5) / it.lanes) * h;
    /* pure function of time: fract() means reverse is exact */
    let x = ((it.x0 + t * it.speed) % 1);
    if (x < 0) x += 1;
    x = (1 - x) * (w + it.len) - it.len;
    const near = Math.abs(x + it.len / 2 - scan) < 26;
    ctx.strokeStyle = (it.hot && near) ? COL.accent : COL.mark;
    ctx.globalAlpha = (it.hot && near) ? Math.min(0.9, it.a * 3.2) : it.a;
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + it.len, y);
    ctx.stroke();
  }
  /* the scan rule, second layer */
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = COL.accent;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(scan, 0); ctx.lineTo(scan, h); ctx.stroke();
}

function frame(now) {
  if (!running) return;
  raf(frame);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  clock += dt;
  paint(clock);
}

function paint(t) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.clearRect(0, 0, W / DPR, H / DPR);
  ctx.globalCompositeOperation = COL.additive ? 'lighter' : 'source-over';
  if (KIND === 'flow') drawFlow(t);
  else if (KIND === 'halftone') drawHalftone(t);
  else drawTape(t);
  ctx.globalAlpha = 1;
}

self.onmessage = (e) => {
  const d = e.data;
  if (d.type === 'init') {
    const c = d.canvas;
    ctx = c.getContext('2d', { alpha: true, desynchronized: true });
    W = d.w; H = d.h; DPR = d.dpr; KIND = d.kind; COL = d.colors; REDUCED = d.reduced;
    c.width = W; c.height = H;
    build();
    if (REDUCED) {
      /* a composed still, chosen and checked. The loop never starts, so a
         reader who asked for reduced motion pays nothing at all. */
      paint(9.2);
    } else {
      running = true; last = performance.now(); t0 = last;
      raf(frame);
    }
  } else if (d.type === 'resize') {
    W = d.w; H = d.h; DPR = d.dpr;
    ctx.canvas.width = W; ctx.canvas.height = H;
    build();
    if (REDUCED) paint(9.2);
  } else if (d.type === 'vis') {
    /* Pause when the tab is hidden, and ALWAYS resume. An earlier build in this
       repo gated a loop and never restarted it; that bug is not repeated. */
    if (d.hidden) { running = false; }
    else if (!REDUCED && !running) { running = true; last = performance.now(); raf(frame); }
  }
};
