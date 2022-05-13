import * as THREE from  'three';
import Stats from       '../build/jsm/libs/stats.module.js';
import {createGroundPlaneWired} from '../libs/util/util.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 50, 25)); // Init camera in this position
initDefaultBasicLight(scene);

var trackballControls = new TrackballControls( camera, renderer.domElement );

// create the ground plane
let plane = createGroundPlaneWired(200, 300);
plane.translateY(100);
scene.add(plane);

// create a cube
var airPlaneGeometry = new THREE.ConeGeometry(2, 5, 20);
var airPlaneMaterial = new THREE.MeshLambertMaterial({color: "rgb(0, 250, 100)"});
var airPlane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);

airPlane.position.set(0.0, 3.0, 12);
airPlane.rotateX(-3.14/2);

// add the airPlane to the scene
scene.add(airPlane);

var controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
function render()
{
  trackballControls.update(); // Enable mouse movements
  cameraMove();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}

function cameraMove() {
  plane.translateY(-1); //Mudar para -0.1
  if(plane.position.y < -25E-15) {
    console.log(plane.position);
    var planoAux = createGroundPlaneWired(200, 300);
    planoAux.translateY(120);
    scene.add(planoAux);
    plane.removeFromParent();
    planoAux.translateY(-1);
    plane.copy(planoAux);
    scene.add(plane);
    planoAux.removeFromParent();
  }
}