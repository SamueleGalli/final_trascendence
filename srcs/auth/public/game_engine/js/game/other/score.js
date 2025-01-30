import { matchData } from "../data/game_global.js";
export function checkScore(game, mode) {
    if (game.scoreP1 >= 2 || game.scoreP2 >= 2) {
        if (game.ball.hits > matchData.longestRally)
            matchData.longestRally = game.ball.hits;
        game.gameEnd = true;
        if (game.scoreP1 > game.scoreP2) 
            game.winner = game.p1Name;
        else 
            game.winner = game.p2Name;
        game.gameEnd = true;
        
        if (mode === "roundrobin")
            backToRobinButton.hidden = false;
        else if (mode === "knockout")
            backToBracketButton.hidden = false;
        else 
            backToMenuButton.hidden = false;

        game.ui.render(game, game.scoreP1, game.scoreP2);
    }
}