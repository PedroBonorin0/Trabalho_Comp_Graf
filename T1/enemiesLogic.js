import * as THREE from  'three';

var enemiesOnScreen = 0;
var enemyMaterial = new THREE.MeshLambertMaterial({color: "rgb(250, 0, 100)"})
var enemyGeometry = new THREE.BoxGeometry(5, 5, 5);
var canCreate = true;

export function createEnemy(scene) {
  if(enemiesOnScreen < 5) {
    if(canCreate) {
      canCreate = false;
      var newEnemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
      newEnemy.position.set(generateRandomX(), 3, -40);
      scene.add(newEnemy);
      
      enemiesOnScreen++;
      setTimeout(() => {
        canCreate = true;
      }, 1000);
    }
  }
}

function generateRandomX() {
  return Math.floor(Math.random() * (30 - (-30)) ) + (-30);
}

export function placeEnemy() {
  return (10, 25, 100);
}

function moveEnemy(newEnemy) {
  newEnemy.translateY(-1 * Math.floor(Math.random() * (0.5 - 0.2) ) + 0.2);
}

export {
  enemiesOnScreen,
};