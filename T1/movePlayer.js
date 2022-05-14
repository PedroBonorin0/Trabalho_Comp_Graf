import KeyboardState from '..//libs/util/KeyboardState.js';

export function inicializeKeyboard(){
    var keyboard = new KeyboardState();
    return keyboard;
}

export function keyboardUpdate(kb, obj){
    kb.update();
    if (kb.pressed("up") && obj.position.y < 3.032)     obj.translateY(2);
    if (kb.pressed("down") && obj.position.y > 2.994)   obj.translateY(-2);
    if (kb.pressed("right") && obj.position.x < 38)  obj.translateX(2);
    if (kb.pressed("left") && obj.position.x > -38)   obj.translateX(-2);
}