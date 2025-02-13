import { Particle } from './particle.js'

export class ParticlePool {
    constructor(game, maxSize) {
        this.pool = [];
        this.maxSize = maxSize;
        for (let i = 0; i < maxSize; i++) {
            this.pool.push(new Particle(game)); 
        }
    }

    getParticle(x, y, game) {
        if (this.pool.length > 0) {
            const particle = this.pool.pop(); 
            particle.reset(x, y, game); // Reuse particle
            return particle;
        }
        return null; 
    }

    releaseParticle(particle) {
        if (this.pool.length < this.maxSize) {
            this.pool.push(particle); // Release particle in the pool
        }
    }
}