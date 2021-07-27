export var CELLTYPE;
(function (CELLTYPE) {
    CELLTYPE[CELLTYPE["Empty"] = 0] = "Empty";
    CELLTYPE[CELLTYPE["Food"] = 1] = "Food";
    CELLTYPE[CELLTYPE["Wall"] = 2] = "Wall";
    CELLTYPE[CELLTYPE["SuperFood"] = 3] = "SuperFood";
})(CELLTYPE || (CELLTYPE = {}));
export default class Cell {
    constructor(x, y, type, context, game, drawSize = 20) {
        this.weight = 0;
        this.distanceToFood = 1000;
        this.hasMonster = false;
        this.neighborArray = [];
        this.x = x;
        this.y = y;
        this.type = type;
        this._context = context;
        this._drawSize = drawSize;
        this._game = game;
        this._setImage();
    }
    setNeighbors() {
        // for (let x=-1; x <=1; x++) {
        //     for (let y=-1; y<=1; y++) {
        //         if (Math.abs(x) !== Math.abs(y) && !( x=== 0 && y === 0))
        //             this.neighborArray.push(this._game.cellArray[this.x + x][this.y + y]);
        //     }
        // }
        let up = this._game.cellArray[this.x][this.y - 1];
        let right = this._game.cellArray[this.x + 1][this.y];
        let down = this._game.cellArray[this.x][this.y + 1];
        let left = this._game.cellArray[this.x - 1][this.y];
        this.neighborArray.push(up, right, down, left);
    }
    resetWeightDistance() {
        this.weight = 0;
        this.distanceToFood = 1000;
    }
    setDistanceToFood(cell) {
        this.distanceToFood = this.getDistanceToFood(undefined, undefined, cell);
    }
    // Поиском в ширину найти дистанцию до ближайшей еды. Путь к ближайшей еде блокирует монстр - найти дистанцию до второй по близости еды.
    getDistanceToFood(excludedCell = undefined, visited = undefined, centerCell = undefined) {
        let queue = [this];
        if (visited == undefined)
            visited = new Map([[this, 0]]);
        if (centerCell != undefined)
            visited.set(centerCell, 0);
        let result = 1000;
        while (queue.length !== 0) {
            let v = queue.shift();
            for (let neighbor of v.neighborArray) {
                // Поиск идет только по пустым клеткам
                if (neighbor.type === CELLTYPE.Wall || neighbor == excludedCell)
                    continue;
                // Если встречен монстр, посчитать дистанцию до монстра, рекурсивно найти дистанцию от монстра до ближайшей еды, и сложить их
                if (neighbor.hasMonster) {
                    let firstPart = visited.get(v) + 1;
                    let secondPart = this.getDistanceToFood(neighbor, visited);
                    result = firstPart + secondPart;
                    continue;
                }
                // Если встречена еда, то вернуть дистанцию до нее
                if (neighbor.type === CELLTYPE.Food || neighbor.type === CELLTYPE.SuperFood) {
                    return visited.get(v) + 1;
                }
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                    visited.set(neighbor, visited.get(v) + 1);
                }
            }
        }
        // Если после нахождения еды, находящейся за монстром, не была встречена другая еда, то вернется расстояние до еды, находящейся за монстром
        return result;
    }
    getCellTypeForWallTexture(x, y) {
        if (x < 0 || x > this._game.width - 1 || y < 0 || y > this._game.height - 1)
            return CELLTYPE.Empty;
        if (this._game.cellArray[x][y].type != CELLTYPE.Wall)
            return CELLTYPE.Empty;
        return this._game.cellArray[x][y].type;
    }
    setOffsetForWallTexture() {
        let sidesArray = [];
        let cornersArray = [];
        let left;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let s = i != -1 ? -j : j;
                if (s == 0 && i == 0)
                    continue;
                let celltype = this.getCellTypeForWallTexture(this.x + s, this.y + i);
                if (s == 0 || i == 0) {
                    if (s == -1)
                        left = celltype;
                    else
                        sidesArray.push(celltype);
                }
                else
                    cornersArray.push(celltype);
            }
        }
        sidesArray.push(left);
        let emptySidesCount = sidesArray.filter((obj) => obj != CELLTYPE.Wall).length;
        let emptyCornersCount = cornersArray.filter((obj) => obj != CELLTYPE.Wall).length;
        let row;
        let column;
        switch (emptySidesCount) {
            case 0:
                switch (emptyCornersCount) {
                    // Пустая
                    case 0:
                        row = 0;
                        column = 1;
                        break;
                    // Угол
                    case 1:
                        for (let i = 0; i < 4; i++) {
                            if (cornersArray[i] == CELLTYPE.Empty) {
                                row = 2;
                                column = (i + 1) % 4;
                                break;
                            }
                        }
                        break;
                    case 2:
                        for (let i = 0; i < 4; i++) {
                            let next = (i + 1) % 4;
                            let next2 = (i + 2) % 4;
                            // Тройной
                            if (cornersArray[i] == CELLTYPE.Empty && cornersArray[next] == CELLTYPE.Empty) {
                                row = 4;
                                column = i;
                                break;
                            }
                            // Четверной
                            if (cornersArray[i] == CELLTYPE.Empty && cornersArray[next2] == CELLTYPE.Empty) {
                                row = 5;
                                column = 0;
                                break;
                            }
                        }
                        break;
                    // Четверной
                    case 3:
                        row = 5;
                        column = 0;
                        break;
                    // Четверной
                    case 4:
                        row = 5;
                        column = 0;
                        break;
                }
                break;
            // Двойной 3 или тройной 4
            case 1:
                for (let i = 0; i < 4; i++) {
                    let next2 = (i + 2) % 4;
                    let next3 = (i + 3) % 4;
                    if (sidesArray[i] == CELLTYPE.Empty) {
                        if (sidesArray[next2] == CELLTYPE.Wall) {
                            if (cornersArray[next2] == CELLTYPE.Wall && cornersArray[next3] == CELLTYPE.Wall) {
                                row = 3;
                                column = i % 2;
                                break;
                            }
                            else {
                                row = 4;
                                column = (i + 2) % 4;
                                break;
                            }
                        }
                        else {
                            row = 3;
                            column = i % 2;
                            break;
                        }
                    }
                }
                break;
            case 2:
                for (let i = 0; i < 4; i++) {
                    let next = (i + 1) % 4;
                    let next2 = (i + 2) % 4;
                    // Угол
                    if (sidesArray[i] == CELLTYPE.Empty && sidesArray[i] == sidesArray[next]) {
                        row = 2;
                        column = i;
                        break;
                    }
                    // Двойной
                    if (sidesArray[i] == CELLTYPE.Empty && sidesArray[i] == sidesArray[next2]) {
                        row = 3;
                        column = i % 2;
                        break;
                    }
                }
                break;
            // Конец
            case 3:
                for (let i = 0; i < 4; i++) {
                    if (sidesArray[i] == CELLTYPE.Wall) {
                        row = 1;
                        column = i;
                        break;
                    }
                }
                break;
            // Точка
            case 4:
                row = 0;
                column = 0;
                break;
        }
        this.sy = row * 56;
        this.sx = column * 56;
    }
    _setImage() {
        this._image = new Image();
        if (this.type == CELLTYPE.Wall) {
            this._image.src = "src/assets/img/level-scaled.png";
            this._image.onload = function () {
                this.draw();
            }.bind(this);
        }
    }
    draw() {
        // drawText нужен для отрисовки весов (дебаггинг)
        this._drawRectangle("black");
        switch (this.type) {
            // case CELLTYPE.Empty: {
            //     // this._drawText(this.weight.toString(), "purple");
            //     break;
            // }
            case CELLTYPE.Food: {
                this._drawCircle("#cbcbd0");
                // this._drawText(this.weight.toString(), "purple");
                break;
            }
            case CELLTYPE.SuperFood: {
                this._drawCircle("red", 1.5);
                // this._drawText(this.weight.toString(), "purple");
                break;
            }
            case CELLTYPE.Wall: {
                this._drawImage();
                // this._drawText(this.weight.toString(), "purple");
                break;
            }
            default: {
                return;
            }
        }
    }
    _drawRectangle(color) {
        this._context.fillStyle = color;
        this._context.fillRect(this.x * this._drawSize, this.y * this._drawSize, this._drawSize, this._drawSize);
    }
    _drawCircle(color, radiusMultiplier = 1) {
        const middleOfCellSize = this._drawSize / 2;
        this._context.beginPath();
        this._context.arc(this.x * this._drawSize + middleOfCellSize, this.y * this._drawSize + middleOfCellSize, middleOfCellSize / 2 * radiusMultiplier, 0, 2 * Math.PI, false);
        this._context.fillStyle = color;
        this._context.fill();
        this._context.lineWidth = 1;
        this._context.strokeStyle = color;
        this._context.stroke();
    }
    _drawImage() {
        this._context.drawImage(this._image, this.sx, this.sy, 56, 56, this.x * this._drawSize, this.y * this._drawSize, this._drawSize, this._drawSize);
    }
    _drawText(text, color) {
        this._context.fillStyle = color;
        this._context.fillText(text, this.x * this._drawSize + 5, this.y * this._drawSize + 8);
    }
}
