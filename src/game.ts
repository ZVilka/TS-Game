import Pacman, {DIR} from "./pacman.js";
import Monster from "./monster.js";
import Cell, {CELLTYPE} from "./cell.js";
import  QLearner from "../lib/q-learning.js";

const level1: string = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
wfffffffmfffffwwfffffmfffffffw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wffffffsfffwwfwwfwwfffsffffffw
wfwwwwwfwwfffffmffffwwfwwwwwfw
wfwwwwwfwwfwwwwwwwwfwwfwwwwwfw
wfffffffwwfwwwwwwwwfwwfffffffw
wfwwwwwfwwffffwwffffwwfwwwwwfw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wfffffffwwwwwfwwfwwwwwfffffffw
wwwwwwwffffffffffffffffwwwwwww
wwwwwwwfwwfwwwffwwwfwwfwwwwwww
wwwwwwwfwwfwffffffwfwwfwwwwwww
wwwwwwwfwwfwffffffwfwwfwwwwwww
wfffffffwwmwffffffwmwwfffffffw
wfwwwwwfwwfwffffffwfwwfwwwwwfw
wfwwwwwfwwfwwwffwwwfwwfwwwwwfw
wffffwwfwwffffffffffwwfwwffffw
wwwwfwwfwwfwwwwwwwwfwwfwwfwwww
wwwwfwwfwwfwwwwwwwwfwwfwwfwwww
wfffffffffsfffwwffffffsffffffw
wfwwwwwwwwwwwfwwfwwwwwwwwwwwfw
wfwwwwwwwwwwwfwwfwwwwwwwwwwwfw
wfwwffffffffffwwffffffffffwwfw
wfwwfwwwwwwwwfwwfwwwwwwwwfwwfw
wpwwffffffffffmfffffffffffwwfw
wwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;

const level2: string = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
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
wfffffffffffsfwwfffmfffffffffw
wfwwwwwwwwwwwfwwfwwwwwwwwwwwfw
wfwwwwwwwwwwwfwwfwwwwwwwwwwwfw
wfwwffffffffffwwffffffffffwwfw
wfwwfwwwwwwwwfwwfwwwwwwwwfwwfw
wpwwffffmfffffffffffffffffwwfw
wwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;

const level3: string = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
weeeeeeeeeeeeewweeeeeeeeeeeeew
wewwwwwewwwwwewwewwwwwewwwwwew
wewwwwwewwwwwewwewwwwwewwwwwew
wewwwwwewwwwwewwewwwwwewwwwwew
wewwwwwewwwwwewwewwwwwewwwwwew
weeeeeeeeeewwewwewweeeeeeeeeew
wewwwwwewweeeeeeeeeewwewwwwwew
wewwwwwewwewwwwwwwwewwewwwwwew
weeeeeeewwewwwwwwwwewweeeeeeew
wewwwwwewweeeewweeeewwewwwwwew
wewwwwwewwwwwewwewwwwwewwwwwew
weeeeeeewwwwwewwewwwwweeeeeeew
wwwwwwweeeeeeeeeeeeepeewwwwwww
wwwwwwwewwewwweewwwewwewwwwwww
wwwwwwwewweweeeeeewewwewwwwwww
wwwwwwwewweweeeeeewewwewwwwwww
weeeeeeewweweeeeeewewweeeeeeew
wwwwwwwewweweeeeeewewwewwwwwew
wwwwwwwewwewwweewwwmwwewwwwwew
weeeeewewweeeeeeeeefwwewweeeew
wewwwewewwewwwwwwwwfwwewwewwww
wewwwewwwwwwwwwwwwwfwwewwewwww
weeeeeeeeeeewewweeeeeeeeeeeeew
wewwwwwwwwwwwewwewwwwwwwwwwwew
wewwwwwwwwwwwewwewwwwwwwwwwwew
wewweeeeeeeeeewweeeeeeeeeewwew
wewwewwwwwwwwwwwwwwwwwwwwewwew
wewweeeeeeeeeeeeeeeeeeeeeewwew
wwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;

const levelsArray = [level1, level2, level3];

