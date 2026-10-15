const root = document.querySelector('[data-scene]');
const local = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const forced = local && new URLSearchParams(location.search).get('motion') === 'on';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches && !forced;

if (root && !reduced) init(root);

async function init(host) {
  const THREE = await import('three');
  const canvas = host.querySelector('canvas');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    host.dataset.failed = 'webgl';
    host.querySelector('.scene-static').style.display = 'block';
    return;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 80);
  const pointer = new THREE.Vector2(0, 0);
  const target = new THREE.Vector2(0, 0);
  const kind = host.dataset.scene;
  const world = makeWorld(kind, THREE, scene, camera, host);
  let progress = readProgress();
  let frame = 0;
  let dirty = true;
  let visible = true;

  function readProgress() {
    const rect = host.getBoundingClientRect();
    return Math.max(0, Math.min(1, -rect.top / Math.max(1, innerHeight)));
  }

  function size() {
    const rect = host.getBoundingClientRect();
    const pixelBudget = 2_200_000;
    const maxDpr = matchMedia('(pointer:coarse)').matches ? 1.35 : 1.8;
    const dpr = Math.max(1, Math.min(maxDpr, devicePixelRatio || 1, Math.sqrt(pixelBudget / Math.max(1, rect.width * rect.height))));
    renderer.setPixelRatio(dpr);
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(1, rect.height);
    camera.updateProjectionMatrix();
    dirty = true;
    request();
  }

  function request() {
    if (visible && !frame) frame = requestAnimationFrame(draw);
  }

  function draw() {
    frame = 0;
    pointer.lerp(target, .13);
    const moving = pointer.distanceToSquared(target) > .00002;
    world.update(progress, pointer);
    updateSemanticState(kind, pointer, host);
    renderer.render(scene, camera);
    dirty = false;
    if (moving) request();
  }

  function point(clientX, clientY) {
    const rect = host.getBoundingClientRect();
    target.set(((clientX - rect.left) / rect.width) * 2 - 1, -(((clientY - rect.top) / rect.height) * 2 - 1));
    request();
  }

  host.addEventListener('pointermove', (event) => point(event.clientX, event.clientY), { passive: true });
  host.addEventListener('pointerdown', (event) => point(event.clientX, event.clientY), { passive: true });
  host.addEventListener('pointerleave', () => { target.set(0, 0); request(); }, { passive: true });
  host.tabIndex = 0;
  host.addEventListener('keydown', (event) => {
    const step = .12;
    if (event.key === 'ArrowLeft') target.x -= step;
    else if (event.key === 'ArrowRight') target.x += step;
    else if (event.key === 'ArrowUp') target.y += step;
    else if (event.key === 'ArrowDown') target.y -= step;
    else return;
    target.clampScalar(-1, 1);
    event.preventDefault();
    request();
  });
  addEventListener('scroll', () => { progress = readProgress(); dirty = true; request(); }, { passive: true });
  addEventListener('resize', size, { passive: true });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) request();
  }, { rootMargin: '120px' }).observe(host);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && dirty) request(); });
  size();
}

function updateSemanticState(kind, pointer, host) {
  const active = Math.max(0, Math.min(3, Math.floor((pointer.x + 1) * 2)));
  if (host.dataset.active === String(active)) return;
  host.dataset.active = String(active);
  if (kind === 'assay') {
    document.querySelectorAll('.assay-index li').forEach((item, i) => item.toggleAttribute('data-active', i === active));
  }
  if (kind === 'witness') {
    const evidence = [
      ['1,200+', 'beta signups in three weeks', 'SaaSquatch Leads · public record'],
      ['300,000+', 'calls across five countries', 'Cold Call Killers · public record'],
      ['Beta', 'origination platform', 'CLOVER · product record'],
      ['5', 'verified operator backgrounds', 'Caprae Tech · team record'],
    ];
    const box = document.querySelector('.witness-proof');
    if (box) {
      box.querySelector('span').textContent = `RESOLVED / 0${active + 1}`;
      box.querySelector('strong').textContent = evidence[active][0];
      box.querySelector('p').textContent = evidence[active][1];
      box.querySelector('small').textContent = evidence[active][2];
    }
    const live = document.querySelector('.witness-readout strong');
    if (live) live.textContent = ['Acquisition signal', 'Operating throughput', 'Origination routing', 'Operator context'][active];
  }
}

function makeWorld(kind, THREE, scene, camera, host) {
  scene.add(new THREE.AmbientLight(0xffffff, 1.25));
  const key = new THREE.DirectionalLight(kind === 'witness' ? 0x8de1ff : 0xffe5ae, 3.1);
  key.position.set(4, 6, 8);
  scene.add(key);
  if (kind === 'assay') return assayWorld(THREE, scene, camera);
  if (kind === 'registered') return registeredWorld(THREE, scene, camera, host);
  if (kind === 'ledger') return ledgerWorld(THREE, scene, camera);
  return witnessWorld(THREE, scene, camera);
}

