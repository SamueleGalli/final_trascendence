import { canvas, ctx } from './globals.js';

export class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5; 
        this.twinkleSpeed = Math.random() * 0.02 + 0.02;
        this.alpha = Math.random();
    }
    
    update() {
        this.alpha += this.twinkleSpeed;
        // Invert twinkling direction if exceeds limits
        if (this.alpha > 1 || this.alpha < 0) {
            this.twinkleSpeed *= -1; 
        }
    }
    render() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; 
        ctx.beginPath(); // Inizia un nuovo percorso
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}