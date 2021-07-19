export var DIR;
(function (DIR) {
    DIR[DIR["Up"] = 0] = "Up";
    DIR[DIR["Down"] = 1] = "Down";
    DIR[DIR["Left"] = 2] = "Left";
    DIR[DIR["Right"] = 3] = "Right";
})(DIR || (DIR = {}));
export default class Pacman {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.direction = dir;
    }
    move() {
    }
    draw() {
    }
}
