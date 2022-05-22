import * as THREE from  'three';
import Stats from       '../build/jsm/libs/stats.module.js';
import { detectCollisionCubes, airPlaneColisions, shotColisions, animateDeadEnemies } from './colision.js';
import {buildShot, inicializeKeyboard, keyboardUpdate, moveShot} from './playerLogic.js'
import { createEnemy, enemiesOnScreen, enemiesOnScreenCounter } from './enemiesLogic.js';
import {createGroundPlaneWired} from '../libs/util/util.js';
import {initRenderer,
       initCamera,
       initDefaultBasicLight,
       InfoBox,
       onWindowResize} from "../libs/util/util.js";

// Inicialização de elelmentos -------------------------------------------------------------------------------------------------- 
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 60, 100)); // Init camera in this position
initDefaultBasicLight(scene);
 
// create the ground plane ------------------------------------------------------------------------------------------------------
let plane = createGroundPlaneWired(500, 500);
plane.translateY(100);
scene.add(plane);
 
// create a airPlane ------------------------------------------------------------------------------------------------------------
var airPlaneGeometry = new THREE.ConeGeometry(4, 8, 20);
var airPlaneMaterial = new THREE.MeshLambertMaterial({color: "rgb(0, 250, 100)"});
var airPlane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);
 
airPlane.position.set(0.0, 4, 45);
airPlane.rotateX(-3.14/2);

scene.add(airPlane);
 
// create a keyboard -------------------------------------------------------------------------------------------------------------
var keyboard = inicializeKeyboard();
 
// Listen window size changes ----------------------------------------------------------------------------------------------------
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// create vet of shots -----------------------------------------------------------------------------------------------------------
var shotOnScreen = [];

// render ------------------------------------------------------------------------------------------------------------------------
render();
function render()
{
 keyboardUpdate(keyboard, airPlane);
 worldMovement();
 requestAnimationFrame(render);
 renderer.render(scene, camera) // Render scene
 
 createEnemy(scene);
 
 if(keyboard.pressed("space") || keyboard.pressed("ctrl")){
   var shot = buildShot(scene, airPlane);
   if(shot){
     shotOnScreen.push(shot);
   }
 }

 airPlaneColisions(airPlane, enemiesOnScreen);
 shotColisions(shotOnScreen, enemiesOnScreen);
 
 moveShot(shotOnScreen);
 
 animateDeadEnemies();
}

// plane functions ----------------------------------------------------------------------------------------------------------------
var criaPlano = false;
var criaPlanoAux = true;
var planoAux = null;

function worldMovement() {
  if(plane)
    plane.translateY(-0.5);
  if(planoAux)
    planoAux.translateY(-0.5);

  if(plane && plane.position.y < -7E-14) {
    plane.removeFromParent();
    plane = null;
    criaPlano = true;
  }

  if(planoAux && planoAux.position.y < -7E-14) {
    planoAux.removeFromParent();
    planoAux = null;
    criaPlanoAux = true;
  }
    
  if(criaPlanoAux && plane && plane.position.y < 2E-14) {
   criaPlanoAux = false;
   planoAux = createGroundPlaneWired(500, 500);
   planoAux.translateY(590);
   scene.add(planoAux);
  }
  
  if(criaPlano && planoAux && planoAux.position.y < 2E-14) {
    criaPlano = false;
    plane = createGroundPlaneWired(500, 500);
    plane.translateY(590);
    scene.add(plane);
  }
}