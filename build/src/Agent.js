import { DIR } from "./pacman.js";
export default class Agent {
    constructor(x, y, ctx, game, size = 20) {
        this.x = x;
        this.y = y;
        this._context = ctx;
        this._game = game;
        this._cellSize = size;
    }
    resetWeights() {
        this.currentCell.resetWeightDistance();
        for (let neigh of this.currentCell.neighborArray) {
            neigh.resetWeightDistance();
        }
    }
    getDestinationCell(direction = this._direction) {
        let newX = this.x;
        let newY = this.y;
        switch (direction) {
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
    _changeCoordinates() {
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
    _setImage(source) {
        this._image = new Image();
        this._image.width = this._cellSize;
        this._image.height = this._cellSize;
        this._image.src = source;
        this._image.onload = function () {
            this.draw();
        }.bind(this);
    }
}
