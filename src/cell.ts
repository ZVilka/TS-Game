import Game, { REWARD } from './game.js'
import IAgent from './IAgent.js';

export enum CELLTYPE {
    Empty,
    Food,
    Wall
}

export default class Cell {
    x: number;
    y: number;
    type: CELLTYPE;
    weight: number = 0;
    distanceToFood: number = 1000;
    private readonly _cellSize: number;
    private _game: Game;
    neighborArray: Cell[] = [];

    private _context: CanvasRenderingContext2D;

    constructor(x: number, y: number, type: CELLTYPE, context: CanvasRenderingContext2D, game: Game, sizeCell = 20) {
        this.x = x;
        this.y = y;
        this.type = type;
        this._context = context;
        this._cellSize = sizeCell;
        this._game = game;
    }

    public setNeighbors(): void {
        // for (let x=-1; x <=1; x++) {
        //     for (let y=-1; y<=1; y++) {
        //         if (Math.abs(x) !== Math.abs(y) && !( x=== 0 && y === 0))
        //             this.neighborArray.push(this._game.cellArray[this.x + x][this.y + y]);
        //     }
        // }
        let up = this._game.cellArray[this.x][this.y - 1];
        let right = this._game.cellArray[this.x + 1][this.y];
        let down = this._game.cellArray[this.x][this.y + 1];
        let left = this._game.cellArray[this.x - 1][this.y];
        this.neighborArray.push(up, right, down, left);
    }

    public resetWeightDistance(): void {
        this.weight = 0;
        this.distanceToFood = 1000;
    }

    public setWeightForMonsterNeighbor(): void {
        this.weight = REWARD.Monster;
    }

    public setDistanceToFood(): void {
        this.distanceToFood = this.getDistanceToFood();
    }

    public getDistanceToFood(): number {
        let queue : Cell[] = [];
        queue.push(this);
        let visited = new Map<Cell, number>([[this, 0]]);
        while (queue.length !== 0) {
            let v = queue.shift();
            for (let neighbor of v.neighborArray) {
                if (neighbor.type === CELLTYPE.Wall) continue;
                if (neighbor.type === CELLTYPE.Food) {
                    return visited.get(v) + 1;
                }
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                    visited.set(neighbor, visited.get(v) + 1);
                }
            }
        }
        return -50;
    }

    public draw(): void {
        switch (this.type) {
            case CELLTYPE.Empty: {
                this._drawRectangle("MediumBlue");
                this._drawText(this.weight.toString(), "purple");
                break;
            }
            case CELLTYPE.Food: {
                this._drawRectangle("MediumBlue");
                this._drawCircle('#cbcbd0');
                this._drawText(this.weight.toString(), "purple");
                break;
            }
            case CELLTYPE.Wall: {
                this._drawRectangle("black");
                this._drawImage('src/assets/img/wall.svg', this._cellSize);
                this._drawText(this.weight.toString(), "purple");
                break;
            }
            default: {
                return;
            }
        }
    }

    protected _drawRectangle(color: string) {
        this._context.fillStyle = color;
        this._context.fillRect(this.x * this._cellSize, this.y * this._cellSize, this._cellSize, this._cellSize);
    }

    protected _drawCircle(color: string) {
        const middleOfCellSize = this._cellSize / 2;
        this._context.beginPath();
        this._context.arc(this.x * this._cellSize + middleOfCellSize , this.y * this._cellSize + middleOfCellSize, middleOfCellSize / 2,
            0, 2 * Math.PI, false);
        this._context.fillStyle = color;
        this._context.fill();
        this._context.lineWidth = 1;
        this._context.strokeStyle = color;
        this._context.stroke();
    }

    protected _drawImage(url: string, size: number) {
        let img = new Image();
        img.src = url;
        img.onload = () => {
            this._context.drawImage(img, this.x * this._cellSize, this.y * this._cellSize, size, size);
        }
    }

    protected _drawText(text: string, color: string) {
        this._context.fillStyle = color;
        this._context.fillText(text, this.x * this._cellSize + 5, this.y * this._cellSize + 8);
    }
}
