import Pacman, { DIR } from "./pacman.js";
import Monster, { AXIS } from "./monster.js";
import Cell, { CELLTYPE } from "./cell.js";

const level1: string = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeemeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeewwwwwwwwwwwwwwwwweeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeemeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
wpeeeeeeeeeeeeeeeeeeeeeeeeeeew
wwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;

class Game {
    width: number;
    height: number;

    score: number = 0;
    isStarted: boolean = false;

    pacman: Pacman | undefined;
    monstersArray: Monster[] = [];
    cellArray: Cell[][] = [];

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;

        this.canvas = document.getElementById("field") as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d");
        this.drawDot();
    }

    private drawDot(): void {
        this.context.fillStyle = "black";
        this.context.fillRect(30, 30, 10, 10);
    }

    private startGame(): void {
        if (!this.isStarted) {
            setTimeout(() => this.updateTimer(), 100);
        }
    }

    private stopGame(): void {
        if (this.isStarted) {
            this.isStarted = false;
        }
    }

    private updateTimer(): void {
        if (this.isStarted) {
            setTimeout(() => this.updateTimer(), 100);
        }
    }

    private initLevel(): void {

    }

    private update(): void {

    }

}

const game = new Game(30, 30);