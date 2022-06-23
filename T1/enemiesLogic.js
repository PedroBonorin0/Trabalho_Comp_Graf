import * as THREE from  'three';

// inicialize elements -------------------------------------------------------------------------------------------------------------
var enemiesOnScreenCounter = 0;
var enemyMaterialAir = new THREE.MeshLambertMaterial({color: "rgb(250, 0, 100)"});
var enemyMaterialGround = new THREE.MeshLambertMaterial({color: "rgb(250, 0, 150)"});
var enemyGeometryAir = new THREE.BoxGeometry(12, 12, 12);
var enemyGeometryGround = new THREE.BoxGeometry(14, 10, 14);
var canCreate = true;

var scene;
var airPlane;

// create vet of enemies -----------------------------------------------------------------------------------------------------------
var enemiesOnScreen = [];

var airEnemiesShotsOnScreen = [];

// enemies logic functions ---------------------------------------------------------------------------------------------------------
export function createEnemy(scn,plane) {
  scene = scn;
  airPlane = plane;

  onda1();

  setTimeout(() => {
    onda2();
  }, 10000);

  setTimeout(() => {
    onda3();
  }, 20000);

  setTimeout(() => {
    onda4();
  }, 30000);

  setTimeout(() => {
    onda5();
  }, 40000);

  setTimeout(() => {
    onda6();
  }, 50000);

  setTimeout(() => {
    onda7();
  }, 60000);

  setTimeout(() => {
    onda8();
  }, 70000);

  setTimeout(() => {
    onda9();
  }, 80000);

  setTimeout(() => {
    onda10();
  }, 90000);


  if(enemiesOnScreenCounter < 10 && canCreate) {
    // canCreate = false;
    // var newEnemy = new THREE.Mesh(enemyGeometryGround, enemyMaterialGround);

    // enemiesOnScreen.push(newEnemy);
    // newEnemy.speed = 0.5;

    // newEnemy.position.set(generateRandomX(), 10, -350);
    // scene.add(newEnemy);
  
    // enemiesOnScreenCounter++;
    // setTimeout(() => {
    //   canCreate = true;
    // }, 1000);

    canCreate = false;
    var newEnemy = new THREE.Mesh(enemyGeometryAir, enemyMaterialAir);

    enemiesOnScreen.push(newEnemy);
    newEnemy.speed = generateRandomSpeed();
    newEnemy.canShoot = false;

    setTimeout(() => {
      newEnemy.canShoot = true;
    }, 2000);

    newEnemy.position.set(generateRandomX(), 36, -350);
    scene.add(newEnemy);
  
    enemiesOnScreenCounter++;
    setTimeout(() => {
      canCreate = true;
    }, 1000);
  }
  moveEnemies();
  //moveAirEnemyShots();
}

function generateRandomX() {
  return Math.floor(Math.random() * (57 - (-57)) ) + (-57);
}

function moveEnemies() {
  for(const enemy of enemiesOnScreen) {
    enemy.translateZ(enemy.speed);
    if(enemy.position.z < 0 && enemy.position.z > 8) {
      // enemy.canShoot = false;
      buildAirEnemyShot(enemy);
      // setTimeout(() => {
      //   enemy.canShoot = true;
      // }, 1250);
    }

    if(enemy.position.z > 110) {
      enemy.removeFromParent();
      const indexToRemove = enemiesOnScreen.indexOf(enemy);
      enemiesOnScreen.splice(indexToRemove, 1);
      enemiesOnScreenCounter--;
    }
  }
}

function buildAirEnemyShot(enemy) {
  var newShot = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 10, 10),
    new THREE.MeshLambertMaterial({color: "rgb(0, 100, 100)"})
  );

  newShot.position.set(enemy.position.x, enemy.position.y, enemy.position.z);
  calculaRotacao(newShot);

  scene.add(newShot);
}

function moveAirEnemyShots() {
  for(const shot of airEnemiesShotsOnScreen) {
    shot.translateZ(0.2);
    
    if(shot.position.z > 110) {
      shot.removeFromParent();
      const indexToRemove = airEnemiesShotsOnScreen.indexOf(shot);
      airEnemiesShotsOnScreen.splice(indexToRemove, 1);
    }
  }
}

function calculaRotacao(newShot) {
//   var distance = Math.sqrt(Math.pow(newEnemy.position.x - airPlane.position.x, 2) +
//                            Math.pow(newEnemy.position.z - airPlane.position.z, 2));

//   var rotateAngle = (newEnemy.position.x - airPlane.position.x)/distance;
//   var angleRad = degreesToRadians(rotateAngle);

//   newEnemy.rotateY(angleRad);
  newShot.lookAt(airPlane);
}

// auxiliar functions --------------------------------------------------------------------------------------------------------------
function generateRandomSpeed() {
  return Math.random() * (2 - (0.5)) + (0.5);
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

// ONDAS

function onda1() {
  
}

function onda2() {

}

function onda3() {

}

function onda4() {

}

function onda5() {

}

function onda6() {

}

function onda7() {

}

function onda8() {

}

function onda9() {

}

function onda10() {

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