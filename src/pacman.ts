import IAgent from "./IAgent.js";
import Game from "./game";
import Cell, {CELLTYPE} from "./cell";

export enum DIR {
    Up,
    Down,
    Left,
    Right
}

export default class Pacman implements IAgent {
    set direction(value: DIR) {
        this._direction = value;
    }
    x: number;
    y: number;

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
        this._image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pacman.svg/813px-Pacman.svg.png";
    }

    public move(): Cell {
        let cell = this._game.cellArray[this.x][this.y];
        switch (this._direction){
            case DIR.Up:
                if(this._game.cellArray[this.x][this.y+1].type !== CELLTYPE.Wall)
                    if(this._game.cellArray[this.x][this.y+1].type === CELLTYPE.Food)
                        this.eatFood(this.x, this.y+1);
                    this.y += 1;
                break;
            case DIR.Down:
                if(this._game.cellArray[this.x][this.y-1].type !== CELLTYPE.Wall)
                    if(this._game.cellArray[this.x][this.y-1].type === CELLTYPE.Food)
                        this.eatFood(this.x, this.y-1);
                    this.y -= 1;
                break;
            case DIR.Left:
                if(this._game.cellArray[this.x-1][this.y].type !== CELLTYPE.Wall)
                    if(this._game.cellArray[this.x-1][this.y].type === CELLTYPE.Food)
                        this.eatFood(this.x-1, this.y);
                    this.x -= 1;
                break;
            case DIR.Right:
                if(this._game.cellArray[this.x+1][this.y].type !== CELLTYPE.Wall)
                    if(this._game.cellArray[this.x+1][this.y].type === CELLTYPE.Food)
                        this.eatFood(this.x+1, this.y);
                    this.x += 1;
            default:
                break;
        }

        return cell;
    }

    public draw(): void {
        this._ctx.drawImage(this._image, this.x*this._size, this.y*this._size, this._size, this._size);
    }

    public eatFood(x: number, y: number): void {
        this._game.cellArray[x][y].type = CELLTYPE.Empty;
    }
}