export enum REWARD {
    Monster = -50,
    Wall = -40,
    Food = 5,
    SuperMonster = 10
}

export default class Game {
    width: number;
    height: number;

    score: number = 0;
    remainingFood: number = 0;
    isPaused: boolean = true;
    gameSpeed: number = 100;
    currentLevel: number = 0;

    pacman: Pacman;
    monstersArray: Monster[] = [];
    cellArray: Cell[][] = [];

    learner: QLearner = new QLearner(0.1, 0.9);
    exploration: number = 0.2;

    movesLeft: number = 0;
    totalFoodEaten: number = 0;
    totalFood: number = 0;
    stuckDeaths: number = 0;
    deaths: number = 0;
    finishes: number = 0;
    
    private movesLeftSpan: HTMLElement;
    private deathCountSpan: HTMLElement;
    private foodPercentSpan: HTMLElement;
    private finishCountSpan: HTMLElement;
    private stuckDeathCountSpan: HTMLElement;

    private speedInput: HTMLInputElement;
    private levelSelect: HTMLSelectElement;

    private _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;

    constructor(w: number, h: number, speed: number) {
        this.width = w;
        this.height = h;
        this.gameSpeed = speed;

        this._canvas = document.getElementById("field") as HTMLCanvasElement;
        this._context = this._canvas.getContext("2d");
        document.addEventListener("keydown", this._onKeydown.bind(this));

        this.speedInput = document.getElementById("speed-input") as HTMLInputElement;
        this.speedInput.addEventListener("input", this._changeGameSpeed.bind(this));
        this.levelSelect = document.getElementById("level-select") as HTMLSelectElement;
        this.levelSelect.addEventListener("change", this._changeLevel.bind(this));

        this.movesLeftSpan = document.getElementById("moves-left");
        this.finishCountSpan = document.getElementById("finish-count");
        this.deathCountSpan = document.getElementById("death-count");
        this.foodPercentSpan = document.getElementById("food-percent");
        this.finishCountSpan = document.getElementById("finish-count");
        this.stuckDeathCountSpan = document.getElementById("stuck-death-count");

        for (let i = 0; i < levelsArray.length; i++) {
            let value = i;
            let text = "Level " + (i + 1);
            let option = `<option value="${value}">${text}</option>`;
            this.levelSelect.innerHTML += option;
        }
        this.currentLevel = 1;

        this._loadLevel(this.currentLevel);
    }

    private _unpauseGame(): void {
        if (this.isPaused) {
            this.isPaused = false;
            this._update();
            setTimeout(() => this._updateTimer(), this.gameSpeed);
        }
    }

    private _pauseGame(): void {
        if (!this.isPaused) {
            this.isPaused = true;
        }
    }

    private _updateTimer(): void {
        if (!this.isPaused) {
            this._update();
            setTimeout(() => this._updateTimer(), this.gameSpeed);
        }
    }

    private _changeGameSpeed(): void {
        let newSpeed = parseFloat(this.speedInput.value);
        this.gameSpeed = newSpeed;
    }

    private _onKeydown(event: KeyboardEvent) :void {
        switch(event.key) {
            // case "ArrowUp":
            //     this.pacman.setNextDirection(DIR.Up);
            //     break;
            // case "ArrowDown":
            //     this.pacman.setNextDirection(DIR.Down);
            //     break;
            // case "ArrowLeft":
            //     this.pacman.setNextDirection(DIR.Left);
            //     break;
            // case "ArrowRight":
            //     this.pacman.setNextDirection(DIR.Right);
            //     break;
            case " " || "Spacebar":
                if (this.isPaused)
                    this._unpauseGame();
                else
                    this._pauseGame();
                break;
            case "d":
                if (this.isPaused)
                    this._update();
                break;
            default:
                break;
        }
    }

    private _changeLevel(): void {
        let level = +this.levelSelect.value;
        this.currentLevel = level + 1;
        if (this.isPaused) {
            this._resetGame();
        }
    }

