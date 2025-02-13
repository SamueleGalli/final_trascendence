export class Particle {
    constructor(game, x, y, ctx) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * game.canvas.width * 0.002; 
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

    reset(x, y, game) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * game.canvas.width * 0.002; 
        this.decay = 0.03;
        this.spread = 30;
        this.speed = 0.1;
        this.hue = Math.random() * 360;
        this.spreadX = (Math.random() - 0.5) * this.spread * this.speed; // Random variation of particle direction X
        this.spreadY = (Math.random() - 0.5) * this.spread * this.speed; // Random variation of particle direction Y
        this.color = `hsl(${this.hue}deg 90% 60%)`;
        this.ctx = game.ctx;
    }
}

export function addParticles(game, x, y, count) {
    for (let i = 0; i < count; i++) {
        const particle = game.particlePool.getParticle(x, y, game);
        if (particle) {
            game.particles.push(particle);
        }
    }
}
    

export function updateParticles(game) {
        for (let i = game.particles.length - 1; i >= 0; i--) {
            game.particles[i].update();
            if (game.particles[i].size <= 0) {
                game.particlePool.releaseParticle(game.particles[i]); // Rilascia la particella
                game.particles.splice(i, 1); // Rimuovi dalla lista attiva
            }
        }
}

export function renderParticles(game) {
    for (const particle of game.particles) {
        particle.render();
    }
}