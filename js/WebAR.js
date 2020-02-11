import * as THREE from "../jsm/three.module.js";
import {ARButton} from "../jsm/ARButton.js";

/*
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


const onSelectStart = ()=>{
    this.userData.isSelecting = true;
    
}

const controller = renderer.xr.getController(0);
controller.addEventListener("selectstart", onSelectStart);
controller.userData.skipFrames = 0;
controller.userData.isSelecting = false;
scene.add(controller);


document.body.appendChild(ARButton.createButton(renderer));

const onWindowResize = () => {

    width = window.innerWidth;
    height = window,innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}

window.addEventListener('resize', onWindowResize, false);


const tick = ()=>{
    if(controller.userData.isSelecting)
    {
        const cursor = new THREE.Vector3();
        cursor.set(0,0,-0.2).applyMatrix4(controller.MatrixWorld);

        const geometry = new THREE.SphereGeometry(0.4, 16, 16);
        const material = new THREE.MeshStandardMaterial({color: 0xffffff, roughness:0.5});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(cursor.x,cursor.y,cursor.z);
        scene.add(mesh);
        controller.userData.isSelecting = false;
    }
    renderer.render(scene, camera);
    setTimeout(tick, 1000 / 60);
}

tick();

*/
			var container;
			var camera, scene, renderer;
			var controller, painter;

			var cursor = new THREE.Vector3();

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

				//

				renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.xr.enabled = true;
				container.appendChild( renderer.domElement );

				//

				document.body.appendChild( ARButton.createButton( renderer ) );

				// model

				var light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
				light.position.set( 0, 1, 0 );
				scene.add( light );

				//

				//

				function onSelectStart() {

					this.userData.isSelecting = true;

				}



				controller = renderer.xr.getController( 0 );
				controller.addEventListener( 'selectstart', onSelectStart );
                controller.userData.skipFrames = 0;
                controller.userData.isSelecting = true;
				scene.add( controller );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function handleController( controller ) {

				var userData = controller.userData;

				cursor.set( 0, 0, - 0.2 ).applyMatrix4( controller.matrixWorld );

                if(controller.userData.isSelecting)
                {
                    cursor.set(0,0,-0.2).applyMatrix4(controller.MatrixWorld);
            
                    const geometry = new THREE.SphereGeometry(0.4, 16, 16);
                    const material = new THREE.MeshStandardMaterial({color: 0xffffff, roughness:0.5});
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(cursor.x,cursor.y,cursor.z);
                    scene.add(mesh);
                    controller.userData.isSelecting = false;
                }

			}

			function animate() {

				renderer.setAnimationLoop( render );

			}

			function render() {

				handleController( controller );

				renderer.render( scene, camera );

			}