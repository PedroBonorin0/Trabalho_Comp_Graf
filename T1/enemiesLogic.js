import * as THREE from  'three';
import { Vector3 } from '../build/three.module.js';
import {airPlane, boxPlane, scene, textureEnemy} from './main.js';
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';

/**
 * CIMA -> 300
 * LADOS -> -350 e 350
 */

// inicialize elements -------------------------------------------------------------------------------------------------------------
var enemiesOnScreenCounter = 0;
var texturesCounter = 0;
var enemyMaterialAir = new THREE.MeshLambertMaterial({color: "rgb(250, 0, 100)"});
var enemyMaterialGround = new THREE.MeshLambertMaterial({color: "rgb(250, 0, 150)"});
var enemyGeometryAir = new THREE.BoxGeometry(12, 12, 12);
var enemyGeometryGround = new THREE.BoxGeometry(14, 10, 14);
var canCreate = true;

//var sceneAux;
//var airPlaneAux;

var airShotCounter = 0;
var groundShotCounter = 0;

// create gltfs --------------------------------------------------------------------------------------------------------------------
var loader = new GLTFLoader();
 
// create a airPlane ------------------------------------------------------------------------------------------------------------


// create vet of enemies -----------------------------------------------------------------------------------------------------------
var enemiesOnScreen = [];
var textureOnScreen = [];

var airEnemiesShotsOnScreen = [];
var groundEnemiesShotOnScreen = [];

var timeInicio;
var ondaAtual;

// enemies logic functions ---------------------------------------------------------------------------------------------------------
export function createEnemy(scn,plane) {
  //sceneAux = scn;
  //airPlaneAux = plane;

  timeInicio = performance.now();
  ondaAtual = 1;
}

export function moveEnemies() {
  for(const enemy of enemiesOnScreen) {
    enemy.translateX(enemy.speedX);
    enemy.translateZ(enemy.speedZ);

    if(enemy.isArch)
      enemy.rotateY(enemy.spin);
  
    if(enemy.position.z > 100 || enemy.position.x < -100 || enemy.position.x > 100) {
      enemy.removeFromParent();
      const indexToRemove = enemiesOnScreen.indexOf(enemy);
      enemiesOnScreen.splice(indexToRemove, 1);
      enemiesOnScreenCounter--;
    }
  }
}


export function setCanCreateEnemy(condition){
  canCreate = condition;
}

export function setEnemiesCounter(){  
  enemiesOnScreenCounter--;
}

export function resetEnemies () {
  enemiesOnScreen = [];
  enemiesOnScreenCounter = 0;
}

export function resetEnemiesShot(){
  airEnemiesShotsOnScreen = [];
  groundEnemiesShotOnScreen = [];
  groundShotCounter = 0;
  airShotCounter = 0;
}

function generateEnemyVertical(type, x, z) {
  var newEnemy;

  if(type === 'air') {
    newEnemy = new THREE.Mesh(enemyGeometryAir, enemyMaterialAir);
    newEnemy.speedX = 0;
    newEnemy.speedZ = 1;
    newEnemy.position.set(x, 36, z);
    newEnemy.type = 'air';
  } else {
    newEnemy = new THREE.Mesh(enemyGeometryGround, enemyMaterialGround);
    newEnemy.speedX = 0;
    newEnemy.speedZ = 0.5;
    newEnemy.position.set(x, 10, z);
    newEnemy.type = 'grd';
  }

  newEnemy.canShot = true;
  
  enemiesOnScreen.push(newEnemy);
  enemiesOnScreenCounter++;

  //textureOnScreen.push(textureEnemy);
  //texturesCounter++;
  
  newEnemy.isArch = false;
  scene.add(newEnemy);
}

