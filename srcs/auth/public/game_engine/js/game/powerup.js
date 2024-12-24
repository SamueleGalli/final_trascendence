import { canvas, ctx } from "./start.js";


export class Powerup {
    constructor() {
        this.width = canvas.width * 0.06;
        this.height = canvas.width * 0.06;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = Math.random() * (canvas.height - this.height);
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
        this.width = canvas.width * 0.06;
        this.height = canvas.width * 0.06;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = Math.random() * (canvas.height - this.height);
    }


    render() {
            if (this.type === "shrinker")
                ctx.fillStyle = "#00ff00";
            else if (this.type === "teleport")
                ctx.fillStyle = "#0000ff";
            else
                ctx.fillStyle = "#ff0000";
            ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}

