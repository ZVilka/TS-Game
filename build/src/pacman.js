import { CELLTYPE } from "./cell.js";
export var DIR;
(function(DIR) {
    DIR[DIR["Up"] = 0] = "Up";
    DIR[DIR["Down"] = 1] = "Down";
    DIR[DIR["Left"] = 2] = "Left";
    DIR[DIR["Right"] = 3] = "Right";
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
        this._image = new Image();
        this._image.src = "src/assets/img/pacman.png";
        this._image.onload = function() {
            this.draw();
        }.bind(this);
    }
    updateDirection() {
        let destinationCell = this.getDestinationCell(this._nextDir);
        // if (destinationCell.type !== CELLTYPE.Wall) {
        //     this._direction = this._nextDir;
        //     this._setRotation();
        // }
        this._direction = this._nextDir;
        this._setRotation();
        this._nextDir = this._direction;
    }
    setNextDirection(dir) {
        this._nextDir = dir;
    }
    move() {
        let prevCell = this._game.cellArray[this.x][this.y];
        let destinationCell = this.getDestinationCell(this._direction);
        switch (destinationCell.type) {
            case CELLTYPE.Wall:
                break;
            case CELLTYPE.Food:
                this._makeAStep();
                this.eatFood(destinationCell);
                break;
            default:
                this._makeAStep();
                break;
        }
        return prevCell;
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
    draw() {
        let centerX = this.x * this._cellSize + this._cellSize / 2;
        let centerY = this.y * this._cellSize + this._cellSize / 2;
        let radRotation = this._rotation * Math.PI / 180;
        this._context.translate(centerX, centerY);
        this._context.rotate(radRotation);
        this._context.drawImage(this._image, (-this._cellSize / 2), (-this._cellSize / 2), this._cellSize, this._cellSize);
        this._context.rotate(-radRotation);
        this._context.translate(-centerX, -centerY);
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
        this._game.remainingFood--;
        cell.type = CELLTYPE.Empty;
    }
}