import * as THREE from "../jsm/three.module.js";
import {OBJLoader} from "../jsm/OBJLoader.js";


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 2000 );
camera.position.set(10,10,10);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const light = new THREE.HemisphereLight( 0xffeeee, 0x5555aa, 1 );
light.position.set( 0.5, 1, 0.25 );
scene.add( light );

//

const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let carModel;
var ObjLoader = new OBJLoader();
ObjLoader.load("../models/car.obj",  function (object){
    carModel = object.clone();
    // carModel = object.clone();
    carModel.scale.set(1, 1, 1);            // 縮尺の初期化
    carModel.rotation.set(0, 0, 0);         // 角度の初期化
    carModel.position.set(0, 0, 0);         // 位置の初期化
    scene.add(carModel);
},()=>{
    console.log("load");
},()=>{
    console.log("error");
}
);


animate();

function animate() {

    renderer.setAnimationLoop(render);

}

function render( timestamp, frame ) {

    renderer.render( scene, camera );

}