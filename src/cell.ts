import Game, { REWARD } from './game.js'
import IAgent from './IAgent.js';

export enum CELLTYPE {
    Empty,
    Food,
    Wall,
    SuperFood
}

enum WALLTYPE {
    Invisible,
    Single,
    End,
    Corner,
    TwoTube,
    ThreeTube,
    FourTube
}

export default class Cell {
    x: number;
    y: number;
    type: CELLTYPE;
    weight: number = 0;
    distanceToFood: number = 1000;
    public hasMonster: boolean = false;
    private readonly _cellSize: number;
    private _game: Game;
    neighborArray: Cell[] = [];

    private _image: HTMLImageElement;

    private _context: CanvasRenderingContext2D;

    constructor(x: number, y: number, type: CELLTYPE, context: CanvasRenderingContext2D, game: Game, sizeCell = 20) {
        this.x = x;
        this.y = y;
        this.type = type;
        this._context = context;
        this._cellSize = sizeCell;
        this._game = game;

        this._setImage();
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

    public setDistanceToFood(cell: Cell): void {
        this.distanceToFood = this.getDistanceToFood(undefined, undefined, cell);
    }

    private getDistanceToFood(excludedCell: Cell = undefined, visited: Map<Cell, number> = undefined, centerCell: Cell = undefined): number {
        let queue : Cell[] = [this];
        if (visited == undefined)
            visited = new Map<Cell, number>([[this, 0]]);
        if (centerCell != undefined)
            visited.set(centerCell, 0);
        let result: number = 1000;
        while (queue.length !== 0) {
            let v = queue.shift();
            for (let neighbor of v.neighborArray) {
                if (neighbor.type === CELLTYPE.Wall || neighbor == excludedCell) continue;
                if (neighbor.hasMonster) {
                    let firstPart = visited.get(v) + 1;
                    let secondPart = this.getDistanceToFood(neighbor, visited);
                    result = firstPart + secondPart;
                    continue;
                }
                if (neighbor.type === CELLTYPE.Food || neighbor.type === CELLTYPE.SuperFood) {
                    return visited.get(v) + 1;
                }
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                    visited.set(neighbor, visited.get(v) + 1);
                }
            }
        }
        return result;
    }

    protected _setImage() :void {
        this._image = new Image();
        this._image.width = this._cellSize;
        this._image.height = this._cellSize;
        if (this.type == CELLTYPE.Wall) {
            this._image.src = "src/assets/img/wall.png";
        
            this._image.onload = function(this : Cell) {
                this.draw();
            }.bind(this);
        }  
    }
    

    private setWallImage(): void {
        let neighborWallCount: number = 0;
            
        let up = this._game.cellArray[this.x][this.y - 1] == undefined ? CELLTYPE.Empty : this._game.cellArray[this.x][this.y - 1].type;
        let right = this._game.cellArray[this.x + 1][this.y] == undefined ? CELLTYPE.Empty : this._game.cellArray[this.x + 1][this.y].type;
        let down = this._game.cellArray[this.x][this.y + 1] == undefined ? CELLTYPE.Empty : this._game.cellArray[this.x][this.y + 1].type;
        let left = this._game.cellArray[this.x - 1][this.y] == undefined ? CELLTYPE.Empty : this._game.cellArray[this.x - 1][this.y].type;
        let arr = [up, right, down, left];
        let emptyCount = arr.filter((obj) => obj == CELLTYPE.Empty || obj == CELLTYPE.Food).length;
        let wallType: WALLTYPE;
        let wallSubstype: number;
        switch(emptyCount) {
            case 0:
                wallType = WALLTYPE.Invisible;
                break;
            case 1:
                for (let i = 0; i < 4; i++) {
                    if (arr[i] == CELLTYPE.Empty) {
                        wallType = WALLTYPE.TwoTube;
                        wallSubstype = i;
                        break;
                    }
                }
                break;
            case 2:
                for (let i = 0; i < 4; i++) {
                    let next = i + 1 > 3 ? i - 4 : i + 1;
                    let next2 = i + 2 > 3 ? i - 4 : i + 1;
                    if (arr[i] == CELLTYPE.Empty && arr[i] == arr[next]) {
                        wallType = WALLTYPE.Corner;
                        wallSubstype = i;
                        break;
                    }
                    if (arr[i] == CELLTYPE.Empty && arr[i] == arr[next2]) {
                        wallType = WALLTYPE.TwoTube;
                        wallSubstype = i;
                        break;
                    }
                }
                break;
            case 3:
                for (let i = 0; i < 4; i++) {
                    if (arr[i] != CELLTYPE.Empty) {
                        wallType = WALLTYPE.End;
                        wallSubstype = i;
                    }
                }
                break;
            case 4:
                wallType = WALLTYPE.Single;
                break;
        }
        
    }

    public draw(): void {
        
        switch (this.type) {
            case CELLTYPE.Empty: {
                this._drawRectangle("MediumBlue");
                // this._drawText(this.weight.toString(), "purple");
                break;
            }
            case CELLTYPE.Food: {
                this._drawRectangle("MediumBlue");
                this._drawCircle('#cbcbd0');
                // this._drawText(this.weight.toString(), "purple");
                break;
            }
            case CELLTYPE.SuperFood: {
                this._drawRectangle("MediumBlue");
                this._drawCircle('red');
                // this._drawText(this.weight.toString(), "purple");
                break;
            }
            case CELLTYPE.Wall: {
                this._drawRectangle("MediumBlue");
                this._drawImage();
                // this._drawText(this.weight.toString(), "purple");
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

    protected _drawImage() {
        this._context.drawImage(this._image, this.x * this._cellSize, this.y * this._cellSize, this._cellSize, this._cellSize);
    }

    protected _drawText(text: string, color: string) {
        this._context.fillStyle = color;
        this._context.fillText(text, this.x * this._cellSize + 5, this.y * this._cellSize + 8);
    }
}
