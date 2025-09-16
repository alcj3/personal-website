import './style.css'
import space from './assets/space_image2.jpg'
import satelliteURL from './assets/models/Landsat 1, 2, and 3.glb?url'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
// field of view, aspect ratio, near clipping plane, far clipping plane 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);
// scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,0,0);
// scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();
let satellite;
loader.load(satelliteURL, gltf => {
  satellite = gltf.scene;
  satellite.scale.set(5, 5, 5);
  satellite.position.set(0, -1, 0);
  satellite.rotation.z = Math.PI / 8;
  scene.add(satellite);
});

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(500).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load(space, (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace;
});
scene.background = spaceTexture;

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;
  const t = clock.getElapsedTime();
  satellite.rotation.y += 0.01;
  satellite.position.y = -5 + Math.sin(t) * 0.5;
  controls.update();
  renderer.render(scene, camera);
}

animate();