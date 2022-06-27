import * as THREE from  'three';
import Stats from       '../build/jsm/libs/stats.module.js';
import { detectCollisionCubes, animateDeadEnemies, animateDeadPlayer, deadPlayer, colisions} from './colision.js';
import {inicializeKeyboard, keyboardUpdate} from './playerLogic.js'
import { createEnemy, enemiesOnScreen, moveEnemies, aplyTextures} from './enemiesLogic.js';
import {createGroundPlaneWired, degreesToRadians} from '../libs/util/util.js';
import { buildShot, moveShots } from './shots.js';
import {initRenderer,
       initCamera,
       initDefaultBasicLight,
       InfoBox,
       onWindowResize} from "../libs/util/util.js";
import { NumberKeyframeTrack } from '../build/three.module.js';
import { game } from './ondas.js';
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';
import { createLight } from './ilumination.js';
import { CSG } from "../libs/other/CSGMesh.js";

// Inicialização de elelmentos -------------------------------------------------------------------------------------------------- 
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 100, 140)); // Init camera in this position
//initDefaultBasicLight(scene);
createLight(scene);

var scene2 = new THREE.Scene();    // Create second
scene2.background = new THREE.Color(0xa3a3a3);

// Variáveis Gerais
let posicaoSomePlano = -8E-14;
let posicaoCriaPlano = 2E-14;
let velocidadePlano = -0.5;

// create the ground plane ------------------------------------------------------------------------------------------------------
let plane = generatePlano();
plane.receiveShadow = true;
plane.translateY(100);
scene.add(plane);

//Create a CSG--------------------------------------------------------------------------------------------------------------------

function vidacsg(scene,posX,posY,posZ){

  //----------------------Create a corte 1 -----------------------------
 var geometrycube = new THREE.Mesh(new THREE.BoxGeometry( 1.1, 4, 10 ));
 geometrycube.position.set(0,8,0);
 
 ////----------------------create a corte 2 -----------------------------
 var geometrycube2 = new THREE.Mesh(new THREE.BoxGeometry( 1.1, 4, 10 ));
 geometrycube2.position.set(0,8,0);
 geometrycube2.rotateZ(80.11);
 
 //----------------------Create a cylinder 1 -----------------------------
 var cylinderCSG = new THREE.Mesh(new THREE.CylinderGeometry( 1, 4, 0.1, 18 ));
 cylinderCSG.position.set(0,8,0);
 cylinderCSG.rotateX(degreesToRadians(-90));
 
 // CSG
 cylinderCSG.matrixAutoUpdate = false;
 cylinderCSG.updateMatrix();
 geometrycube.matrixAutoUpdate = false;
 geometrycube.updateMatrix();
 geometrycube2.matrixAutoUpdate = false;
 geometrycube2.updateMatrix();
 var vida = CSG.fromMesh(cylinderCSG);
 var corte1 = CSG.fromMesh(geometrycube);
 var corte2 = CSG.fromMesh(geometrycube2);
 var corteCSG = vida.subtract(corte1);
 var corteCSG2 = corteCSG.subtract(corte2);
 var life = CSG.toMesh(corteCSG2, new THREE.Matrix4());
 life.material = new THREE.MeshPhongMaterial ({color : "rgb(200,0,0)"});
 life.scale.set(1.5,1.5,1.5);
 
 life.position.set(posX,posY,posZ);
 return life;
}
//vidacsg(scene,0,15,0);

// variaveis para a geração e movimentação das vidas
var lifeOnScreen = [];
var lifeBoxOnScreen = [];
var lifeAir = new THREE.MeshLambertMaterial({color: "rgb(50, 0, 100)"});
var lifeAirgeo = new THREE.BoxGeometry(12, 12, 12);

var geometry = new THREE.BoxGeometry( 1.25, 1.25, 1.25 );
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

var airPlaneGeometry = new THREE.ConeGeometry(4, 8, 20);
var airPlaneMaterial = new THREE.MeshLambertMaterial({color: "rgb(0, 250, 100)"});

//função de geração das vidas
export function generateLife(type, x, z) {
  var lifeAux;
  var lifeBox
  if(type === 'lifeV') {
    lifeAux = vidacsg(scene, x, 25, z);
    lifeAux.speedX = 0;
    lifeAux.speedZ = 1;
    lifeAux.type = 'lifeV';

    lifeBox = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);
    lifeBox.position.set(x, 25, z);
    lifeBoxOnScreen.push(lifeBox);
  }
  lifeAux.canShot = true;
  
  lifeOnScreen.push(lifeAux);
  
  lifeAux.isArch = false;
  scene.add(lifeAux, lifeBox);
}

