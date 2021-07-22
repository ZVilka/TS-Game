import Pacman, {DIR} from "./pacman.js";
import Monster from "./monster.js";
import Cell, {CELLTYPE} from "./cell.js";
//import QLearner from "../lib/q-learning.js";
//let ql = require("../lib/q-learning.js")
//import QL from "../lib/q-learning.js";
import QLearner from "../lib/q-learning.js";
import { throws } from "assert/strict";

const level1: string = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
wfffffmfffffffwwfffffffffffffw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwmw
wffffffffffwwfwwfwwffffffffffw
wfwwwwwfwwffffffffffwwmwwwwwfw
wfwwwwwfwwfwwwwwwwwfwwfwwwwwfw
wfffffffwwfwwwwwwwwfwwfffffffw
wfwwwwwfwwffffwwffffwwfwwwwwfw
wfwwwwwmwwwwwfwwfwwwwwfwwwwwfw
wfffffffwwwwwfwwfwwwwwfffffffw
wwwwwwwfffffffffffmffffwwwwwww
wwwwwwwfwwfwwwffwwwfwwfwwwwwww
wwwwwwwfwwfwffffffwfwwfwwwwwww
wwwwwwwfwwfwffffffwfwwfwwwwwww
wfffffffwwfwffffffwfwwfffffffw
wfwwwwwfwwfwffffffwfwwfwwwwwfw
wfwwwwwfwwfwwwffwwwfwwfwwwwwfw
wffffwwfwwffffffffffwwfwwffffw
wwwwfwwfwwfwwwwwwwwfwwfwwfwwww
wwwwfwwfwwfwwwwwwwwfwwfwwfwwww
wfffffffffffffwwfffmfffffffffw
wfwwwwwwwwwwwfwwfwwwwwwwwwwwfw
wfwwwwwwwwwwwfwwfwwwwwwwwwwwfw
wfwwffffffffffwwffffffffffwwfw
wfwwfwwwwwwwwfwwfwwwwwwwwfwwfw
wpwwffffmfffffffffffffffffwwfw
wwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;

// const level1: string = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
// weeeeeeeeeeeeewweeeeeeeeeefmfw
// wewwwwwewwwwwewwewwwwwewwwwwew
// wewwwwwewwwwwewwewwwwwewwwwwew
// wewwwwwewwwwwewwewwwwwewwwwwew
// wewwwwwewwwwwewwewwwwwewwwwwew
// weeeeeeeeeewwewwewweeeeeeeeeew
// wewwwwwewweeeeeeeeeewwewwwwwew
// wewwwwwewwewwwwwwwwewwewwwwwew
// weeeeeeewwewwwwwwwwewweeeeeeew
// wewwwwwewweeeewweeeewwewwwwwew
// wewwwwwewwwwwewwewwwwwewwwwwew
// weeeeeeewwwwwewwewwwwweeeeeeew
// wwwwwwweeeeeeeeeeeeeeeewwwwwww
// wwwwwwwewwewwweewwwewwewwwwwww
// wwwwwwwewweweeeeeewewwewwwwwww
// wwwwwwwewweweeeeeewewwewwwwwww
// weeeeeeewweweeeeeewewweeeeeeew
// wewwwwwewweweeeeeewewwewwwwwew
// wewwwwwewwewwweewwwewwewwwwwew
// weeeewwewweeeeeeeeeewwewweeeew
// wwwwewwewwewwwwwwwwewwewwewwww
// wwwwewwewwewwwwwwwwewwewwewwww
// weeeeeeeeeeeeewweeeeeeeeeeeeew
// wewwwwwwwwwwwewwewwwwwwwwwwwew
// wewwwwwwwwwwwewwewwwwwwwwwwwew
// wewweeeeeeeeeewweeeeeeeeeewwew
// wewwewwwwwwwwewwewwwwwwwwewwew
// wpwweeeeeeeeeeeeeeeeeeeeeewwew
// wwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;

const levelsArray = [level1];

export default class Game {
    width: number;
    height: number;

    score: number = 0;
    remainingFood: number = 0;
    isStarted: boolean = false;
    gameSpeed: number = 100;
    currentLevel: number = 0;
    isOver: boolean = false;

    pacman: Pacman;
    monstersArray: Monster[] = [];
    cellArray: Cell[][] = [];

    learner: QLearner = new QLearner(0.1, 0.9);
    exploration: number = 0.01;

    private _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;

    constructor(w: number, h: number, speed: number) {
        this.width = w;
        this.height = h;
        this.gameSpeed = speed;

        this._canvas = document.getElementById("field") as HTMLCanvasElement;
        this._context = this._canvas.getContext("2d");
        document.addEventListener("keydown", this._onKeydown.bind(this));

        this.currentLevel = 1;

        this._loadLevel(this.currentLevel);
    }

    private _startGame(): void {
        if (!this.isStarted) {
            this.isStarted = true;
            this._update();
            setTimeout(() => this._updateTimer(), this.gameSpeed);
        }
    }

    private _stopGame(): void {
        if (this.isStarted) {
            this.isStarted = false;
        }
    }

    private _updateTimer(): void {
        if (this.isStarted) {
            this._update();
            setTimeout(() => this._updateTimer(), this.gameSpeed);
        }
    }

