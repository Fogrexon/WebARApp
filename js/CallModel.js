"use strict";

import * as THREE from "../jsm/three.module.js";
import {ARButton} from "../jsm/ARButton.js";
import {GLTFLoader} from "../jsm/GLTFLoader.js";

const container = document.createElement("div");
document.body.appendChild(container);

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 2000);
const light = new THREE.HemisphereLight(0xffffff, 0x5555aa, 1.0);
light.position.set(0.5, 1.0, 0.25);
scene.add(light);

const renderer = new THREE.WebGLRenderer(
    {
        antialiase: true,
        alpha: true
    }
);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);


document.body.appendChild(ARButton.createButton(renderer, {requiredFeatures: ["hit-test"]}));

let zunko, mixer;
var loader = new GLTFLoader();

loader.load("./models/zunko.gltf", (object)=>{
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
    zunko.scale.set(0.01,0.01,0.01);
    zunko.position.set(10000,10000,10000);
    scene.add(zunko);
},()=>{
    console.log("load");
},()=>{
    console.log("error");
}
);

const reticle = new THREE.Mesh(
    new THREE.RingBufferGeometry(0.15, 0.2, 32).rotateX(-Math.PI/2),
    new THREE.MeshBasicMaterial()
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

const onSelect = () => {

    if ( reticle.visible && !!zunko) {
        zunko.position.setFromMatrixPosition( reticle.matrix );
    }

};

const controller = renderer.xr.getController( 0 );
controller.addEventListener( 'select', onSelect );
scene.add( controller );

//

const onWindowResize = ()=>{

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize, false );





let hitTestSource;
let hitTestSourceRequested = false

const render = ( timestamp, frame ) => {

    if(mixer)
    {
        mixer.update(clock.getDelta());
    }

    if ( frame ) {

        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if ( hitTestSourceRequested === false ) {

            session.requestReferenceSpace( 'viewer' ).then( ( referenceSpace ) => {

                session.requestHitTestSource( { space: referenceSpace } ).then( ( source ) => {

                    hitTestSource = source;

                } );

            } );

            hitTestSourceRequested = true;

        }

        if ( hitTestSource ) {

            var hitTestResults = frame.getHitTestResults( hitTestSource );

            if ( hitTestResults.length ) {

                var hit = hitTestResults[ 0 ];

                reticle.visible = true;
                reticle.matrix.fromArray( hit.getPose( referenceSpace ).transform.matrix );

            } else {

                reticle.visible = false;

            }

        }

    }

    renderer.render( scene, camera );

}

renderer.setAnimationLoop(render);
