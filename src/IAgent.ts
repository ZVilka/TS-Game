import Cell from "./cell.js";

export default interface IAgent {
    x: number;
    y: number;

    occupiedCell: Cell;

    move(): void;

    draw(): void;
}
