export var CELLTYPE;
(function (CELLTYPE) {
    CELLTYPE[CELLTYPE["Empty"] = 0] = "Empty";
    CELLTYPE[CELLTYPE["Food"] = 1] = "Food";
    CELLTYPE[CELLTYPE["Wall"] = 2] = "Wall";
})(CELLTYPE || (CELLTYPE = {}));
export default class Cell {
    constructor(x, y, type, context) {
        this.weight = 0;
        this.neighborsArray = [];
        this.x = x;
        this.y = y;
        this.type = type;
        this.context = context;
    }
    draw() {
    }
}
