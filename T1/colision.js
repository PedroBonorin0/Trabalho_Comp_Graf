import { setEnemiesCounter, textureOnScreen } from './enemiesLogic.js';
import { setCanCreateShot } from './playerLogic.js';
import { scene } from './main.js';
import { enemiesOnScreen, clearEnemies} from './enemiesLogic.js';
import { shots, clearShots, decrementaShots } from './shots.js';
import { airPlane, 
         boxPlane,
         deadAirPlane,
         lifeOnScreen,
         finalizaGame } from './main.js';

var deadEnemies = [];
var deadPlayer = [];

var set = false;

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

export function animateDeadEnemies() {
  for(const enemy of deadEnemies) {
    enemy.rotateY(3.14/12);
    const scaleValue = enemy.scale.x - 0.1;
    enemy.scale.set(scaleValue, scaleValue, scaleValue); 
    if(enemy.scale.x <= 0)
      enemy.removeFromParent();
  }
}

export function animateDeadPlayer(scene, plane) {
  for(const player of deadPlayer) {
    if(set){
      scene.add(player);
      player.rotateZ(3.14/4);
      setTimeout(() => {
        set = false;
        player.removeFromParent();
        deadPlayer.shift();
        return;
      },440);
    }
  }
}

/**
 * tipo 1: Player x Inimigo
 * tip2 2: Player x TiroAereo
 * tipo 3: Player x TiroTerrestre
 * tipo 4: TiroPlayer x InimigoAereo
 * tipo 5: MisselPlayer x InimigoTerrestre
 */

export function colisions(type, airplaneHp, colisaoAtivada){
  if(!colisaoAtivada) return 0;

  let dano = 0;

  if(airplaneHp <= 0) {
    clearEnemies();
    clearShots();
    
    for(const hp of lifeOnScreen){
      hp.removeFromParent();
      lifeOnScreen.splice(0, 1);
    }        
    
    deadAirPlane.position.set(boxPlane.position.x, boxPlane.position.y, boxPlane.position.z);
    airPlane.removeFromParent();
    deadPlayer.push(deadAirPlane);
    set = true;

    finalizaGame();
    return 0;
  }

  if(type === 1){
    for(const enemy of enemiesOnScreen){
      if(detectCollisionCubes(enemy, boxPlane)){
        textureOnScreen[enemiesOnScreen.indexOf(enemy)].object.removeFromParent();
        textureOnScreen.splice(enemiesOnScreen.indexOf(enemy), 1);
        enemiesOnScreen.splice(enemiesOnScreen.indexOf(enemy), 1);
        dano = 2;
      }
    }
  }
  
  if(type === 2){
    for(const shot of shots){
      if(shot.type === 1){
        if(detectCollisionCubes(shot, boxPlane)){
          shots.splice(shots.indexOf(shot), 1);
          scene.remove(shot);
          dano = 1;
        }
      }
    }
  }
  
  if(type === 3){
    for(const shot of shots){
      if(shot.type === 2){
        if(detectCollisionCubes(shot, boxPlane)){
          shots.splice(shots.indexOf(shot), 1);
          scene.remove(shot);
          dano = 2;
        }
      }
    }
  }

  if(type === 4){
    for(const enemy of enemiesOnScreen){
      for(const shot of shots){
        if(shot.type === 3){
          if(detectCollisionCubes(shot, enemy)){
            const indexEnemy = enemiesOnScreen.indexOf(enemy);
            deadEnemies.push(textureOnScreen[indexEnemy].object);
            enemiesOnScreen.splice(indexEnemy, 1);
            textureOnScreen.splice(indexEnemy, 1);

            setEnemiesCounter();

            shot.removeFromParent();
            const indexShot = shots.indexOf(shot);
            shots.splice(indexShot, 1);
            decrementaShots();
            setCanCreateShot();
          }   
        }
      }
    }
  }

  if(type === 5){
    for(const enemy of enemiesOnScreen){
      for(const shot of shots){
        if(shot.type === 4 && enemy.type == 'grd'){
          if(detectCollisionCubes(shot, enemy)){
            const indexEnemy = enemiesOnScreen.indexOf(enemy);
            deadEnemies.push(textureOnScreen[indexEnemy].object);
            enemiesOnScreen.splice(indexEnemy, 1);
            textureOnScreen.splice(indexEnemy, 1);

            setEnemiesCounter();

            shot.removeFromParent();
            const indexShot = shots.indexOf(shot);
            shots.splice(indexShot, 1);
            decrementaShots();
            setCanCreateShot();
          }   
        }
      }
    }
  }

  if(type === 6){
    for(const hp of lifeOnScreen){
      if(detectCollisionCubes(hp, boxPlane) && airplaneHp < 5){
        lifeOnScreen.splice(lifeOnScreen.indexOf(hp), 1);
        hp.removeFromParent();
        dano = -1;
      }
    }
  }

  return dano;
}

export {
  deadPlayer,
}
