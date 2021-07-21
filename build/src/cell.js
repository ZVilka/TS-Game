export var CELLTYPE;
(function (CELLTYPE) {
    CELLTYPE[CELLTYPE["Empty"] = 0] = "Empty";
    CELLTYPE[CELLTYPE["Food"] = 1] = "Food";
    CELLTYPE[CELLTYPE["Wall"] = 2] = "Wall";
})(CELLTYPE || (CELLTYPE = {}));
export default class Cell {
    constructor(x, y, type, context, game, sizeCell = 20) {
        this.weight = 0;
        this.cellNeighbours = [];
        this.x = x;
        this.y = y;
        this.type = type;
        this._context = context;
        this._cellSize = sizeCell;
        this._game = game;
    }
    setNeighbours() {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (Math.abs(x) !== Math.abs(y) && !(x === 0 && y === 0))
                    this.cellNeighbours.push(this._game.cellArray[this.x + x][this.y + y]);
            }
        }
    }
    setWeight() {
        switch (this.type) {
            case CELLTYPE.Empty: {
                this.weight = this.getDistanceToFood();
                break;
            }
            case CELLTYPE.Food: {
                this.weight = 5;
                break;
            }
            case CELLTYPE.Wall: {
                this.weight = -1000;
                break;
            }
            default: {
                return;
            }
        }
    }
    getDistanceToFood() {
        let queue = [];
        queue.push(this);
        let visited = new Map([[this, 0]]);
        while (queue.length !== 0) {
            let v = queue.shift();
            for (let neighbour of v.cellNeighbours) {
                if (neighbour.type === CELLTYPE.Wall)
                    continue;
                if (neighbour.type === CELLTYPE.Food) {
                    return -(visited.get(v) + 1);
                }
                if (!visited.has(neighbour)) {
                    queue.push(neighbour);
                    visited.set(neighbour, visited.get(v) + 1);
                }
            }
        }
        return -1000;
    }
    draw() {
        switch (this.type) {
            case CELLTYPE.Empty: {
                this._drawRectangle("MediumBlue");
                break;
            }
            case CELLTYPE.Food: {
                this._drawRectangle("MediumBlue");
                this._drawCircle('#cbcbd0');
                break;
            }
            case CELLTYPE.Wall: {
                this._drawRectangle("MediumBlue");
                this._drawImage('src/assets/img/wall.svg', this._cellSize);
                break;
            }
            default: {
                return;
            }
        }
    }
    _drawRectangle(color) {
        this._context.fillStyle = color;
        this._context.fillRect(this.x * this._cellSize, this.y * this._cellSize, this._cellSize, this._cellSize);
    }
    _drawCircle(color) {
        const middleOfCellSize = this._cellSize / 2;
        this._context.beginPath();
        this._context.arc(this.x * this._cellSize + middleOfCellSize, this.y * this._cellSize + middleOfCellSize, middleOfCellSize / 2, 0, 2 * Math.PI, false);
        this._context.fillStyle = color;
        this._context.fill();
        this._context.lineWidth = 1;
        this._context.strokeStyle = color;
        this._context.stroke();
    }
    _drawImage(url, size) {
        let img = new Image();
        img.src = url;
        img.onload = () => {
            this._context.drawImage(img, this.x * this._cellSize, this.y * this._cellSize, size, size);
        };
    }
}