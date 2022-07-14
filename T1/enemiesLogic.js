import * as THREE from  'three';
import { Vector3 } from '../build/three.module.js';
import {airPlane, boxPlane, scene} from './main.js';
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

var airShotCounter = 0;
var groundShotCounter = 0;

var timeInicio;
var ondaAtual;


// create vet of enemies -----------------------------------------------------------------------------------------------------------
var enemiesOnScreen = [];
let textureOnScreen = [];

var airEnemiesShotsOnScreen = [];
var groundEnemiesShotOnScreen = [];

// create enemies functions ---------------------------------------------------------------------------------------------------------
export function createEnemy(scn,plane) {

  timeInicio = performance.now();
  ondaAtual = 1;
}

export function updateAsset(){
  for(const enemy of enemiesOnScreen){
    const aux = textureOnScreen[enemiesOnScreen.indexOf(enemy)];
    if(aux !== undefined && aux.object){
      moveEnemies(aux, enemy);
    }
  }
}

export function moveEnemies() {
  for(const enemy of enemiesOnScreen) {
    const aux = textureOnScreen[enemiesOnScreen.indexOf(enemy)];
    if(aux !== undefined && aux.object){
      enemy.translateX(enemy.speedX);
      enemy.translateZ(enemy.speedZ);
    
      aux.object.translateX(enemy.speedX);
      aux.object.translateZ(enemy.speedZ);

      if(enemy.isArch)
        enemy.rotateY(enemy.spin);
        aux.object.rotateY(enemy.spin);
  
      if(enemy.position.z > 100 || enemy.position.x < -100 || enemy.position.x > 100) {
        enemy.removeFromParent();
        //aux.removeFromParent();
        const indexToRemove = enemiesOnScreen.indexOf(enemy);
        enemiesOnScreen.splice(indexToRemove, 1);
        enemiesOnScreenCounter--;
        //textureOnScreen.splice(indexToRemove, 1);
      }
    }
  }
}

function generateEnemyVertical(type, x, z) {
  var newEnemy;
  let asset = {
    object: null,
    loaded: false,
    bb: new THREE.Box3()
  }

  let loader = new GLTFLoader();

  loader.load( './assets/F-16D.gltf', function ( gltf ) {
    let obj = gltf.scene;
    obj.traverse( function ( child ) {
      if ( child.isMesh ) {
          child.castShadow = true;
      }
    });
    if(type === 'air') {
      newEnemy = new THREE.Mesh(enemyGeometryAir, enemyMaterialAir);
      newEnemy.speedX = 0;
      newEnemy.speedZ = 1;
      newEnemy.position.set(x, 36, z);
      newEnemy.type = 'air';

      //obj.rotateY(3.14);
      asset.object = gltf.scene;
      asset.object.position.set(x, 36, z);
    } else {
      newEnemy = new THREE.Mesh(enemyGeometryGround, enemyMaterialGround);
      newEnemy.speedX = 0;
      newEnemy.speedZ = 0.5;
      newEnemy.position.set(x, 10, z);
      newEnemy.type = 'grd';

      //obj.rotateY(3.14);
      asset.object = gltf.scene;
      asset.object.position.set(x, 36, z);
    }
    newEnemy.canShot = true;
    
    enemiesOnScreen.push(newEnemy);
    enemiesOnScreenCounter++;

    textureOnScreen.push(asset);
    texturesCounter++;
    
    newEnemy.isArch = false;
    scene.add(asset.object);
  }, null, null);
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

// textures -------------------------------------------------------------------------------------------------------------------------

function loadGLBFile(asset, file, desiredScale)
{
  let loader = new GLTFLoader( );
  loader.load( file, function ( gltf ) {
    let obj = gltf.scene;
    obj.traverse( function ( child ) {
      if ( child.isMesh ) {
          child.castShadow = true;
      }
    });
    obj = normalizeAndRescale(obj, desiredScale);
    obj = fixPosition(obj);
    obj.updateMatrixWorld( true )
    scene.add ( obj );

    // Store loaded gltf in our js object
    asset.object = gltf.scene;
  }, null, null);
}
// GLTFs ----------------------------------------------------------------------------------------------------------------------------

function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}


// auxiliar functions ---------------------------------------------------------------------------------------------------------------
export function clearEnemies(){
  for(const enemy of enemiesOnScreen){
    enemy.removeFromParent();
  }
  enemiesOnScreen = [];
  enemiesOnScreenCounter = 0;
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

// exports --------------------------------------------------------------------------------------------------------------------------
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
