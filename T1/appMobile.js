import * as THREE from  'three';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
initDefaultBasicLight(scene);

  let button  = document.getElementById("myBtn")
  button.innerHTML = 'START';
  button.addEventListener("click", onButtonPressed);


function onButtonPressed() {
    const loadingScreen = document.getElementById( 'load-tela' );
    document.getElementById('load-screen').style.display= "none";
    start();
    loadingScreen.transition = 0;
    loadingScreen.classList.add( 'fade-out' );
    loadingScreen.addEventListener( 'transitionend', (e) => {
      const element = e.target;
      element.remove();  
    });  
}


/*function start(){
}
*/



render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}