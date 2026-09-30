# Dala particles: exact spec

Source: `study/dala/theme.pretty.js` (line numbers below as `L1234`), `study/dala/mirror/scripts/vendor.js` for three.js class identities, and the assets in `study/dala/assets/`, decoded with bun on 2026-09-30 (GLTFLoader, EXRLoader and a small PNG decoder from three 0.186.1). Study only. Everything under "How to reproduce" is our own code.

**Correction to `01-code-teardown.md`.** `pos-33.exr`, `sc-33.png` and `cd-33.png` are 200x200, not 400x400. Each quadrant is 100x100 = 10,000 points, which is exactly the desktop particle count. There are no 40,000 particles.

## 1. Spec table

| Item | Value | Source |
|---|---|---|
| Particle count | 10,000 desktop, 7,000 mobile (first 70 rows of the quadrant) | L3745 |
| Particle mesh used | `py-lod7.glb` desktop, `py-monbile.glb` mobile. lod1/2/3 are loaded but never used for particles | L3405-3420, L3951 |
| LOD selection | None. One mesh per device class, chosen at load. No distance LOD | L3408-3410 |
| Mesh (lod7) | Closed tetrahedral shell with one triangular window per face. 20 verts, 48 tris (24 face out, 24 face in) | GLB dump |
| Outer corner radius | apex 0.828, base 0.789 / 0.728 / 0.728 (mean edge 1.255) | GLB dump |
| Inner corner radius | 0.82 x outer (apex 0.678) | GLB dump |
| Window size | 0.586 x outer face (linear, about face centroid) | GLB dump |
| Bar width | 0.12 x edge length, per face, measured in the face plane | GLB dump |
| Window depth | window verts sit 0.030 below the outer face plane (2.4% of edge) | GLB dump |
| Normals | smooth per vertex (shared verts). Unused: the material is unlit | GLB dump |
| Material | `MeshBasicMaterial` patched with `onBeforeCompile` | L3437, vendor 6173 |
| Flags | `transparent: true`. Everything else three's default: `depthWrite: true`, `depthTest: true`, `side: FrontSide`, `NormalBlending`, `alphaTest: 0` | L3956-3958 |
| Draw | one `InstancedMesh`, one draw call, `frustumCulled = false`, instances drawn in index order, no sorting | L4065, vendor 7936 |
| Instance base scale | 0.1 (baked into `instanceMatrix`) | L4081 |
| `u_scale` | 1.55 desktop, 1.2 mobile | L3745 |
| Per-point scale `s` | `sc-33.png` R/255, top-left 100x100. min 0.004, p5 0.126, p25 0.275, p50 0.345, p75 0.404, p95 0.463, max 0.494 | decoded |
| World scale | `0.1 * s * u_scale`: p5 0.0195, p50 0.0535, p95 0.0717 | computed |
| World edge length | `1.255 * world scale`: p50 0.067, p95 0.090, max 0.096 | computed |
| Colour | `cd-33.png` top-left 100x100, flat, `x u_colorFactor` | particles.output_fragment.glsl |
| `u_colorFactor` | 1.3 | L3988 |
| Output encoding | none (three r13x default, linear). Raw texel x 1.3 goes to the screen | no `outputEncoding` in bundle |
| Alpha | `smoothstep(-4.5, 4.0, viewZ + 10)`. Over the brain: p5 0.03, p25 0.23, p50 0.53, p75 0.86, p95 0.99 | fragment chunk, computed |
| Rotation | angle `mod(snoise(pos * 0.619) + time, 2pi)` about `normalize(0,1,1)`. Every particle spins at 1 rad/s, phase from the noise | project_vertex chunk, L3986 |
| Shape radius `_factor` | 4.35 desktop, 2.5 mobile, `world = (p - 0.5) * 2 * radius` | L3745, sim shaders |
| Brain placement | group at (0, -1.19, 0), `u_offset.x = 3` at the top of the page | L3761, L4268 |
| Nearest neighbour (3D) | p5 0.097, p25 0.112, p50 0.122, p95 0.171 world | computed |
| Gap ratio NN / edge | p5 1.17, p25 1.46, p50 1.81, p75 2.43 | computed |
| Camera | fov 50 (vertical), z 10, near 0.1, far 30. `setFocalLength(35)` is overwritten by `fov = 50` in `resize()` | L4611, L4674 |
| Renderer | `antialias: false`, `alpha: false`, pixel ratio 1 desktop, 2 mobile, clear black, body `#000` | L4602-4608 |
| Post chain | render particles, render DOM scene, UnrealBloom, Bokeh (desktop only), Vignette | L4440-4453 |
| Bloom | strength 0.4, radius 1, threshold 0.159. 100% of brain colours are above threshold | L4440 |
| Bokeh | focalDepth 0.125, focalLength 27, fstop 2509, maxblur 10, gain 0, bias 0. Net blur 0 to 0.77 px | L4441, computed |
| Vignette | three `VignetteShader`, offset 0.3, darkness 4 | L4453 |
| Grain layer | transparent quad at z 9.6 in the particle scene. alpha 0.149, bright 0.252, scale 1.366 (DPR >= 2: 0.138, 0.185, 1.072) | L4520, grain-layer.frag.glsl |
| Front cones | 250, lod7 mesh, scale 0.075 desktop (0.05 below 768 px), 4 colours, random alpha 0..1 | L3500, L3548, L3568 |
| Hover radius | 1.25 world + abs(max(u_delta.x, u_delta.y)), u_delta clamped to +-2 desktop | project_vertex chunk, L4237 |

