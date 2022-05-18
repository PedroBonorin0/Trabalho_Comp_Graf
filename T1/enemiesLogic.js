import * as THREE from  'three';

var enemiesOnScreen = 0;
var enemyMaterial = new THREE.MeshLambertMaterial({color: "rgb(250, 0, 100)"})
var enemyGeometry = new THREE.BoxGeometry(5, 5, 5);
var canCreate = true;

export function createEnemy(scene) {
  if(enemiesOnScreen < 5 && canCreate) {
      canCreate = false;
      var newEnemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
      newEnemy.position.set(generateRandomX(), 3, -40);
      scene.add(newEnemy);
      
      enemiesOnScreen++;
      setTimeout(() => {
        canCreate = true;
      }, 1000);
  }
  return newEnemy;
}

function generateRandomX() {
  return Math.floor(Math.random() * (30 - (-30)) ) + (-30);
}

export function placeEnemy() {
  return (10, 25, 100);
}

export function moveEnemies(enemiesOnScreen) {
  for(const enemy of enemiesOnScreen) {
    enemy.translateZ(-1 * generateRandomSpeed());
  }
}

function generateRandomSpeed() {
  return Math.floor(Math.random() * (0.5 - (-0.2)) ) + (-0.2);
}

export {
  enemiesOnScreen,
};