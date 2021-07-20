import Pacman, { DIR } from "./pacman.js";
import Monster from "./monster.js";
import Cell, { CELLTYPE } from "./cell.js";
const level1 = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
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
const levelsArray = [level1];
export default class Game {
    constructor(w, h, speed) {
        this.score = 0;
        this.remainingFood = 0;
        this.isStarted = false;
        this.gameSpeed = 100;
        this.currentLevel = 0;
        this.isOver = false;
        this.monstersArray = [];
        this.cellArray = [];
        this.width = w;
        this.height = h;
        this.gameSpeed = speed;
        this.canvas = document.getElementById("field");
        this.context = this.canvas.getContext("2d");
        document.addEventListener("keydown", this.onKeydown.bind(this));
        this.currentLevel = 1;
        this.loadLevel(this.currentLevel);
    }
    startGame() {
        if (!this.isStarted) {
            this.isStarted = true;
            this.update();
            setTimeout(() => this.updateTimer(), this.gameSpeed);
        }
    }
    stopGame() {
        if (this.isStarted) {
            this.isStarted = false;
        }
    }
    updateTimer() {
        if (this.isStarted) {
            this.update();
            setTimeout(() => this.updateTimer(), this.gameSpeed);
        }
    }
    // TODO: Действия с клавиатуры
    onKeydown(event) {
        switch (event.key) {
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
                    this.startGame();
                else {
                    this.resetGame();
                    this.loadLevel(this.currentLevel);
                }
                break;
            default:
                break;
        }
    }
    resetGame() {
        this.stopGame();
        this.isOver = false;
        this.pacman = undefined;
        this.cellArray = [];
        this.monstersArray = [];
        this.score = 0;
        this.remainingFood = 0;
    }
    // TODO: Добавить размеры объектов в конструкторы, weight клетки
    loadLevel(lvlNumber) {
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
            switch (level.charAt(i)) {
                case "\n":
                    row++;
                    break;
                case "e":
                    let emptyCell = new Cell(col, row, CELLTYPE.Empty, this.context, objectSize);
                    this.cellArray[col][row] = emptyCell;
                    symbolCounter++;
                    break;
                case "w":
                    let wallCell = new Cell(col, row, CELLTYPE.Wall, this.context, objectSize);
                    this.cellArray[col][row] = wallCell;
                    symbolCounter++;
                    break;
                case "f":
                    let foodCell = new Cell(col, row, CELLTYPE.Food, this.context, objectSize);
                    this.cellArray[col][row] = foodCell;
                    this.remainingFood++;
                    symbolCounter++;
                    break;
                case "m":
                    let foodCellForMonster = new Cell(col, row, CELLTYPE.Food, this.context, objectSize);
                    this.cellArray[col][row] = foodCellForMonster;
                    this.remainingFood++;
                    let monsterAgent = new Monster(col, row, this.context, this, objectSize);
                    this.monstersArray.push(monsterAgent);
                    symbolCounter++;
                    break;
                case "p":
                    let emptyCellPacman = new Cell(col, row, CELLTYPE.Empty, this.context, objectSize);
                    this.cellArray[col][row] = emptyCellPacman;
                    let pacman = new Pacman(col, row, DIR.Up, this.context, this, objectSize);
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
            }
        }
        this.pacman.draw();
    }
    update() {
        if (this.remainingFood === 0) {
            alert("Level Finished");
            this.isOver = true;
            this.stopGame();
            return;
        }
        this.pacman.updateDirection();
        let prevPacCell = this.pacman.move();
        prevPacCell.draw();
        this.pacman.draw();
        this.checkDeath();
        for (let monster of this.monstersArray) {
            let prevCell = monster.move();
            prevCell.draw();
            monster.draw();
            this.checkDeathForMonster(monster);
        }
    }
    checkDeath() {
        for (let monster of this.monstersArray) {
            this.checkDeathForMonster(monster);
        }
    }
    checkDeathForMonster(monster) {
        if (this.pacman.x === monster.x && this.pacman.y === monster.y) {
            setTimeout(() => alert("Game Over"), 100);
            this.isOver = true;
            this.stopGame();
        }
    }
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
const game = new Game(30, 30, 500);
