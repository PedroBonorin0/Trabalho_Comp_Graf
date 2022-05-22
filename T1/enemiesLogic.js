import * as THREE from  'three';

// inicialize elements -------------------------------------------------------------------------------------------------------------
var enemiesOnScreenCounter = 0;
var enemyMaterial = new THREE.MeshLambertMaterial({color: "rgb(250, 0, 100)"})
var enemyGeometry = new THREE.BoxGeometry(14, 14, 14);
var canCreate = true;

// create vet of enemies -----------------------------------------------------------------------------------------------------------
var enemiesOnScreen = [];

// enemies logic functions ---------------------------------------------------------------------------------------------------------
export function createEnemy(scene) {
  if(enemiesOnScreenCounter < 10 && canCreate) {
    canCreate = false;
    var newEnemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
    newEnemy.uniqueId = generateUniqueId();

    enemiesOnScreen.push(newEnemy);
    newEnemy.speed = generateRandomSpeed();

    newEnemy.position.set(generateRandomX(), 3, -350);
    scene.add(newEnemy);
  
    enemiesOnScreenCounter++;
    setTimeout(() => {
      canCreate = true;
    }, 1000);
  }
  moveEnemies();
}

function generateRandomX() {
  return Math.floor(Math.random() * (57 - (-57)) ) + (-57);
}

function moveEnemies() {
  for(const enemy of enemiesOnScreen) {
    enemy.translateZ(enemy.speed);
    if(enemy.position.z > 90) {
      enemy.removeFromParent();
      const indexToRemove = enemiesOnScreen.indexOf(enemy);
      enemiesOnScreen.splice(indexToRemove, 1);
      enemiesOnScreenCounter--;
    }
  }
}

// auxiliar functions --------------------------------------------------------------------------------------------------------------
function generateRandomSpeed() {
  return Math.random() * (2 - (0.5)) + (0.5);
}

function generateUniqueId() {
  return new Date().getTime() 
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

export {
  enemiesOnScreenCounter,
  enemiesOnScreen,
}


// import * as THREE from  'three';

// var enemyOnScreenCounter = 0;
// var enemyMaterial = new THREE.MeshLambertMaterial({color: "rgb(250, 0, 100)"})
// var enemyGeometry = new THREE.BoxGeometry(5, 5, 5);
// var canCreate = true;

// var enemiesOnScreen = [];

// export function createEnemy(scene) {
//   if(enemyOnScreenCounter < 7 && canCreate) {
//       canCreate = false;
//       const padraoInimigos = generateRandomEnemyPattern();
//       const numeroIminigos = generateNumberOfEnemies(padraoInimigos);
//       for(let i = 0; i < numeroIminigos; i++) {
//         var newEnemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
//         newEnemy.padraoMovimentacao = padraoInimigos;

//         generatePosicaoPorPadrao(newEnemy, i);
//         scene.add(newEnemy);
  
//         enemiesOnScreen.push(newEnemy);
      
//         enemyOnScreenCounter++;
//       }
      
//       setTimeout(() => {
//         canCreate = true;
//       }, 1000);

//     }
//   moveEnemies(enemiesOnScreen);
// }

// // function generateRandomX() {
// //   return Math.random() * (30 - (-30)) + (-30);
// // }

// function moveEnemies() {
//   for(const enemy of enemiesOnScreen) {
//     moveInimigoPorPadrao(enemy);
//   }
// }


// function moveInimigoPorPadrao(enemy) {
//   if(enemy.padraoMovimentacao === 1 || enemy.padraoMovimentacao === 3) {
//     enemy.translateX(-0.4);
//     enemy.translateZ(+0.4);
//     return;
//   }
//   if(enemy.padraoMovimentacao === 2 || enemy.padraoMovimentacao === 4) {
//     enemy.translateX(+0.4);
//     enemy.translateZ(+0.4);
//     return;
//   }
//   if(enemy.padraoMovimentacao === 5 || enemy.padraoMovimentacao === 6) {
//     enemy.translateZ(-0.3);
//     return;
//   }
//   if(enemy.padraoMovimentacao === 7)
//     return;
// }
// /*
//  * Padrões de inimigos: 
//  * 1 - Diagonal Enfileirado D pra E - Rápido
//  * 2 - Diagonal  Enfileirado E para D - Rápido
//  * 3 - Diagonal Alinhados D pra E - Médio
//  * 4 - Diagonal  Alinhados E para D - Médio
//  * 5 - Alinhado Reto (mais de um enemy) - Médio
//  * 6 - Reto (um enemy) - Lento
//  * 7 - Parado
// */

// function generatePosicaoPorPadrao(enemy, index) {
//   if(enemy.padraoMovimentacao === 1) {
//     if(index === 0) {
//       enemy.position.set(+30, 3, -40);
//       return;
//     }
//     if(index === 1) {
//       enemy.position.set(+35, 3, -45);
//       return;
//     }
//     if(index === 2) {
//       enemy.position.set(+40, 3, -50);
//       return;
//     }
//   }
//   if(enemy.padraoMovimentacao === 2) {
//     if(index === 0) {
//       enemy.position.set(-30, 3, -40);
//       return;
//     }
//     if(index === 1) {
//       enemy.position.set(-35, 3, -45);
//       return;
//     }
//     if(index === 2) {
//       enemy.position.set(-40, 3, -50);
//       return;
//     }
//   }
//   if(enemy.padraoMovimentacao === 3) {
//     if(index === 0) {
//       enemy.position.set(+30, 3, -40);
//       return;
//     }
//     if(index === 1) {
//       enemy.position.set(+35, 3, -35);
//       return;
//     }
//     if(index === 2) {
//       enemy.position.set(+40, 3, -30);
//       return;
//     }
//   }
//   if(enemy.padraoMovimentacao === 4) {
//     if(index === 0) {
//       enemy.position.set(-30, 3, -40);
//       return;
//     }
//     if(index === 1) {
//       enemy.position.set(-35, 3, -35);
//       return;
//     }
//     if(index === 2) {
//       enemy.position.set(-40, 3, -30);
//       return;
//     }
//   }
//   if(enemy.padraoMovimentacao === 5) {
//     if(index === 0) {
//       enemy.position.set(-7.5, 3, -40);
//       return;
//     }
//     if(index === 1) {
//       enemy.position.set(-2.5, 3, -40);
//       return;
//     }
//     if(index === 2) {
//       enemy.position.set(+2.5, 3, -40);
//       return;
//     }
//     if(index === 3) {
//       enemy.position.set(+7.5, 3, -40);
//       return;
//     }
//   }
//   if(enemy.padraoMovimentacao === 6) {
//     enemy.position.set(Math.random() * (30 - (-30)) + (-30));
//     return;
//   }
//   if(enemy.padraoMovimentacao === 7) {
//     enemy.position.set(Math.random() * (30 - (-30)) + (-30));
//     return;
//   }
// }

// function generateNumberOfEnemies(padrao) {
//   if(padrao === 1 || padrao === 2) {
//     return 3;
//   }
//   if(padrao === 3 || padrao === 4) {
//     return 3;
//   }
//   if(padrao === 5) {
//     return 4;
//   }
//   if(padrao === 6) {
//     return 1;
//   }
//   if(padrao === 7)
//     return 1;
// }

// function generateRandomEnemyPattern() {
//   return Math.floor(Math.random() * (7.9 - (1)) + (1));
// }