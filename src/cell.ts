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
    private readonly _cellSize: number;

    private _context: CanvasRenderingContext2D;

    constructor(x: number, y: number, type: CELLTYPE, context: CanvasRenderingContext2D, sizeCell = 20) {
        this.x = x;
        this.y = y;
        this.type = type;
        this._context = context;
        this._cellSize = sizeCell;
    }

    public draw(): void {
        switch (this.type) {
            case CELLTYPE.Empty: {
                this._drawRectangle("MediumBlue");
                break;
            }
            case CELLTYPE.Food: {
                this._drawRectangle("MediumBlue");
                this._drawCircle('#cbcbd0');
                break;
            }
            case CELLTYPE.Wall: {
                this._drawRectangle("MediumBlue");
                this._drawImage('src/assets/img/wall.svg', this._cellSize);
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
}
