class GameOfLife {
    constructor(width, height) {
        this.canvas = new Canvas() // instancia do obj Canvas
        this.boardSize = {
            width: width,
            height: height
        }

        this.cellSize = {
            width: this.canvas.width / width,
            height: this.canvas.height / height
        }

        this.cells = []
        this.initializeCells() // celulas do jogo
        this.initializeNeighbors() // vizinhos de cada celula
    }

    initializeCells() {
        for (let y = 0; y < this.boardSize.height; y++) {
            let row = []
            this.cells.push(row)
            for (let x = 0; x < this.boardSize.width; x++) {
                let cell = new Cell(
                    false, // iniciada morta
                    x * this.cellSize.width, // posicao x da celula
                    y * this.cellSize.height // posicao y da celula
                )
                row.push(cell)
            }
        }
    }

    initializeNeighbors() {
        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                cell.neighbors = []
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx !== 0 || dy !== 0) {
                            let neighborX = x + dx
                            let neighborY = y + dy
                            if (
                                neighborX >= 0 &&
                                neighborX < this.boardSize.width &&
                                neighborY >= 0 &&
                                neighborY < this.boardSize.height
                            ) {
                                let neighborCell = this.cells[neighborY][neighborX]
                                cell.neighbors.push(neighborCell) // adiciona o vizinho na lista de vizinhos da celula
                            }
                        }
                    }
                }
            })
        })
    }

    calculateNextState() {
        this.cells.forEach(row => {
            row.forEach(cell => {
                let aliveNeighbors = cell.neighbors.reduce(
                    (total, neighborCell) => total + neighborCell.alive,
                    0
                )
                if (cell.alive) {
                    cell.nextState = +(aliveNeighbors >= 2 && aliveNeighbors <= 3) // determina o próximo estado da celula viva
                } else {
                    cell.nextState = +(aliveNeighbors === 3) // determina o próximo estado da celula morta
                }
            })
        })
    }

    updateState() {
        this.cells.forEach(row => {
            row.forEach(cell => {
                cell.alive = cell.nextState // atualiza o estado da celula para o próximo estado
            })
        })
    }

    render() {
        this.cells.forEach(row => {
            row.forEach(cell => {
                this.renderCell(cell) // renderiza a celula
            })
        })
    }

    renderCell(cell) {
        this.canvas.rectangle(
            cell.x,
            cell.y,
            this.cellSize.width,
            this.cellSize.height,
            "#FFF", // estilos da celula
            cell.alive ? "#ffff00" : "#7e7e7e"
        )
    }

    execute() {
        this.calculateNextState()
        this.updateState()
        this.render()
    }
}

class Cell {
    constructor(alive, x, y) {
        this.alive = alive // celula (viva ou morta)
        this.x = x // posição x
        this.y = y // posição y
        this.nextState = 0 // proximo estado da celula
        this.neighbors = [] // lista de vizinhos da celula
    }
}

let game = new GameOfLife(15, 15)
game.render()
let intervalId = null

// botão start
document.getElementById("start").addEventListener("click", () => {
    if (intervalId === null) {
        intervalId = setInterval(() => {
            game.execute()
        }, 200)
    }
})

// botão stop
document.getElementById("stop").addEventListener("click", () => {
    clearInterval(intervalId)
    intervalId = null
})

const canvasElement = document.getElementById("canvas")

canvasElement.addEventListener("click", handleClick)

function handleClick(event) {
    // Obtém as informações de posição da celula clicada
    const rect = canvasElement.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top
    const cellX = Math.floor(clickX / game.cellSize.width)
    const cellY = Math.floor(clickY / game.cellSize.height);
    const cell = game.cells[cellY][cellX];
    cell.alive = !cell.alive; // inverte o estado da celula
    game.renderCell(cell); // renderiza a celula com o novo estado
}

// botão clear
document.getElementById("clear").addEventListener("click", () => {
    game.cells.forEach(row => {
        row.forEach(cell => {
            cell.alive = false
            game.renderCell(cell)
        })
    })
    clearInterval(intervalId)
    intervalId = null
})
