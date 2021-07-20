import { DIR } from "./pacman.js";
import { CELLTYPE } from "./cell.js";
export var AXIS;
(function (AXIS) {
    AXIS[AXIS["Hor"] = 0] = "Hor";
    AXIS[AXIS["Vert"] = 1] = "Vert";
})(AXIS || (AXIS = {}));
export default class Monster {
    constructor(x, y, context, game, cellSize) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.cellSize = cellSize;
        this.game = game;
        this.isMoving = true;
        this.setImage();
    }
    move() {
        let lastCellMonster = this.game.cellArray[this.x][this.y];
        let destinationCell = this.getDestinationCell();
        if (this.isMoving) {
            switch (destinationCell.type) {
                case CELLTYPE.Wall:
                    this.changeDirection();
                    break;
                default:
                    this.makeAStep();
                    break;
            }
        }
        return lastCellMonster;
    }
    makeAStep() {
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
        let isHorAllowed = false;
        let isVertAllowed = false;
        if (this.game.cellArray[this.x - 1][this.y].type === CELLTYPE.Food
            || this.game.cellArray[this.x + 1][this.y].type === CELLTYPE.Food) {
            isHorAllowed = true;
        }
        else if (this.game.cellArray[this.x][this.y + 1].type === CELLTYPE.Food
            || this.game.cellArray[this.x][this.y - 1].type === CELLTYPE.Food) {
            isVertAllowed = true;
        }
        if (!isHorAllowed && !isVertAllowed) {
            this.isMoving = false;
            return;
        }
        if (isHorAllowed) {
            if (isVertAllowed) {
                this.axis = this.getRandomAxis();
            }
            else {
                this.axis = AXIS.Hor;
            }
        }
        else {
            this.axis = AXIS.Vert;
        }
        this.setDirection();
    }
    setDirection() {
        if (this.axis === AXIS.Hor) {
            this.direction = DIR.Right;
        }
        else if (this.axis === AXIS.Vert) {
            this.direction = DIR.Up;
        }
    }
    getDestinationCell() {
        let newX = this.x;
        let newY = this.y;
        switch (this.direction) {
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
        return this.game.cellArray[newX][newY];
    }
    getRandomAxis() {
        let random = this.game.getRandomNumber(0, 1);
        return random ? AXIS.Hor : AXIS.Vert;
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
}
