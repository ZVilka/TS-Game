import IAgent from "./IAgent.js";
import Game from "./game.js";
import Cell, {CELLTYPE} from "./cell.js";
import { runInThisContext } from "vm";

export enum DIR {
    Up,
    Right,
    Down,
    Left
}

export default class Pacman implements IAgent {
    x: number;
    y: number;

    private _rotation: number = 0;

    private _direction: DIR;
    private _nextDir: DIR;
    private readonly _image: HTMLImageElement;
    private _context: CanvasRenderingContext2D;
    private readonly _cellSize: number;
    private readonly _game: Game;
    public occupiedCell: Cell;
    constructor(x: number, y: number, dir: DIR, ctx: CanvasRenderingContext2D, game: Game, size: number = 20) {
        this.x = x;
        this.y = y;
        this._direction = dir;
        this._nextDir = dir;
        this._context = ctx;
        this._cellSize = size;
        this._game = game;
        this._image = new Image();
        this._image.src = "src/assets/img/pacman.png";
        this._image.onload = function (this : Pacman) {
            this.draw();
        }.bind(this);
    }

    public updateDirection() :void {
        let destinationCell = this.getDestinationCell(this._nextDir);
        // if (destinationCell.type !== CELLTYPE.Wall) {
        //     this._direction = this._nextDir;
        //     this._setRotation();
        // }
        this._direction = this._nextDir;
        this._setRotation();

        this._nextDir = this._direction;
    }

    public setNextDirection(dir:DIR) :void {
        this._nextDir = dir;
    }

    public getLegalActions(): DIR[] {
        let res = [];
        for (let i = 0; i < 4; i++) {
            let neigh = this._game.cellArray[this.x][this.y].neighborArray[i];
            if (neigh.type != CELLTYPE.Wall) {
                res.push(i);
            }
        }
        return res;
    }

    public move(): Cell {
        let prevCell = this._game.cellArray[this.x][this.y];
        let destinationCell = this.getDestinationCell(this._direction);

        switch (destinationCell.type) {
            case CELLTYPE.Wall:
                break;
            case CELLTYPE.Food:
                this.occupiedCell = destinationCell;
                this._makeAStep();
                this.eatFood(destinationCell);
                break;
            default:
                this.occupiedCell = destinationCell;
                this._makeAStep();
                break;
        }
        return prevCell;
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

    public getDestinationCell(direction:DIR = this._direction): Cell {
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
        let centerX = this.x * this._cellSize + this._cellSize/2;
        let centerY = this.y * this._cellSize + this._cellSize/2;

        let radRotation = this._rotation * Math.PI/180
        this._context.translate(centerX, centerY);
        this._context.rotate(radRotation);

        this._context.drawImage(this._image, (-this._cellSize/2), (-this._cellSize/2), this._cellSize, this._cellSize);

        this._context.rotate(-radRotation);
        this._context.translate(-centerX, -centerY);
    }

    protected _setRotation() :void {
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