### Screen sizes (desktop, DPR 1, particles at z around 0, 10 units from the camera)

| | 1503x680 | 1920x1080 |
|---|---|---|
| px per world unit | 72.9 | 115.8 |
| particle edge p5 / p50 / p95 / max | 1.8 / 4.8 / 8.8 / 11.3 px | 2.9 / 7.6 / 14.0 / 17.9 px |
| bar width p50 / p95 | 0.57 / 1.05 px | 0.91 / 1.67 px |
| brain width | 588 px | 933 px |
| screen-space NN p5 / p50 / p95 | 0.6 / 2.4 / 5.8 px | 1.0 / 3.8 / 9.2 px |
| front cones on screen | ~144 of 250 | ~143 of 250 |
| front cone edge p5 / p50 / p95 | 7.1 / 9.8 / 26.3 px | 11.3 / 15.6 / 41.6 px |

## 2. Detail per question

### 2.1 Mesh topology

lod7 vertices (x, y, z):

```
outer corners  v1 (0, 0.828, 0)  v3 (0.372, -0.278, 0.561)  v5 (0.372, -0.278, -0.561)  v7 (-0.740, -0.276, 0)
inner corners  v0 (0, 0.678, 0)  v2 (0.297, -0.224, 0.443)  v4 (0.297, -0.224, -0.443)  v6 (-0.599, -0.225, 0)
window, face opposite v7   v8 (0.055, 0.587, 0)   v9 (0.311, -0.180, 0.383)   v10 (0.311, -0.180, -0.383)
window, face opposite v3   v11 (-0.024, 0.600, -0.039)  v12 (0.236, -0.179, -0.428)  v13 (-0.544, -0.179, -0.039)
window, face opposite v5   v14 (-0.024, 0.600, 0.039)   v15 (-0.544, -0.179, 0.039)  v16 (0.236, -0.179, 0.428)
window, bottom face        v17 (-0.501, -0.251, 0)  v18 (0.260, -0.251, -0.380)  v19 (0.260, -0.251, 0.380)
```

