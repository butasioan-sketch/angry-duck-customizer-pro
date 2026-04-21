let scene, camera, renderer, shirt;
let canvasTexture, designCanvas, designCtx;
let rotationY = 0;
let isDragging = false;
let previousX = 0;
let currentColor = '#111111';
let cartCount = 0;

let shirtTextures = { white: null, black: null };

function loadShirtTextures() {
  const loader = new THREE.TextureLoader();
  loader.load('assets/shirts/white.png', tex => shirtTextures.white = tex);
  loader.load('assets/shirts/black.png', tex => shirtTextures.black = tex);
}

function initThree() {
  const container = document.getElementById('three-container');
  scene = new THREE.Scene(); scene.background = new THREE.Color(0x111111);
  camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 4);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const light1 = new THREE.DirectionalLight(0xffffff, 1.2); light1.position.set(5,5,5); scene.add(light1);
  const light2 = new THREE.DirectionalLight(0xff0000, 0.6); light2.position.set(-5,-5,-5); scene.add(light2);
  scene.add(new THREE.AmbientLight(0x404040, 0.8));

  const torsoGeo = new THREE.CylinderGeometry(0.9, 1.1, 2.2, 32);
  const material = new THREE.MeshPhongMaterial({ color: currentColor, shininess: 10, specular: 0x222222 });
  shirt = new THREE.Mesh(torsoGeo, material);
  shirt.rotation.x = Math.PI / 2;
  scene.add(shirt);

  const sleeveGeo = new THREE.CylinderGeometry(0.35, 0.25, 1.4, 32);
  const leftSleeve = new THREE.Mesh(sleeveGeo, material); leftSleeve.position.set(-1.1,0,0); leftSleeve.rotation.set(0,0,Math.PI/2); scene.add(leftSleeve);
  const rightSleeve = leftSleeve.clone(); rightSleeve.position.x = 1.1; scene.add(rightSleeve);

  designCanvas = document.createElement('canvas'); designCanvas.width = 1024; designCanvas.height = 1024;
  designCtx = designCanvas.getContext('2d');
  canvasTexture = new THREE.CanvasTexture(designCanvas);
  material.map = canvasTexture;

  loadShirtTextures();
  updateDesign();
  animate();
}

function changeColor(color) {
  currentColor = color;
  if (shirt) {
    shirt.material.color.set(color);
    if (color === '#ffffff' && shirtTextures.white) shirt.material.map = shirtTextures.white;
    if (color === '#111111' && shirtTextures.black) shirt.material.map = shirtTextures.black;
  }
}

function updateDesign() {
  designCtx.clearRect(0, 0, 1024, 1024);
  designCtx.fillStyle = '#ffffff';
  designCtx.font = 'bold 120px Impact';
  designCtx.textAlign = 'center';
  designCtx.fillText(document.getElementById('text-input').value || 'ANGRY DUCK', 512, 512);
  canvasTexture.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);
  shirt.rotation.y = rotationY * (Math.PI / 180);
  renderer.render(scene, camera);
}

function addDragListeners() {
  const container = document.getElementById('three-container');
  container.addEventListener('mousedown', e => { isDragging = true; previousX = e.clientX; });
  container.addEventListener('touchstart', e => { isDragging = true; previousX = e.touches[0].clientX; });
  window.addEventListener('mousemove', e => { if (!isDragging) return; rotationY += (e.clientX - previousX) * 1.8; previousX = e.clientX; });
  window.addEventListener('touchmove', e => { if (!isDragging) return; rotationY += (e.touches[0].clientX - previousX) * 1.8; previousX = e.touches[0].clientX; });
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('touchend', () => isDragging = false);
}

function liveUpdate() { updateDesign(); }

function loadAngryDuckDesign() {
  designCtx.clearRect(0, 0, 1024, 1024);
  designCtx.fillStyle = '#ff0000';
  designCtx.font = 'bold 90px Impact';
  designCtx.textAlign = 'center';
  designCtx.fillText('ON ME,', 512, 420);
  designCtx.fillText('AND IN YOUR HEAD', 512, 540);
  designCtx.fillText('WORDS ARE NOT JUST WORDS!', 512, 660);
  canvasTexture.needsUpdate = true;
  alert('🐤 Angry Duck Design geladen!');
}

function uploadImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = () => { designCtx.drawImage(img, 200, 200, 624, 624); canvasTexture.needsUpdate = true; };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function addToCart() {
  cartCount++;
  document.getElementById('cart-count').textContent = cartCount;
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#ff0000;color:white;padding:20px 32px;border-radius:9999px;font-weight:700;';
  toast.textContent = 'In den Warenkorb gelegt!';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function toggleCart() { alert('🛒 Warenkorb kommt bald!'); }

window.onload = () => {
  initThree();
  addDragListeners();
  console.log('%c🚀 Phase 3 – Echte T-Shirt-Bilder (weiß + schwarz) geladen!', 'color:#ff0000;font-size:18px;font-weight:bold');
};
