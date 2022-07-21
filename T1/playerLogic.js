import KeyboardState from '../libs/util/KeyboardState.js';

// Variáveis auxiliares ----------------------------------------------------------------------------
var shotOnScreenCounter = 0;
var canCreateShot = true;

var misselOnScreenCounter = 0;

// Funções Keyboard ---------------------------------------------------------------------------------
export function inicializeKeyboard(){
    var keyboard = new KeyboardState();
    return keyboard;
}

function inclination(airPlane){
    for(var i = 0; i< 3; i++){
        setTimeout(() => {
            airPlane.rotateOnWorldAxis(3.14/9);
          },250);
    }
}

export function keyboardUpdate(kb, obj, airPlane){
   kb.update();
   if (kb.pressed("up") && obj.position.y < 36.16 && airPlane != undefined){
       obj.translateY(2);
       airPlane.translateZ(2);
    }
    if (kb.pressed("down") && obj.position.y > 35.992 && airPlane != undefined){
        obj.translateY(-2);
        airPlane.translateZ(-2);
    }
    if (kb.pressed("right") && obj.position.x < 57 && airPlane != undefined){
        obj.translateX(2);
        airPlane.position.set(airPlane.position.x + 2, airPlane.position.y, airPlane.position.z);
        rotateAirplane('dir', airPlane)
    }
    if (kb.pressed("left") && obj.position.x > -57 && airPlane != undefined){
        obj.translateX(-2);
        airPlane.position.set(airPlane.position.x - 2, airPlane.position.y, airPlane.position.z);
   }
}

function rotateAirplane(dir, airPlane) {
  
}

function fixRotation(airPlane) {
  
}

// Funções de atualização de variáveis ----------------------------------------------------------------
export function setCanCreateShot(){
    canCreateShot = true;
}

export function setShotCounter(){
    shotOnScreenCounter--;
}

export function setMisselCounter(){
    misselOnScreenCounter--;
}

export function resetShots (vetShot) {
    vetShot = [];
    shotOnScreenCounter = 0;
    misselOnScreenCounter = 0;
    canCreateShot = true;
  }
