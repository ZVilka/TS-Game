import IAgent from "./IAgent.js";

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
    private _image: HTMLImageElement;
    private _ctx: CanvasRenderingContext2D;
    constructor(x: number, y: number, dir: DIR, ctx: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this._direction = dir;
        this._ctx = ctx;
        this._image = new Image();
        this._image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pacman.svg/813px-Pacman.svg.png";
    }

    public move(): void {
        switch (this._direction){
            case DIR.Up:
                this.y += 1;
                break;
            case DIR.Down:
                this.y -= 1;
                break;
            case DIR.Left:
                this.x -= 1;
                break;
            case DIR.Right:
                this.x += 1;
        }
    }

    public draw(): void {
        this._ctx.drawImage(this._image, this.x*20, this.y*20, 20, 20);
    }
}
