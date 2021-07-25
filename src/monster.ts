import IAgent from "./IAgent.js";
import {DIR} from "./pacman.js";
import Cell, {CELLTYPE} from "./cell.js";
import Game, { REWARD } from "./game.js";

export enum AXIS {
    Hor,
    Vert
}

export default class Monster implements IAgent {
    x: number;
    y: number;
    private _axis: AXIS;
    private _direction: DIR;
    private _game: Game;
    private _isMoving: boolean;

    public previousCell: Cell;
    public currentCell: Cell;

    private _image: HTMLImageElement;

    private _context: CanvasRenderingContext2D;
    private readonly _cellSize: number;

    constructor(x: number, y: number,
                context: CanvasRenderingContext2D,
                game: Game,
                cellSize:number = 20) {
        this.x = x;
        this.y = y;
        this._context = context;
        this._cellSize = cellSize;
        this._game = game;
        this._isMoving = true;

        this._setImage();
    }

    public move(): void {
        if (this._isMoving) {
            let destinationCell = this.getDestinationCell();

            switch (destinationCell.type) {
                case CELLTYPE.Wall:
                    this._direction = this._getNewDirection();
                    destinationCell = this.getDestinationCell();

                    this.previousCell = this.currentCell;
                    this.previousCell.hasMonster = false;
                    this.currentCell = destinationCell;
                    this.currentCell.hasMonster = true;
                    this._makeAStep();
                    break;
                default:
                    this.previousCell = this.currentCell;
                    this.previousCell.hasMonster = false;
                    this.currentCell = destinationCell;
                    this.currentCell.hasMonster = true;
                    this._makeAStep();
                    break;
            }
        }
    }

    protected _makeAStep() :void {
        switch (this._direction) {
            case DIR.Up:
                this.y--;
                break;
            case DIR.Down:
                this.y++;
                break;
            case DIR.Left:
                this.x--;
                break;
            case DIR.Right:
                this.x++;
                break;
            default:
                break;
        }
    }

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

    public getDestinationCell(direction:DIR = this._direction): Cell {
        let newX = this.x;
        let newY = this.y;

        switch(direction) {
            case DIR.Up:
                newY--;
                break;
            case DIR.Down:
                newY++;
                break;
            case DIR.Left:
                newX--;
                break;
            case DIR.Right:
                newX++;
                break;
            default:
                throw "Invalid direction!";
        }
        return this._game.cellArray[newX][newY];
    }

    protected _getRandomAxis() : AXIS {
        let random = this._game.getRandomNumber(0, 1);
        return random ? AXIS.Hor : AXIS.Vert;
    }

    protected _getNewDirection() : DIR {
        switch (this._direction) {
            case DIR.Up:
                return DIR.Down;
                break;
            case DIR.Down:
                return DIR.Up;
                break;
            case DIR.Left:
                return DIR.Right;
                break;
            case DIR.Right:
                return DIR.Left;
                break;
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

    public resetWeights(): void {
        this.currentCell.resetWeightDistance();
        for (let neigh of this.currentCell.neighborArray) {
            neigh.resetWeightDistance();
        }
    }

    protected _setImage() :void {
        this._image = new Image();
        this._image.width = this._cellSize;
        this._image.height = this._cellSize;
        this._image.src = "src/assets/img/monster.png";
        this._image.onload = function(this : Monster) {
            this.draw();
        }.bind(this);
    }

    public draw(): void {
        this._context.drawImage(this._image, this.x * this._cellSize, this.y * this._cellSize, this._cellSize, this._cellSize);
    }
}
