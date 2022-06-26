import * as THREE from  'three';
import { generateEnemyVertical,
         generateEnemyHorizontal,
         generateEnemyDiagonal,
         generateEnemyArco,
         enemiesOnScreen } from './enemiesLogic.js'
import { textureEnemy } from './main.js';

var inicia = true;
var ondaAtual = 1;

export function game (){
    if(inicia){
        inicia = false;
        
        generateEnemyVertical('air', -45, -250, textureEnemy);
        generateEnemyVertical('air', -20, -300);
        generateEnemyVertical('grd', -30, -300);
        generateEnemyVertical('grd', 30, -300);

    }
}

function onda1(){
    generateEnemyVertical('air', -45, -250);
    generateEnemyVertical('air', -20, -300);
    generateEnemyVertical('air', 0, -350);
    generateEnemyVertical('air', 20, -400);
    generateEnemyVertical('air', 45, -450);
    generateEnemyVertical('grd', -30, -300);
    generateEnemyVertical('grd', 30, -300);

    if(enemiesOnScreen.length === 0){
        ondaAtual++;
    }
}

function onda2(){
    generateEnemyHorizontal('air', -250, 30, 'esq');
    generateEnemyHorizontal('air', -200 , 0, 'esq');
    generateEnemyHorizontal('air', 250, 45, 'dir');
    generateEnemyHorizontal('air', 200, 15, 'dir');

    if(enemiesOnScreen.length === 0){
        ondaAtual++;
    }
}

function onda3(){
    generateEnemyDiagonal('air', -220, -180, 'dir', 'down');
    generateEnemyDiagonal('air', -260, -160, 'dir', 'down');
    generateEnemyDiagonal('air', 220, -180, 'esq', 'down');
    generateEnemyDiagonal('air', 260, -160, 'esq', 'down');
    generateEnemyVertical('grd', 45, -270);
    generateEnemyVertical('grd', -45, -270);

    if(enemiesOnScreen.length === 0){
        inicia = true;
    }
}