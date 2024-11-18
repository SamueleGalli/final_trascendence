import { canvas, ctx } from './globals.js';

export class Paddle {
    constructor(x, upKey, downKey) {
        this.width = canvas.width * 0.01;
        this.height = canvas.height * 0.2;
        this.x = x - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.radius = this.width / 2;
        this.speed = canvas.height * 0.008;
        this.upKey = upKey;
        this.downKey = downKey;
        this.moveUp = false;
        this.moveDown = false;
    }

    handleInput(key, isPressed) {
        if (key === 'W' || key === 'S')
            key = key.toLowerCase();
        if (key === this.upKey) this.moveUp = isPressed;
        if (key === this.downKey) this.moveDown = isPressed;
    }

    update() {
        if (this.moveUp && this.y > 15) this.y -= this.speed;
        if (this.moveDown && this.y + this.height < canvas.height - 15) this.y += this.speed;
    }

    resize(oldCanvasHeight, newCanvasHeight) {

        this.y = canvas.height / 2 - this.height / 2;
        // Resize paddle height
        this.height = (canvas.height * 0.2);
        
    }

    render() {
        ctx.fillStyle = 'white';
        this.drawRoundedRect(ctx);
    }

    // Draw Paddles (rounded)
    drawRoundedRect(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x + this.radius, this.y);
        ctx.lineTo(this.x + this.width - this.radius, this.y);
        ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.radius, this.radius);
        ctx.lineTo(this.x + this.width, this.y + this.height - this.radius);
        ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - this.radius, this.y + this.height, this.radius);
        ctx.lineTo(this.x + this.radius, this.y + this.height);
        ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - this.radius, this.radius);
        ctx.lineTo(this.x, this.y + this.radius);
        ctx.arcTo(this.x, this.y, this.x + this.radius, this.y, this.radius);
        ctx.fill();
        ctx.closePath();
    }
}