Per face and per window edge (a, b) there are two quads: outer `(outerA, outerB, winB, winA)` facing out and inner `(innerA, innerB, winB, winA)` facing the centre. 4 faces x 3 edges x 2 quads x 2 tris = 48. Every edge is shared by exactly two triangles, so the shell is closed.

What this looks like: each face is an open frame. The bar has a wedge cross-section, full thickness at the tetrahedron edge and zero at the window edge, because outer and inner surfaces meet at the window vertices. With `FrontSide`, near faces show their outer surface and far faces show their inner surface through the windows, so all six struts draw from any angle, with no double-sided tricks.

Other meshes, for reference:

| Mesh | outer apex | inner apex | window scale | bar / edge | used |
|---|---|---|---|---|---|
| py-lod1 | 0.798 | 0.708 | ~0.58 | ~0.12 | no |
| py-lod2 | 0.853 | 0.653 | 0.605 | 0.114 | no |
| py-lod3 | 0.903 | 0.603 | 0.442 | 0.161 | no |
| py-lod7 | 0.828 | 0.678 | 0.586 | 0.120 | desktop particles, front cones, DOM pyramids |
| py-monbile | flat, y = 0 | | | | mobile particles |

lod1/2/3 are 36-vertex non-shared versions of the same topology (same index list). py-monbile is a flat triangle ring in the XZ plane (6 verts, 6 tris). On mobile `u_mobileRotation > 0` switches rotation to a look-at-camera matrix. As coded, that matrix maps the ring's plane onto a plane containing the view ray. Check it live before copying the mobile path.

### 2.2 Material and overlap

The particle material is `MeshBasicMaterial({ transparent: true })`. The colour chunk throws away lighting and writes `gl_FragColor = vec4(col * 1.3, smoothstep(-4.5, 4.0, v_pos.z))`, where `v_pos.z` is view-space z plus 10, which is world z with the camera at z 10.

Why overlaps read as 3D rather than flat:

1. `depthWrite` stays on although the material is transparent. When a nearer particle is drawn first, farther ones fail the depth test and disappear behind it. When a farther one is drawn first, the nearer one blends over it at its own alpha, which is 0.86 to 1 on the front half. Either way the front particle wins cleanly. There is no additive mush.
2. Alpha over a black clear colour acts as depth fog. Front particles show at full colour, the back of the brain drops to 3-23% brightness. Two overlapping particles almost never share a brightness.
3. Every colour is above the bloom threshold, and bloom scales with brightness, so front particles glow over back ones.
4. Sizes spread 3.7x between p5 and p95, and small particles cluster spatially (neighbour scale difference 7.9/255 against 27.4 for random pairs). Size works as a depth and surface cue.
5. Orientation is a smooth noise field (frequency 0.619 per world unit, about 13 neighbour spacings per cycle), so neighbours face the same way and form facets that turn together.

Instances are not sorted. Transparent objects are sorted per object: brain, then front cones (z 0.1), then the grain quad (z 9.6).

### 2.3 Scale

`final scale = 0.1 * s * u_scale`, and hover adds `0.1 * 0.75 * dist` on top (L4081 and the vertex chunk). Histogram of `s` in 0.1 bins: 3.8% / 5.4% / 24.0% / 39.8% / 27.0%, nothing above 0.494. Scale has no correlation with colour (every colour cluster has median `s` 0.337 to 0.349).

At Dala's real size a particle is about 5 px on a 680 px-tall canvas and 8 px at 1080. The bars are 0.6 to 0.9 px. The canvas renders at DPR 1 with no antialiasing, so a bar rasterises as a full-brightness 1 px run or not at all, and then bloom spreads it. On a DPR 1.25 laptop the browser also upscales the 1x canvas. The border ends up about 1 px of a 5 px particle, which is why it reads thick.

### 2.4 Colour

`cd-33.png` brain quadrant: 2,400 unique colours, 32.4% exactly `#c88d00` and 17.5% exactly `#b1a0b6`. The rest are blends. k-means (k = 6):

