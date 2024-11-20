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

    // Metodo per muovere la racchetta
    move(direction) 
    {
        if (direction === 'up')
            this.y = Math.max(0, this.y - this.speed); //sposto su senza superare 0
        else if (direction === 'down')
            this.y = Math.min(window.innerHeight - this.height, this.y + this.speed); //sposto giu senza superare la finestra
    }

    // Previsione della posizione Y della palla
    predictBallY(ball)
    {
        // Se la palla si sta muovendo verso la IA
        if (ball.speedx > 0)
        {
            // Tempo necessario affinché la palla raggiunga la IA
            let timeToReachAI = (window.innerWidth - ball.x) / ball.speedx;

            // Prevedi la posizione Y della palla in quel momento
            let futureBallY = ball.y + ball.speedy * timeToReachAI;
            
            // Inizializza variabili per calcolare eventuali rimbalzi della palla
            const maxBounces = 10; // Limite massimo di rimbalzi da calcolare per evitare loop infiniti
            let bounces = 0; // Contatore per il numero di rimbalzi

            // Calcola il rimbalzo se la palla supera i bordi dello schermo
            while ((futureBallY < 0 || futureBallY > window.innerHeight) && bounces < maxBounces)
            {
                bounces++; // Incrementa il contatore dei rimbalzi
                if (futureBallY < 0)
                {
                    // La palla ha colpito il bordo superiore
                    futureBallY = -futureBallY; // Calcola la nuova posizione Y dopo il rimbalzo
                }
                else if (futureBallY > window.innerHeight)
                {
                // La palla ha colpito il bordo inferiore
                futureBallY = 2 * window.innerHeight - futureBallY; // Calcola la nuova posizione Y dopo il rimbalzo
                }
            }
        // Restituisci la posizione Y prevista della palla dopo aver considerato i rimbalzi
        return futureBallY;
        }
        // Se la palla non si sta muovendo verso la racchetta dell'IA, restituisci la posizione Y attuale
        return ball.y;
    }

    // Funzione per aggiornare la posizione della racchetta IA
    move_ia(ball) 
    {
        let targetY = this.predictBallY(ball); // Previsione posizione palla
        // Distanza tra la posizione della palla prevista e il centro della racchetta
        let distance = targetY - (this.y + this.height / 2);
        let direction = Math.sign(distance);  // Decidi la direzione del movimento usando Math.sign

        // Usa una velocità basata su un fattore fisso
        let aiSpeed = this.speed * 0.2;  // Riduce la velocità dell'this in base al fattore
        // Muovi la racchetta basandosi sulla velocità e sulla distanza
        if (Math.abs(distance) > aiSpeed)
            this.y += aiSpeed * direction;
        else
            this.y += distance;
        // Limita il movimento della racchetta all'interno dello schermo
        this.speed = canvas.height * 0.0020;
        if (this.y < 0)
            this.y = 0;   
        if (this.y + this.height > window.innerHeight)
            this.y = window.innerHeight - this.height;
        if (distance < -5) 
            this.move('up'); // Muovi verso l'alto
        else if (distance > 5) 
            this.move('down'); // Muovi verso il basso
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