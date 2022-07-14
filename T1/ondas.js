import * as THREE from  'three';
import { generateEnemyVertical,
         generateEnemyHorizontal,
         generateEnemyDiagonal,
         generateEnemyArco,
         enemiesOnScreen } from './enemiesLogic.js'
import { generateLife } from './main.js';

var ondaAtual = 0;
var createOnda = true;

export function game (){
    proximaOnda();
}

function proximaOnda() {
    if(createOnda) ondaAtual++;
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
    generateEnemyVertical('air', -45, -250);
    generateEnemyVertical('air', -20, -300);
    generateEnemyVertical('grd', -30, -300);
    generateEnemyVertical('grd', 30, -300);
    generateLife('lifeV', -30, -250);
    generateLife('lifeV',10, -300);

    if(enemiesOnScreen.length === 0){
        console.log('passaa')
        createOnda = true
        proximaOnda();
    }
}

function onda2(){
    if(!createOnda) return;
    createOnda = false;
    console.log('onda2')
    generateEnemyHorizontal('air', -250, 30, 'esq');
    generateEnemyHorizontal('air', -200 , 0, 'esq');
    generateEnemyHorizontal('air', 250, 45, 'dir');
    generateEnemyHorizontal('air', 200, 15, 'dir');

    if(enemiesOnScreen.length === 0){
        createOnda = true
        proximaOnda();
    }
}

function onda3(){
    if(!createOnda) return;
    createOnda = false;
    console.log('onda3')
    generateEnemyDiagonal('air', -220, -180, 'dir', 'down');
    generateEnemyDiagonal('air', -260, -160, 'dir', 'down');
    generateEnemyDiagonal('air', 220, -180, 'esq', 'down');
    generateEnemyDiagonal('air', 260, -160, 'esq', 'down');
    generateEnemyVertical('grd', 45, -270);
    generateEnemyVertical('grd', -45, -270);
    generateLife('lifeV', 45, -270);
    generateLife('lifeV',-45, -270);


    if(enemiesOnScreen.length === 0){
        createOnda = true
        proximaOnda();
    }
}