| Cluster | Share | x1.3 on screen |
|---|---|---|
| gold `#c58a03` | 40.7% | `#ffb304` |
| lilac grey `#ad9db4` | 24.8% | `#e1ccea` |
| teal `#076b6d` | 9.9% | `#0a8c8d` |
| purple `#6220b0` | 9.7% | `#7f2ae4` |
| rose `#a55f71` | 9.1% | `#d67c93` |
| slate blue `#6c8296` | 5.7% | `#8da9c3` |

No white. Colour is spatially grouped: neighbour colour difference is 48.9 against 128.6 for random pairs, so it comes in regions, not speckle. Luminance after x1.3: p5 0.30, p50 0.73, p95 0.85. The x1.3 clips gold's red channel.

### 2.5 Spacing

Brain quadrant after `(p - 0.5) * 2 * 4.35`: bbox x -4.03..4.03, y -4.27..4.12, z -4.17..4.21. NN p50 0.122 world. The median particle edge is 0.067, so the typical gap is 1.8 particle edges. Screen-space NN (2.4 px at 680) is smaller than the particle (4.8 px), so the silhouette fills in through depth overlap, not because particles sit tight.

Mapping check: particle i reads EXR data row `199 - floor(i/100)` (EXR uploaded with `flipY = true`) and PNG row `floor(i/100)` (`flipY = false`), column `i % 100`. This pairing is the only one where colour and scale are spatially coherent (tested against all four quadrants).

### 2.6 Front cones

- 250 instances of the same lod7 mesh (L3500), `MeshBasicMaterial`, `transparent: true`, `vertexColors: true`, output `vec4(a_color.rgb, a_color.a)`. No x1.3, no depth fade.
- Colours cycle `i % 4`: `#5d399a`, `#ba882b`, `#287464`, `#a494af` (25% each). Alpha is `Math.random()` per cone.
- Scale 0.075 on screens 768 px and wider (edge 0.094 world), 0.05 below (L3568). The size range comes from perspective alone.
- Placement: x, y in [-1, 1] times the frustum size at 9.9 units times `zFactor = map(z, 0, 9, 0.5, 0.2)`. z in [0, 9] plus group z 0.1, so every cone sits between the brain's centre and the camera. None are behind the brain.
- Motion: spin about a random axis in [-1, 1]^3 at `a_angle.w * 0.15` rad/s, with `a_angle.w` in [-pi, 2 - pi], so 0.17 to 0.47 rad/s. Drift `sin/cos(t * a_param.w * 0.5) * a_param.y|z * 0.15` (up to 0.15 world). Mouse parallax `-u_mouse * a_param.x`, where `u_mouse` eases toward `0.25 * mouseNDC` at 0.1 per frame (L3610). Desktop: the group x also follows scroll (L3613).
- Blur: none worth the name (see 2.7). `dof-2k-10.jpg` is loaded as `sprite` and never referenced.

### 2.7 Depth of field and grain

The Bokeh pass swaps in a custom depth material that writes `1 - smoothstep(0.1, 13, viewZ)`, then runs BokehShader2's physical CoC formula with fstop 2509. Result by view depth: 0.077 at 0.5 to 2 units, 0.060 at 4, then under 0.05 from about 5 units out, where the shader skips blurring and passes the pixel through. Blur radius is `blur * maxblur` = 0.77 px at most. The brain (view depth 6 to 14) is never blurred. The pass costs a full depth re-render and does nothing visible. Do not copy it.

Grain: a quad in the particle scene at z 9.6, `transparent: true`, drawn last, so it lands before bloom. The pattern is `sin(x) * sin(y) * 4` on a 4096 x `u_scale` grid, rotated 0.5 rad, re-jittered per pixel per frame, times 0.252, written at alpha 0.149 into an 8-bit target (negatives clip to 0). Net effect: the whole frame is darkened 14.9% and up to +0.149 speckle is added. `noise.jpg` is bound but the shader no longer samples it. The quad also works as the intro curtain: `u_show` 0 draws black, and entering the site tweens it to 1 over 2 s (`Power2.easeInOut`).

