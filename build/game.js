const level1 = `wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeemeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeewwwwwwwwwwwwwwwwweeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
wfeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeemeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
weeeeeeeeeeeeeeeeeeeeeeeeeeeew
wpeeeeeeeeeeeeeeeeeeeeeeeeeeew
wwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;
class Game {
    constructor(w, h) {
        this.score = 0;
        this.isStarted = false;
        this.monstersArray = [];
        this.cellArray = [];
        this.width = w;
        this.height = h;
        this.canvas = document.getElementById("field");
        this.context = this.canvas.getContext("2d");
        this.drawDot();
    }
    drawDot() {
        this.context.fillStyle = "black";
        this.context.fillRect(30, 30, 10, 10);
    }
    startGame() {
        if (!this.isStarted) {
            setTimeout(() => this.updateTimer(), 100);
        }
    }
    stopGame() {
        if (this.isStarted) {
            this.isStarted = false;
        }
    }
    updateTimer() {
        if (this.isStarted) {
            setTimeout(() => this.updateTimer(), 100);
        }
    }
    initLevel() {
    }
    update() {
    }
}
const game = new Game(30, 30);
export {};
