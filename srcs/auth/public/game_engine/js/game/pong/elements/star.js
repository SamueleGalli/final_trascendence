export class Star {
    constructor(game, canvas, ctx) {
        const maxWidth = canvas.width - game.wallThickness * 2;
        const minWidth = game.wallThickness * 2;
        const maxHeight = canvas.height - game.wallThickness * 2;
        const minHeight = game.wallThickness * 2;
        this.x = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
        this.y = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        this.size = Math.random() * game.canvas.width * 0.002; 
        this.twinkleSpeed = Math.random() * 0.05;
        this.alpha = Math.random();
        this.canvas = canvas;
        this.ctx = ctx;
    }
    
    update() {
        this.alpha += this.twinkleSpeed;
        // Invert twinkling direction if exceeds limits
        if (this.alpha > 1 || this.alpha < 0) {
            this.twinkleSpeed *= -1; 
        }
    }

    render() {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; 
        this.ctx.beginPath(); // Start a new path
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}