### 2.8 Mouse

Per particle, in the vertex shader, with `m` = eased mouse NDC times the frustum half-size at 10 units:

```
dist  = smoothstep(1.25 + abs(max(u_delta.x, u_delta.y)), 0.0, distance(particle.xy, m))
pos.x += dist * sin(t * a_random.y) * (a_random.z * 0.35 + u_delta.x) * (1 - explode)
pos.y += dist * cos(t * a_random.y) * (a_random.z * 0.35 + u_delta.y) * (1 - explode)
scale += dist * 0.75 * (1 - explode)                 // before the 0.1 base, so median size x2.4 at the centre
col    = mix(col, vec3(0.45), max(0, dist - explode) * (1 - explode))   // grey, x1.3 = #959595
```

`a_random.y` is in [0.2, 1], `a_random.z` is in [0.5, 1] on desktop and [0, 0.5] on mobile. `u_delta` is mouse velocity: `clamp(50 * dNDC per event, +-2)` on desktop, +-0.1 on mobile. It decays 0.1 per frame and the uniform eases toward it at 0.075 per frame (L4237, L4265). `u_mouse` eases at 0.075 per frame. The sim is untouched: there is no repulsion force. The particle camera also turns toward the pointer, `rotation.y -> -0.075 * m.x` and `rotation.x -> 0.05 * m.y`, eased 0.1 per frame (L4706).

## 3. How to reproduce with our own code

### 3.1 Frame mesh generator

Checked in bun: 20 verts, 144 indices, closed, consistent winding, edge 1.257.

```js
// Tetrahedral frame: closed shell, one triangular window per face.
// 4 outer corners, 4 inner corners (radially inset), 3 window verts per face = 20 verts, 48 tris.
export function frameTetra({ radius = 0.77, inner = 0.82, window = 0.586, sink = 0.024 } = {}) {
  const q = Math.sqrt
  const U = [[0, 1, 0], [-q(8 / 9), -1 / 3, 0], [q(2 / 9), -1 / 3, q(2 / 3)], [q(2 / 9), -1 / 3, -q(2 / 3)]]
    .map(a => new THREE.Vector3(...a))
  const O = U.map(u => u.clone().multiplyScalar(radius))          // outer corners 0..3
  const I = U.map(u => u.clone().multiplyScalar(radius * inner))  // inner corners 4..7
  const edge = O[0].distanceTo(O[1])
  const verts = [...O, ...I], tris = []
  const tri = (a, b, c, out) => { // wind so the normal points away from (out) or toward (!out) the centre
    const n = new THREE.Vector3().subVectors(verts[b], verts[a]).cross(new THREE.Vector3().subVectors(verts[c], verts[a]))
    const m = verts[a].clone().add(verts[b]).add(verts[c])
    tris.push(...((n.dot(m) > 0) === out ? [a, b, c] : [a, c, b]))
  }
  for (let k = 0; k < 4; k++) {               // face opposite corner k
    const f = [0, 1, 2, 3].filter(i => i !== k)
    const g = f.reduce((s, i) => s.add(O[i]), new THREE.Vector3()).divideScalar(3)
    const n = g.clone().normalize()
    const h = f.map(i => { verts.push(g.clone().lerp(O[i], window).addScaledVector(n, -sink * edge)); return verts.length - 1 })
    for (let e = 0; e < 3; e++) {
      const a = f[e], b = f[(e + 1) % 3], ha = h[e], hb = h[(e + 1) % 3]
      tri(a, b, hb, true); tri(a, hb, ha, true)                 // outer ring, faces out
      tri(a + 4, b + 4, hb, false); tri(a + 4, hb, ha, false)   // inner ring, faces the centre
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts.flatMap(v => v.toArray()), 3))
  geo.setIndex(tris)
  return geo
}
```

