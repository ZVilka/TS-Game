import { REWARD } from "./game.js";
import { CELLTYPE } from "./cell.js";
export var DIR;
(function (DIR) {
    DIR[DIR["Up"] = 0] = "Up";
    DIR[DIR["Right"] = 1] = "Right";
    DIR[DIR["Down"] = 2] = "Down";
    DIR[DIR["Left"] = 3] = "Left";
})(DIR || (DIR = {}));
export default class Pacman {
    constructor(x, y, dir, ctx, game, size = 20) {
        this._rotation = 0;
        this.x = x;
        this.y = y;
        this._direction = dir;
        this._nextDir = dir;
        this._context = ctx;
        this._cellSize = size;
        this._game = game;
        // this._image = new Image();
        // this._image.src = "src/assets/img/pacman.png";
        // this._image.onload = function (this : Pacman) {
        //     this.draw();
        // }.bind(this);
        this._setImage();
    }
    updateDirection() {
        let destinationCell = this.getDestinationCell(this._nextDir);
        if (destinationCell.type !== CELLTYPE.Wall) {
            this._direction = this._nextDir;
            this._setRotation();
        }
        // this._direction = this._nextDir;
        // this._setRotation();
        this._nextDir = this._direction;
    }
    setNextDirection(dir) {
        this._nextDir = dir;
    }
    setWeights() {
        let cellsToRank = [];
        for (let neigh of this.currentCell.neighborArray) {
            if (neigh.weight == 0) {
                switch (neigh.type) {
                    case CELLTYPE.Food:
                        neigh.weight = REWARD.Food;
                        break;
                    case CELLTYPE.SuperFood:
                        neigh.weight = REWARD.Food;
                        break;
                    case CELLTYPE.Wall:
                        neigh.weight = REWARD.Wall;
                        break;
                    case CELLTYPE.Empty:
                        neigh.setDistanceToFood();
                        cellsToRank.push(neigh);
                        break;
                    default:
                        break;
                }
            }
        }
        let compareCellsByDistance = function (cell1, cell2) {
            if (cell1.distanceToFood > cell2.distanceToFood)
                return 1;
            if (cell1.distanceToFood === cell2.distanceToFood)
                return 0;
            if (cell1.distanceToFood < cell2.distanceToFood)
                return -1;
        };
        cellsToRank.sort(compareCellsByDistance);
        for (let cell of cellsToRank) {
            cell.weight = -cellsToRank.indexOf(cell) - 1;
        }
    }
    resetWeights() {
        for (let neigh of this.currentCell.neighborArray) {
            neigh.resetWeightDistance();
        }
    }
    getLegalActions() {
        let res = [];
        for (let i = 0; i < 4; i++) {
            let neigh = this._game.cellArray[this.x][this.y].neighborArray[i];
            if (neigh.type != CELLTYPE.Wall) {
                res.push(i);
            }
        }
        return res;
    }
    move() {
        let prevCell = this.currentCell;
        let destinationCell = this.getDestinationCell(this._direction);
        console.log(destinationCell.type);
        switch (destinationCell.type) {
            case CELLTYPE.Wall:
                break;
            case CELLTYPE.Food:
                this.previousCell = this.currentCell;
                this.currentCell = destinationCell;
                this._makeAStep();
                this.eatFood(destinationCell);
                break;
            case CELLTYPE.SuperFood:
                this.previousCell = this.currentCell;
                this.currentCell = destinationCell;
                this._makeAStep();
                this.eatFood(destinationCell);
                break;
            default:
                this.previousCell = this.currentCell;
                this.currentCell = destinationCell;
                this._makeAStep();
                break;
        }
    }
    _makeAStep() {
        switch (this._direction) {
            case DIR.Up:
                this.y--;
                break;
            case DIR.Down:
                this.y++;
                break;
            case DIR.Left:
                this.x--;
                break;
            case DIR.Right:
                this.x++;
                break;
            default:
                break;
        }
    }
    getDestinationCell(direction = this._direction) {
        let newX = this.x;
        let newY = this.y;
        switch (direction) {
            case DIR.Up:
                newY--;
                break;
            case DIR.Down:
                newY++;
                break;
            case DIR.Left:
                newX--;
                break;
            case DIR.Right:
                newX++;
                break;
            default:
                throw "Invalid direction!";
        }
        return this._game.cellArray[newX][newY];
    }
    _setRotation() {
        switch (this._direction) {
            case DIR.Up:
                this._rotation = 0;
                break;
            case DIR.Right:
                this._rotation = 90;
                break;
            case DIR.Down:
                this._rotation = 180;
                break;
            case DIR.Left:
                this._rotation = 270;
                break;
            default:
                throw "Invalid direction!";
        }
    }
    eatFood(cell) {
        if (cell.type == CELLTYPE.SuperFood) {
            this._game.isSuper = true;
            this._game.superMovesLeft += 20;
        }
        this._game.totalFoodEaten++;
        this._game.increaseMoveCount();
        this._game.remainingFood--;
        cell.type = CELLTYPE.Empty;
    }
    _setImage() {
        this._image = new Image();
        this._image.width = this._cellSize;
        this._image.height = this._cellSize;
        this._image.src = "src/assets/img/pacman.png";
        this._image.onload = function () {
            this.draw();
        }.bind(this);
    }
    draw() {
        let centerX = this.x * this._cellSize + this._cellSize / 2;
        let centerY = this.y * this._cellSize + this._cellSize / 2;
        let radRotation = this._rotation * Math.PI / 180;
        this._context.translate(centerX, centerY);
        this._context.rotate(radRotation);
        this._context.drawImage(this._image, -this._cellSize / 2, -this._cellSize / 2, this._cellSize, this._cellSize);
        this._context.rotate(-radRotation);
        this._context.translate(-centerX, -centerY);
    }
}
