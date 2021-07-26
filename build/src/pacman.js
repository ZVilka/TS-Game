import Agent from "./Agent.js";
import { REWARD } from "./game.js";
import { CELLTYPE } from "./cell.js";
export var DIR;
(function (DIR) {
    DIR[DIR["Up"] = 0] = "Up";
    DIR[DIR["Right"] = 1] = "Right";
    DIR[DIR["Down"] = 2] = "Down";
    DIR[DIR["Left"] = 3] = "Left";
})(DIR || (DIR = {}));
export default class Pacman extends Agent {
    constructor(x, y, dir, ctx, game, size = 20) {
        super(x, y, ctx, game, size);
        this.isSuper = false;
        this.superMovesLeft = 0;
        this._rotation = 0;
        this.movesPerSuperfood = 20;
        this._direction = dir;
        this._nextDir = dir;
        this.defaultSource = "src/assets/img/pacman.png";
        this.superSource = "src/assets/img/pacman-super.png";
        this._setImage(this.defaultSource);
    }
    updateDirection() {
        let destinationCell = this.getDestinationCell(this._nextDir);
        if (destinationCell.type !== CELLTYPE.Wall) {
            this._direction = this._nextDir;
            this._setRotation();
        }
        this._nextDir = this._direction;
    }
    setNextDirection(dir) {
        this._nextDir = dir;
    }
    // Установить веса соседних клеток, если клетка пустая - то высчитать дистанцию до ближайшей еды
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
                        neigh.setDistanceToFood(this.currentCell);
                        cellsToRank.push(neigh);
                        break;
                    default:
                        break;
                }
            }
        }
        // Отсортировать соседние клетки по возрастанию дистанции до еды, и поставить им ранг. Ближайшая до еды клетка получит ранг 0, и т.д.
        let compareCellsByDistance = function (cell1, cell2) {
            if (cell1.distanceToFood > cell2.distanceToFood)
                return 1;
            if (cell1.distanceToFood === cell2.distanceToFood)
                return 0;
            if (cell1.distanceToFood < cell2.distanceToFood)
                return -1;
        };
        cellsToRank.sort(compareCellsByDistance);
        // Вес = rank * -1 - 1. Ближайшая клетка будет равна -1, вторая -2 и т.д.
        for (let cell of cellsToRank) {
            cell.weight = -cellsToRank.indexOf(cell) - 1;
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
        let destinationCell = this.getDestinationCell(this._direction);
        switch (destinationCell.type) {
            case CELLTYPE.Wall:
                break;
            case CELLTYPE.Food:
            case CELLTYPE.SuperFood:
                this._makeAStep(destinationCell);
                this.eatFood(destinationCell);
                break;
            default:
                this._makeAStep(destinationCell);
                break;
        }
    }
    _makeAStep(destinationCell) {
        this.previousCell = this.currentCell;
        this.currentCell = destinationCell;
        this._changeCoordinates();
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
            this.makeSuper();
            this.updateSuperMoveCount(this.movesPerSuperfood);
        }
        this._game.totalFoodEaten++;
        this._game.updateMoveCount(1);
        this._game.remainingFood--;
        cell.type = CELLTYPE.Empty;
    }
    updateSuperMoveCount(incr) {
        this.superMovesLeft += incr;
    }
    makeSuper() {
        this.isSuper = true;
        this._image.src = this.superSource;
    }
    stopSuper() {
        this.isSuper = false;
        this._image.src = this.defaultSource;
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
