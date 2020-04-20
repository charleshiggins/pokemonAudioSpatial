document.addEventListener("DOMContentLoaded", function (event) {
    level = 0
    score = 0
    theGame = new PokemonAudioSpatialGame 
    theLevel = new Level(level)
    theLevel.init()
});


function goNextLevel(score) { //can put stats here to persist between levels
    level++
    console.log(score)
    if(level < allLevelData.length){
        nextLevel = new Level(level)
        nextLevel.init()
    
    }
    else{
        console.log('Game Complete!')
    }
    console.log(theGame)
}