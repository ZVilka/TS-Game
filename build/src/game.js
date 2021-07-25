import Pacman, { DIR } from "./pacman.js";
import Monster from "./monster.js";
import Cell, { CELLTYPE } from "./cell.js";
// import QLearner from "../lib/q-learning.js";
const level1 = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
wfffffffmfffffwwfffffmfffffffw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wfwwwwwfwwwwwfwwfwwwwwfwwwwwfw
wffffffffffwwfwwfwwffffffffffw
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
wfffffffffffffwwfffffffffffffw
wfwwwwwwwwwwwfwwfwwwwwwwwwwwfw
wfwwwwwwwwwwwfwwfwwwwwwwwwwwfw
wfwwffffffffffwwffffffffffwwfw
wfwwfwwwwwwwwfwwfwwwwwwwwfwwfw
wpwwffffffffffmfffffffffffwwfw
wwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;
const level2 = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
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
const level3 = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
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
export var REWARD;
(function(REWARD) {
    REWARD[REWARD["Monster"] = -50] = "Monster";
    REWARD[REWARD["Wall"] = -40] = "Wall";
    REWARD[REWARD["Food"] = 5] = "Food";
    REWARD[REWARD["SuperMonster"] = 10] = "SuperMonster";
})(REWARD || (REWARD = {}));
export default class Game {
    constructor(w, h, speed) {
        this.score = 0;
        this.remainingFood = 0;
        this.isPaused = true;
        this.gameSpeed = 100;
        this.currentLevel = 0;
        this.isSuper = false;
        this.superMovesLeft = 0;
        this.monstersArray = [];
        this.cellArray = [];
        this.learner = new QLearner(0.1, 0.9);
        this.exploration = 0.2;
        this.movesLeft = 0;
        this.totalFoodEaten = 0;
        this.totalFood = 0;
        this.stuckDeaths = 0;
        this.deaths = 0;
        this.finishes = 0;
        this.width = w;
        this.height = h;
        this.gameSpeed = speed;
        this._canvas = document.getElementById("field");
        this._context = this._canvas.getContext("2d");
        document.addEventListener("keydown", this._onKeydown.bind(this));
        this.speedInput = document.getElementById("speed-input");
        this.speedInput.addEventListener("input", this.changeGameSpeed.bind(this));
        this.levelSelect = document.getElementById("level-select");
        this.levelSelect.addEventListener("change", this.changeLevel.bind(this));
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
    _unpauseGame() {
        if (this.isPaused) {
            this.isPaused = false;
            this._update();
            setTimeout(() => this._updateTimer(), this.gameSpeed);
        }
    }
    _pauseGame() {
        if (!this.isPaused) {
            this.isPaused = true;
        }
    }
    _updateTimer() {
        if (!this.isPaused) {
            this._update();
            setTimeout(() => this._updateTimer(), this.gameSpeed);
        }
    }
    changeGameSpeed() {
            let newSpeed = parseFloat(this.speedInput.value);
            this.gameSpeed = newSpeed;
        }
        // TODO: Действия с клавиатуры
    _onKeydown(event) {
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
    changeLevel() {
        let level = +this.levelSelect.value;
        this.currentLevel = level + 1;
        if (this.isPaused) {
            this._resetGame();
        }
    }
    _updateStatistics() {
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
    _resetGame() {
            this.pacman = undefined;
            this.cellArray = [];
            this.monstersArray = [];
            this.score = 0;
            this.movesLeft = 0;
            this.remainingFood = 0;
            this._loadLevel(this.currentLevel);
        }
        // TODO: Добавить размеры объектов в конструкторы, weight клетки
    _loadLevel(lvlNumber) {
        let objectSize = 20;
        let level = levelsArray[lvlNumber - 1];
        let row = 0;
        let symbolCounter = 0;
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
    getCurrentState() {
        let rankedCells = [...this.pacman.currentCell.neighborArray];
        let compareCells = function(cell1, cell2) {
            if (cell1.weight > cell2.weight)
                return -1;
            if (cell1.weight === cell2.weight)
                return 0;
            if (cell1.weight < cell2.weight)
                return 1;
        };
        rankedCells.sort(compareCells);
        let state = "";
        for (let i = 0; i < 4; i++) {
            let neighborCell = this.pacman.currentCell.neighborArray[i];
            let typeStr = neighborCell.type.toString();
            if (neighborCell.weight == REWARD.Monster)
                typeStr += "m";
            if (neighborCell.weight == REWARD.SuperMonster)
                typeStr += "s";
            let rankStr = rankedCells.indexOf(neighborCell).toString();
            state += typeStr + rankStr;
            //state += "type: " + typeStr + "rank:" + rankStr + "|";
        }
        return state;
    }
    _update() {
        let currentState = this.getCurrentState();
        let action = this.learner.bestAction(currentState);
        let legalActions = this.pacman.getLegalActions();
        let rand = this.getRandomNumber(0, legalActions.length - 1);
        let randomAction = legalActions[rand];
        if (action === null || action === undefined || (!this.learner.knowsAction(currentState, randomAction) && Math.random() < game.exploration)) {
            action = randomAction;
            //console.log("random action: ", action);
        }
        action = this.pacman._nextDir;
        let nextCell = this.pacman.getDestinationCell(+action);
        //this.pacman.setNextDirection(+action);
        let reward = nextCell.weight;
        console.log(reward);
        this.pacman.resetWeights();
        for (let monster of this.monstersArray) {
            monster.resetWeights();
        }
        if (this.movesLeft == 0)
            reward = REWARD.Monster;
        let prevPacCell = this.pacman.currentCell;
        this.updateAllMonsters();
        this.updatePacman();
        let collisionMonster = this.checkCollision();
        if (collisionMonster) {
            if (this.isSuper) {
                collisionMonster.currentCell.draw();
                let idx = this.monstersArray.indexOf(collisionMonster);
                this.monstersArray.splice(idx, 1);
            } else {
                this._updateStatistics();
                this._resetGame();
            }
        }
        if (this.isSuper) {
            this.superMovesLeft--;
            console.log(this.superMovesLeft);
        }
        if (this.superMovesLeft == 0)
            this.isSuper = false;
        for (let row of this.cellArray) {
            for (let cell of row)
                cell.draw();
        }
        this.pacman.draw();
        for (let monster of this.monstersArray) {
            monster.draw();
        }
        if (this.remainingFood == 0) {
            this._updateStatistics();
            this._resetGame();
        }
        this.decreaseMoveCount();
        let nextState = this.getCurrentState();
        this.learner.add(currentState, nextState, reward, action);
        this.learner.learn(100);
    }
    updatePacman() {
        this.pacman.updateDirection();
        this.pacman.move();
        this.pacman.setWeights();
        this.pacman.previousCell.draw();
        this.pacman.draw();
    }
    updateAllMonsters() {
        for (let monster of this.monstersArray) {
            monster.move();
            let monsterReward = REWARD.Monster;
            if (this.isSuper)
                monsterReward = REWARD.SuperMonster;
            monster.setWeights(monsterReward);
            monster.previousCell.draw();
            monster.draw();
        }
    }
    checkCollision() {
        for (let monster of this.monstersArray) {
            if (monster.previousCell == this.pacman.currentCell ||
                monster.currentCell == this.pacman.currentCell) {
                return monster;
            }
        }
        return undefined;
    }
    checkCollisionForPacman() {
        for (let monster of this.monstersArray) {
            if (this.checkCollisionForMonster(monster))
                return true;
        }
        return false;
    }
    checkCollisionForMonster(monster) {
            if (monster.x == this.pacman.x && monster.y == this.pacman.y) {
                return true;
            }
            return false;
        }
        // protected checkMonsterCollosion() :void {
        //     for (let monster of this.monstersArray) {
        //         if (this.pacman.x === monster.x && this.pacman.y === monster.y) {
        //             this.cellArray[monster.x][monster.y].draw();
        //             let idx = this.monstersArray.indexOf(monster);
        //             this.monstersArray.splice(idx, 1);
        //         }
        //     }
        // }
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    increaseMoveCount() {
        this.movesLeft++;
        this.movesLeftSpan.innerHTML = this.movesLeft.toString();
    }
    decreaseMoveCount() {
        this.movesLeft--;
        this.movesLeftSpan.innerHTML = this.movesLeft.toString();
    }
}
const game = new Game(30, 30, 200);