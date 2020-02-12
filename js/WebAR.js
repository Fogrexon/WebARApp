import * as THREE from "../jsm/three.module.js";
import {ARButton} from "../jsm/ARButton.js";

let width = window.innerWidth;
let height = window.innerHeight;

const cursor = new THREE.Vector3();

const container = document.createElement( 'div' );
document.body.appendChild( container );
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 70, width/height, 0.01, 20 );
const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( width, height );
renderer.xr.enabled = true;
container.appendChild( renderer.domElement );

document.body.appendChild( ARButton.createButton( renderer ) );

const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
light.position.set( 0, 1, 0 );
scene.add( light );

const onSelectStart = () => {
	controller.userData.isSelecting = true;
}

controller = renderer.xr.getController( 0 );
controller.addEventListener( 'selectstart', onSelectStart );
controller.userData.skipFrames = 0;
controller.userData.isSelecting = false;
scene.add( controller );

const onWindowResize = () => {

	width = window.innerWidth;
	height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);

}
window.addEventListener( 'resize', onWindowResize, false );

const handleController = () => {

	cursor.set( 0, 0, - 0.2 ).applyMatrix4( controller.matrixWorld );

	if(controller.userData.isSelecting)
	{
		const geometry = new THREE.SphereGeometry(0.02, 16, 16);
		const material = new THREE.MeshStandardMaterial({color: 0xffffff, roughness:0.5});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(cursor.x,cursor.y,cursor.z);
		scene.add(mesh);
		controller.userData.isSelecting = false;
	}

}

const render = () => {

	handleController();

	renderer.render( scene, camera );

	setTimeout(render, 1000/60);
}
render();


