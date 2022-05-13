import * as THREE from  'three';
import Stats from       '../build/jsm/libs/stats.module.js';
import {createGroundPlaneWired} from '../libs/util/util.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 30, 25)); // Init camera in this position
initDefaultBasicLight(scene);


// create the ground plane
let plane = createGroundPlaneWired(100, 100)
scene.add(plane);

// create a cube
var airPlaneGeometry = new THREE.ConeGeometry(2, 5, 20);
var airPlaneMaterial = new THREE.MeshLambertMaterial({color: "rgb(0, 250, 0)"});
var airPlane = new THREE.Mesh(airPlaneGeometry, airPlaneMaterial);

airPlane.position.set(0.0, 3.0, 12);
airPlane.rotateX(-3.14/2);

// add the airPlane to the scene
scene.add(airPlane);

// Use this to show information onscreen

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}