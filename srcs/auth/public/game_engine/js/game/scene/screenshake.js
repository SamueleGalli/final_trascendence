// ScreenShake.js
export class ScreenShake {
    constructor() {
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeTimer = 0;
    }

    start(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeTimer = duration;
    }

    update() {
        if (this.shakeTimer > 0) {
            this.shakeTimer--;
        }
    }

    apply(context) {
        if (this.shakeTimer > 0) {
            const offsetX = (Math.random() - 0.5) * this.shakeIntensity;
            const offsetY = (Math.random() - 0.5) * this.shakeIntensity;
            context.translate(offsetX, offsetY);
        }
    }

    reset(context) {
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}


/*export function screenShake(game, duration, intensity) {
        const startTime = performance.now();
    
        function shakeFrame(time) {
            const elapsedTime = time - startTime;
    
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                const currentIntensity = intensity * (1 - progress);
    
                const offsetX = (Math.random() - 0.5) * currentIntensity;
                const offsetY = (Math.random() - 0.5) * currentIntensity;

                game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
                game.ctx.translate(offsetX, offsetY);
                //gameContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                requestAnimationFrame(shakeFrame);
            } else {
                game.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }
        requestAnimationFrame(shakeFrame);
}*/