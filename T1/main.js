import * as THREE from  'three';
import Stats from       '../build/jsm/libs/stats.module.js';
import { detectCollisionCubes, airPlaneColisions, shotColisions, animateDeadEnemies, animateDeadPlayer } from './colision.js';
import {buildShot, inicializeKeyboard, keyboardUpdate, moveShot} from './playerLogic.js'
import { createEnemy, enemiesOnScreen } from './enemiesLogic.js';
import {createGroundPlaneWired} from '../libs/util/util.js';
import {initRenderer,
       initCamera,
       initDefaultBasicLight,
       InfoBox,
       onWindowResize} from "../libs/util/util.js";

// Inicialização de elelmentos -------------------------------------------------------------------------------------------------- 
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 100, 140)); // Init camera in this position
initDefaultBasicLight(scene);

// Variáveis Gerais
let posicaoSomePlano = -8E-14;
let posicaoCriaPlano = 2E-14;
let velocidadePlano = -0.5;

// create the ground plane ------------------------------------------------------------------------------------------------------
let plane = generatePlano();
plane.translateY(100);
scene.add(plane);
 
// create a airPlane ------------------------------------------------------------------------------------------------------------
var airPlaneGeometry = new THREE.ConeGeometry(4, 8, 20);
var airPlaneMaterial = new THREE.MeshLambertMaterial({color: "rgb(0, 250, 100)"});
var airPlane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);

airPlane.position.set(0.0, 36, 80);
airPlane.rotateX(-3.14/2);

scene.add(airPlane);
 
// create a keyboard -------------------------------------------------------------------------------------------------------------
var keyboard = inicializeKeyboard();
 
// Listen window size changes ----------------------------------------------------------------------------------------------------
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// create vet of shots -----------------------------------------------------------------------------------------------------------
var shotOnScreen = [];


var game = true; // Habilita o comeco do jogo 

// render ------------------------------------------------------------------------------------------------------------------------
render();
function render()
{
  if(game) {
    game = false;
    iniciaGame();
  }

 keyboardUpdate(keyboard, airPlane);
 worldMovement();
 requestAnimationFrame(render);
 renderer.render(scene, camera) // Render scene
 
 if(keyboard.pressed("space") || keyboard.pressed("ctrl")){
   var shot = buildShot(scene, airPlane);
   if(shot) shotOnScreen.push(shot);
 }

 airPlaneColisions(airPlane, enemiesOnScreen, shotOnScreen);
 shotColisions(shotOnScreen, enemiesOnScreen);
 
 moveShot(shotOnScreen);
 
 animateDeadEnemies();
 animateDeadPlayer(airPlane);
}

// plane functions ----------------------------------------------------------------------------------------------------------------
var criaPlano = false;
var criaPlanoAux = true;
var planoAux = null;

function worldMovement() {
  if(plane)
    plane.translateY(velocidadePlano);
  if(planoAux)
    planoAux.translateY(velocidadePlano);

  if(plane && plane.position.y < posicaoSomePlano) {
    plane.removeFromParent();
    plane = null;
    criaPlano = true;
  }

  if(planoAux && planoAux.position.y < posicaoSomePlano) {
    planoAux.removeFromParent();
    planoAux = null;
    criaPlanoAux = true;
  }
    
  if(criaPlanoAux && plane && plane.position.y < posicaoCriaPlano) {
   criaPlanoAux = false;
   planoAux = generatePlano();
   planoAux.translateY(590);
   scene.add(planoAux);
  }
  
  if(criaPlano && planoAux && planoAux.position.y < posicaoCriaPlano) {
    criaPlano = false;
    plane = generatePlano();
    plane.translateY(590);
    scene.add(plane);
  }
}

function generatePlano() {
  return createGroundPlaneWired(500, 500);
}

function iniciaGame() {
  createEnemy(scene, airPlane);
}

export default { airPlane };