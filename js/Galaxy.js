
import {vertexSource, fragmentSource} from "../jsm/galaxyShader.js";

let width = window.innerWidth;
let height = window.innerHeight;

const renderer = new THREE.WebGLRenderer(
    {
        canvas: document.getElementById("cnv")
    }
);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
camera.position.set(0, 0, 10);


const OnResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

OnResize();
window.addEventListener("resize", OnResize);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.1;



const texture = new THREE.TextureLoader().load("./img/cloud.png");


let x,y,z,r,rot;
let geometry,material,cube;
let uniforms = [];

for(let i=0;i<500;i++){
    x = (Math.random()-0.5) * 1000;
    y = (Math.random()-0.5) * 1000;
    z = (Math.random()-0.5) * 1000;
    r = (Math.random()) * 20 + 1.0;

    geometry = new THREE.SphereGeometry(r,32,32);

    uniforms.push({
        time: { type: "f", value: 1.0 },
        uTex: {value: texture},
        uCenter: {value: new THREE.Vector3(x,y,z)},
        uSize: {value: r},
        uRot: {value: new THREE.Vector3(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2)}
    });

    material = new THREE.MeshNormalMaterial();
    // new THREE.ShaderMaterial({
    //     uniforms: uniforms[i],
    //     vertexShader: vertexSource,
    //     fragmentShader: fragmentSource
    // });
    material.transparent = true;
    
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(x,y,z);
    scene.add(cube);
}

const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
directionalLight.position.set(1,1,1);
scene.add(directionalLight);

const start = Date.now();

const tick = () =>{
    controls.update();
    for(let i=0;i<uniforms.length;i++) uniforms[i].time.value = Date.now() - start;
    renderer.render(scene, camera);
    setTimeout(tick, 1000 / 60);
}
tick();