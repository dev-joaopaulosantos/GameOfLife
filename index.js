class GameOfLife {
    constructor(width, height) {
        this.canvas = new Canvas()
        this.BoardSize = {
            width: width,
            height: height
        }

        this.CellSize = {
            width: this.canvas.width / width,
            height: this.canvas.height / height
        }

        this.Cells = []
        this.startCells()
        this.startNears()
    }
    startCells() {
        for (let y = 0; y < this.BoardSize.height; y++) {
            let line = []
            this.Cells.push(line)
            for (let x = 0; x < this.BoardSize.width; x++) {
                let cell = {
                    alive: randomInt(0, 2),
                    x: x * this.CellSize.width,
                    y: y * this.CellSize.height,
                    next: 0
                }
                line.push(cell)
            }
        }
    }
    startNears() {
        this.Cells.forEach((line, y) => {
            line.forEach((cell, x) => {
                cell.nears = []
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx !== 0 || dy !== 0) {
                            let nearX = x + dx
                            let nearY = y + dy
                            if (nearX >= 0 && nearX < this.BoardSize.width && nearY >= 0 && nearY < this.BoardSize.height) {
                                let nearCell = this.Cells[nearY][nearX]
                                cell.nears.push(nearCell)
                            }
                        }
                    }
                }
            })
        })
    }
    calculate() {
        this.Cells.forEach(line => {
            line.forEach(cell => {
                let nears = 0
                cell.nears.forEach(nearCell => {
                    nears += nearCell.alive
                })
                if (cell.alive) cell.next = +(nears >= 2 && nears <= 3)
                else cell.next = +(nears == 3)
            })
        })
    }
    update() {
        this.Cells.forEach(line => {
            line.forEach(cell => {
                cell.alive = cell.next
            })
        })
    }
    render() {
        this.Cells.forEach(line => {
            line.forEach(cell => {
                this.renderCell(cell)
            })
        })
    }
    renderCell(cell) {
        this.canvas.rectangle(cell.x, cell.y, this.CellSize.width, this.CellSize.height, "black", cell.alive ? "green" : "white")
    }
    execute() {
        this.calculate()
        this.update()
        this.render()
    }
}

function randomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

let game = new GameOfLife(20, 20)

function executeGame() {
    game.execute()
    // requestAnimationFrame(executeGame)

}
requestAnimationFrame(executeGame)