import * as THREE from  'three';
import { setCanCreateEnemy, setEnemiesCounter, resetEnemies } from './enemiesLogic.js';
import { setCanCreateShot, setShotCounter, resetShots } from './playerLogic.js';

var deadEnemies = [];
var deadPlayer = [];

// auxiliar functions -----------------------------------------------------------------------------------------------------
export function buildBoundingBox(obj){
    return new THREE.BoxHelper(obj, 0x00ff00);
}

export function detectCollisionCubes(object1, object2){
    object1.geometry.computeBoundingBox();
    object2.geometry.computeBoundingBox();
    object1.updateMatrixWorld();
    object2.updateMatrixWorld();
    
    var box1 = object1.geometry.boundingBox.clone();
    box1.applyMatrix4(object1.matrixWorld);
  
    var box2 = object2.geometry.boundingBox.clone();
    box2.applyMatrix4(object2.matrixWorld);
  
    return box1.intersectsBox(box2);
  }

// detect colisions functions -------------------------------------------------------------------------------------------
export function airPlaneColisions(airPlane, enemiesVet, vetShot){
  for (const enemy of enemiesVet){
    if(detectCollisionCubes(airPlane, enemy)){
      removeAllEnemies(enemiesVet);
      removeAllShots(vetShot);

      deadPlayer.push(airPlane);
      //airPlane.position.set(0.0, 4.0, 45);
      return;
    }
  }
}

function removeAllEnemies(enemiesVet) {
  for(const enemy of enemiesVet) {
    enemy.removeFromParent();
  }
  resetEnemies();
}

function removeAllShots(vetShot){
  for(const shot of vetShot) {
    shot.removeFromParent();
  }
  resetShots(vetShot);
}

export function shotColisions(shotVet, enemiesVet){
  for(const enemy of enemiesVet){
    for(const shot of shotVet){
      if(detectCollisionCubes(shot, enemy)){
        const indexEnemy = enemiesVet.indexOf(enemy)
        enemiesVet.splice(indexEnemy, 1);
        deadEnemies.push(enemy);

        setEnemiesCounter();
        setCanCreateEnemy(true);

        shot.removeFromParent();
        const indexShot = shotVet.indexOf(shot)
        shotVet.splice(indexShot, 1);
        setShotCounter();
        setCanCreateShot();
      }
    }
  }
}

export function animateDeadEnemies() {
  for(const enemy of deadEnemies) {
    enemy.rotateY(3.14/12);
    const scaleValue = enemy.scale.x - 0.1;
    enemy.scale.set(scaleValue, scaleValue, scaleValue); 
    if(enemy.scale.x <= 0)
      enemy.removeFromParent();
  }
}

export function animateDeadPlayer(plane) {
  var set = true;
  for(const airPlane of deadPlayer) {
    if(set){
      airPlane.rotateZ(3.14/4);
    }
    setTimeout(() => {
      set = false;
      airPlane.updateMatrixWorld();
      airPlane.position.set(0.0, 4, 45);
      deadPlayer.shift();
      return;
  },440);
  }
}

function animation(obj){
  setTimeout(() => {
    obj.material.opacity =0.7;
  }, 1000);

  setTimeout(() => {
      obj.material.opacity =0.4;
  }, 1000);

  setTimeout(() => {
      obj.material.opacity =0.1;
  }, 1000);
}