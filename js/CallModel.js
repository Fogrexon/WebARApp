import * as THREE from "../jsm/three.module.js";
import {ARButton} from "../jsm/ARButton.js";
import {OBJLoader} from "../jsm/OBJLoader.js";

var container;
var camera, scene, renderer;
var controller;

var reticle;

var hitTestSource;
var hitTestSourceRequested = false;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 2000 );

    var light = new THREE.HemisphereLight( 0xffffff, 0x5555aa, 1 );
    light.position.set( 0.5, 1, 0.25 );
    scene.add( light );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    container.appendChild( renderer.domElement );

    //

    document.body.appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );
    //

    //var geometry = new THREE.CylinderBufferGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );
    let carModel;
    var ObjLoader = new OBJLoader(); 
    ObjLoader.load("../models/car.obj",  function (object){
        carModel = object.clone();
        carModel.scale.set(0.1, 0.1, 0.1);            // 縮尺の初期化
        carModel.rotation.set(0, 0, 0);         // 角度の初期化
        carModel.position.set(0, 0, 0);         // 位置の初期化                // sceneに追加
    });

    function onSelect() {

        if ( reticle.visible && !!carModel) {

            // var material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
            var mesh = carModel.clone();
            mesh.position.setFromMatrixPosition( reticle.matrix );
            // mesh.scale.y = Math.random() * 2 + 1;
            scene.add( mesh );

        }

    }

    controller = renderer.xr.getController( 0 );
    controller.addEventListener( 'select', onSelect );
    scene.add( controller );

    reticle = new THREE.Mesh(
        new THREE.RingBufferGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
        new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add( reticle );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    renderer.setAnimationLoop( render );

}

function render( timestamp, frame ) {

    if ( frame ) {

        var referenceSpace = renderer.xr.getReferenceSpace();
        var session = renderer.xr.getSession();

        if ( hitTestSourceRequested === false ) {

            session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {

                session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {

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