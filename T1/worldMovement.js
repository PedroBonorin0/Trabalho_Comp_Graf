import {createGroundPlaneWired} from '../libs/util/util.js';

// create the ground plane
let plane = createGroundPlaneWired(200, 300);
plane.translateY(100);
scene.add(plane);

export function worldMovement() {
  plane.translateY(-0.1); //Mudar para -0.1
  if(plane.position.y < -25E-15) {
    console.log(plane.position);
    var planoAux = createGroundPlaneWired(200, 300);
    planoAux.translateY(120);
    scene.add(planoAux);
    plane.removeFromParent();
    planoAux.translateY(-0.1);
    plane.copy(planoAux);
    scene.add(plane);
    planoAux.removeFromParent();
  }
}