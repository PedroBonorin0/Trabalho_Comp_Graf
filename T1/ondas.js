import { generateEnemyVertical,
         generateEnemyHorizontal,
         generateEnemyDiagonal,
         generateEnemyArco,
         enemiesOnScreen,
         enemiesOnScreenCounter,
        clearEnemies } from './enemiesLogic.js';
import {clearShots} from './shots.js';
import { generateLife } from './lifeCSG.js';
import {scene, airPlane, boxPlane, setHp} from './main.js';

var ondaAtual = 1;
var createOnda = true;
var canIncrement = true;

export function jogo (){
  console.log('inimigos', enemiesOnScreenCounter);
  console.log('onda', ondaAtual);

  if(enemiesOnScreenCounter > 0)
    return;

  if(ondaAtual === 1){
      generateEnemyVertical('air', -10, -250);
      generateEnemyVertical('air', 10, -300);
      generateEnemyVertical('grd', -30, -300);
      generateEnemyVertical('grd', 30, -300);
      ondaAtual = 2;
      return;
  }

  if(ondaAtual === 2){
    generateEnemyVertical('air', -30, -300);
    generateEnemyVertical('air', 30, -250);
    ondaAtual = 3;
    return;
  }

  if(ondaAtual === 3){
      ondaAtual = 4;
      return;
  }

  if(ondaAtual === 4){
      ondaAtual = 5;
      return;
  }

  if(ondaAtual === 5){
      ondaAtual = 6;
      return;
  }

  if(ondaAtual === 6){
      ondaAtual = 7;
      return;
  }

  if(ondaAtual === 7){
      ondaAtual = 8;
      return;
  }

  if(ondaAtual === 8){
      ondaAtual = 9;
      return;
  }

  if(ondaAtual === 9){
      ondaAtual = 10;
      return;
  }

  if(ondaAtual === 10){
  }
}

export function reiniciaJogo(){
    clearEnemies();
    clearShots();
    
    setHp();

    airPlane.position.set(0.0, 36, 80);
    boxPlane.position.set(0.0, 36, 80);
    scene.add(airPlane);

    ondaAtual = 1;
}

export function reiniciaJogo2(){
    clearEnemies();
    clearShots();

    setHp();

    airPlane.position.set(0.0, 36, 80);
    boxPlane.position.set(0.0, 36, 80);

    setTimeout(() => {
        scene.add(airPlane);
    },440);

    ondaAtual = 1;
}

export function setOnda(){
    ondaAtual = 1;
}

export function game (){
    proximaOnda();
}

function proximaOnda() {
    if(createOnda) {
        canIncrement = false;
        ondaAtual++;
    }


    if(ondaAtual === 1) onda1();
    //if(ondaAtual === 2) onda2();
    //if(ondaAtual === 3) onda3();
    // if(ondaAtual === 4) onda4();
    // if(ondaAtual === 5) onda5();
    // if(ondaAtual === 6) onda6();
    // if(ondaAtual === 7) onda7();
    // if(ondaAtual === 8) onda8();
    // if(ondaAtual === 9) onda9();
    // if(ondaAtual === 10) onda10();
}

function onda1(){
    if(!createOnda) return;
    createOnda = false;
    console.log('onda1')
    //generateEnemyVertical('air', -45, -250);
    //generateEnemyVertical('air', -20, -300);
    //generateEnemyVertical('grd', -30, -300);
    //generateEnemyVertical('grd', 30, -300);
    //generateEnemyHorizontal('air', 100, 30, 'dir');
    //generateEnemyHorizontal('air', -100 , 0, 'esq');
    generateEnemyArco('air', -100, 100, 'esq');
    generateEnemyArco('air', 100, 100, 'dir');
    generateLife('lifeV', -30, -250);
    generateLife('lifeV',10, -300);

    if(enemiesOnScreen.length === 0){
        createOnda = true
        canIncrement = true;
        proximaOnda();
    }
}

function onda2(){
    if(createOnda) {
        console.log('onda2')
        generateEnemyHorizontal('air', -250, 30, 'esq');
        generateEnemyHorizontal('air', -200 , 0, 'esq');
        generateEnemyHorizontal('air', 250, 45, 'dir');
        generateEnemyHorizontal('air', 200, 15, 'dir');
        createOnda = false;
    }

    if(enemiesOnScreen.length === 0){
        createOnda = true
        canIncrement = true;
        proximaOnda();
    }
}

function onda3(){
    if(createOnda) {
        console.log('onda3')
        generateEnemyDiagonal('air', -220, -180, 'dir', 'down');
        generateEnemyDiagonal('air', -260, -160, 'dir', 'down');
        generateEnemyDiagonal('air', 220, -180, 'esq', 'down');
        generateEnemyDiagonal('air', 260, -160, 'esq', 'down');
        generateEnemyVertical('grd', 45, -270);
        generateEnemyVertical('grd', -45, -270);
        generateLife('lifeV', 45, -270);
        generateLife('lifeV',-45, -270);
        createOnda = false;
    }
    
    if(enemiesOnScreen.length === 0){
        createOnda = true
        canIncrement = true;
        proximaOnda();
    }
}