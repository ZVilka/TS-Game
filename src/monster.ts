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

    constructor(x: number, y: number,
                context: CanvasRenderingContext2D,
                game: Game,
                cellSize:number) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.cellSize = cellSize;
        this.game = game;
        this.isMoving = true;

        this.setImage();
    }

    public move(): Cell {
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

    protected makeAStep() :void {
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

    protected setImage() :void {
        this.image = new Image();
        this.image.width = this.cellSize;
        this.image.height = this.cellSize;
        this.image.src = "src/assets/img/monster.svg";
        this.image.onload = function(this : Monster) {
            this.draw();
        }.bind(this);
    }

    public initDirection() :void {
        let isHorAllowed : boolean = false;
        let isVertAllowed : boolean = false;

        if (this.game.cellArray[this.x - 1][this.y].type === CELLTYPE.Food
        || this.game.cellArray[this.x + 1][this.y].type === CELLTYPE.Food) {
            isHorAllowed = true;
        } else if (this.game.cellArray[this.x][this.y + 1].type === CELLTYPE.Food
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
            } else {
                this.axis = AXIS.Hor;
            }
        } else {
            this.axis = AXIS.Vert;
        }

        this.setDirection();
    }

    protected setDirection() : void {
        if (this.axis === AXIS.Hor) {
            this.direction = DIR.Right;
        } else if (this.axis === AXIS.Vert) {
            this.direction = DIR.Up;
        }
    }

    public getDestinationCell(): Cell {
        let newX = this.x;
        let newY = this.y;

        switch(this.direction) {
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

    protected getRandomAxis() : AXIS {
        let random = this.game.getRandomNumber(0, 1);
        return random ? AXIS.Hor : AXIS.Vert;
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
}