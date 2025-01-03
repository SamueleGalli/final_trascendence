export class MainPageParticle { // Rinominato Particle a MainPageParticle
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.initialSize = this.size;
        this.life = 100;
        this.hue = Math.random() * 360;
        this.spread = 10;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = (Math.random() - 0.5) * 4;
        this.alpha = 1;
        this.gravity = 0.05;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size = Math.max(0, this.size - 0.1);
        this.alpha = Math.max(0, this.alpha - 0.02);
        this.speedX *= 0.98;
        this.speedY += this.gravity;
        this.life--;

        if (this.life <= 0) {
            return false;
        }
        return true;
    }

    render(mainPageCtx) {
        mainPageCtx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
        mainPageCtx.beginPath();
        mainPageCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        mainPageCtx.fill();
    }
}