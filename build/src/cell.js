export var CELLTYPE;
(function(CELLTYPE) {
    CELLTYPE[CELLTYPE["Empty"] = 0] = "Empty";
    CELLTYPE[CELLTYPE["Food"] = 1] = "Food";
    CELLTYPE[CELLTYPE["Wall"] = 2] = "Wall";
})(CELLTYPE || (CELLTYPE = {}));
export default class Cell {
    constructor(x, y, type, context, game, sizeCell = 20) {
        this.weight = 0;
        this.distanceToFood = 1000;
        this.hasMonster = false;
        this.neighborArray = [];
        this.x = x;
        this.y = y;
        this.type = type;
        this._context = context;
        this._cellSize = sizeCell;
        this._game = game;
        this._setImage();
    }
    setNeighbors() {
        // for (let x=-1; x <=1; x++) {
        //     for (let y=-1; y<=1; y++) {
        //         if (Math.abs(x) !== Math.abs(y) && !( x=== 0 && y === 0))
        //             this.neighborArray.push(this._game.cellArray[this.x + x][this.y + y]);
        //     }
        // }
        let up = this._game.cellArray[this.x][this.y - 1];
        let right = this._game.cellArray[this.x + 1][this.y];
        let down = this._game.cellArray[this.x][this.y + 1];
        let left = this._game.cellArray[this.x - 1][this.y];
        this.neighborArray.push(up, right, down, left);
    }
    resetWeightDistance() {
        this.weight = 0;
        this.distanceToFood = 1000;
    }
    setDistanceToFood() {
        this.distanceToFood = this.getDistanceToFood();
    }
    getDistanceToFood(excludedCell = undefined, visited = undefined) {
        let queue = [this];
        if (visited == undefined)
            visited = new Map([
                [this, 0]
            ]);
        let result = 1000;
        while (queue.length !== 0) {
            let v = queue.shift();
            for (let neighbor of v.neighborArray) {
                if (neighbor.type === CELLTYPE.Wall || neighbor == excludedCell)
                    continue;
                if (neighbor.hasMonster) {
                    let firstPart = visited.get(v) + 1;
                    let secondPart = this.getDistanceToFood(neighbor, visited);
                    result = firstPart + secondPart;
                    continue;
                }
                if (neighbor.type === CELLTYPE.Food) {
                    return visited.get(v) + 1;
                }
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                    visited.set(neighbor, visited.get(v) + 1);
                }
            }
        }
        return result;
    }
    _setImage() {
        this._image = new Image();
        this._image.width = this._cellSize;
        this._image.height = this._cellSize;
        if (this.type == CELLTYPE.Wall)
            this._image.src = "src/assets/img/wall.png";
        this._image.onload = function() {
            this.draw();
        }.bind(this);
    }
    draw() {
        switch (this.type) {
            case CELLTYPE.Empty:
                {
                    this._drawRectangle("black");
                    // this._drawText(this.weight.toString(), "purple");
                    break;
                }
            case CELLTYPE.Food:
                {
                    this._drawRectangle("black");
                    this._drawCircle('#cbcbd0');
                    // this._drawText(this.weight.toString(), "purple");
                    break;
                }
            case CELLTYPE.Wall:
                {
                    this._drawRectangle("MediumBlue");
                    this._drawImage();
                    // this._drawText(this.weight.toString(), "purple");
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
    _drawImage() {
        this._context.drawImage(this._image, this.x * this._cellSize, this.y * this._cellSize, this._cellSize, this._cellSize);
        this.context.drawImage()
    }
    _drawText(text, color) {
        this._context.fillStyle = color;
        this._context.fillText(text, this.x * this._cellSize + 5, this.y * this._cellSize + 8);
    }
}