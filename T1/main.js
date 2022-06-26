import * as THREE from  'three';
import Stats from       '../build/jsm/libs/stats.module.js';
import { detectCollisionCubes, airPlaneColisions, shotColisions, animateDeadEnemies, animateDeadPlayer, deadPlayer} from './colision.js';
import {buildShot, inicializeKeyboard, keyboardUpdate, moveShot} from './playerLogic.js'
import { createEnemy, enemiesOnScreen, moveEnemies } from './enemiesLogic.js';
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

var scene2 = new THREE.Scene();    // Create second
scene2.background = new THREE.Color(0xa3a3a3);

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

var deadAirPlane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);
 
deadAirPlane.position.set(0.0, 36, 80);
deadAirPlane.rotateX(-3.14/2);

scene.add(airPlane);
 
// create a keyboard -------------------------------------------------------------------------------------------------------------
var keyboard = inicializeKeyboard();
 
// Listen window size changes ----------------------------------------------------------------------------------------------------
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// create vet of shots -----------------------------------------------------------------------------------------------------------
var shotOnScreen = [];

var game = true; // Habilita o comeco do jogo
var vidaMudou = true;

//-------------------------------------------------------------------------------
// Setting virtual camera
//-------------------------------------------------------------------------------
var lookAtVec   = new THREE.Vector3( 0, 0, 0);
var camPosition = new THREE.Vector3( 0, 0, 20 );
var upVec       = new THREE.Vector3( 0, 1, 0 );
var vcWidth = 200;
var vcHeidth = 50; 
var virtualCamera = new THREE.PerspectiveCamera(45, vcWidth/vcHeidth, 1.0, 25.0);
  virtualCamera.position.copy(camPosition);
  virtualCamera.up.copy(upVec);
  virtualCamera.lookAt(lookAtVec);

// Create helper for the virtual camera
const cameraHelper = new THREE.CameraHelper(virtualCamera);
scene2.add(cameraHelper);

function controlledRender()
{
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.clear();   // Clean the window
  renderer.render(scene, camera);   

  // Set virtual camera viewport 
  var offset = 10;
  renderer.setViewport(offset, height-vcHeidth-offset, vcWidth, vcHeidth);  // Set virtual camera viewport  
  renderer.setScissor(offset, height-vcHeidth-offset, vcWidth, vcHeidth); // Set scissor with the same size as the viewport
  renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
  renderer.clear(); // Clean the small viewport
  renderer.render(scene2, virtualCamera);  // Render scene of the virtual camera
}

// render ------------------------------------------------------------------------------------------------------------------------
render();
function render()
{
  keyboardUpdate(keyboard, airPlane);
  worldMovement();
  requestAnimationFrame(render);
  // renderer.render(scene, camera) // Render scene
  controlledRender();
  
  if(game) {
    game = false;
    iniciaGame();
  }
  moveEnemies();
  if(vidaMudou) {
    vidaMudou = false
    atualizaVidas(5);
  }
  
  if(keyboard.pressed("space") || keyboard.pressed("ctrl")){
    var shot = buildShot(scene, airPlane);
    if(shot) shotOnScreen.push(shot);
  }

 game = airPlaneColisions(scene, airPlane, deadAirPlane, enemiesOnScreen, shotOnScreen);
 shotColisions(shotOnScreen, enemiesOnScreen);
 
 moveShot(shotOnScreen);
 
 animateDeadEnemies();
 animateDeadPlayer(scene, airPlane);
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

function atualizaVidas(vidas) {
  let posicaoVida = {x: -20, y: 0, z: 0};
  for(let i = 0; i < vidas; i++) {
    createEsferaVida(posicaoVida);
    posicaoVida.x += 10;
  }
}

function createEsferaVida(pos) {
  let material = new THREE.MeshBasicMaterial({color: "rgb(150, 250, 0)"});
  let geometry = new THREE.SphereGeometry(3, 20, 20);
  let sphere = new THREE.Mesh(geometry, material);

  sphere.position.set(pos.x, pos.y, pos.z);
  scene2.add(sphere);
}

export default { airPlane };