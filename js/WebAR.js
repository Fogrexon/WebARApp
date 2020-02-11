import * as THREE from "../jsm/three.module.js";
import {ARButton} from "../jsm/ARButton.js";


let width = window.innerWidth;
let height = window.innerHeight;

const cnv = document.getElementById("cnv");
cnv.width = width;
cnv.height = height;

const renderer = new THREE.WebGLRenderer({
    canvas: cnv,
    antialias: true,
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.xr.enabled = true;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, width/height, 0.01, 20);

const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1.0);
light.position.set(0,1,0);
scene.add(light);

const controller = renderer.xr.getController(0);
controller.userData.points = [ new THREE.Vector3(), new THREE.Vector3()];
controller.userData.matrices = [new THREE.Matrix4(), new THREE.Matrix4()];
controller.userData.skipFrames = 0;
controller.userData.isSelecting = false;
scene.add(controller);

const onSelectStart = ()=>{
    this.userData.isSelecting = true;
}

controller.addEventListener("selectstart", onSelectStart);

document.body.appendChild(ARButton.createButton(renderer));

const onWindowResize = () => {

    width = window.innerWidth;
    height = window,innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}

window.addEventListener('resize', onWindowResize, false);

const geometry = new THREE.SphereGeometry(0.2, 16, 16);
const material = new THREE.MeshStandardMaterial();

const tick = ()=>{
    if(controller.userData.isSelecting)
    {
        const cursor = new THREE.Vector3();
        cursor.set(0,0,-0.2).applyMatrix4(controller.MatrixWorld);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(cursor);
        scene.add(mesh);
    }
    renderer.render(scene, camera);
    setTimeout(tick, 1000 / 60);
}

tick();