    private _updateStatistics(): void {
        if (this.movesLeft == 0)
            this.stuckDeaths++;
        if (this.remainingFood == 0)
            this.finishes++;
        else
            this.deaths++;
        let percent = Math.floor(this.totalFoodEaten / this.totalFood * 100);
        this.deathCountSpan.innerHTML = this.deaths.toString();
        this.foodPercentSpan.innerHTML = percent.toString();
        this.finishCountSpan.innerHTML = this.finishes.toString();
        this.stuckDeathCountSpan.innerHTML = this.stuckDeaths.toString();
    }

    private _resetGame(): void {
        this.pacman = undefined;
        this.cellArray = [];
        this.monstersArray = [];
        this.score = 0;
        this.movesLeft = 0;
        this.remainingFood = 0;
        this._loadLevel(this.currentLevel);
    }

    // Загрузка уровня по строке
    private _loadLevel(lvlNumber: number): void {
        let objectSize = 20;
        let level = levelsArray[lvlNumber - 1];
        let row = 0;
        let symbolCounter = 0;
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
                    this.movesLeft++;
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
                    this.movesLeft++;
                    symbolCounter++;
                    break;
                case "s":
                    let superFoodCell = new Cell(col, row, CELLTYPE.SuperFood, this._context, this, objectSize);
                    this.cellArray[col][row] = superFoodCell;
                    this.remainingFood++;
                    this.movesLeft++;
                    symbolCounter++;
                    break;
                case "m":
                    let foodCellForMonster = new Cell(col, row, CELLTYPE.Food, this._context, this, objectSize);
                    foodCellForMonster.hasMonster = true;
                    this.cellArray[col][row] = foodCellForMonster;
                    this.remainingFood++;
                    this.movesLeft++;
                    let monsterAgent = new Monster(col, row, this._context, this, objectSize);
                    monsterAgent.currentCell = foodCellForMonster;
                    this.monstersArray.push(monsterAgent);
                    symbolCounter++;
                    break;
                case "p":
                    let emptyCellPacman = new Cell(col, row, CELLTYPE.Empty, this._context, this, objectSize);
                    this.cellArray[col][row] = emptyCellPacman;
                    this.movesLeft++;
                    let pacman = new Pacman(col, row, DIR.Up, this._context, this, objectSize);
                    pacman.currentCell = emptyCellPacman;
                    this.pacman = pacman;
                    symbolCounter++;
                    break;
            }
        }
        this.movesLeftSpan.innerHTML = this.movesLeft.toString();
        this.totalFood += this.remainingFood;

        this.pacman.setWeights();
        for (let monster of this.monstersArray) {
            monster.initDirection();
            monster.setWeights();
        }

        for (let arrCell of this.cellArray) {
            for (let cell of arrCell) {
                cell.draw();
                if (cell.type !== CELLTYPE.Wall)
                    cell.setNeighbors();
            }
        }
    }

    // Представление текущего состояния в виде описания четырех соседних клеток пакмана
    private _getCurrentState(): string {
        let rankedCells: Cell[] = [...this.pacman.currentCell.neighborArray];

        // Сортирует веса соседних клеток пакмена по убыванию и расставляет им ранг от 0 до 3
        let compareCells = function(cell1: Cell, cell2: Cell) {
            if (cell1.weight > cell2.weight) return -1;
            if (cell1.weight === cell2.weight) return 0;
            if (cell1.weight < cell2.weight) return 1;
        };
        rankedCells.sort(compareCells);

        let state: string = "";

        for (let i = 0; i < 4; i++) {
            let neighborCell = this.pacman.currentCell.neighborArray[i];
            let typeStr = neighborCell.type.toString();
            // Если соседняя клетка - монстр, то добавить букву m
            if (neighborCell.weight == REWARD.Monster)
                typeStr += "m";
            // Если соседняя клетка - монстр, но съедена супер-еда, то добавить букву s
            if (neighborCell.weight == REWARD.SuperMonster)
                typeStr += "s";
            let rankStr = rankedCells.indexOf(neighborCell).toString();
            // Состояние - тип соседней клетки, и ее ранг, например 11 32 33 34 означает, что сверху пакмена еда, а с других сторон - стены
            state += typeStr + rankStr;
            //state += "type: " + typeStr + "rank:" + rankStr + "|";
        }
        return state;
    }

    private _update(): void {
        // Получить текущее состояние и лучшее действие. Действия - это повороты пакмена
        let currentState = this._getCurrentState();
        let action: number | string = this.learner.bestAction(currentState);

        // Выбрать рандомное действие из возможных
        let legalActions = this.pacman.getLegalActions();
        let rand = this.getRandomNumber(0, legalActions.length - 1);
        let randomAction = legalActions[rand];
        // Если лучшего действия не существует, или лернер не знает награду за рандомное действие, то выполняется рандомное действие
        if (action === null || action === undefined || (!this.learner.knowsAction(currentState, randomAction) && Math.random() < game.exploration)) {
            action = randomAction;
        }

        // Нужно для ручного управления
        //action = this.pacman._nextDir;

        // Выполнить действие (повернуть пакмена) и узнать награду
        let nextCell = this.pacman.getDestinationCell(+action);
        this.pacman.setNextDirection(+action);
        let reward = nextCell.weight;

        // Если не осталось еды, то загрузить уровень заново
        if (this.remainingFood == 0) {
            this._updateStatistics();
            this._resetGame();
        }
        // Если кончились движения, то установить награду в -50 и загрузить заново
        if (this.movesLeft == 0) {
            this._updateStatistics();
            this._resetGame();
            reward = REWARD.Monster;
        }

        // Двинуть всех агентов, пересчитать веса, перерисовать
        this._doAllAgentsMove();
        // Если было столкновение пакмана и монстра - перезагрузить уровень
        this._checkCollision();

        // Обновить супер-режим
        if (this.pacman.isSuper) {
            this.pacman.updateSuperMoveCount(-1);
            if (this.pacman.superMovesLeft == 0)
                this.pacman.stopSuper();
        }
        
        // Если нужно рисовать веса клеток
        //this._redrawWholeField();

        // Уменьшить колличество движений
        this.updateMoveCount(-1);

        // Получить следующее состояние и обучить лернера
        let nextState = this._getCurrentState();
        this.learner.add(currentState, nextState, reward, action);
        this.learner.learn(100);
    }

    private _doAllAgentsMove(): void {
        this.pacman.resetWeights();
        for (let monster of this.monstersArray) {
            monster.resetWeights();
        }
        this._updateAllMonsters();
        this._updatePacman();
        this.pacman.draw();
        for (let monster of this.monstersArray) {
            monster.draw();
        }
    }
    
    private _updatePacman(): void {
        this.pacman.updateDirection();
        this.pacman.move();
        this.pacman.setWeights();
        this.pacman.previousCell.draw();
    }

    private _updateAllMonsters(): void {
        for (let monster of this.monstersArray) {
            monster.move();
            let monsterReward = REWARD.Monster;
            if (this.pacman.isSuper)
                monsterReward = REWARD.SuperMonster;
            monster.setWeights(monsterReward);
            monster.previousCell.draw();
        }
    }

    private _checkCollision(): void {
        let collisionMonster: Monster | undefined = undefined;
        for (let monster of this.monstersArray) {
            if (monster.previousCell == this.pacman.currentCell
                || monster.currentCell == this.pacman.currentCell) {
                    collisionMonster = monster;
                }
        }
        if (collisionMonster) {
            if (this.pacman.isSuper) {
                collisionMonster.currentCell.draw();
                let idx = this.monstersArray.indexOf(collisionMonster);
                this.monstersArray.splice(idx, 1);
            } else {
                this._updateStatistics();
                this._resetGame();                
            }
        }
    }

    private _redrawWholeField(): void {
        for (let row of this.cellArray) {
            for (let cell of row)
                cell.draw();
        }
        this.pacman.draw();
        for (let monster of this.monstersArray) {
            monster.draw();
        }
    }

    public updateMoveCount(incr: number): void {
        this.movesLeft += incr;;
        this.movesLeftSpan.innerHTML = this.movesLeft.toString();
    }

    public getRandomNumber(min: number, max: number) :number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

const game = new Game(30, 30, 200);