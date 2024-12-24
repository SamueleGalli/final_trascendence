export class Particle {
    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.size = Math.random() + 1;
        this.decay = 0.03;
        this.spread = 30;
        this.speed = 0.1;
        this.hue = Math.random() * 360;
        this.spreadX = (Math.random() - 0.5) * this.spread * this.speed; // Random variation of particle direction X
        this.spreadY = (Math.random() - 0.5) * this.spread * this.speed; // Random variation of particle direction Y
        this.color = `hsl(${this.hue}deg 90% 60%)`;
        this.ctx = ctx;
    }

    update() {
        this.x += this.spreadX * this.size;
        this.y += this.spreadY * this.size;
        this.size -= this.decay;
    }

    render() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}