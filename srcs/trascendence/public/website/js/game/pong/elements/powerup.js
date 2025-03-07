export class Powerup {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = this.canvas.width * 0.06;
        this.height = this.canvas.width * 0.06;
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = Math.random() * (this.canvas.height - this.height);
        this.type = this.getType();

        this.sprites = {};
        this.loadImages();
        this.frameIndex = 0;   // Frame attuale dell'animazione
        this.frameWidth = 182;  // Larghezza di ogni frame nel file (modifica secondo il tuo spritesheet)
        this.frameHeight = 182; // Altezza di ogni frame
        this.totalFrames = 8;  // Numero di frame dell’animazione
        this.frameDelay = 4;  // Velocità dell'animazione (più alto = più lento)
        this.frameCounter = 0; // Contatore per cambiare frame
    }


    loadImages() {
        const types = ["shrinker", "teleport", "invisible"];
        types.forEach(type => {
            this.sprites[type] = new Image();
            this.sprites[type].src = `website/images/${type}_spritesheet.png`; // Assicurati che il percorso sia corretto

            // Gestione degli errori di caricamento
            this.sprites[type].onerror = () => {
                console.error(`Errore nel caricamento dell'immagine: ${type}.png`);
            };
        });
    }
    getType() { 
        const typeNum = Math.floor(Math.random() * 3) + 1;
    
        switch (typeNum) {
            case 1:
                return "shrinker";
            case 2:
                return "teleport";
            case 3:
                return "invisible";
        }
    }

    resize() {
        this.width = this.canvas.width * 0.06;
        this.height = this.canvas.width * 0.06;
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = Math.random() * (this.canvas.height - this.height);
    }

    updateAnimation() {
        this.frameCounter++;
        if (this.frameCounter >= this.frameDelay) {
            this.frameCounter = 0;
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
        }
    }

    // render() {
    //         if (this.type === "shrinker")
    //             this.ctx.fillStyle = "#00ff00";
    //         else if (this.type === "teleport")
    //             this.ctx.fillStyle = "#0000ff";
    //         else
    //             this.ctx.fillStyle = "#ff0000";
    //         this.ctx.fillRect(this.x, this.y, this.width, this.height);
    // }
    
    render() {
        this.sprite = this.sprites[this.type];
        this.updateAnimation();  // Aggiorna l’animazione
        
        if (this.sprite.complete) {  // Controlla che l'immagine sia caricata
            this.ctx.drawImage(
                this.sprite, 
                this.frameIndex * this.frameWidth, 0, // Seleziona il frame giusto
                this.frameWidth, this.frameHeight,   // Dimensioni del frame
                this.x, this.y,                      // Posizione sul canvas
                this.width, this.height              // Ridimensionamento
            );
        } else {
            console.warn(`Sprite non ancora caricata: website/images/${this.type}_spritesheet.png`);
        }
    }

}

export function handlePowerups(game) {
    // Generate a new power-up every 5 seconds
    if (!game.powerUpTimerStarted) {
        game.powerUpTimerStarted = true;
        setTimeout(() => {
            if (!game.gameEnd)
            {
                let power_up = new Powerup(game.canvas, game.ctx);
                game.powerup.push(power_up)
            }
            
        }, 5000);
    }
}

