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
        switch (this.type) {
            case CELLTYPE.Empty: {
                this._drawRectangle("MediumBlue");
                break;
            }
            case CELLTYPE.Food: {
                this._drawRectangle("MediumBlue");
                this._drawCircle('white');
                break;
            }
            case CELLTYPE.Wall: {
                this._drawRectangle("MediumBlue");
                this._drawImage('assets/img/wall.svg', 100);
                break;
            }
            default: {
                return;
            }
        }
    }
    _drawRectangle(color) {
        this.context.fillStyle = color;
        this.context.fillRect(this.x, this.y, 100, 100);
    }
    _drawCircle(color) {
        this.context.beginPath();
        this.context.arc(this.x + 50, this.y + 50, 25, 0, 2 * Math.PI, false);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.lineWidth = 1;
        this.context.strokeStyle = color;
        this.context.stroke();
    }
    _drawImage(url, size) {
        let img = new Image();
        img.src = url;
        img.onload = () => {
            this.context.drawImage(img, this.x, this.y, size, size);
        };
    }
}
