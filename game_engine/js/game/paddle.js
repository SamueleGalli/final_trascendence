import { canvas, ctx } from './globals.js';

export class Paddle {
    constructor(x, upKey, downKey) {
        this.width = canvas.width * 0.01;
        this.height = canvas.height * 0.2;
        this.x = x - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.radius = this.width / 2;
        this.baseSpeed = canvas.height * 0.008; // Base speed based on screen height
        this.speed = this.baseSpeed; // Initialize speed based on canvas height
        this.upKey = upKey;
        this.downKey = downKey;
        this.moveUp = false;
        this.moveDown = false;
    }

    handleInput(key, isPressed) {
        if (key === 'W' || key === 'S') key = key.toLowerCase();
        if (key === this.upKey) this.moveUp = isPressed;
        if (key === this.downKey) this.moveDown = isPressed;
    }

    update() {
        if (this.moveUp && this.y > 15) this.y -= this.speed;
        if (this.moveDown && this.y + this.height < canvas.height - 15) this.y += this.speed;
    }

    resize(oldCanvasHeight, newCanvasHeight) {
        // Aggiorna l'altezza e la velocità della racchetta in base alle nuove dimensioni del canvas
        this.height = newCanvasHeight * 0.2; // Adatta l'altezza della racchetta in base alla nuova altezza del canvas
        this.speed = (newCanvasHeight / oldCanvasHeight) * this.baseSpeed; // Adatta la velocità in base al cambiamento della altezza
        this.y = newCanvasHeight / 2 - this.height / 2; // Riposiziona la racchetta al centro
    }    

    // Metodo per muovere la racchetta
    move(direction) {
        if (direction === 'up')
            this.y = Math.max(0, this.y - this.speed); //sposto su senza superare 0
        else if (direction === 'down')
            this.y = Math.min(window.innerHeight - this.height, this.y + this.speed); //sposto giu senza superare la finestra
    }

    // Previsione della posizione Y della palla
    predictBallY(ball) {
        if (ball.speedx > 0) {
            let timeToReachAI = (window.innerWidth - ball.x) / ball.speedx;
            let futureBallY = ball.y + ball.speedy * timeToReachAI;

            const maxBounces = 10;
            let bounces = 0;
            while ((futureBallY < 0 || futureBallY > window.innerHeight) && bounces < maxBounces) {
                bounces++;
                if (futureBallY < 0) {
                    futureBallY = -futureBallY;
                } else if (futureBallY > window.innerHeight) {
                    futureBallY = 2 * window.innerHeight - futureBallY;
                }
            }
            return futureBallY;
        }
        return ball.y;
    }

    move_ia(ball, lastMoveTime) {
        const now = Date.now();
        if (now - lastMoveTime > 1000) { // 1 second
            lastMoveTime = now;

            let targetY = this.predictBallY(ball);
            let distance = targetY - (this.y + this.height / 2);
            let direction = Math.sign(distance);

            // Adjust AI speed based on canvas height (this makes the AI move slower on smaller screens)
            let aiSpeed = this.speed * 0.2; 

            // Move the AI paddle
            if (Math.abs(distance) > aiSpeed)
                this.y += aiSpeed * direction;
            else
                this.y += distance;

            // Limit AI paddle movement within the screen
            this.speed = canvas.height * 0.0060;
            if (this.y < 0) this.y = 0;
            if (this.y + this.height > window.innerHeight) this.y = window.innerHeight - this.height;

            if (distance < -5) this.move('up');
            else if (distance > 5) this.move('down');
        }
    }

    render() {
        ctx.fillStyle = 'white';
        this.drawRoundedRect(ctx);
    }

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
