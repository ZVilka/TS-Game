import { DIR } from "./pacman.js";
import { CELLTYPE } from "./cell.js";
import { REWARD } from "./game.js";
export var AXIS;
(function (AXIS) {
    AXIS[AXIS["Hor"] = 0] = "Hor";
    AXIS[AXIS["Vert"] = 1] = "Vert";
})(AXIS || (AXIS = {}));
export default class Monster {
    constructor(x, y, context, game, cellSize = 20) {
        this.x = x;
        this.y = y;
        this._context = context;
        this._cellSize = cellSize;
        this._game = game;
        this._isMoving = true;
        this._setImage();
    }
    move() {
        if (this._isMoving) {
            let destinationCell = this.getDestinationCell();
            switch (destinationCell.type) {
                case CELLTYPE.Wall:
                    this._direction = this._getNewDirection();
                    destinationCell = this.getDestinationCell();
                    this.previousCell = this.currentCell;
                    this.previousCell.hasMonster = false;
                    this.currentCell = destinationCell;
                    this.currentCell.hasMonster = true;
                    this._makeAStep();
                    break;
                default:
                    this.previousCell = this.currentCell;
                    this.previousCell.hasMonster = false;
                    this.currentCell = destinationCell;
                    this.currentCell.hasMonster = true;
                    this._makeAStep();
                    break;
            }
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
    initDirection() {
        let isHorAllowed = false;
        let isVertAllowed = false;
        let left = this._game.cellArray[this.x - 1][this.y];
        let right = this._game.cellArray[this.x + 1][this.y];
        let up = this._game.cellArray[this.x][this.y - 1];
        let down = this._game.cellArray[this.x][this.y + 1];
        if (left.type === CELLTYPE.Food || right.type === CELLTYPE.Food || left.type === CELLTYPE.Empty || right.type === CELLTYPE.Empty) {
            isHorAllowed = true;
        }
        else if (up.type === CELLTYPE.Food || down.type === CELLTYPE.Food || up.type === CELLTYPE.Empty || down.type === CELLTYPE.Empty) {
            isVertAllowed = true;
        }
        if (!isHorAllowed && !isVertAllowed) {
            this._isMoving = false;
            return;
        }
        if (isHorAllowed) {
            if (isVertAllowed) {
                this._axis = this._getRandomAxis();
            }
            else {
                this._axis = AXIS.Hor;
            }
        }
        else {
            this._axis = AXIS.Vert;
        }
        this._setDirection();
    }
    _setDirection() {
        if (this._axis === AXIS.Hor) {
            this._direction = DIR.Right;
        }
        else if (this._axis === AXIS.Vert) {
            this._direction = DIR.Up;
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
    _getRandomAxis() {
        let random = this._game.getRandomNumber(0, 1);
        return random ? AXIS.Hor : AXIS.Vert;
    }
    _getNewDirection() {
        switch (this._direction) {
            case DIR.Up:
                return DIR.Down;
                break;
            case DIR.Down:
                return DIR.Up;
                break;
            case DIR.Left:
                return DIR.Right;
                break;
            case DIR.Right:
                return DIR.Left;
                break;
            default:
                break;
        }
    }
    setWeights(reward = REWARD.Monster) {
        this.currentCell.weight = reward;
        let destinationCell = this.getDestinationCell();
        if (destinationCell.type == CELLTYPE.Wall)
            destinationCell = this.getDestinationCell(this._getNewDirection());
        destinationCell.weight = reward;
    }
    resetWeights() {
        this.currentCell.resetWeightDistance();
        for (let neigh of this.currentCell.neighborArray) {
            neigh.resetWeightDistance();
        }
    }
    _setImage() {
        this._image = new Image();
        this._image.width = this._cellSize;
        this._image.height = this._cellSize;
        this._image.src = "src/assets/img/monster.png";
        this._image.onload = function () {
            this.draw();
        }.bind(this);
    }
    draw() {
        this._context.drawImage(this._image, this.x * this._cellSize, this.y * this._cellSize, this._cellSize, this._cellSize);
    }
}