Knobs: `window` sets bar width (bar / edge = (1 - window) x 0.2887, so 0.586 gives 0.12). `inner` and `sink` only change the look at oblique angles. For an `InstancedBufferGeometry`, copy `position` and `index` from this geometry. No normals are needed.

### 3.2 Material flags

```js
new THREE.ShaderMaterial({
  transparent: true,          // alpha = depth fade
  depthWrite: true,           // keep: this is what makes the front particle win
  depthTest: true,
  side: THREE.FrontSide,      // the closed shell shows every strut, no DoubleSide
  blending: THREE.NormalBlending,
})
// fragment: gl_FragColor = vec4(col * 1.3, smoothstep(-4.5, 4.0, zRel));
// zRel = view z + distance from camera to the shape centre (Dala: + 10). Clear colour black.
```

Leave out `#include <colorspace_fragment>` and pass colours as plain `vec3(r/255, g/255, b/255)` uniforms or attributes, not `THREE.Color`. Dala writes texel x 1.3 straight to an unencoded canvas. Leave `renderer.outputColorSpace` alone and skip the include, or the hex values come out re-encoded.

### 3.3 Size distribution

World scale = `0.155 * s` desktop (0.12 mobile), with `s` drawn from Dala's CDF. Use a smooth noise of the particle's rest position as the variate so small particles cluster:

```js
// piecewise-linear inverse CDF of Dala's brain scale texture
const Q = [[0, 0.004], [0.05, 0.126], [0.25, 0.275], [0.5, 0.345], [0.75, 0.404], [0.95, 0.463], [1, 0.494]]
export function sizeFromU(u) {
  for (let i = 1; i < Q.length; i++) if (u <= Q[i][0]) {
    const [u0, s0] = Q[i - 1], [u1, s1] = Q[i]
    return s0 + (s1 - s0) * (u - u0) / (u1 - u0)
  }
  return Q[Q.length - 1][1]
}
// u = rank-normalised value of a low-frequency noise at the rest position (rank so the CDF holds exactly)
```

Bake `s` per particle into an instance attribute at load. It is static in Dala, apart from blending between shapes.

### 3.4 Colour

Six regional colours with Dala's shares, chosen by a low-frequency field over rest position (rank-normalise the field and cut it at the cumulative shares): gold 40.7%, lilac grey 24.8%, teal 9.9%, purple 9.7%, rose 9.1%, slate 5.7%. Use our own brand values if the palette changes, but keep one dominant warm at about 40%, one pale neutral at about 25%, four accents at 6-10% each, no white, and x1.3 on output.

### 3.5 Spacing target

NN / edge median 1.8 (p25 1.46, p75 2.43). With Dala's numbers: NN 0.122 at radius 4.35 (NN = 0.028 x radius) and median edge 0.067. For any shape and count: measure the median NN of the baked points, then set the median edge to `0.55 x NN`.

### 3.6 Post

1. Render particles, dust and a grain quad in one scene (grain: alpha 0.149, value `max(0, sin(x) * sin(y) * 4 * 0.252)` per pixel, re-jittered per frame).
2. `UnrealBloomPass` strength 0.4, radius 1, threshold 0.159.
3. `VignetteShader` offset 0.3, darkness 4.
4. No DOF on the shape.

Renderer on desktop: `antialias: false`, `setPixelRatio(1)`. This is a real trade. It softens text-free WebGL on retina screens, and it is also why Dala's edges look heavy. If we keep a higher DPR, clamp bar width to at least 1 device px and add bloom, and compare side by side.

## 4. Diff against `builds/dala-modified-particles/src/particles.js`