    // TODO: Действия с клавиатуры
    private _onKeydown(event: KeyboardEvent) :void {
        switch(event.key) {
            case "ArrowUp":
                this.pacman.setNextDirection(DIR.Up);
                break;
            case "ArrowDown":
                this.pacman.setNextDirection(DIR.Down);
                break;
            case "ArrowLeft":
                this.pacman.setNextDirection(DIR.Left);
                break;
            case "ArrowRight":
                this.pacman.setNextDirection(DIR.Right);
                break;
            case " " || "Spacebar":
                if (!this.isOver)
                    this._startGame();
                else {
                    this._resetGame();
                    this._loadLevel(this.currentLevel);
                }
                break;
            default:
                break;
        }
    }

    private _resetGame(): void {
        this._stopGame();
        this.isOver = false;
        this.pacman = undefined;
        this.cellArray = [];
        this.monstersArray = [];
        this.score = 0;
        this.remainingFood = 0;
    }

    // TODO: Добавить размеры объектов в конструкторы, weight клетки
    private _loadLevel(lvlNumber: number): void {
        let objectSize = 20;
        let level = levelsArray[lvlNumber - 1];
        let row = 0;
        let symbolCounter = 0;
        this._resetGame();
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
                    let emptyCell = new Cell(col, row, CELLTYPE.Empty, this._context, this, objectSize);
                    this.cellArray[col][row] = emptyCell;
                    symbolCounter++;
                    break;
                case "w":
                    let wallCell = new Cell(col, row, CELLTYPE.Wall, this._context, this, objectSize);
                    this.cellArray[col][row] = wallCell;
                    symbolCounter++;
                    break;
                case "f":
                    let foodCell = new Cell(col, row, CELLTYPE.Food, this._context, this, objectSize);
                    this.cellArray[col][row] = foodCell;
                    this.remainingFood++;
                    symbolCounter++;
                    break;
                case "m":
                    let foodCellForMonster = new Cell(col, row, CELLTYPE.Food, this._context, this, objectSize);
                    this.cellArray[col][row] = foodCellForMonster;
                    this.remainingFood++;
                    let monsterAgent = new Monster(col, row, this._context, this, objectSize);
                    this.monstersArray.push(monsterAgent);
                    symbolCounter++;
                    break;
                case "p":
                    let emptyCellPacman = new Cell(col, row, CELLTYPE.Empty, this._context, this, objectSize);
                    this.cellArray[col][row] = emptyCellPacman;
                    let pacman = new Pacman(col, row, DIR.Up, this._context, this, objectSize);
                    this.pacman = pacman;
                    symbolCounter++;
                    break;
            }
        }

        for (let monster of this.monstersArray) {
            monster.initDirection();
        }

        for (let arrCell of this.cellArray) {
            for (let cell of arrCell) {
                cell.draw();
                if (cell.type !== CELLTYPE.Wall)
                    cell.setNeighbors();
            }
        }
        this.pacman.draw();
    }

    private getCurrentState(): string {
        let sortedCells: Cell[] = [...this.cellArray[this.pacman.x][this.pacman.y].neighborArray];

        let compareCells = function(cell1: Cell, cell2: Cell) {
            if (cell1.weight > cell2.weight) return -1;
            if (cell1.weight === cell2.weight) return 0;
            if (cell1.weight < cell2.weight) return 1;
        };
        sortedCells.sort(compareCells);

        let state: string = "";

        for (let i = 0; i < 4; i++) {
            let neighborCell = this.cellArray[this.pacman.x][this.pacman.y].neighborArray[i];
            state += "type: " + neighborCell.type + "rank:" + sortedCells.indexOf(neighborCell).toString();
        }
        return state;
    }

    private _update(): void {
        if (this.remainingFood === 0) {
            alert("Level Finished");
            this.isOver = true;
            this._stopGame();
            return;
        }

        let currentState = this.getCurrentState();
        let action: number | string = this.learner.bestAction(currentState);

        if ((action == undefined) || (Math.random() < this.exploration)) {
            action = this.getRandomNumber(0, 3);
        }

        this.pacman.setNextDirection(+action);
        let reward = this.pacman.getDestinationCell().weight;

        this.pacman.updateDirection();
        let prevPacCell = this.pacman.move();
        prevPacCell.draw();
        this.pacman.draw();
        this._checkDeath();
        for (let neigh of this.cellArray[this.pacman.x][this.pacman.y].neighborArray) {
            neigh.setWeightForPacmanNeighbor();
        }

        for (let monster of this.monstersArray) {
            let prevCell = monster.move();
            prevCell.draw();
            monster.draw();
            this._checkDeathForMonster(monster);
            this.cellArray[monster.x][monster.y].setWeightForMonsterNeighbor();
            for (let neigh of this.cellArray[monster.x][monster.y].neighborArray) {
                neigh.setWeightForMonsterNeighbor();
            }
        }

        let nextState = this.getCurrentState();
        this.learner.add(currentState, nextState, reward, action);

        this.learner.learn(100);
    }

    protected _checkDeath() :void {
        for (let monster of this.monstersArray) {
            this._checkDeathForMonster(monster);
        }
    }

    protected _checkDeathForMonster(monster:Monster) :void {
        if (this.pacman.x === monster.x && this.pacman.y === monster.y) {
            setTimeout(() => alert("Game Over"), 100);
            this.isOver = true;
            this._stopGame();
        }
    }

    public getRandomNumber(min: number, max: number) :number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

const game = new Game(30, 30, 200);