function assayWorld(THREE, scene, camera) {
  camera.position.set(0, 1.3, 9);
  camera.lookAt(0, 0, 0);
  const group = new THREE.Group();
  group.rotation.set(-.12, -.36, -.06);
  scene.add(group);
  const shape = new THREE.Shape();
  shape.moveTo(-1.8,-.8); shape.lineTo(1.5,-.8); shape.lineTo(1.8,-.5);
  shape.lineTo(1.8,.8); shape.lineTo(-1.25,.8); shape.lineTo(-1.48,.58);
  shape.lineTo(-1.8,.58); shape.closePath();
  const notch = new THREE.Path(); notch.moveTo(.82,.38); notch.lineTo(1.12,.38); notch.lineTo(1.12,.68); notch.lineTo(.82,.68); notch.closePath();
  shape.holes.push(notch);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth:.12, bevelEnabled:true, bevelSize:.025, bevelThickness:.025, bevelSegments:2 });
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0xd8d0bf, roughness: .76, metalness: .06 }),
    new THREE.MeshStandardMaterial({ color: 0xb7ae9d, roughness: .5, metalness: .18 }),
    new THREE.MeshStandardMaterial({ color: 0x6d3025, roughness: .66, metalness: .05 }),
    new THREE.MeshStandardMaterial({ color: 0xf9d360, roughness: .42, metalness: .35 }),
  ];
  const slabs = materials.map((material, i) => {
    const slab = new THREE.Mesh(geometry, material);
    slab.position.set((i - 1.5) * .54, (i - 1.5) * -.18, i * -.08);
    slab.rotation.z = (i - 1.5) * .035;
    group.add(slab);
    return slab;
  });
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.5), new THREE.MeshBasicMaterial({ color: 0x6d3025, transparent: true, opacity: .085, side: THREE.DoubleSide }));
  scan.rotation.y = Math.PI / 2;
  group.add(scan);
  return { update(p, pointer) {
    const local = Math.min(1, p * 2.4);
    slabs.forEach((slab, i) => {
      const spread = (i - 1.5) * local;
      slab.position.z = (i - 1.5) * .18 + spread * .52;
      slab.position.x = (i - 1.5) * (.52 + local * .16);
      slab.rotation.y = spread * .025;
    });
    scan.position.x = THREE.MathUtils.lerp(-2.3, 2.3, local);
    group.rotation.x = -.12 + pointer.y * .08;
    group.rotation.y = -.36 + pointer.x * .1;
  }};
}

