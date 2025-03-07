import { Star } from "../elements/star.js";
import { background } from "../data/game_global.js";
export function createStarsBackground(game, count) {
    for (let i = 0; i < count; i++) {
        const star = new Star(game, game.canvas, game.ctx);
        game.stars.push(star);
    }
}

export function renderBackground(game) {
    // Walls
    if (background == "space")
        game.ctx.fillStyle = game.wallsColor;
    else 
        game.ctx.fillStyle = "white";

    if (background == "pingpong") {
        // Background
        game.ctx.fillStyle = "#1d8819";
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
        game.ctx.fillStyle = "white";
        game.ctx.fillRect(game.wallThickness, game.canvas.height / 2, game.canvas.width - game.wallThickness, game.wallThickness);
        game.ctx.fillRect(game.canvas.width / 2, game.wallThickness, game.wallThickness, game.canvas.height - game.wallThickness);
    }

    if (background == "classic") {
        // Draw vertical dashed line
        for (let y = game.wallThickness; y < game.canvas.height - game.wallThickness; y += 50) {
            game.ctx.fillRect(game.canvas.width / 2, y, game.wallThickness, 30);
        }
    }
    game.ctx.shadowColor = game.wallsColor;
    game.ctx.shadowBlur = 20;
    game.ctx.fillRect(game.wallThickness, 0, game.canvas.width - game.wallThickness, game.wallThickness);
    game.ctx.fillRect(game.wallThickness, game.canvas.height - game.wallThickness, game.canvas.width - game.wallThickness, game.wallThickness);
    game.ctx.fillRect(0, 0, game.wallThickness, game.canvas.height);
    game.ctx.fillRect(game.canvas.width - game.wallThickness, 0, game.wallThickness, game.canvas.height);
}