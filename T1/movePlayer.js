import KeyboardState from '..//libs/util/KeyboardState.js';

export function inicializeKeyboard(){
    var keyboard = new KeyboardState();
    return keyboard;
}

export function keyboardUpdate(kb, obj){
    kb.update();
    if (kb.pressed("up"))     obj.translateY(1);
    if (kb.pressed("down"))   obj.translateY(-1);
    if (kb.pressed("right"))  obj.translateX(1);
    if (kb.pressed("left"))   obj.translateX(-1);
}