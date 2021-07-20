import { CELLTYPE } from "./cell.js";
export var DIR;
(function (DIR) {
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
        this._ctx = ctx;
        this._size = size;
        this._game = game;
        this._image = new Image();
        this._image.src = "src/assets/img/pacman.png";
        this._image.onload = function () {
            this.draw();
        }.bind(this);
    }
    set direction(value) {
        let destinationCell = this.getDestinationCell(value);
        if (destinationCell.type !== CELLTYPE.Wall) {
            this._direction = value;
            this.setRotation();
        }
    }
    move() {
        let prevCell = this._game.cellArray[this.x][this.y];
        let destinationCell = this.getDestinationCell(this._direction);
        switch (destinationCell.type) {
            case CELLTYPE.Wall:
                break;
            case CELLTYPE.Food:
                this.makeAStep();
                this.eatFood(destinationCell);
                break;
            default:
                this.makeAStep();
                break;
        }
        return prevCell;
    }
    makeAStep() {
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
    getDestinationCell(direction) {
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
        let centerX = this.x * this._size + this._size / 2;
        let centerY = this.y * this._size + this._size / 2;
        let radRotation = this._rotation * Math.PI / 180;
        this._ctx.translate(centerX, centerY);
        this._ctx.rotate(radRotation);
        this._ctx.drawImage(this._image, (-this._size / 2), (-this._size / 2), this._size, this._size);
        this._ctx.rotate(-radRotation);
        this._ctx.translate(-centerX, -centerY);
    }
    setRotation() {
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
