import { matchData } from "../data/game_global.js";
export function checkScore(game, mode) {
    if (game.scoreP1 >= game.maxScore || game.scoreP2 >= game.maxScore) {
        game.gameEnd = true;
        //game.running = false;
        if (game.ball.hits > matchData.longestRally)
            matchData.longestRally = game.ball.hits;
        if (game.scoreP1 > game.scoreP2) 
            game.winner = game.p1Name;
        else 
            game.winner = game.p2Name;
        
        if (mode === "roundrobin")
            backToRobinButton.style.display = "block";
        else if (mode === "knockout")
            backToBracketButton.style.display = "block";
        else {
            backToMenuButton.style.display = "block";
            backToMenuButton.hidden = false;
        }
        game.ui.render(game, game.scoreP1, game.scoreP2); 
    }
}