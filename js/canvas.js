class Canvas{
    constructor(){
        this.canvas = document.getElementById("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.width = this.ctx.canvas.clientWidth
        this.height = this.ctx.canvas.clientHeight
    }

    rectangle(x, y, width, height, borderColor, innerColor){
        this.ctx.fillStyle = innerColor
        this.ctx.strokeStyle = borderColor
        if(innerColor) this.ctx.fillRect(x, y, width, height)
        if(borderColor) this.ctx.strokeRect(x, y, width, height)
    }
}