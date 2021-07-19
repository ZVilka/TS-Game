export default interface IAgent {
    x: number;
    y: number;

    move(): void;

    draw(): void;
}