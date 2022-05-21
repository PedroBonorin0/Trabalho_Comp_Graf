import * as THREE from  'three';
import { setCanCreateEnemie, setEnemiesCounter } from './enemiesLogic.js';
import { setCanCreateShot, setShotCounter } from './playerLogic.js';


// auxiliar functions -----------------------------------------------------------------------------------------------------
export function buildBoundingBox(obj){
    return new THREE.BoxHelper(obj, 0x00ff00);
}

export function detectCollisionCubes(object1, object2){
    object1.geometry.computeBoundingBox();
    object2.geometry.computeBoundingBox();
    object1.updateMatrixWorld();
    object2.updateMatrixWorld();
    
    var box1 = object1.geometry.boundingBox.clone();
    box1.applyMatrix4(object1.matrixWorld);
  
    var box2 = object2.geometry.boundingBox.clone();
    box2.applyMatrix4(object2.matrixWorld);
  
    return box1.intersectsBox(box2);
  }

// detect colisions functions -------------------------------------------------------------------------------------------
export function airPlaneColisions(airPlane, enemiesVet){
      for (const enemie of enemiesVet){
          if(detectCollisionCubes(airPlane, enemie)){
            animation(enemie);
              enemie.removeFromParent();
              const indexEnemie = enemiesVet.indexOf(enemie)
              enemiesVet.splice(indexEnemie, 1);
              setEnemiesCounter();
              setCanCreateEnemie();
            
              animation(airPlane);
              airPlane.position.set(0.0, 3.0, 45);
              airPlane.material.opacity = 1.0;
        }
    }
}

export function shotColisions(shotVet, enemiesVet){
      for(const enemie of enemiesVet){
          for(const shot of shotVet){
              if(detectCollisionCubes(shot, enemie)){
                animation(enemie);
                enemie.removeFromParent();
                const indexEnemie = enemiesVet.indexOf(enemie)
                enemiesVet.splice(indexEnemie, 1);
                setEnemiesCounter();
                setCanCreateEnemie();

                shot.removeFromParent();
                const indexShot = shotVet.indexOf(shot)
                shotVet.splice(indexShot, 1);
                setShotCounter();
                setCanCreateShot();
            }
        }
    }
}

function animation(obj){
    setTimeout(() => {
        obj.material.opacity =0.7;
    }, 1000);

    setTimeout(() => {
        obj.material.opacity =0.4;
    }, 1000);

    setTimeout(() => {
        obj.material.opacity =0.1;
    }, 1000);
}