import IAgent from "./IAgent.js";

export enum AXIS {
    Hor,
    Vert
}

export default class Monster implements IAgent {
    x: number;
    y: number;
    axis: AXIS;

    constructor(x: number, y: number, axis: AXIS) {
        this.x = x;
        this.y = y;
        this.axis = axis;
    }

    public move(): void {
        
    }

    public draw(): void {
        
    }
}