Measured: our shape 0 (SIDE 75, scale 3.6) has NN p50 0.114. Our particle edge is `1.633 * 0.085 * mix(0.75, 1.45, r^2)`, p50 0.128 (range 0.104 to 0.192). That gives NN / edge 0.89 against Dala's 1.81. Our particles are 1.9x too big for their spacing. Our band is 0.06 barycentric, which is 0.052 x edge, against Dala's 0.12. Our bars are 2.3x too thin relative to the particle.

| Where | Now | Change to |
|---|---|---|
| `pyramid()` L180-190 | `TetrahedronGeometry(1)` plus `aBary`, non-indexed | `frameTetra()` from 3.1, copy `position` + `index`, drop `aBary` |
| `FRAG` WIRE branch L136-142 | barycentric discard, band 0.06, fwidth floor | delete. The geometry is the frame |
| `STYLE` L192-194 | `side: DoubleSide` | `side: FrontSide`, `transparent: true`, `depthWrite: true` |
| `VERT` size L109 | `uSize * mix(0.75, 1.45, aRand.w^2) * (1 + min(len(v) * 6, 0.8))` | `0.155 * aSize` (attribute from 3.3). Drop the velocity growth, Dala has none. Keeping SIDE 75 / scale 3.6: use 0.145 (edge = 0.55 x 0.114) |
| `SIM.size` config L31 | 0.085 | replaced by the 0.155 / 0.145 constant above |
| rotation L107-108 | 3 sines x 1.2 + t x 0.25 about (0.3, 1, 1) | `angle = mod(snoise(p * 0.619) + t, 2pi)` about `normalize(0, 1, 1)`: 1 rad/s, noise phase. Use three's simplex chunk or our own 3D noise |
| colour L114-118 | 3 regions + 35% speckle (white / teal / pink) | 6 regions with the shares in 3.4, no speckle, `* 1.3` |
| `FRAG` output L146 | `vec4(vColor * light * vShade, vDepth / 20)`, plus `colorspace_fragment` | `vec4(vColor * 1.3, smoothstep(-4.5, 4.0, zRel))`, no colorspace include |
| depth fade L123 | `mix(0.02, 1, smoothstep(-3, 2.5, z))` on colour | alpha `smoothstep(-4.5, 4.0, z)` over black. Wider ramp, real alpha |
| mouse (VELOCITY L60-62, `SIM.mouseForce`) | radial push in the sim | remove from the sim. In the vertex shader: offset, scale +0.075 world and grey tint per 2.8, radius 1.25 + speed |
| `createDust()` L309-335 | 180, 70% at z -14..-5, 30% at 5..8, size 0.06-0.56, `vShade` 0.55 | 250, z 0.1..9.1 (all in front), xy = rand x frustum(9.9) x lerp(0.5, 0.2, z/9), fixed scale 0.075 (edge 0.094), 4 colours evenly, alpha `random()`, spin 0.17-0.47 rad/s, drift <= 0.15, mouse parallax |
| `post.js` | DOF disc blur (max 4 px, x2 near) plus vignette plus grain 0.018 | bloom 0.4 / 1 / 0.159, vignette 0.3 / 4, grain layer 0.149 / 0.252. No DOF: it needs alpha for depth, and Dala's DOF is a no-op |
| `main.js` renderer | `antialias: true`, DPR up to 2, MSAA x4 post target | desktop `antialias: false`, DPR 1 to match (see 3.6) |
| `main.js` camera | camera translates +-0.4 / 0.25 and looks at the origin | optional: rotate camera y `-0.075 * m.x`, x `0.05 * m.y`, eased 0.1 per frame |

Order of impact on the three complaints:
- "Edges too thin": frame geometry at 0.12 bar / edge, smaller particles, DPR 1 with no AA, bloom.
- "Overlap flat": real alpha fade over black with depthWrite on, 3.7x size spread, bloom, 1 rad/s noise-phased spin.
- "Too compacted": particle edge from 0.128 to 0.063-0.067 world, or keep the size and double the spacing.
