import * as THREE from  'three';
import Stats from       '../build/jsm/libs/stats.module.js';
import { buildBoundingBox } from './colision.js';
import {buildShot, inicializeKeyboard, keyboardUpdate, moveShot} from './playerLogic.js'
import { createEnemy } from './enemiesLogic.js';
import {createGroundPlaneWired} from '../libs/util/util.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer,
       initCamera,
       initDefaultBasicLight,
       InfoBox,
       onWindowResize} from "../libs/util/util.js";
 
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 40, 25)); // Init camera in this position
initDefaultBasicLight(scene);
 
var trackballControls = new TrackballControls( camera, renderer.domElement );
 
 
// create the ground plane
let plane = createGroundPlaneWired(200, 300);
plane.translateY(100);
scene.add(plane);
 
// create a airPlane
var airPlaneGeometry = new THREE.ConeGeometry(2, 5, 20);
var airPlaneMaterial = new THREE.MeshLambertMaterial({color: "rgb(0, 250, 100)"});
var airPlane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);
 
airPlane.position.set(0.0, 3.0, 12);
airPlane.rotateX(-3.14/2);
 
// create a keyboard
var keyboard = inicializeKeyboard();
 
// add the airPlane to the scene
scene.add(airPlane);

//================= APAGAR ESSA PARTE NO FINAL DE TUDO=================
var controls = new InfoBox();
 controls.add("Basic Scene");
 controls.addParagraph();
 controls.add("Use mouse to interact:");
 controls.add("* Left button to rotate");
 controls.add("* Right button to translate (pan)");
 controls.add("* Scroll to zoom in/out.");
 controls.show();
 
// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
 
var enemiesOnScreen = [];
var shotOnScreen = [];
 
render();
function render()
{
 keyboardUpdate(keyboard, airPlane);
 trackballControls.update(); // Enable mouse movements
 worldMovement();
 requestAnimationFrame(render);
 renderer.render(scene, camera) // Render scene
 
 createEnemy(scene);
 
 if(keyboard.pressed("space")){
   var shot = buildShot(scene, airPlane);
   if(shot){
     shotOnScreen.push(shot);
   }
 }
 moveShot(shotOnScreen);
}
 
function worldMovement() {
 plane.translateY(-0.1);
 if(plane.position.y < -25E-15) {
   var planoAux = createGroundPlaneWired(200, 300);
   planoAux.translateY(120);
   scene.add(planoAux);
   plane.removeFromParent();
   planoAux.translateY(-0.1);
   plane.copy(planoAux);
   scene.add(plane);
   planoAux.removeFromParent();
 }
}



