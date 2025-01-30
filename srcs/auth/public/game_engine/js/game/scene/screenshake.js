export function screenShake(duration, intensity) {
        const startTime = performance.now();
    
        function shakeFrame(time) {
            const elapsedTime = time - startTime;
    
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                const currentIntensity = intensity * (1 - progress);
    
                const offsetX = (Math.random() - 0.5) * currentIntensity;
                const offsetY = (Math.random() - 0.5) * currentIntensity;
    
                gameContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                requestAnimationFrame(shakeFrame);
            } else {
                gameContainer.style.transform = 'translate(0, 0)';
            }
        }
        requestAnimationFrame(shakeFrame);
    }