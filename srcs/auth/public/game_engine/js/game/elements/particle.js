export class Particle {
    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.6 + 1;
        this.decay = 0.03;
        this.spread = 30;
        this.speed = 0.1;
        this.hue = Math.random() * 360;
        this.alpha = 1;
        this.spreadX = (Math.random() - 0.5) * this.spread * this.speed; // Random variation of particle direction X
        this.spreadY = (Math.random() - 0.5) * this.spread * this.speed; // Random variation of particle direction Y
        this.ctx = ctx;
    }

    update() {
        this.x += this.spreadX * this.size;
        this.y += this.spreadY * this.size;
        this.size -= this.decay;
    }

    render() {
        this.ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}


export function addParticles(game, x, y, count) {
    for (let i = 0; i < count; i++) {
        const particle = new Particle(x, y, game.ctx);
        game.particles.push(particle);
    }
}

export function updateParticles(game) {
        for (let i = game.particles.length - 1; i >= 0; i--) {
            game.particles[i].update();
            if (game.particles[i].size <= 0) {
                game.particles.splice(i, 1);
            }
        }
    }
    
export function renderParticles(game) {
    for (const particle of game.particles) {
        particle.render();
    }
}