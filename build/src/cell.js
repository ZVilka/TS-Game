export var CELLTYPE;
(function(CELLTYPE) {
    CELLTYPE[CELLTYPE["Empty"] = 0] = "Empty";
    CELLTYPE[CELLTYPE["Food"] = 1] = "Food";
    CELLTYPE[CELLTYPE["Wall"] = 2] = "Wall";
})(CELLTYPE || (CELLTYPE = {}));
export default class Cell {
    constructor(x, y, type, context, game, sizeCell = 20) {
        this.weight = 0;
        this.neighborArray = [];
        this.x = x;
        this.y = y;
        this.type = type;
        this._context = context;
        this._cellSize = sizeCell;
        this._game = game;
    }
    setNeighbors() {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (Math.abs(x) !== Math.abs(y) && !(x === 0 && y === 0))
                    this.neighborArray.push(this._game.cellArray[this.x + x][this.y + y]);
            }
        }
    }
    setWeightForMonsterNeighbor() {
        this.weight = -1;
    }
    setWeightForPacmanNeighbor() {
        switch (this.type) {
            case CELLTYPE.Empty:
                {
                    //this.weight = this.getDistanceToFood();
                    this.weight = -0.1;
                    break;
                }
            case CELLTYPE.Food:
                {
                    this.weight = 1;
                    break;
                }
            case CELLTYPE.Wall:
                {
                    this.weight = -1;
                    break;
                }
            default:
                {
                    return;
                }
        }
    }
    getDistanceToFood() {
        let queue = [];
        queue.push(this);
        let visited = new Map([
            [this, 0]
        ]);
        while (queue.length !== 0) {
            let v = queue.shift();
            for (let neighbor of v.neighborArray) {
                if (neighbor.type === CELLTYPE.Wall)
                    continue;
                if (neighbor.type === CELLTYPE.Food) {
                    return -Math.floor((visited.get(v) + 1) / 10);
                }
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                    visited.set(neighbor, visited.get(v) + 1);
                }
            }
        }
        return -50;
    }
    draw() {
        switch (this.type) {
            case CELLTYPE.Empty:
                {
                    this._drawRectangle("MediumBlue");
                    break;
                }
            case CELLTYPE.Food:
                {
                    this._drawRectangle("MediumBlue");
                    this._drawCircle('#cbcbd0');
                    break;
                }
            case CELLTYPE.Wall:
                {
                    this._drawRectangle("black");
                    this._drawImage('src/assets/img/wall.svg', this._cellSize);
                    break;
                }
            default:
                {
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