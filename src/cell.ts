import Game from './game.js'

export enum CELLTYPE {
    Empty,
    Food,
    Wall,
    SuperFood
}

export default class Cell {
    x: number;
    y: number;
    type: CELLTYPE;
    weight: number = 0;
    distanceToFood: number = 1000;
    public hasMonster: boolean = false;
    private readonly _drawSize: number;
    private _game: Game;
    neighborArray: Cell[] = [];

    private _image: HTMLImageElement;

    private _context: CanvasRenderingContext2D;

    constructor(x: number, y: number, type: CELLTYPE, context: CanvasRenderingContext2D, game: Game, drawSize = 20) {
        this.x = x;
        this.y = y;
        this.type = type;
        this._context = context;
        this._drawSize = drawSize;
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

    // Поиском в ширину найти дистанцию до ближайшей еды. Путь к ближайшей еде блокирует монстр - найти дистанцию до второй по близости еды.
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
                // Поиск идет только по пустым клеткам
                if (neighbor.type === CELLTYPE.Wall || neighbor == excludedCell) continue;
                // Если встречен монстр, посчитать дистанцию до монстра, рекурсивно найти дистанцию от монстра до ближайшей еды, и сложить их
                if (neighbor.hasMonster) {
                    let firstPart = visited.get(v) + 1;
                    let secondPart = this.getDistanceToFood(neighbor, visited);
                    result = firstPart + secondPart;
                    continue;
                }
                // Если встречена еда, то вернуть дистанцию до нее
                if (neighbor.type === CELLTYPE.Food || neighbor.type === CELLTYPE.SuperFood) {
                    return visited.get(v) + 1;
                }
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                    visited.set(neighbor, visited.get(v) + 1);
                }
            }
        }
        // Если после нахождения еды, находящейся за монстром, не была встречена другая еда, то вернется расстояние до еды, находящейся за монстром
        return result;
    }

    protected _setImage() :void {
        this._image = new Image();
        this._image.width = this._drawSize;
        this._image.height = this._drawSize;
        if (this.type == CELLTYPE.Wall) {
            this._image.src = "src/assets/img/wall.png";
        
            this._image.onload = function(this : Cell) {
                this.draw();
            }.bind(this);
        }  
    }

    public draw(): void {
        // drawText нужен для отрисовки весов (дебаггинг)
        this._drawRectangle("MediumBlue");
        switch (this.type) {
            // case CELLTYPE.Empty: {
            //     // this._drawText(this.weight.toString(), "purple");
            //     break;
            // }
            case CELLTYPE.Food: {
                this._drawCircle("#cbcbd0");
                // this._drawText(this.weight.toString(), "purple");
                break;
            }
            case CELLTYPE.SuperFood: {
                this._drawCircle("red", 1.5);
                // this._drawText(this.weight.toString(), "purple");
                break;
            }
            case CELLTYPE.Wall: {
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
        this._context.fillRect(this.x * this._drawSize, this.y * this._drawSize, this._drawSize, this._drawSize);
    }

    protected _drawCircle(color: string, radiusMultiplier: number = 1) {
        const middleOfCellSize = this._drawSize / 2;
        this._context.beginPath();
        this._context.arc(this.x * this._drawSize + middleOfCellSize , this.y * this._drawSize + middleOfCellSize,
             middleOfCellSize / 2 * radiusMultiplier, 0, 2 * Math.PI, false);
        this._context.fillStyle = color;
        this._context.fill();
        this._context.lineWidth = 1;
        this._context.strokeStyle = color;
        this._context.stroke();
    }

    protected _drawImage() {
        this._context.drawImage(this._image, this.x * this._drawSize, this.y * this._drawSize, this._drawSize, this._drawSize);
    }

    protected _drawText(text: string, color: string) {
        this._context.fillStyle = color;
        this._context.fillText(text, this.x * this._drawSize + 5, this.y * this._drawSize + 8);
    }
}
