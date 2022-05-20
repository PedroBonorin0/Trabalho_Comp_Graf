import KeyboardState from '../libs/util/KeyboardState.js';
import * as THREE from  'three';

// Variáveis auxiliares ----------------------------------------------------------------------------
var shotOnScreen = 0;
var canCreateShot = true;

// Funções para lógica dos projéteis ---------------------------------------------------------------
export function buildShot(scene, player){
   if(shotOnScreen < 1 && canCreateShot) {
       canCreateShot = false;
       var newShot = new THREE.Mesh(
           new THREE.SphereGeometry(0.5, 10, 10),
           new THREE.MeshLambertMaterial({color: "rgb(0, 250, 100)"})
       );

       newShot.position.set(player.position.x, player.position.y, player.position.z);
       scene.add(newShot);
       shotOnScreen++;

       setTimeout(() => {
           canCreateShot = true;
       }, 200);
       return newShot;
   }
}
 
export function moveShot(vetShot){
   for(const shot of vetShot){
       shot.translateZ(-2);
       if(shot.position.z < -30){
            shot.removeFromParent();
            vetShot.shift();
            shotOnScreen--;
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
   if (kb.pressed("up") && obj.position.y < 3.032){
       obj.translateY(2);
   }
   if (kb.pressed("down") && obj.position.y > 2.994){
       obj.translateY(-2);
   }
   if (kb.pressed("right") && obj.position.x < 38){
       obj.translateX(2);
   }
   if (kb.pressed("left") && obj.position.x > -38){
       obj.translateX(-2);
   }
}