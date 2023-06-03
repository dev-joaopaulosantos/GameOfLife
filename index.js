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
                let cell = {
                    alive: randomInt(0, 2),
                    x: x * this.cellSize.width,
                    y: y * this.cellSize.height,
                    nextState: 0
                };
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

function randomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

let game = new GameOfLife(20, 20);
game.render()
let intervalId = null;

document.getElementById("start").addEventListener("click", () => {
  // Verifica se o jogo já está em execução
  if (intervalId === null) {
    // Inicia o jogo apenas se não estiver em execução
    intervalId = setInterval(() => {
      game.execute();
    }, 200);
  }
});

document.getElementById("stop").addEventListener("click", () => {
  // Para o jogo
  clearInterval(intervalId);
  intervalId = null;
});

document.getElementById("reset").addEventListener("click", () => {
  // Reinicia o jogo
  clearInterval(intervalId);
  intervalId = null;
  game = new GameOfLife(20, 20);
});

