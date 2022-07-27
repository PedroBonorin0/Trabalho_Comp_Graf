import * as THREE from  'three';
import { degreesToRadians} from '../libs/util/util.js';
import { animateDeadEnemies, animateDeadPlayer, colisions} from './colision.js';
import {inicializeKeyboard, keyboardUpdate} from './playerLogic.js'
import { enemiesOnScreen, moveEnemies, setEnemiesCounter } from './enemiesLogic.js';
import { generateLife, movelife } from './lifeCSG.js';
import {createGroundPlaneWired } from '../libs/util/util.js';
import { buildShot, moveShots } from './shots.js';
import {initRenderer,
       initCamera,
       onWindowResize} from "../libs/util/util.js";
import { jogo, reiniciaJogo, reiniciaJogo2 } from './ondas.js';
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';
import { createLight } from './ilumination.js';
import {criaWorld, rotateWorld} from './world.js'
import { animateExplosoes } from './colision.js';
import { Water } from '../build/jsm/objects/Water.js';  // Water shader in here

// Inicialização de elelmentos -------------------------------------------------------------------------------------------------- 
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 100, 140)); // Init camera in this position
// initDefaultBasicLight(scene);
//createLight(scene);
createLight(scene);

var scene2 = new THREE.Scene();    // Create second
scene2.background = new THREE.Color(0xa3a3a3);

// Variáveis Gerais
//let posicaoSomePlano = -8E-14;
//let posicaoCriaPlano = 2E-14;
//let velocidadePlano = -0.5;

let posicaoSomePlano = 400;
let posicaoCriaPlano = -100;
let velocidadePlano = -0.5;

var loader = new GLTFLoader();

//-- SET WATER SHADER -----------------------------------------------------------------------------
const waterGeometry = new THREE.PlaneGeometry( 150, 500 );

// Water shader parameters
let water;
  water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load( './assets/textures/waternormals.jpg', function ( texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      } ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x836FFF,
      distortionScale: 0.7,
      //reflectivity: 0.35,
      flowDirection: new THREE.Vector2( -1, 0 ),
    }
  );
  water.translateY(1);
  water.position.set(0,2,-100);
  water.transparent = true;
  water.opacity = 0.5;
  //water.translateZ(500);
  water.rotateX (degreesToRadians(-90));
  water.rotateZ (degreesToRadians(180));
  scene.add(water);
// create the ground plane ------------------------------------------------------------------------------------------------------
let plane = generatePlano();
//plane.translateZ(100);
scene.add(plane);

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

//criaWorld();
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

  water.material.uniforms[ 'time' ].value = water.material.uniforms[ 'time' ].value - 0.05;
  
  keyboardUpdate(keyboard, boxPlane, airPlane);
  worldMovement();
  //moveCenario();
  //rotateWorld();
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
  
  animateExplosoes();
  animateDeadEnemies();
  animateDeadPlayer(scene);
}

// plane functions ----------------------------------------------------------------------------------------------------------------
var criaPlano = false;
var criaPlanoAux = true;
var planoAux = null;

function worldMovement() {
    if(plane)
      plane.translateZ(-velocidadePlano);
    if(planoAux)
      planoAux.translateZ(-velocidadePlano);

    if(plane && plane.position.z > posicaoSomePlano) {
      plane.removeFromParent();
      plane = null;
      criaPlano = true;
    }

    if(planoAux && planoAux.position.z  > posicaoSomePlano) {
      planoAux.removeFromParent();
      planoAux = null;
      criaPlanoAux = true;
    }
      
    if(criaPlanoAux && plane && plane.position.z > posicaoCriaPlano) {
    criaPlanoAux = false;
    planoAux = generatePlano();
    planoAux.translateZ(-499);
    scene.add(planoAux);
    }
    
    if(criaPlano && planoAux && planoAux.position.z > posicaoCriaPlano) {
      criaPlano = false;
      plane = generatePlano();
      plane.translateZ(-499);
      scene.add(plane);
    }
}

//var vPlane = true;
//var vAux = false;

function moveCenario(){
  //var plano2;
  if(plane !== undefined && outro !== undefined){
    if(plane.position.z < 930){
      plane.translateY(velocidadePlano);
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
  var textureLoader = new THREE.TextureLoader();
  var grass = textureLoader.load('./assets/textures/grama.jpg');
  var rock = textureLoader.load('./assets/textures/terra.jpg');
  var areia = textureLoader.load('./assets/textures/areia.jpg');
  
  var geometry1 = new THREE.BoxGeometry(120,0.2,500);
  var geometry2 = new THREE.BoxGeometry(40,0.2,500);
  var geometry3 = new THREE.BoxGeometry(240,0.2,500);
  var geometry4 = new THREE.BoxGeometry(15,0.2,500);
  
  var material1 = new THREE.MeshLambertMaterial();
  var material2 = new THREE.MeshLambertMaterial();
  var material3 = new THREE.MeshLambertMaterial();

  material1.map = areia;
  material1.map.wrapS = THREE.RepeatWrapping;
  material1.map.wrapT = THREE.RepeatWrapping;
  material1.map.minFilter = THREE.LinearFilter;
  material1.map.magFilter = THREE.NearestFilter;

  material2.map = rock;
  material2.map.wrapS = THREE.RepeatWrapping;
  material2.map.wrapT = THREE.RepeatWrapping;
  material2.map.minFilter = THREE.LinearFilter;
  material2.map.magFilter = THREE.NearestFilter;

  material3.map = grass;
  material3.map.wrapS = THREE.RepeatWrapping;
  material3.map.wrapT = THREE.RepeatWrapping;
  material3.map.minFilter = THREE.LinearFilter;
  material3.map.magFilter = THREE.NearestFilter;
  
  var cube1 = new THREE.Mesh(geometry1, material1);
  var cube2 = new THREE.Mesh(geometry2, material2);
  var cube3 = new THREE.Mesh(geometry2, material2);
  var cube4 = new THREE.Mesh(geometry3, material3);
  var cube5 = new THREE.Mesh(geometry3, material3);
  var cube6 = new THREE.Mesh(geometry4, material2);
  var cube7 = new THREE.Mesh(geometry4, material2);

  cube1.add(cube2, cube3, cube4, cube5);

  cube1.translateY(-10);

  cube6.translateX(-85);
  cube6.translateY(5);
  cube6.rotateZ(degreesToRadians(-10));

  cube7.translateX(85);
  cube7.translateY(5);
  cube7.rotateZ(degreesToRadians(10));

  cube2.translateX(-70);
  cube2.translateY(2);
  cube2.rotateZ(degreesToRadians(-25));

  cube3.translateX(70);
  cube3.translateY(2);
  cube3.rotateZ(degreesToRadians(25));

  cube4.translateY(7);
  cube4.translateX(207);

  cube5.translateY(7);
  cube5.translateX(-207);

  cube1.position.set(0,0,-100);

  return cube1;
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
