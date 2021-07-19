import IAgent from "./IAgent.js";

export enum DIR {
    Up,
    Down,
    Left,
    Right
}

export default class Pacman implements IAgent {
    x: number;
    y: number;

    direction: DIR;

    constructor(x: number, y: number, dir: DIR) {
        this.x = x;
        this.y = y;
        this.direction = dir;
    }

    public move(): void {
        
    }

    public draw(): void {
        
    }
}