export let ballColor = "#ffffff";
export let paddleColor = "#ffffff";
export let ballTrailColor = "#014c4a";
export let wallsColor = "#014c4a";
export let background = "space";
export let powerUpActive = false;


export let matchData = {
    player1: "",
    player2: "",
    seconds:0,
    matchTime: "",
    scorep1: 0,
    scorep2: 0, 
    longestRally: 0,
    timer: 0
};

export function setBallColor(color) {
    ballColor = color;
}

export function setPaddleColor(color) {
    paddleColor = color;
}

export function setBallTrailColor(color) {
    ballTrailColor = color;
}

export function setWallsColor(color) {  
    wallsColor = color;
}

export function setPowerUpState(state) {
    powerUpActive = state;
}

export function setPowerupPlayer(powerup, player) {
    if (player === 1) {
        powerupPlayer1 = powerup;
    } else if (player === 2) {
        powerupPlayer2 = powerup;
    }
}

export function setBackground(bg) {
    background = bg;
}