import Agent from "./Agent.js";
import { DIR } from "./pacman.js";
import { CELLTYPE } from "./cell.js";
import { REWARD } from "./game.js";
export var AXIS;
(function (AXIS) {
    AXIS[AXIS["Hor"] = 0] = "Hor";
    AXIS[AXIS["Vert"] = 1] = "Vert";
})(AXIS || (AXIS = {}));
export default class Monster extends Agent {
    constructor(x, y, context, game, cellSize = 20) {
        super(x, y, context, game, cellSize);
        this._isMoving = true;
        this._setImages();
    }
    move() {
        if (this._isMoving) {
            let destinationCell = this.getDestinationCell();
            switch (destinationCell.type) {
                case CELLTYPE.Wall:
                    this._direction = this._getNewDirection();
                    destinationCell = this.getDestinationCell();
                    this._makeAStep(destinationCell);
                    break;
                default:
                    this._makeAStep(destinationCell);
                    break;
            }
        }
    }
    _makeAStep(destinationCell) {
        this.previousCell = this.currentCell;
        this.previousCell.hasMonster = false;
        this.currentCell = destinationCell;
        this.currentCell.hasMonster = true;
        this._changeCoordinates();
    }
    // Выбрать направление движения монстра
    initDirection() {
        let isHorAllowed = false;
        let isVertAllowed = false;
        let left = this._game.cellArray[this.x - 1][this.y];
        let right = this._game.cellArray[this.x + 1][this.y];
        let up = this._game.cellArray[this.x][this.y - 1];
        let down = this._game.cellArray[this.x][this.y + 1];
        if (left.type === CELLTYPE.Food || right.type === CELLTYPE.Food || left.type === CELLTYPE.Empty || right.type === CELLTYPE.Empty) {
            isHorAllowed = true;
        }
        else if (up.type === CELLTYPE.Food || down.type === CELLTYPE.Food || up.type === CELLTYPE.Empty || down.type === CELLTYPE.Empty) {
            isVertAllowed = true;
        }
        if (!isHorAllowed && !isVertAllowed) {
            this._isMoving = false;
            return;
        }
        if (isHorAllowed) {
            if (isVertAllowed) {
                this._axis = this._getRandomAxis();
            }
            else {
                this._axis = AXIS.Hor;
            }
        }
        else {
            this._axis = AXIS.Vert;
        }
        this._setDirection();
    }
    _setDirection() {
        if (this._axis === AXIS.Hor) {
            this._direction = DIR.Right;
        }
        else if (this._axis === AXIS.Vert) {
            this._direction = DIR.Up;
        }
    }
    _getRandomAxis() {
        let random = this._game.getRandomNumber(0, 1);
        return random ? AXIS.Hor : AXIS.Vert;
    }
    _getNewDirection() {
        switch (this._direction) {
            case DIR.Up:
                return DIR.Down;
            case DIR.Down:
                return DIR.Up;
            case DIR.Left:
                return DIR.Right;
            case DIR.Right:
                return DIR.Left;
            default:
                break;
        }
    }
    setWeights(reward = REWARD.Monster) {
        this.currentCell.weight = reward;
        let destinationCell = this.getDestinationCell();
        if (destinationCell.type == CELLTYPE.Wall)
            destinationCell = this.getDestinationCell(this._getNewDirection());
        destinationCell.weight = reward;
    }
    _setImages() {
        this.defaultSources = [];
        let rand = Math.floor(Math.random() * 4);
        for (let i = 0; i < 4; i++) {
            let defaultImage = new Image();
            defaultImage.src = `src/assets/img/monsters/ghost${rand}${i}.png`;
            this.defaultSources.push(defaultImage);
            defaultImage.onload = function () {
                this.draw();
            }.bind(this);
            let superImage = new Image();
            superImage.src = `src/assets/img/monsters/ghost-super${i}.png`;
            this.superSources.push(superImage);
            superImage.onload = function () {
                this.draw();
            }.bind(this);
        }
    }
    draw() {
        let img;
        if (!this._game.isSuper)
            img = this.defaultSources[this._direction];
        else
            img = this.superSources[this._direction];
        this._context.drawImage(img, this.x * this._cellSize, this.y * this._cellSize, this._cellSize, this._cellSize);
    }
}
