export class Powerup {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = this.canvas.width * 0.06;
        this.height = this.canvas.width * 0.06;
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = Math.random() * (this.canvas.height - this.height);
        this.type = this.getType();
    }

    getType() { 
    
        const typeNum = Math.floor(Math.random() * 3) + 1;
    
        switch (typeNum) {
            case 1:
                return "shrinker";
            case 2:
                return "teleport";
            case 3:
                return "invisible";
        }
    }

    resize() {
        this.width = this.canvas.width * 0.06;
        this.height = this.canvas.width * 0.06;
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = Math.random() * (this.canvas.height - this.height);
    }


    render() {
            if (this.type === "shrinker")
                this.ctx.fillStyle = "#00ff00";
            else if (this.type === "teleport")
                this.ctx.fillStyle = "#0000ff";
            else
                this.ctx.fillStyle = "#ff0000";
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}

export function handlePowerups(game) {
    // Generate a new power-up every 5 seconds
    if (!game.powerUpTimerStarted) {
        game.powerUpTimerStarted = true;
        setTimeout(() => {
            if (!game.gameEnd)
            {
                let power_up = new Powerup(game.canvas, game.ctx);
                game.powerup.push(power_up)
            }
            
        }, 5000);
    }
}

