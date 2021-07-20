import IAgent from "./IAgent.js";
import {DIR} from "./pacman.js";
import Cell, {CELLTYPE} from "./cell.js";
import Game from "./game.js";

export enum AXIS {
    Hor,
    Vert
}

export default class Monster implements IAgent {
    x: number;
    y: number;
    axis: AXIS;
    direction: DIR;
    game: Game;
    isMoving: boolean;

    image: HTMLImageElement;
    context: CanvasRenderingContext2D;
    cellSize: number;

    constructor(x: number, y: number, axisNum: number,
                context: CanvasRenderingContext2D,
                game: Game,
                cellSize:number) {
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

    protected setAxis(axisNum: number) {
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

    public move(): void {
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

    protected setImage() :void {
        this.image = new Image();
        this.image.width = this.cellSize;
        this.image.height = this.cellSize;
        this.image.src = "images/monster.svg";
        this.image.onload = function(this : Monster) {
            this.draw();
        }.bind(this);
    }

    protected initDirection() :void {
        if (this.axis === AXIS.Hor) {
            this.direction = DIR.Left;
        } else if (this.axis === AXIS.Vert) {
            this.direction = DIR.Up;
        }
    }

    protected checkDirection() :void {
        if (this.axis === AXIS.Hor) {
            this.checkHorDirection();
        } else if (this.axis === AXIS.Vert) {
            this.checkVerDirection();
        }
    }

    protected checkHorDirection() : void {

        if (this.game.cellArray[this.y][this.x - 1].type === CELLTYPE.Wall
        && this.game.cellArray[this.y][this.x + 1].type === CELLTYPE.Wall) {
            this.isMoving = false;
            return;
        }

        if (this.x + 1 == this.game.cellArray[0].length
            || this.x - 1 < 0
            ||this.direction === DIR.Left
            && this.game.cellArray[this.y][this.x - 1].type === CELLTYPE.Wall
            ||this.direction === DIR.Right
            && this.game.cellArray[this.y][this.x + 1].type === CELLTYPE.Wall) {
            this.changeDirection();
        }
    }

    protected checkVerDirection() : void {
        if (this.game.cellArray[this.y - 1][this.x].type === CELLTYPE.Wall
            && this.game.cellArray[this.y + 1][this.x].type === CELLTYPE.Wall) {
            this.isMoving = false;
            return;
        }

        if (this.y + 1 == this.game.cellArray.length
            || this.y - 1 < 0
            ||this.direction === DIR.Up
            && this.game.cellArray[this.y - 1][this.x].type === CELLTYPE.Wall
            ||this.direction === DIR.Down
            && this.game.cellArray[this.y + 1][this.x].type === CELLTYPE.Wall) {
            this.changeDirection();
        }
    }

    protected changeDirection() :void {
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

    public draw(x:number = this.x, y:number = this.y): void {
        this.context.drawImage(this.image,
            x * this.cellSize, y * this.cellSize,
            this.cellSize, this.cellSize);
    }

    public clear(x:number = this.x, y:number = this.y) : void {
        this.context.fillStyle = "white";
        this.context.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize, this.cellSize);
    }
}