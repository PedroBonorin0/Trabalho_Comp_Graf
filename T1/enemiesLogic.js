import * as THREE from  'three';

/**
 * CIMA -> 300
 * LADOS -> -350 e 350
 */

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

var timeInicio;
var ondaAtual;

// enemies logic functions ---------------------------------------------------------------------------------------------------------
export function createEnemy(scn,plane) {
  scene = scn;
  airPlane = plane;

  timeInicio = performance.now();
  ondaAtual = 1;

  // if(enemiesOnScreenCounter < 10 && canCreate) {
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

    // canCreate = false;
    // var newEnemy = new THREE.Mesh(enemyGeometryAir, enemyMaterialAir);

    // enemiesOnScreen.push(newEnemy);
    // newEnemy.speed = generateRandomSpeed();
    // newEnemy.canShoot = false;

    // setTimeout(() => {
    //   newEnemy.canShoot = true;
    // }, 2000);

    // newEnemy.position.set(generateRandomX(), 36, -350);
    // scene.add(newEnemy);
  
    // enemiesOnScreenCounter++;
    // setTimeout(() => {
    //   canCreate = true;
    // }, 1000);
  // }
  // moveAirEnemyShots();
}

export function moveEnemies() {
  for(const enemy of enemiesOnScreen) {
    enemy.translateX(enemy.speedX);
    enemy.translateZ(enemy.speedZ);

    if(enemy.isArch)
      enemy.rotateY(enemy.spin);
    
    if(enemy.position.z > 110 || enemy.position.x > 300 || enemy.position.x < -300) {
      enemy.removeFromParent();
      const indexToRemove = enemiesOnScreen.indexOf(enemy);
      enemiesOnScreen.splice(indexToRemove, 1);
      enemiesOnScreenCounter--;
    }
  }
  if(ondaAtual === 1) {
    ondaAtual++;
    onda1();
  }
  else {
    if(enemiesOnScreen.length === 0)
      generateNovaOnda();
  }
}

function generateNovaOnda() {
  if(ondaAtual === 2)
    onda2();

  if(ondaAtual === 3)
    onda3();

  if(ondaAtual === 4)
    onda4();
    
  if(ondaAtual === 5)
    onda5();

  if(ondaAtual === 6)
    onda6();

  if(ondaAtual === 7)
    onda7();

  if(ondaAtual === 8)
    onda8();

  if(ondaAtual === 9)
    onda9();

  ondaAtual++;
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

function generateEnemyVertical(type, x, z) {
  var newEnemy;
  
  if(type === 'air') {
    newEnemy = new THREE.Mesh(enemyGeometryAir, enemyMaterialAir);
    newEnemy.speedX = 0;
    newEnemy.speedZ = 1;
    newEnemy.position.set(x, 36, z);
  } else {
    newEnemy = new THREE.Mesh(enemyGeometryGround, enemyMaterialGround);
    newEnemy.speedX = 0;
    newEnemy.speedZ = 0.5;
    newEnemy.position.set(x, 10, z);
  }
  
  enemiesOnScreen.push(newEnemy);
  enemiesOnScreenCounter++;
  
  newEnemy.isArch = false;
  scene.add(newEnemy);
}

function generateEnemyHorizontal(type, x, z, side) {
  var newEnemy;
  
  if(type === 'air') {
    newEnemy = new THREE.Mesh(enemyGeometryAir, enemyMaterialAir);
    
    if(side === 'dir')
      newEnemy.speedX = -0.8;
      else
      newEnemy.speedX = 0.8;
      
      newEnemy.speedZ = 0;
      newEnemy.position.set(x, 36, z);
    } else {
      newEnemy = new THREE.Mesh(enemyGeometryGround, enemyMaterialGround);
      
      if(side === 'dir')
      newEnemy.speedX = -0.8;
      else
      newEnemy.speedX = 0.8;
      
      newEnemy.speedZ = 0;
      newEnemy.position.set(x, 10, z);
    }
    
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
  
  enemiesOnScreen.push(newEnemy);
  enemiesOnScreenCounter++;
  
  newEnemy.isArch = false;
  scene.add(newEnemy);
}

function generateEnemyArco(type, x, z, rot) {
  var newEnemy;
  
  if(type === 'air') {
    newEnemy = new THREE.Mesh(enemyGeometryAir, enemyMaterialAir);
    
    newEnemy.speedX = 0;
    newEnemy.speedZ = -1;
    
    if(rot === 'dir')
      newEnemy.spin = -1 * (Math.PI/180) / 4;
    else
      newEnemy.spin = 1 * (Math.PI/180) / 4;
    
    newEnemy.position.set(x, 36, z);
  } else {
    newEnemy = new THREE.Mesh(enemyGeometryGround, enemyMaterialGround);
    newEnemy.speedX = 0;
    newEnemy.speedZ = 0.5;

    newEnemy.position.set(x, 10, z);
  }
  
  enemiesOnScreen.push(newEnemy);
  enemiesOnScreenCounter++;
  
  newEnemy.isArch = true;
  scene.add(newEnemy);
}

// ONDAS

function onda1() {
  console.log('onda1');
  generateEnemyVertical('air', -45, -250);
  
  generateEnemyVertical('air', -20, -300);
  
  generateEnemyVertical('air', 0, -350);
  
  generateEnemyVertical('air', 20, -400);

  generateEnemyVertical('air', 45, -450);
  
  generateEnemyVertical('grd', -30, -300);
  generateEnemyVertical('grd', 30, -300);
}

function onda2() {
  console.log('onda2')
  generateEnemyHorizontal('air', -250, 30, 'esq');
  generateEnemyHorizontal('air', -200 , 0, 'esq');

  generateEnemyHorizontal('air', 250, 45, 'dir');
  generateEnemyHorizontal('air', 200, 15, 'dir');
}

function onda3() {
  console.log('onda3')
  generateEnemyDiagonal('air', -220, -180, 'dir', 'down');
  generateEnemyDiagonal('air', -260, -160, 'dir', 'down');

  generateEnemyDiagonal('air', 220, -180, 'esq', 'down');
  generateEnemyDiagonal('air', 260, -160, 'esq', 'down');

  generateEnemyVertical('grd', 45, -270);
  generateEnemyVertical('grd', -45, -270);

}

function onda4() {
  console.log('onda4')
  generateEnemyArco('air', -40, 80, 'dir');
  generateEnemyArco('air', 40, 80, 'esq');
}

function onda5() {
  console.log('onda5')

}

function onda6() {
  console.log('onda6')

}

function onda7() {
  console.log('onda7')

}

function onda8() {
  console.log('onda2')

}

function onda9() {
  console.log('onda2')

}

function onda10() {
  console.log('onda2')

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