function generateEnemyHorizontal(type, x, z, side) {
  var newEnemy;
  
  if(type === 'air') {
    newEnemy = new THREE.Mesh(enemyGeometryAir, enemyMaterialAir);
    newEnemy.type = 'air';
    
    if(side === 'dir')
      newEnemy.speedX = -0.8;
      else
      newEnemy.speedX = 0.8;
      
      newEnemy.speedZ = 0;
      newEnemy.position.set(x, 36, z);
    } else {
      newEnemy = new THREE.Mesh(enemyGeometryGround, enemyMaterialGround);
      newEnemy.type = 'ground';
      
      if(side === 'dir')
      newEnemy.speedX = -0.8;
      else
      newEnemy.speedX = 0.8;
      
      newEnemy.speedZ = 0;
      newEnemy.position.set(x, 10, z);
    }

    newEnemy.canShot = true;
    
    enemiesOnScreen.push(newEnemy);
    enemiesOnScreenCounter++;
    
    newEnemy.isArch = false;
    scene.add(newEnemy);
  }
  
  function generateEnemyDiagonal(type, x, z, hor, vert) {
  // MODIFICAR
  var newEnemy;
  if(type === 'air') {
    newEnemy = new THREE.Mesh(enemyGeometryAir, enemyMaterialAir);
    newEnemy.type = 'air';
    if(hor === 'dir')
    newEnemy.speedX = 0.75;
    else
    newEnemy.speedX = -0.75;
    
    if(vert === 'up')
    newEnemy.speedZ = -0.75;
    else
    newEnemy.speedZ = 0.75;
    
    newEnemy.position.set(x, 36, z);
  } else {
    newEnemy = new THREE.Mesh(enemyGeometryGround, enemyMaterialGround);
    newEnemy.type = 'ground';
    
    if(hor === 'dir')
    newEnemy.speedX = 0.25;
    else
    newEnemy.speedX = -0.25;
    
    if(vert === 'up')
    newEnemy.speedZ = -0.5;
    else
    newEnemy.speedZ = 0.5;
    
    newEnemy.position.set(x, 10, z);
  }
  
  newEnemy.canShot = true;

  enemiesOnScreen.push(newEnemy);
  enemiesOnScreenCounter++;
  
  newEnemy.isArch = false;
  scene.add(newEnemy);
}

function generateEnemyArco(type, x, z, rot) {
  var newEnemy;
  
  if(type === 'air') {
    newEnemy = new THREE.Mesh(enemyGeometryAir, enemyMaterialAir);
    newEnemy.type = 'air';
    
    newEnemy.speedX = 0;
    newEnemy.speedZ = -1;
    
    if(rot === 'dir')
      newEnemy.spin = -1 * (Math.PI/180) / 4;
    else
      newEnemy.spin = 1 * (Math.PI/180) / 4;
    
    newEnemy.position.set(x, 36, z);
  } else {
    newEnemy = new THREE.Mesh(enemyGeometryGround, enemyMaterialGround);
    newEnemy.type = 'ground';
    newEnemy.speedX = 0;
    newEnemy.speedZ = 0.5;

    newEnemy.position.set(x, 10, z);
  }

  newEnemy.canShot = true;
  
  enemiesOnScreen.push(newEnemy);
  enemiesOnScreenCounter++;
  
  newEnemy.isArch = true;
  scene.add(newEnemy);
}

export function clearEnemies(){
  for(const enemy of enemiesOnScreen){
    enemy.removeFromParent();
  }
  enemiesOnScreen = [];
  enemiesOnScreenCounter = 0;
}

export function aplyTextures(){
  var texture;
  for(const enemy of enemiesOnScreen){
    texture = loadTexture(1);
    textureOnScreen.push(texture);
    //scene.add(texture);
    texturesCounter++;
  }
}

export function loadTexture (x, y, z){
  loader.load('./assets/F-16D.gltf', function ( gltf ){
    gltf.scene.position.set(x,y,z);
    gltf.scene.scale.set(1.25,1.25,1.25);
    gltf.scene.rotateY(-9.45);

    gltf.scene.traverse(function(child){
      if(child) child.castShadow = true;
    });
    afterload(gltf);
  });
}

export {
  enemiesOnScreenCounter,
  enemiesOnScreen,
  groundEnemiesShotOnScreen,
  airEnemiesShotsOnScreen,
  generateEnemyArco,
  generateEnemyHorizontal,
  generateEnemyVertical,
  generateEnemyDiagonal,
}
