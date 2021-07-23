import { DIR } from "./pacman.js";
import { CELLTYPE } from "./cell.js";
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
        let lastCellMonster = this._game.cellArray[this.x][this.y];
        let destinationCell = this.getDestinationCell();
        if (this._isMoving) {
            switch (destinationCell.type) {
                case CELLTYPE.Wall:
                    this._changeDirection();
                    destinationCell = this.getDestinationCell();
                    this.occupiedCell = destinationCell;
                    this._makeAStep();
                    break;
                default:
                    this.occupiedCell = destinationCell;
                    this._makeAStep();
                    break;
            }
        }
        return lastCellMonster;
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
    _setImage() {
        this._image = new Image();
        this._image.width = this._cellSize;
        this._image.height = this._cellSize;
        this._image.src = "src/assets/img/monster.svg";
        this._image.onload = function () {
            this.draw();
        }.bind(this);
    }
    initDirection() {
        let isHorAllowed = false;
        let isVertAllowed = false;
        if (this._game.cellArray[this.x - 1][this.y].type === CELLTYPE.Food
            || this._game.cellArray[this.x + 1][this.y].type === CELLTYPE.Food) {
            isHorAllowed = true;
        }
        else if (this._game.cellArray[this.x][this.y + 1].type === CELLTYPE.Food
            || this._game.cellArray[this.x][this.y - 1].type === CELLTYPE.Food) {
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
    getDestinationCell() {
        let newX = this.x;
        let newY = this.y;
        switch (this._direction) {
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
    _changeDirection() {
        switch (this._direction) {
            case DIR.Up:
                this._direction = DIR.Down;
                break;
            case DIR.Down:
                this._direction = DIR.Up;
                break;
            case DIR.Left:
                this._direction = DIR.Right;
                break;
            case DIR.Right:
                this._direction = DIR.Left;
                break;
            default:
                break;
        }
    }
    draw(x = this.x, y = this.y) {
        this._context.drawImage(this._image, x * this._cellSize, y * this._cellSize, this._cellSize, this._cellSize);
    }
}
