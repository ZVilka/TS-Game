import Agent from "./Agent.js";
import {DIR} from "./pacman.js";
import Cell, {CELLTYPE} from "./cell.js";
import Game, { REWARD } from "./game.js";

export enum AXIS {
    Hor,
    Vert
}

export default class Monster extends Agent {
    private _axis: AXIS;
    private _isMoving: boolean;

    constructor(x: number, y: number,
                context: CanvasRenderingContext2D,
                game: Game,
                cellSize:number = 20) {
        super(x, y, context, game, cellSize);
        this._isMoving = true;

        this._setImages();
    }

    public move(): void {
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

    protected _makeAStep(destinationCell: Cell): void {
        this.previousCell = this.currentCell;
        this.previousCell.hasMonster = false;
        this.currentCell = destinationCell;
        this.currentCell.hasMonster = true;
        this._changeCoordinates();
    }

    // Выбрать направление движения монстра
    public initDirection() :void {
        let isHorAllowed : boolean = false;
        let isVertAllowed : boolean = false;

        let left = this._game.cellArray[this.x - 1][this.y];
        let right = this._game.cellArray[this.x + 1][this.y];
        let up = this._game.cellArray[this.x][this.y - 1];
        let down = this._game.cellArray[this.x][this.y + 1];

        if (left.type === CELLTYPE.Food || right.type === CELLTYPE.Food || left.type === CELLTYPE.Empty || right.type === CELLTYPE.Empty) {
            isHorAllowed = true;
        } else if (up.type === CELLTYPE.Food || down.type === CELLTYPE.Food || up.type === CELLTYPE.Empty || down.type === CELLTYPE.Empty) {
            isVertAllowed = true;
        }

        if (!isHorAllowed && !isVertAllowed) {
            this._isMoving = false;
            return;
        }

        if (isHorAllowed) {
            if (isVertAllowed) {
                this._axis = this._getRandomAxis();
            } else {
                this._axis = AXIS.Hor;
            }
        } else {
            this._axis = AXIS.Vert;
        }

        this._setDirection();
    }

    protected _setDirection() : void {
        if (this._axis === AXIS.Hor) {
            this._direction = DIR.Right;
        } else if (this._axis === AXIS.Vert) {
            this._direction = DIR.Up;
        }
    }

    protected _getRandomAxis() : AXIS {
        let random = this._game.getRandomNumber(0, 1);
        return random ? AXIS.Hor : AXIS.Vert;
    }

    protected _getNewDirection() : DIR {
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

    public setWeights(reward: REWARD = REWARD.Monster): void {
        this.currentCell.weight = reward;
        let destinationCell = this.getDestinationCell();
        if (destinationCell.type == CELLTYPE.Wall)
            destinationCell = this.getDestinationCell(this._getNewDirection());
        destinationCell.weight = reward;
    }

    protected _setImages() :void {
        this.defaultSources = [];
        let rand = Math.floor(Math.random() * 4);
        for (let i = 0; i < 4; i++) {
            let defaultImage = new Image(); defaultImage.src = `src/assets/img/monsters/ghost${rand}${i}.png`;
            this.defaultSources.push(defaultImage);
            defaultImage.onload = function (this: Monster) {
                this.draw();
            }.bind(this);
        }
    }

    public draw(): void {
        let img = this.defaultSources[this._direction];
        this._context.drawImage(img, this.x * this._cellSize, this.y * this._cellSize, this._cellSize, this._cellSize);
    }
}
