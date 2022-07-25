import * as THREE from  'three';
import { degreesToRadians} from '../libs/util/util.js';
import { animateDeadEnemies, animateDeadPlayer, colisions} from './colision.js';
import {inicializeKeyboard, keyboardUpdate} from './playerLogic.js'
import { enemiesOnScreen, moveEnemies } from './enemiesLogic.js';
import { generateLife, movelife } from './lifeCSG.js';
import {createGroundPlaneWired } from '../libs/util/util.js';
import { buildShot, moveShots } from './shots.js';
import {initRenderer,
       initCamera,
       onWindowResize} from "../libs/util/util.js";
import { game, jogo, reiniciaJogo, reiniciaJogo2 } from './ondas.js';
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';
import { createLight } from './ilumination.js';
import {criaWorld, rotateWorld} from './world.js'

// Inicialização de elelmentos -------------------------------------------------------------------------------------------------- 
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 100, 140)); // Init camera in this position
// initDefaultBasicLight(scene);
createLight(scene);

var scene2 = new THREE.Scene();    // Create second
scene2.background = new THREE.Color(0xa3a3a3);

// Variáveis Gerais
//let posicaoSomePlano = -8E-14;
let posicaoSomePlano = 1000;
//let posicaoCriaPlano = 2E-14;
let posicaoCriaPlano = 0;
let velocidadePlano = -0.5;

var loader = new GLTFLoader();

// create the ground plane ------------------------------------------------------------------------------------------------------
//let plane = generatePlano();
let plane;
loader.load('./assets/death-star.gltf', function ( glft ) {
  plane = glft.scene;
  plane.name = 'death-star';
  plane.scale.set(40,15,40);
  plane.position.set(465, -80,20);
  //plane.rotateY(-9.45);
  plane.traverse(function (child) {
    if(child){
      child.castShadow = true;
    }
  });
  plane.rotateY(degreesToRadians(90));
  //scene.add(plane);
});

var loader = new GLTFLoader();

let outro;
loader.load('./assets/death-star.gltf', function (glft) {
  let obj = glft.scene;
  obj.traverse(function (child) {
    if(child){
      child.castShadow = true;
    }
  });
  obj.scale.set(40,15,40);
  outro = glft.scene;
  outro.scale.set(40,15,40);
  outro.position.set(465, -80,20);
  obj.position.set(465, -80,20);
  outro.rotateY(degreesToRadians(90));
});

//plane.receiveShadow = true;
//plane.translateY(100);
//scene.add(plane);

// Create CSG HP ----------------------------------------------------------------------------------------------------------------
var lifeOnScreen = [];
generateLife('lifeV', -10, 150);

var airPlaneGeometry = new THREE.ConeGeometry(4, 8, 20);
var airPlaneMaterial = new THREE.MeshLambertMaterial({color: "rgb(0, 250, 100)"});

// create a airPlane ------------------------------------------------------------------------------------------------------------
var loader = new GLTFLoader();
var airPlane;
loader.load('./assets/x-wing.gltf', function ( glft ) {
  airPlane = glft.scene;
  airPlane.name = 'F-16D';
  airPlane.scale.set(1.25,1.25,1.25);
  airPlane.rotateY(degreesToRadians(180));
  airPlane.position.set(0.0, 36,80);
  airPlane.traverse(function (child) {
    if(child){
      child.castShadow = true;
    }
  });
  scene.add(airPlane);
});

var deadAirPlane;
loader.load('./assets/x-wing.gltf', function ( glft ){
  deadAirPlane = glft.scene;
  deadAirPlane.name = 'DEAD';
  deadAirPlane.scale.set(1.25,1.25,1.25);
  deadAirPlane.rotateY(-9.45);
  deadAirPlane.position.set(0.0, 36,80);
  deadAirPlane.traverse(function (child) {
    if(child){
      child.castShadow = true;
    }
  });
});

//TODO -------------------------------------------------------------------------------------------------------------------------------

var boxPlane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);

boxPlane.position.set(0.0, 36, 80);
boxPlane.rotateX(-3.14/2);

boxPlane.canShot = true;
boxPlane.canMissel = true;

var deadBoxPlane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);
 
deadBoxPlane.position.set(0.0, 36, 80);
deadBoxPlane.rotateX(-3.14/2);

// create a keyboard -------------------------------------------------------------------------------------------------------------
var keyboard = inicializeKeyboard();
 
// Listen window size changes ----------------------------------------------------------------------------------------------------
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var airplaneHp = 5;
var playerHpOnScreen = [];

var canGame = true;
var colisaoAtivada = true;
var canSwitchGodMode = true;

export function setHp(){
  airplaneHp = 5;
}

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

