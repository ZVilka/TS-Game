import { DIR } from "./pacman.js";
import { CELLTYPE } from "./cell.js";
export var AXIS;
(function (AXIS) {
    AXIS[AXIS["Hor"] = 0] = "Hor";
    AXIS[AXIS["Vert"] = 1] = "Vert";
})(AXIS || (AXIS = {}));
export default class Monster {
    constructor(x, y, axisNum, context, game, cellSize) {
        this.x = x;
        this.y = y;
        this.setAxis(axisNum);
        this.context = context;
        this.cellSize = cellSize;
        this.game = game;
        this.isMoving = true;
        this.setImage();
        this.initDirection();
    }
    setAxis(axisNum) {
        switch (axisNum) {
            case 0:
                this.axis = AXIS.Hor;
                break;
            case 1:
                this.axis = AXIS.Vert;
                break;
            default:
                break;
        }
    }
    move() {
        this.checkDirection();
        if (this.isMoving) {
            this.clear();
            switch (this.direction) {
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
            this.draw();
        }
    }
    setImage() {
        this.image = new Image();
        this.image.width = this.cellSize;
        this.image.height = this.cellSize;
        this.image.src = "src/assets/img/monster.svg";
        this.image.onload = function () {
            this.draw();
        }.bind(this);
    }
    initDirection() {
        if (this.axis === AXIS.Hor) {
            this.direction = DIR.Left;
        }
        else if (this.axis === AXIS.Vert) {
            this.direction = DIR.Up;
        }
    }
    checkDirection() {
        if (this.axis === AXIS.Hor) {
            this.checkHorDirection();
        }
        else if (this.axis === AXIS.Vert) {
            this.checkVerDirection();
        }
    }
    checkHorDirection() {
        if (this.game.cellArray[this.y][this.x - 1].type === CELLTYPE.Wall
            && this.game.cellArray[this.y][this.x + 1].type === CELLTYPE.Wall) {
            this.isMoving = false;
            return;
        }
        if (this.x + 1 == this.game.cellArray[0].length
            || this.x - 1 < 0
            || this.direction === DIR.Left
                && this.game.cellArray[this.y][this.x - 1].type === CELLTYPE.Wall
            || this.direction === DIR.Right
                && this.game.cellArray[this.y][this.x + 1].type === CELLTYPE.Wall) {
            this.changeDirection();
        }
    }
    checkVerDirection() {
        if (this.game.cellArray[this.y - 1][this.x].type === CELLTYPE.Wall
            && this.game.cellArray[this.y + 1][this.x].type === CELLTYPE.Wall) {
            this.isMoving = false;
            return;
        }
        if (this.y + 1 == this.game.cellArray.length
            || this.y - 1 < 0
            || this.direction === DIR.Up
                && this.game.cellArray[this.y - 1][this.x].type === CELLTYPE.Wall
            || this.direction === DIR.Down
                && this.game.cellArray[this.y + 1][this.x].type === CELLTYPE.Wall) {
            this.changeDirection();
        }
    }
    changeDirection() {
        switch (this.direction) {
            case DIR.Up:
                this.direction = DIR.Down;
                break;
            case DIR.Down:
                this.direction = DIR.Up;
                break;
            case DIR.Left:
                this.direction = DIR.Right;
                break;
            case DIR.Right:
                this.direction = DIR.Left;
                break;
            default:
                break;
        }
    }
    draw(x = this.x, y = this.y) {
        this.context.drawImage(this.image, x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
    clear(x = this.x, y = this.y) {
        this.context.fillStyle = "white";
        this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
}
