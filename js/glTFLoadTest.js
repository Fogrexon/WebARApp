import * as THREE from "../jsm/three.module.js";
import {GLTFLoader} from "../jsm/GLTFLoader.js";


const scene = new THREE.Scene();
const clock = new THREE.Clock();

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

let zunko, mixer;
var loader = new GLTFLoader();

loader.load("../models/zunko.gltf", (object)=>{
    const gltf = object;
    zunko = gltf.scene;
    const animations = gltf.animations;

    if(animations && animations.length)
    {
        mixer = new THREE.AnimationMixer(zunko);
        for(let i=0;i<animations.length;i++)
        {
            mixer.clipAction(animations[i]).play();
        }
    }
    zunko.scale.set(0.1,0.1,0.1);
    scene.add(zunko);
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

    if(mixer)
    {
        mixer.update(clock.getDelta());
    }
    renderer.render( scene, camera );

}