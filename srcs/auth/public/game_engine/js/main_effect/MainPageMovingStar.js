export class MainPageMovingStar {
    constructor(mainPageCanvas, mainPageCtx) {
        this.mainPageCanvas = mainPageCanvas;
        this.mainPageCtx = mainPageCtx;
        this.x = Math.random() * this.mainPageCanvas.width;
        this.y = Math.random() * this.mainPageCanvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.alpha = Math.random() * 0.5 + 0.5;
        this.color = `rgba(255, 255, 255, ${this.alpha})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.mainPageCanvas.width) this.x = 0;
        if (this.x < 0) this.x = this.mainPageCanvas.width;
        if (this.y > this.mainPageCanvas.height) this.y = 0;
        if (this.y < 0) this.y = this.mainPageCanvas.height;
    }

    render() {
        this.mainPageCtx.fillStyle = this.color;
        this.mainPageCtx.beginPath();
        this.mainPageCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.mainPageCtx.fill();
    }
}