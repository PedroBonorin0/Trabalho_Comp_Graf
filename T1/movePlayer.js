import KeyboardState from '..//libs/util/KeyboardState.js';
import * as THREE from  'three';

export function inicializeKeyboard(){
    var keyboard = new KeyboardState();
    return keyboard;
}

export function buildShot(){
    var shot = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 10, 10),
        new THREE.MeshLambertMaterial({color: "rgb(0, 250, 100)"})
    );
    return shot;
}

export function keyboardUpdate(kb, obj, scene){
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

    if(kb.pressed("space")){
        var shot = buildShot();
        //var timer = true;

        shot.position.set(obj.position.x, obj.position.y, obj.position.z);

        scene.add(shot);
        shot.alive = true;

        setTimeout(function(){
            shot.alive = false;
            scene.remove(shot);
        }, 1000);
    }
}