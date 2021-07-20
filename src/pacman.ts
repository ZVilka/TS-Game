import IAgent from "./IAgent.js";
import Game from "./game.js";
import Cell, {CELLTYPE} from "./cell.js";

export enum DIR {
    Up,
    Down,
    Left,
    Right
}

export default class Pacman implements IAgent {
    set direction(value: DIR) {
        let destinationCell = this.getDestinationCell(value);
        if (destinationCell.type !== CELLTYPE.Wall) {
            this._direction = value;
            this.setRotation();
        }
    }
    x: number;
    y: number;

    private _rotation: number = 0;

    private _direction: DIR;
    private readonly _image: HTMLImageElement;
    private _ctx: CanvasRenderingContext2D;
    private readonly _size: number;
    private readonly _game: Game;
    constructor(x: number, y: number, dir: DIR, ctx: CanvasRenderingContext2D, game: Game, size: number = 20) {
        this.x = x;
        this.y = y;
        this._direction = dir;
        this._ctx = ctx;
        this._size = size;
        this._game = game;
        this._image = new Image();
        this._image.src = "src/assets/img/pacman.png";
        this._image.onload = function (this : Pacman) {
            this.draw();
        }.bind(this);
    }

    public move(): Cell {
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

    protected makeAStep() :void {
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

    public getDestinationCell(direction:DIR): Cell {
        let newX = this.x;
        let newY = this.y;

        switch(direction) {
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

    public draw(): void {
        let centerX = this.x * this._size + this._size/2;
        let centerY = this.y * this._size + this._size/2;

        let radRotation = this._rotation * Math.PI/180
        this._ctx.translate(centerX, centerY);
        this._ctx.rotate(radRotation);

        this._ctx.drawImage(this._image, (-this._size/2), (-this._size/2), this._size, this._size);

        this._ctx.rotate(-radRotation);
        this._ctx.translate(-centerX, -centerY);
    }

    protected setRotation() :void {
        switch(this._direction) {
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

    public eatFood(cell: Cell): void {
        this._game.remainingFood--;
        cell.type = CELLTYPE.Empty;
    }
}