function registeredWorld(THREE, scene, camera, host) {
  camera.position.set(0, .2, 9.5);
  camera.lookAt(0, 0, 0);
  const count = innerWidth < 700 ? 1100 : 3500;
  const geometry = new THREE.BoxGeometry(.032, .34, .11);
  const material = new THREE.MeshStandardMaterial({ color: 0xd8d5ce, roughness: .68, metalness: .08 });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const dummy = new THREE.Object3D();
  const data = [];
  let seed = 7231;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = 0; i < count; i++) data.push({ x:(random()-.5)*8, y:(random()-.5)*5.2, z:(random()-.5)*4, r:(random()-.5)*1.2, stage:random() });
  scene.add(mesh);
  const spineRatio = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spine-x')) || .34;
  const spine = new THREE.Mesh(new THREE.BoxGeometry(.026, 6.2, .026), new THREE.MeshBasicMaterial({ color: 0xf9d360 }));
  scene.add(spine);
  function pageSpineX() {
    const rect = host.getBoundingClientRect();
    const ndc = (((innerWidth * spineRatio) - rect.left) / rect.width) * 2 - 1;
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov * .5)) * camera.position.z;
    return ndc * halfHeight * camera.aspect;
  }
  return { update(p, pointer) {
    const q = Math.min(1, p * 1.8);
    const spineX = pageSpineX();
    spine.position.x = spineX;
    data.forEach((d, i) => {
      const registered = THREE.MathUtils.smoothstep(q - d.stage, -.18, .25);
      dummy.position.set(THREE.MathUtils.lerp(d.x, spineX + (d.stage-.5)*.28, registered), d.y, THREE.MathUtils.lerp(d.z, 0, registered));
      dummy.rotation.set(d.r * (1-registered), pointer.x*.08, d.r*.4);
      dummy.scale.setScalar(.75 + d.stage*.65);
      dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    camera.position.x = pointer.x * .35;
    camera.position.y = .2 + pointer.y * .25;
    camera.lookAt(0,0,0);
  }};
}

function ledgerWorld(THREE, scene, camera) {
  camera.position.set(4.8, 3.6, 8.5);
  camera.lookAt(0, 0, 0);
  const group = new THREE.Group();
  scene.add(group);
  const bays = 12, rails = 3;
  const nodes = [];
  for (let z = 0; z < rails; z++) for (let x = 0; x < bays; x++) nodes.push(new THREE.Vector3((x-(bays-1)/2)*.5, (x%2)*.16-.18, (z-1)*.82));
  const edges = [];
  for(let z=0;z<rails;z++) for(let x=0;x<bays-1;x++){const a=z*bays+x;edges.push([a,a+1]);}
  for(let z=0;z<rails-1;z++) for(let x=0;x<bays;x++) edges.push([z*bays+x,(z+1)*bays+x]);
  for(let z=0;z<rails-1;z++) for(let x=0;x<bays-1;x++){edges.push([z*bays+x,(z+1)*bays+x+1]);edges.push([(z+1)*bays+x,z*bays+x+1]);}
  const beamGeo = new THREE.CylinderGeometry(.032,.032,1,8);
  const beamMat = new THREE.MeshStandardMaterial({color:0x181816,roughness:.55,metalness:.35});
  const stressMat = new THREE.MeshStandardMaterial({color:0xf9d360,roughness:.48,metalness:.25});
  const beams = edges.map((edge,i)=>{const m=new THREE.Mesh(beamGeo,i%9===0?stressMat:beamMat);group.add(m);return m});
  const supportMat = new THREE.MeshStandardMaterial({color:0x181816,roughness:.7});
  const pin=new THREE.Mesh(new THREE.ConeGeometry(.18,.34,4),supportMat);pin.position.set(-2.75,-.48,0);pin.rotation.y=Math.PI/4;group.add(pin);
  const rollerBeam=new THREE.Mesh(new THREE.BoxGeometry(.42,.08,.75),supportMat);rollerBeam.position.set(2.75,-.42,0);group.add(rollerBeam);
  [-.18,.18].forEach((z)=>{const roller=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.55,12),supportMat);roller.position.set(2.75,-.55,z);roller.rotation.x=Math.PI/2;group.add(roller)});
  const arrowMat = new THREE.MeshBasicMaterial({color:0xf9d360});
  [-1.75,-.55,.65,1.85].forEach((x)=>{const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.55,8),arrowMat);shaft.position.set(x,1.08,0);group.add(shaft);const arrow=new THREE.Mesh(new THREE.ConeGeometry(.08,.3,10),arrowMat);arrow.position.set(x,.72,0);arrow.rotation.z=Math.PI;group.add(arrow)});
  const displacement = nodes.map((n)=>Math.sin((n.x+2.75)/5.5*Math.PI)*(.25 + Math.abs(n.z)*.05));
  const up = new THREE.Vector3(0,1,0), mid = new THREE.Vector3(), delta = new THREE.Vector3();
  return { update(p,pointer){
    const load=Math.min(1,p*2.1);
    const displaced=nodes.map((n,i)=>new THREE.Vector3(n.x,n.y-displacement[i]*load,n.z));
    edges.forEach((edge,i)=>{const a=displaced[edge[0]],b=displaced[edge[1]];mid.copy(a).add(b).multiplyScalar(.5);delta.copy(b).sub(a);beams[i].position.copy(mid);beams[i].scale.set(1,delta.length(),1);beams[i].quaternion.setFromUnitVectors(up,delta.clone().normalize())});
    group.rotation.y=-.23+pointer.x*.08; group.rotation.x=pointer.y*.04;
  }};
}

function witnessWorld(THREE, scene, camera) {
  camera.position.set(0,0,7.5);
  const count = innerWidth < 700 ? 900 : 2200;
  const positions = new Float32Array(count*3);
  const seeds = new Float32Array(count);
  let seed=91821; const random=()=>((seed=(seed*48271)%2147483647)-1)/2147483646;
  for(let i=0;i<count;i++){positions[i*3]=(random()-.5)*10;positions[i*3+1]=(random()-.5)*6;positions[i*3+2]=(random()-.5)*5;seeds[i]=random()}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uPointer:{value:new THREE.Vector2()},uProgress:{value:0}},vertexShader:`attribute float aSeed; uniform vec2 uPointer; uniform float uProgress; varying float vA; void main(){ vec3 p=position; float d=distance(p.xy*vec2(.18,.29),uPointer); float lens=smoothstep(.55,.03,d); p.z=mix(p.z,0.0,lens*.88); p.xy+=normalize(p.xy+vec2(.001))*lens*.08; p.x+=sin(aSeed*40.0+uProgress*4.0)*.08; vec4 mv=modelViewMatrix*vec4(p,1.0); gl_PointSize=(1.2+lens*6.0)*(18.0/max(3.0,-mv.z)); gl_Position=projectionMatrix*mv; vA=.1+lens*.82;}`,fragmentShader:`varying float vA; void main(){vec2 q=gl_PointCoord-.5;float d=dot(q,q);if(d>.25)discard;float core=exp(-d*18.0);gl_FragColor=vec4(mix(vec3(.42,.60,.64),vec3(.55,.90,1.0),core),vA*core);}`});
  const points=new THREE.Points(geometry,material);scene.add(points);
  const ring=new THREE.Mesh(new THREE.RingGeometry(1.3,1.315,96),new THREE.MeshBasicMaterial({color:0x8de1ff,transparent:true,opacity:.48,side:THREE.DoubleSide}));scene.add(ring);
  return {update(p,pointer){material.uniforms.uPointer.value.copy(pointer);material.uniforms.uProgress.value=p;ring.position.set(pointer.x*5.05,pointer.y*3.05,.05);points.rotation.z=p*.08;camera.position.x=pointer.x*.12;camera.position.y=pointer.y*.12;camera.lookAt(0,0,0)}};
}
