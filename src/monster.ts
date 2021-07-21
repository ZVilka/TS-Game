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
    private _axis: AXIS;
    private _direction: DIR;
    private _game: Game;
    private _isMoving: boolean;

    private _image: HTMLImageElement;
    private _context: CanvasRenderingContext2D;
    private readonly _cellSize: number;

    constructor(x: number, y: number,
                context: CanvasRenderingContext2D,
                game: Game,
                cellSize:number = 20) {
        this.x = x;
        this.y = y;
        this._context = context;
        this._cellSize = cellSize;
        this._game = game;
        this._isMoving = true;

        this._setImage();
    }

    public move(): Cell {
        let lastCellMonster = this._game.cellArray[this.x][this.y];

        let destinationCell = this.getDestinationCell();

        if (this._isMoving) {

            switch (destinationCell.type) {
                case CELLTYPE.Wall:
                    this._changeDirection();
                    break;
                default:
                    this._makeAStep();
                    break;
            }
        }
        return lastCellMonster;
    }

    protected _makeAStep() :void {
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

    protected _setImage() :void {
        this._image = new Image();
        this._image.width = this._cellSize;
        this._image.height = this._cellSize;
        this._image.src = "src/assets/img/monster.svg";
        this._image.onload = function(this : Monster) {
            this.draw();
        }.bind(this);
    }

    public initDirection() :void {
        let isHorAllowed : boolean = false;
        let isVertAllowed : boolean = false;

        if (this._game.cellArray[this.x - 1][this.y].type === CELLTYPE.Food
        || this._game.cellArray[this.x + 1][this.y].type === CELLTYPE.Food) {
            isHorAllowed = true;
        } else if (this._game.cellArray[this.x][this.y + 1].type === CELLTYPE.Food
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
            } else {
                this._axis = AXIS.Hor;
            }
        } else {
            this._axis = AXIS.Vert;
        }

        this._setDirection();
    }

    protected _setDirection() : void {
        if (this._axis === AXIS.Hor) {
            this._direction = DIR.Right;
        } else if (this._axis === AXIS.Vert) {
            this._direction = DIR.Up;
        }
    }

    public getDestinationCell(): Cell {
        let newX = this.x;
        let newY = this.y;

        switch(this._direction) {
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

    protected _getRandomAxis() : AXIS {
        let random = this._game.getRandomNumber(0, 1);
        return random ? AXIS.Hor : AXIS.Vert;
    }

    protected _changeDirection() :void {
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

    public draw(x:number = this.x, y:number = this.y): void {
        this._context.drawImage(this._image,
            x * this._cellSize, y * this._cellSize,
            this._cellSize, this._cellSize);
    }
}
