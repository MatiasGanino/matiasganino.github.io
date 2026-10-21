import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Teclas flotantes con las tecnologías del CV, en la línea de los objetos 3D de moahu.
const KEYS = [
  { label: 'MG', color: '#23336a', ink: '#f4f6fb', pos: [0, 0.2, 0.6], size: 1.35 },
  { label: 'Go', color: '#f4f6fb', ink: '#23336a', pos: [-1.9, 1.3, -0.4], size: 1 },
  { label: 'SQL', color: '#101a3d', ink: '#b3bddc', pos: [1.9, 1.15, -0.2], size: 1 },
  { label: '</>', color: '#f4f6fb', ink: '#23336a', pos: [1.55, -1.25, 0.3], size: 1.05 },
  { label: 'Java', color: '#1a2858', ink: '#f4f6fb', pos: [-1.7, -1.1, 0.1], size: 1 },
  { label: '{ }', color: '#23336a', ink: '#f4f6fb', pos: [-0.3, 2.05, -1.2], size: 0.8 },
  { label: 'QA', color: '#ccd4ef', ink: '#101a3d', pos: [0.2, -2.1, -0.9], size: 0.85 },
  { label: 'DB', color: '#101a3d', ink: '#ccd4ef', pos: [2.9, 0, -1.6], size: 0.8 },
];

function labelTexture(text, ink) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${text.length > 3 ? 70 : 96}px Poppins, system-ui, sans-serif`;
  ctx.fillText(text, 128, 136);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createStage(canvas, { reduced = false, dark = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  // En celular 1.5 alcanza y ahorra GPU
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 900 ? 1.5 : 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.4, 11);

  const key = new THREE.DirectionalLight('#ffffff', 1.6);
  key.position.set(3, 5, 6);
  const ambient = new THREE.AmbientLight('#dfe5f7', 0.4);
  scene.add(key, ambient);

  // En modo oscuro hay más luz para que las teclas oscuras se despeguen del fondo
  function setDark(on) {
    scene.environmentIntensity = on ? 1.3 : 0.7;
    key.intensity = on ? 2.4 : 1.6;
    ambient.intensity = on ? 0.9 : 0.4;
  }
  setDark(dark);

  const group = new THREE.Group();
  scene.add(group);

  const geo = new RoundedBoxGeometry(1, 0.62, 1, 6, 0.2);
  const plane = new THREE.PlaneGeometry(0.82, 0.82);
  const keys = KEYS.map((k, i) => {
    const holder = new THREE.Group();
    const cap = new THREE.Mesh(
      geo,
      new THREE.MeshPhysicalMaterial({ color: k.color, roughness: 0.32, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.25 }),
    );
    const label = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: labelTexture(k.label, k.ink), transparent: true }));
    label.rotation.x = -Math.PI / 2;
    label.position.y = 0.312;
    holder.add(cap, label);
    holder.scale.setScalar(k.size);
    holder.position.set(...k.pos);
    // Inclinadas hacia la cámara para que se lean las letras
    holder.rotation.set(0.95 + (i % 3) * 0.12, (i % 2 ? -1 : 1) * 0.35, (i % 4) * 0.08 - 0.12);
    group.add(holder);
    return {
      holder,
      base: new THREE.Vector3(...k.pos),
      rot: holder.rotation.clone(),
      phase: i * 1.37,
      dir: new THREE.Vector3(...k.pos).normalize(),
    };
  });

  // Estado que modifican el mouse y el scroll
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let progress = 0;
  let smooth = 0;

  // Con reduced motion las teclas no siguen al mouse
  if (!reduced) {
    window.addEventListener('pointermove', (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    });
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En pantallas angostas se aleja la cámara para que entren todas las teclas
    camera.position.z = w / h < 1 ? 15 : 11;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);

  const timer = new THREE.Timer();
  function tick(ms) {
    requestAnimationFrame(tick);
    if (!visible) return;
    timer.update(ms);
    const t = reduced ? 0 : timer.getElapsed();

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    smooth += (progress - smooth) * 0.08;

    group.rotation.y = pointer.x * 0.35 + smooth * 1.2;
    group.rotation.x = pointer.y * 0.2 - smooth * 0.3;

    keys.forEach((k) => {
      // Flotan suavemente y se dispersan a medida que se scrollea
      k.holder.position.copy(k.base).addScaledVector(k.dir, smooth * 3.5);
      k.holder.position.y += Math.sin(t * 0.9 + k.phase) * 0.12;
      k.holder.rotation.x = k.rot.x + Math.sin(t * 0.6 + k.phase) * 0.08 + smooth * 1.5;
      k.holder.rotation.z = k.rot.z + Math.cos(t * 0.5 + k.phase) * 0.06;
    });

    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);

  return {
    setProgress(p) {
      progress = p;
    },
    setDark,
  };
}
