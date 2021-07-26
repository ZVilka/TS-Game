import Agent from "./Agent.js";
import Game, { REWARD } from "./game.js";
import Cell, {CELLTYPE} from "./cell.js";

export enum DIR {
    Up,
    Right,
    Down,
    Left
}

export default class Pacman extends Agent {
    public isSuper: boolean = false;
    public superMovesLeft: number = 0;
    private _rotation: number = 0;
    public _nextDir: DIR;

    private superSource: string;
    private movesPerSuperfood: number = 20;

    constructor(x: number, y: number, dir: DIR, ctx: CanvasRenderingContext2D, game: Game, size: number = 20) {
        super(x, y, ctx, game, size);
        this._direction = dir;
        this._nextDir = dir;

        this.defaultSource = "src/assets/img/pacman.png";
        this.superSource = "src/assets/img/pacman-super.png"
        this._setImage(this.defaultSource);
    }

    public updateDirection() :void {
        let destinationCell = this.getDestinationCell(this._nextDir);
        if (destinationCell.type !== CELLTYPE.Wall) {
            this._direction = this._nextDir;
            this._setRotation();
        }
        
        this._nextDir = this._direction;
    }

    public setNextDirection(dir:DIR) :void {
        this._nextDir = dir;
    }

    // Установить веса соседних клеток, если клетка пустая - то высчитать дистанцию до ближайшей еды
    public setWeights(): void {
        let cellsToRank: Cell[] = [];
        for (let neigh of this.currentCell.neighborArray) {
            if (neigh.weight == 0) {
                switch(neigh.type) {
                    case CELLTYPE.Food:
                        neigh.weight = REWARD.Food;
                        break;
                    case CELLTYPE.SuperFood:
                        neigh.weight = REWARD.Food;
                        break;
                    case CELLTYPE.Wall:
                        neigh.weight = REWARD.Wall;
                        break;
                    case CELLTYPE.Empty:
                        neigh.setDistanceToFood(this.currentCell);
                        cellsToRank.push(neigh);
                        break;
                    default:
                        break;
                }
            }
        }
        // Отсортировать соседние клетки по возрастанию дистанции до еды, и поставить им ранг. Ближайшая до еды клетка получит ранг 0, и т.д.
        let compareCellsByDistance = function(cell1: Cell, cell2: Cell) {
            if (cell1.distanceToFood > cell2.distanceToFood) return 1;
            if (cell1.distanceToFood === cell2.distanceToFood) return 0;
            if (cell1.distanceToFood < cell2.distanceToFood) return -1;
        };
        cellsToRank.sort(compareCellsByDistance);
        // Вес = rank * -1 - 1. Ближайшая клетка будет равна -1, вторая -2 и т.д.
        for (let cell of cellsToRank) {
            cell.weight = -cellsToRank.indexOf(cell) - 1;
        }
    }

    public getLegalActions(): DIR[] {
        let res = [];
        for (let i = 0; i < 4; i++) {
            let neigh = this._game.cellArray[this.x][this.y].neighborArray[i];
            if (neigh.type != CELLTYPE.Wall) {
                res.push(i);
            }
        }
        return res;
    }

    public move(): void {
        let destinationCell = this.getDestinationCell(this._direction);
        switch (destinationCell.type) {
            case CELLTYPE.Wall:
                break;
            case CELLTYPE.Food:
            case CELLTYPE.SuperFood:
                this._makeAStep(destinationCell);
                this.eatFood(destinationCell);
                break;
            default:
                this._makeAStep(destinationCell);
                break;
        }
    }

    public _makeAStep(destinationCell: Cell): void {
        this.previousCell = this.currentCell;
        this.currentCell = destinationCell;
        this._changeCoordinates();
    }

    protected _setRotation() :void {
        switch(this._direction) {
            case DIR.Up:
                this._rotation = 0;
                break;
            case DIR.Right:
                this._rotation = 90;
                break;
            case DIR.Down:
                this._rotation = 180;
                break;
            case DIR.Left:
                this._rotation = 270;
                break;
            default:
                throw "Invalid direction!";
        }
    }

    public eatFood(cell: Cell): void {
        if (cell.type == CELLTYPE.SuperFood) {
            this.makeSuper();
            this.updateSuperMoveCount(this.movesPerSuperfood);
        }
        this._game.totalFoodEaten++;
        this._game.updateMoveCount(1);
        this._game.remainingFood--;
        cell.type = CELLTYPE.Empty;
    }

    public updateSuperMoveCount(incr: number): void {
        this.superMovesLeft += incr;
    }

    public makeSuper(): void {
        this.isSuper = true;
        this._image.src = this.superSource;
    }

    public stopSuper(): void {
        this.isSuper = false;
        this._image.src = this.defaultSource;
    }

    public draw(): void {
        let centerX = this.x * this._cellSize + this._cellSize/2;
        let centerY = this.y * this._cellSize + this._cellSize/2;

        let radRotation = this._rotation * Math.PI/180
        this._context.translate(centerX, centerY);
        this._context.rotate(radRotation);

        this._context.drawImage(this._image, -this._cellSize/2, -this._cellSize/2, this._cellSize, this._cellSize);

        this._context.rotate(-radRotation);
        this._context.translate(-centerX, -centerY);
    }
}
