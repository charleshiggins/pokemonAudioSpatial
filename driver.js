
var level = 0
var totalScore = 0


document.addEventListener("DOMContentLoaded", function (event) {
    theGame = new PokemonAudioSpatialGame
    theLevel = new Level(level)
    theLevel.init()
});


function goNextLevel(score) { //can put stats here to persist between levels
    level++
    totalScore += score
    if (level < allLevelData.length) {
        nextLevel = new Level(level)
        nextLevel.init()

    }
    else {

    }
    console.log(theGame)
}


function say(text) {
    var utterThis = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterThis);
}


function calculateTotalScore(score) { //final level finished
    totalScore += score
    return totalScore
}

function restartGame() {
    resetData()
    level = 0
    totalScore = 0
    theGame = new PokemonAudioSpatialGame
    theLevel = new Level(level)
    theLevel.init()

}



function resetData() {
    allLevelData =
        [{
            'level': 1,
            'pokemonCoordinates': [{ 'id': 1, 'coordinates': [2, 4] }, { 'id': 7, 'coordinates': [9, 0] }, { 'id': 4, 'coordinates': [0, 8] }],
            'playerCoordinates': [9, 9]

        },
        {
            'level': 2,
            'pokemonCoordinates': [{ 'id': 25, 'coordinates': [5, 6] }, { 'id': 43, 'coordinates': [0, 0] }, { 'id': 50, 'coordinates': [0, 1] }],
            'playerCoordinates': [9, 9]

        },
        {
            'level': 3,
            'pokemonCoordinates': [{ 'id': 54, 'coordinates': [8, 9] }, { 'id': 81, 'coordinates': [0, 1] }, { 'id': 95, 'coordinates': [5, 4] }],
            'playerCoordinates': [9, 9]

        },
        {
            'level': 4,
            'pokemonCoordinates': [{ 'id': 98, 'coordinates': [2, 4] }, { 'id': 126, 'coordinates': [9, 0] }, { 'id': 130, 'coordinates': [0, 8] }],
            'playerCoordinates': [9, 9]

        },
        {
            'level': 5,
            'pokemonCoordinates': [{ 'id': 143, 'coordinates': [2, 4] }, { 'id': 151, 'coordinates': [9, 0] }, { 'id': 6, 'coordinates': [0, 8] }],
            'playerCoordinates': [9, 9]

        }]

}