export default function TournamentGame() {
    return `
        <div id="matchStatsPopup" style="display: none; flex-direction: column; align-items: center; justify-content: center;">
            <h2>Match Statistics</h2>
            <table style="width: 80%; border-collapse: collapse; font-size: 1rem; background-color: #fff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px; background-color: #e6f7ff; font-weight: bold; text-align: center;">PLAYERS</td>
                        <td id="playersColumn" style="border: 1px solid #ddd; padding: 10px; text-align: center;"></td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px; background-color: #e6f7ff; font-weight: bold; text-align: center;">MATCH TIME</td>
                        <td id="matchTimeColumn" style="border: 1px solid #ddd; padding: 10px; text-align: center;"></td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px; background-color: #e6f7ff; font-weight: bold; text-align: center;">SCORE</td>
                        <td id="scoreColumn" style="border: 1px solid #ddd; padding: 10px; text-align: center;"></td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px; background-color: #e6f7ff; font-weight: bold; text-align: center;">LONGEST RALLY</td>
                        <td id="longestRallyColumn" style="border: 1px solid #ddd; padding: 10px; text-align: center;"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br><br><br><br><br>
       
        <button class="button-style" id="backToBracketButton">Back to Bracket</button>  
        <button class="button-style" id="backToRobinButton">Back to Ranking</button>
        <button class="button-style" id="matchStatisticsButton">End Match</button>
    `;
}
