import * as THREE from  'three';
import Stats from       '../build/jsm/libs/stats.module.js';
import { detectCollisionCubes, animateDeadEnemies, animateDeadPlayer, deadPlayer, colisions} from './colision.js';
import {inicializeKeyboard, keyboardUpdate} from './playerLogic.js'
import { createEnemy, enemiesOnScreen, moveEnemies, aplyTextures} from './enemiesLogic.js';
import {createGroundPlaneWired} from '../libs/util/util.js';
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
var dirLight = createLight(scene);

// Variáveis Gerais
let posicaoSomePlano = -8E-14;
let posicaoCriaPlano = 2E-14;
let velocidadePlano = -0.5;

// create the ground plane ------------------------------------------------------------------------------------------------------
let plane = generatePlano();
plane.translateY(100);
scene.add(plane);

//Create a CSG--------------------------------------------------------------------------------------------------------------------

function vidacsg(){

  //----------------------Create a corte 1 -----------------------------
 var geometrycube = new THREE.Mesh(new THREE.BoxGeometry( 3, 6, 10 ));
 geometrycube.position.set(0,8,0);
 
 ////----------------------create a corte 2 -----------------------------
 var geometrycube2 = new THREE.Mesh(new THREE.BoxGeometry( 3, 6, 10 ));
 geometrycube2.position.set(0,8,0);
 
 //----------------------Create a cylinder 1 -----------------------------
 var cylinderCSG = new THREE.Mesh(new THREE.CylinderGeometry( 1, 8, 0.1, 20 ));
 cylinderCSG.position.set(0,8,0);
 
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
 life.material = new THREE.MeshBasicMaterial ({color : "rgb(100,0,0)"});
 life.scale.set(1.5,1.5,1.5);
 
 return life;
 }
 scene.add(vidacsg());

 
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


var airPlaneGeometry = new THREE.ConeGeometry(4, 8, 20);
var airPlaneMaterial = new THREE.MeshLambertMaterial({color: "rgb(0, 250, 100)"});
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

// create vet of shots -----------------------------------------------------------------------------------------------------------
var shotOnScreen = [];
var misselOnScreen = [];

//var game = true; // Habilita o comeco do jogo

// render ------------------------------------------------------------------------------------------------------------------------
render();
function render()
{
  //if(game) {
    //game = false;
    //iniciaGame();
  //}

  game();

  //aplyTextures();
  moveEnemies();

  keyboardUpdate(keyboard, boxPlane, airPlane);
  worldMovement();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene

  if(keyboard.pressed("ctrl") && boxPlane.canShot){
    buildShot(scene, null, boxPlane, 3);
  }

  if(keyboard.pressed("space") && boxPlane.canMissel){
    console.log('missel');
    buildShot(scene, null, boxPlane, 4);
  }

  for(const enemy of enemiesOnScreen){
    if(enemy.type === 'air' && enemy.canShot){
      buildShot(scene, enemy, boxPlane, 1);
    }
    if(enemy.type === 'grd' && enemy.canShot){
      buildShot(scene, enemy, boxPlane, 2);
    }
  }
  colisions(1);
  colisions(2);
  colisions(3);
  colisions(4);
  colisions(5);

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
  createEnemy(scene, boxPlane);
}

export { 
  airPlane,
  boxPlane, 
  scene,
  deadBoxPlane,
  deadAirPlane,
  textureEnemy,
};