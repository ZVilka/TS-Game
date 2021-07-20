import Pacman, { DIR } from "./pacman.js";
import Monster, { AXIS } from "./monster.js";
import Cell, { CELLTYPE } from "./cell.js";

const level1: string = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
weeeeemeeeeeeewweeeeeeeeeeeeew
wewwwwwewwwwwewwewwwwwewwwwwew
wewwwwwewwwwwewwewwwwwewwwwwew
wewwwwwewwwwwewwewwwwwewwwwwew
wewwwwwewwwwwewwewwwwwewwwwwmw
weeeeeeeeeewwewwewweeeeeeeeeew
wewwwwwewweeeeeeeeeewwmwwwwwew
wewwwwwewwewwwwwwwwewwewwwwwew
weeeeeeewwewwwwwwwwewweeeeeeew
wewwwwwewweeeewweeeewwewwwwwew
wewwwwwmwwwwwewwewwwwwewwwwwew
weeeeeeewwwwwewwewwwwweeeeeeew
wwwwwwweeeeeeeeeeemeeeewwwwwww
wwwwwwwewwewwweewwwewwewwwwwww
wwwwwwwewweweeeeeewewwewwwwwww
wwwwwwwewweweeeeeewewwewwwwwww
weeeeeeewweweeeeeewewweeeeeeew
wewwwwwewweweeeeeewewwewwwwwew
wewwwwwewwewwweewwwewwewwwwwew
weeeewwewweeeeeeeeeewwewweeeew
wwwwewwewwewwwwwwwwewwewwewwww
wwwwewwewwewwwwwwwwewwewwewwww
wfffffeeeeeeeewweeemeeeeeeeeew
wfwwwwwwwwwwwewwewwwwwwwwwwwew
wewwwwwwwwwwwewwewwwwwwwwwwwew
wewweeeeeeeeeewweeeeeeeeeewwew
wewwewwwwwwwwewwewwwwwwwwewwew
wpwweeeemeeeeeeeeeeeeeeeeewwew
wwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;

const levelsArray = [level1];

class Game {
    width: number;
    height: number;

    score: number = 0;
    remainingFood: number = 0;
    isStarted: boolean = false;
    gameSpeed: number = 100;
    currentLevel: number = 0;

    pacman: Pacman;
    monstersArray: Monster[] = [];
    cellArray: Cell[][] = [];

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(w: number, h: number, speed: number) {
        this.width = w;
        this.height = h;
        this.gameSpeed = speed;

        this.canvas = document.getElementById("field") as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d");
        document.addEventListener("keydown", this.onKeydown.bind(this));

        this.currentLevel = 1;

        this.loadLevel(this.currentLevel);
    }

    private startGame(): void {
        if (!this.isStarted) {
            this.update();
            setTimeout(() => this.updateTimer(), this.gameSpeed);
        }
    }

    private stopGame(): void {
        if (this.isStarted) {
            this.isStarted = false;
        }
    }

    private updateTimer(): void {
        if (this.isStarted) {
            this.update();
            setTimeout(() => this.updateTimer(), this.gameSpeed);
        }
    }

    // TODO: Действия с клавиатуры
    private onKeydown(event: KeyboardEvent) {
        switch(event.key) {
            case "ArrowUp":
                break;
            case "ArrowDown":
                break;
            case "ArrowLeft":
                break;
            case "ArrowRight":
                break;
            case " " || "Spacebar":
                this.startGame();
                break;
            default:
                break;
        }
    }

    private resetGame(): void {
        this.stopGame();
        this.pacman = undefined;
        this.cellArray = [];
        this.monstersArray = [];
        this.score = 0;
    }

    // TODO: Добавить размеры объектов в конструкторы, weight клетки
    private loadLevel(lvlNumber: number): void {
        let objectSize = 20;
        let level = levelsArray[lvlNumber - 1];
        let row = 0;
        let symbolCounter = 0;
        this.resetGame();
        for (let i = 0; i < this.width; i++) {
            this.cellArray[i] = [];
        }
        for (let i = 0; i < level.length; i++) {
            let col = symbolCounter % this.width;
            switch(level.charAt(i)) {
                case "\n":
                    row++;
                    break;
                case "e":
                    let emptyCell = new Cell(col, row, CELLTYPE.Empty, this.context);
                    this.cellArray[col][row] = emptyCell;
                    symbolCounter++;
                    break;
                case "w":
                    let wallCell = new Cell(col, row, CELLTYPE.Wall, this.context);
                    this.cellArray[col][row] = wallCell;
                    symbolCounter++;
                    break;
                case "f":
                    let foodCell = new Cell(col, row, CELLTYPE.Food, this.context);
                    this.cellArray[col][row] = foodCell;
                    this.remainingFood++;
                    symbolCounter++;
                    break;
                case "m":
                    let rand = this.getRandomNumber(1,2);
                    let monsterAgent = new Monster(col, row, rand);
                    this.monstersArray.push(monsterAgent);
                    symbolCounter++;
                    break;
                case "p":
                    let pacman = new Pacman(col, row, DIR.Up);
                    this.pacman = pacman;
                    symbolCounter++;
                    break;
            }
        }
    }

    private update(): void {
        this.pacman.move();
        for (let monster of this.monstersArray) {
            monster.move();
        }
    }

    private getRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

const game = new Game(30, 30, 100);