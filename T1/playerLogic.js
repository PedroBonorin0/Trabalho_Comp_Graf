import KeyboardState from '../libs/util/KeyboardState.js';
import * as THREE from  'three';

// Variáveis auxiliares ----------------------------------------------------------------------------
var shotOnScreenCounter = 0;
var canCreateShot = true;

// Funções para lógica dos projéteis ---------------------------------------------------------------
export function buildShot(scene, player){
   if(shotOnScreenCounter < 10 && canCreateShot) {
       canCreateShot = false;
       var newShot = new THREE.Mesh(
           new THREE.SphereGeometry(0.8, 10, 10),
           new THREE.MeshLambertMaterial({color: "rgb(0, 250, 100)"})
       );

       newShot.position.set(player.position.x, player.position.y, player.position.z);
       scene.add(newShot);
       shotOnScreenCounter++;

       setTimeout(() => {
           canCreateShot = true;
       }, 200);
       return newShot;
   }
}
 
export function moveShot(vetShot){
   for(const shot of vetShot){
       shot.translateZ(-4);
       if(shot.position.z < -190){
            shot.removeFromParent();
            vetShot.shift();
            shotOnScreenCounter--;
        }
   }
}

// Funções Keyboard ---------------------------------------------------------------------------------
export function inicializeKeyboard(){
    var keyboard = new KeyboardState();
    return keyboard;
 }

export function keyboardUpdate(kb, obj){
   kb.update();
   if (kb.pressed("up") && obj.position.y < 4.22){
       console.log(obj.position.y)
       obj.translateY(2);
   }
   if (kb.pressed("down") && obj.position.y > 3.994){
       obj.translateY(-2);
       console.log(obj.position.y)
   }
   if (kb.pressed("right") && obj.position.x < 57){
       obj.translateX(2);
       console.log(obj.position.x)
   }
   if (kb.pressed("left") && obj.position.x > -57){
       obj.translateX(-2);
       console.log(obj.position.x)
   }
}

// Funções de atualização de variáveis ----------------------------------------------------------------
export function setCanCreateShot(){
    canCreateShot = true;
}

export function setShotCounter(){
    shotOnScreenCounter--;
}
