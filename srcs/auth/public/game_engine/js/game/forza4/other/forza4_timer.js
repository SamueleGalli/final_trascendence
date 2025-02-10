export function f4FormatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export function updateTimer(game) {
    const currentTime = Date.now();
    game.elapsedTime = Math.floor((currentTime - game.startTime) / 1000);
    const minutes = Math.floor(game.elapsedTime / 60);
    const seconds = game.elapsedTime % 60;
    const timerElement = document.getElementById('f4timer');
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function resetTimer(game) {
    clearInterval(game.timerInterval);
    game.timerInterval = null; // Opzionale: resetta la variabile
    console.log("Timer azzerato.");
}