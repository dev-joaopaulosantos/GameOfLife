class GameOfLife {
    constructor(width, height) {
        this.canvas = new Canvas();
        this.boardSize = {
            width: width,
            height: height
        };

        this.cellSize = {
            width: this.canvas.width / width,
            height: this.canvas.height / height
        };

        this.cells = [];
        this.initializeCells();
        this.initializeNeighbors();
    }

    initializeCells() {
        for (let y = 0; y < this.boardSize.height; y++) {
            let row = [];
            this.cells.push(row);
            for (let x = 0; x < this.boardSize.width; x++) {
                let cell = new Cell(
                    false,
                    x * this.cellSize.width,
                    y * this.cellSize.height
                );
                row.push(cell);
            }
        }
    }

    initializeNeighbors() {
        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                cell.neighbors = [];
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx !== 0 || dy !== 0) {
                            let neighborX = x + dx;
                            let neighborY = y + dy;
                            if (
                                neighborX >= 0 &&
                                neighborX < this.boardSize.width &&
                                neighborY >= 0 &&
                                neighborY < this.boardSize.height
                            ) {
                                let neighborCell = this.cells[neighborY][neighborX];
                                cell.neighbors.push(neighborCell);
                            }
                        }
                    }
                }
            });
        });
    }

    calculateNextState() {
        this.cells.forEach(row => {
            row.forEach(cell => {
                let aliveNeighbors = cell.neighbors.reduce(
                    (total, neighborCell) => total + neighborCell.alive,
                    0
                );
                if (cell.alive) {
                    cell.nextState = +(aliveNeighbors >= 2 && aliveNeighbors <= 3);
                } else {
                    cell.nextState = +(aliveNeighbors === 3);
                }
            });
        });
    }

    updateState() {
        this.cells.forEach(row => {
            row.forEach(cell => {
                cell.alive = cell.nextState;
            });
        });
    }

    render() {
        this.cells.forEach(row => {
            row.forEach(cell => {
                this.renderCell(cell);
            });
        });
    }

    renderCell(cell) {
        this.canvas.rectangle(
            cell.x,
            cell.y,
            this.cellSize.width,
            this.cellSize.height,
            "black",
            cell.alive ? "green" : "white"
        );
    }

    execute() {
        this.calculateNextState();
        this.updateState();
        this.render();
    }
}

class Cell {
    constructor(alive, x, y) {
        this.alive = alive;
        this.x = x;
        this.y = y;
        this.nextState = 0;
        this.neighbors = [];
    }
}

let game = new GameOfLife(20, 20);
game.render()
let intervalId = null;

document.getElementById("start").addEventListener("click", () => {
    if (intervalId === null) {
        intervalId = setInterval(() => {
            game.execute();
        }, 200);
    }
});

document.getElementById("stop").addEventListener("click", () => {
    clearInterval(intervalId);
    intervalId = null;
});

const canvasElement = document.getElementById("canvas");

canvasElement.addEventListener("click", handleClick);

function handleClick(event) {
    const rect = canvasElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const cellX = Math.floor(clickX / game.cellSize.width);
    const cellY = Math.floor(clickY / game.cellSize.height);
    const cell = game.cells[cellY][cellX];
    cell.alive = !cell.alive;
    game.renderCell(cell);
}

document.getElementById("clear").addEventListener("click", () => {
    game.cells.forEach(row => {
        row.forEach(cell => {
            cell.alive = false;
            game.renderCell(cell);
        });
    });
});