criaWorld();
// render ------------------------------------------------------------------------------------------------------------------------
render();
function render()
{   

  if(keyboard.pressed('enter')){
    reiniciaJogo();
  }
  else{
    if(airplaneHp <= 0){
      reiniciaJogo2();
    }
    else{
      jogo();
    }
  }
  
  movelife();
    
  moveEnemies();
  
  keyboardUpdate(keyboard, boxPlane, airPlane);
  //worldMovement();
  //moveCenario();
  rotateWorld();
  requestAnimationFrame(render);
  
  atualizaVidas(airplaneHp);
  
  controlledRender();
  
  if(keyboard.pressed("ctrl") && boxPlane.canShot){
    buildShot(scene, null, boxPlane, 3);
  }
  
  if(keyboard.pressed("space") && boxPlane.canMissel){
    console.log('missel');
    buildShot(scene, null, boxPlane, 4);
  }
  
  if(keyboard.pressed("G") && canSwitchGodMode) {
    canSwitchGodMode = false;
    colisaoAtivada = !colisaoAtivada;

    setTimeout(() => {
      canSwitchGodMode = true;
    }, 100);
  }
  
  for(const enemy of enemiesOnScreen){
    if(enemy.type === 'air' && enemy.canShot){
      buildShot(scene, enemy, boxPlane, 1);
    }
    if(enemy.type === 'grd' && enemy.canShot){
      buildShot(scene, enemy, boxPlane, 2);
    }
  }
  airplaneHp -= colisions(1, airplaneHp, colisaoAtivada);
  airplaneHp -= colisions(2, airplaneHp, colisaoAtivada);
  airplaneHp -= colisions(3, airplaneHp, colisaoAtivada);
  colisions(4, airplaneHp, colisaoAtivada);
  colisions(5, airplaneHp, colisaoAtivada);
  airplaneHp -= colisions(6, airplaneHp, colisaoAtivada);

  moveShots();
 
  animateDeadEnemies();
  animateDeadPlayer(scene);
}

// plane functions ----------------------------------------------------------------------------------------------------------------
var criaPlano = false;
var criaPlanoAux = true;
//var planoAux = null;

function worldMovement() {
  if(plane !== undefined && planeAux !==undefined){
    //console.log(plane.position);
    if(plane)
      plane.translateX(velocidadePlano);
    if(planeAux)
      planeAux.translateX(velocidadePlano);

    if(plane && plane.position.z > posicaoSomePlano) {
      plane.removeFromParent();
      //plane = null;
      criaPlano = true;
    }

    if(planeAux && planeAux.position.z  > posicaoSomePlano) {
      planeAux.removeFromParent();
      planeAux = null;
      criaPlanoAux = true;
    }
      
    if(criaPlanoAux && plane && plane.position.z > posicaoCriaPlano) {
    criaPlanoAux = false;
    //planoAux = generatePlano();
    planeAux = plane;
    planeAux.receiveShadow = true;
    //planoAux.translateY(590);
    scene.add(planeAux);
    }
    
    if(criaPlano && planeAux && planeAux.position.z > posicaoCriaPlano) {
      criaPlano = false;
      //plane = generatePlano();
      planeAux.receiveShadow = true;
      //plane.translateY(590);
      scene.add(plane);
    }
  }
}

//var vPlane = true;
//var vAux = false;

function moveCenario(){
  //var plano2;
  if(plane !== undefined && outro !== undefined){
    if(plane.position.z < 930){
      plane.translateX(velocidadePlano);
    }
    else{
      plane.removeFromParent();
    }

    if(outro.position.z < 930){
      outro.translateX(velocidadePlano);
    }
    else{
      outro.removeFromParent();
    }

    if(plane.position.z > 180){
      //outro = outro;
      outro.position.set(465, -80,-800);
      scene.add(outro);
    }

    if(outro.position.z > 180){
      plane.position.set(465, -80,-800);
      scene.add(plane);
    }
  }
}

function generatePlano() {
  return createGroundPlaneWired(500, 500);
}

function generateCube(x, y, z){
  var geometry = new THREE.BoxGeometry(80,30,500);
  var material = new THREE.MeshLambertMaterial();
  
  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(x,y,z);
  scene.add(cube);
}

function atualizaVidas(vidas) {
  removeVidas();
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
  playerHpOnScreen.push(sphere);
  scene2.add(sphere);
}

function removeVidas() {
  for(const vida of playerHpOnScreen)
    vida.removeFromParent();
}

function restartGame() {
  airplaneHp = 5;

  airPlane.position.set(0.0, 36, 80);
  boxPlane.position.set(0.0, 36, 80);
  scene.add(airPlane);

  canGame = true;
}

export function finalizaGame() {
  canGame = false;
  lifeOnScreen = [];
  removeAllLifes();
};

function removeAllLifes() {
  for(const life of lifeOnScreen)
    life.removeFromParent();
}

export { 
  airPlane,
  boxPlane, 
  scene,
  deadBoxPlane,
  deadAirPlane,
  lifeOnScreen,
  createEsferaVida,
  airplaneHp,
};
