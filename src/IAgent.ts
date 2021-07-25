import Cell from "./cell.js";

export default interface IAgent {
    x: number;
    y: number;

    currentCell: Cell;

    move(): void;

    draw(): void;
}
