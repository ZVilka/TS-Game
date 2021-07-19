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

    neighborsArray: Cell[] = [];

    context: CanvasRenderingContext2D;

    constructor(x: number, y: number, type: CELLTYPE, context: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.context = context;
    }

    public draw(): void {

    }
}