// função de movimentação da vidaCSG
export function movelife() {
  for(const life of lifeOnScreen) {
    const index = lifeOnScreen.indexOf(life);

    lifeBoxOnScreen[index].translateX(life.speedX);
    lifeBoxOnScreen[index].translateZ(life.speedZ);

    life.translateX(life.speedX);
    life.translateZ(life.speedZ);

    if(life.isArch)
      life.rotateY(life.spin);
      lifeBoxOnScreen[index].rotateY(life.spin);
  
    if(life.position.z > 100 || life.position.x < -100 || life.position.x > 100) {
      life.removeFromParent();
      const indexToRemove = lifeOnScreen.indexOf(life);
      lifeOnScreen.splice(indexToRemove, 1);

      lifeBoxOnScreen.splice(indexToRemove, 1);

    }
  }
}

// create a airPlane ------------------------------------------------------------------------------------------------------------
var loader = new GLTFLoader();
var airPlane;
loader.load('./assets/F-16D.gltf', function ( glft ) {
  airPlane = glft.scene;
  airPlane.name = 'F-16D';
  airPlane.scale.set(1.25,1.25,1.25);
  airPlane.rotateY(-9.45);
  airPlane.position.set(0.0, 36,80);
  airPlane.traverse(function (child) {
    if(child){
      child.castShadow = true;
    }
  });
  airPlane.castShadow = true;
  scene.add(airPlane);
});

var loader = new GLTFLoader();

var deadAirPlane;
loader.load('./assets/F-16D.gltf', function ( glft ){
  deadAirPlane = glft.scene;
  deadAirPlane.name = 'F-16D';
  deadAirPlane.scale.set(1.25,1.25,1.25);
  deadAirPlane.rotateY(-9.45);
  deadAirPlane.position.set(0.0, 36,80);
  deadAirPlane.traverse(function (child) {
    if(child){
      child.castShadow = true;
    }
  });
});

var loader = new GLTFLoader();
var textureEnemy;

loader.load('./assets/F-16D.gltf', ( glft ) =>{
  textureEnemy = glft.scene;
  textureEnemy.name = 'F-16D';
  textureEnemy.scale.set(1.25,1.25,1.25);
  textureEnemy.rotateY(-9.45);
  //textureEnemy.position.set(0.0, 36, 40);
  textureEnemy.traverse(function (child) {
    if(child){
      child.castShadow = true;
    }
  });
  //scene.add(textureEnemy);
});


var boxPlane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);

boxPlane.position.set(0.0, 36, 80);
boxPlane.rotateX(-3.14/2);

boxPlane.canShot = true;
boxPlane.canMissel = true;

var deadBoxPlane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);
 
deadBoxPlane.position.set(0.0, 36, 80);
deadBoxPlane.rotateX(-3.14/2);

//scene.add(boxPlane);

// create a cylinder 1 -----------------------------------------------------------------------------------------------------------
var cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry( 1, 8, 0.1, 20 ));

// create a corte 1 -----------------------------------------------------------------------------------------------------------
var plane1 = new THREE.Mesh(new THREE.PlaneGeometry( 7,7 ));

// create a corte 2 -----------------------------------------------------------------------------------------------------------
var plane2 = new THREE.Mesh(new THREE.PlaneGeometry( 7,7 ));

 
// create a keyboard -------------------------------------------------------------------------------------------------------------
var keyboard = inicializeKeyboard();
 
// Listen window size changes ----------------------------------------------------------------------------------------------------
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var airplaneHp = 5;
var playerHpOnScreen = [];

var canGame = true;
var colisaoAtivada = true;
var canSwitchGodMode = true;

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
  game();
  if(canGame) {
    canGame = false;
  } else {
    if(keyboard.pressed('enter'))
      restartGame();
  }

  movelife();
    
    //aplyTextures();
  moveEnemies();
  
  keyboardUpdate(keyboard, boxPlane, airPlane);
  worldMovement();
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
   planoAux.receiveShadow = true;
   planoAux.translateY(590);
   scene.add(planoAux);
  }
  
  if(criaPlano && planoAux && planoAux.position.y < posicaoCriaPlano) {
    criaPlano = false;
    plane = generatePlano();
   planoAux.receiveShadow = true;
    plane.translateY(590);
    scene.add(plane);
  }
}

function generatePlano() {
  return createGroundPlaneWired(500, 500);
}

function iniciaGame() {
  createEnemy(scene, boxPlane);
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
  lifeBoxOnScreen = [];

  removeAllLifes();
};

function removeAllLifes() {
  for(const life of lifeOnScreen)
    life.removeFromParent();
  
  for(const life of lifeBoxOnScreen)
    life.removeFromParent();
}

export { 
  airPlane,
  boxPlane, 
  scene,
  deadBoxPlane,
  deadAirPlane,
  textureEnemy,
  lifeOnScreen,
  lifeBoxOnScreen,
  createEsferaVida,
};
