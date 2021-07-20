export var CELLTYPE;
(function (CELLTYPE) {
    CELLTYPE[CELLTYPE["Empty"] = 0] = "Empty";
    CELLTYPE[CELLTYPE["Food"] = 1] = "Food";
    CELLTYPE[CELLTYPE["Wall"] = 2] = "Wall";
})(CELLTYPE || (CELLTYPE = {}));
export default class Cell {
    constructor(x, y, type, context, sizeCell = 20) {
        this.weight = 0;
        this.x = x;
        this.y = y;
        this.type = type;
        this.context = context;
        this.sizeCell = sizeCell;
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
                this._drawImage('src/assets/img/wall.svg', this.sizeCell);
                break;
            }
            default: {
                return;
            }
        }
    }
    _drawRectangle(color) {
        this.context.fillStyle = color;
        this.context.fillRect(this.x * this.sizeCell, this.y * this.sizeCell, this.sizeCell, this.sizeCell);
    }
    _drawCircle(color) {
        const middleOfCellSize = this.sizeCell / 2;
        this.context.beginPath();
        this.context.arc(this.x * this.sizeCell + middleOfCellSize, this.y * this.sizeCell + middleOfCellSize, middleOfCellSize / 2, 0, 2 * Math.PI, false);
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
            this.context.drawImage(img, this.x * this.sizeCell, this.y * this.sizeCell, size, size);
        };
    }
}
