import Cell from "./cell.js";
import Game from "./game.js";
import { DIR } from "./pacman.js";

export default abstract class Agent {
    public x: number;
    public y: number;

    protected _direction: DIR;

    public currentCell: Cell;
    public previousCell: Cell;

    protected readonly _cellSize: number;
    protected readonly _game: Game;

    protected defaultSources: HTMLImageElement[];

    protected _context: CanvasRenderingContext2D;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, game: Game, size: number = 20) {
        this.x = x;
        this.y = y;
        this._context = ctx;
        this._game = game;
        this._cellSize = size;
    }

    abstract move(): void;

    public abstract setWeights(): void;

    public resetWeights(): void {
        this.currentCell.resetWeightDistance();
        for (let neigh of this.currentCell.neighborArray) {
            neigh.resetWeightDistance();
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

    public _changeCoordinates() :void {
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

    protected abstract _makeAStep(destinationCell: Cell): void;

    protected abstract _setImages(): void;

    public abstract draw(): void;
}