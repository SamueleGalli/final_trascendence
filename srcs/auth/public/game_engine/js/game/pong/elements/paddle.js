export class Paddle {
    constructor(canvas, x, upKey, downKey, color) {
        this.width = canvas.width * 0.01;
        this.height = canvas.height * 0.2;
        this.canvas = canvas;
        this.x = x - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.radius = this.width / 2;
        this.color = color;
        this.speedPercentage = 0.5;
        this.baseSpeed = canvas.height * this.speedPercentage; // Base speed based on screen height
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

    update(game) {
        if (this.moveUp && this.y > game.wallThickness * 1.5) this.y -= this.speed * game.deltaTime;
        if (this.moveDown && this.y + this.height < this.canvas.height - game.wallThickness * 1.5) this.y += this.speed * game.deltaTime;
    }

    resize(game) {
        const paddleRelativeX = this.x / game.oldCanvasWidth;
        const paddleRelativeY = this.y / game.oldCanvasHeight;
        const paddleRelativeSpeed = this.baseSpeed / game.oldCanvasHeight;

        this.x = paddleRelativeX * game.canvas.width;
        this.y = paddleRelativeY * game.canvas.height;
    
        // Ricalcola la velocità della palla
        this.baseSpeed = paddleRelativeSpeed * game.canvas.height;
        // Calculate new radius
        this.radius = game.canvas.width * 0.006;
        this.width = game.canvas.width * 0.01;
        this.height = game.canvas.height * 0.2;
        //this.x = x - this.width / 2;
        //this.y = game.canvas.height / 2 - this.height / 2;
        this.radius = this.width / 2;
        this.speed = this.baseSpeed; // Initialize speed based on canvas height
        /*if (this.isPaddle2) {
            this.x = newCanvasWidth - this.width - 10;
        }*/
    }

    reset() {
        this.height = this.canvas.height * 0.2;
    }

    // Metodo per muovere la racchetta
    move(direction) {
        if (direction === 'up')
            this.y = Math.max(0, this.y - this.speed); //sposto su senza superare 0
        else if (direction === 'down')
            this.y = Math.min(window.innerHeight - this.height, this.y + this.speed); //sposto giu senza superare la finestra
    }

    shrink() {
        this.height = this.height / 2;  
    }

    predictBallY(ball) {
        if (ball.speedx > 0) {
            let timeToReachAI = (this.canvas.width - ball.x) / ball.speedx;
            let futureBallY = ball.y + ball.speedy * timeToReachAI;

            const maxBounces = 10;
            let bounces = 0;
            while ((futureBallY < 0 || futureBallY > this.canvas.height) && bounces < maxBounces) {
                bounces++;
                if (futureBallY < 0)
                    futureBallY = -futureBallY;
                else if (futureBallY > this.canvas.height)
                    futureBallY = 2 * this.canvas.height - futureBallY;
            }
            return futureBallY;
        }
        return ball.y;
    }

    move_ia(ball, game, lastMoveTime) {
        const now = Date.now();
        if (now - lastMoveTime > 1000) // 1 secondo
            lastMoveTime = now;
        
        if (ball.speedX > 0) { // Solo se la palla si muove verso destra
            this.speed = this.baseSpeed * this.speedPercentage;
    
            let targetY = this.predictBallY(ball);  // Previsione posizione futura della palla
            let currentCenter = this.y + this.height / 2; // Centro della paddle
            let distance = targetY - currentCenter;  // Differenza tra paddle e palla
            let direction = Math.sign(distance);  // Direzione del movimento
    
            // Smorzamento per evitare oscillazioni brusche
            let smoothingFactor = 4; // Riduci se l'IA si muove troppo lenta
            let aiSpeed = this.speed * game.deltaTime * smoothingFactor; 
    
            // Se la distanza è maggiore della velocità calcolata, muoviti gradualmente
            if (Math.abs(distance) > aiSpeed)
                this.y += aiSpeed * direction;
            else
                this.y += distance; // Muoviti direttamente alla posizione target se molto vicina
    
            // Limita il movimento della paddle dentro i confini del canvas
            this.y = Math.max(game.wallThickness * 1.5, Math.min(this.canvas.height - this.height - game.wallThickness * 1.5, this.y));
        }
    }
    

    render(ctx) {
        ctx.fillStyle = this.color;
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