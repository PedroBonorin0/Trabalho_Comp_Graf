import * as THREE from  'three';

export function buildBoundingBox(obj){
    return new THREE.BoxHelper(obj, 0x00ff00);
}