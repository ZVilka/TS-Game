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
    sizeCell: number;

    neighborsArray: Cell[] = [];

    context: CanvasRenderingContext2D;

    constructor(x: number, y: number, type: CELLTYPE, context: CanvasRenderingContext2D, sizeCell = 20) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.context = context;
        this.sizeCell = sizeCell;
    }

    public draw(): void {
        switch (this.type) {
            case CELLTYPE.Empty: {
                this._drawRectangle("MediumBlue");
                break;
            }
            case CELLTYPE.Food: {
                this._drawRectangle("MediumBlue");
                this._drawCircle('white');
                break;
            }
            case CELLTYPE.Wall: {
                this._drawRectangle("MediumBlue");
                this._drawImage('assets/img/wall.svg', this.sizeCell);
                break;
            }
            default: {
                return;
            }
        }
    }

    protected _drawRectangle(color: string) {
        this.context.fillStyle = color;
        this.context.fillRect(this.x, this.y, this.sizeCell, this.sizeCell);
    }

    protected _drawCircle(color: string) {
        const middleOfCellSize = this.sizeCell / 2;
        this.context.beginPath();
        this.context.arc(this.x + middleOfCellSize, this.y + middleOfCellSize, middleOfCellSize / 2,
            0, 2 * Math.PI, false);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.lineWidth = 1;
        this.context.strokeStyle = color;
        this.context.stroke();
    }

    protected _drawImage(url: string, size: number) {
        let img = new Image();
        img.src = url;
        img.onload = () => {
            this.context.drawImage(img, this.x, this.y, size, size);
        }
    }
}
