export var AXIS;
(function (AXIS) {
    AXIS[AXIS["Hor"] = 0] = "Hor";
    AXIS[AXIS["Vert"] = 1] = "Vert";
})(AXIS || (AXIS = {}));
export default class Monster {
    constructor(x, y, axis) {
        this.x = x;
        this.y = y;
        this.axis = axis;
    }
    move() {
    }
    draw() {
    }
}
