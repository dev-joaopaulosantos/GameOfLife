class Canvas{
    constructor(){
        this.canvas = document.getElementById("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.width = this.ctx.canvas.clientWidth
        this.height = this.ctx.canvas.clientHeight
    }

    rectangle(x, y, larg, alt, corBorda, corInterna){
        this.ctx.fillStyle = corInterna
        this.ctx.strokeStyle = corBorda
        if(corInterna) this.ctx.fillRect(x, y, larg, alt)
        if(corBorda) this.ctx.strokeRect(x, y, larg, alt)
    }
}

// ctx.fillRect(50,100,100,100)