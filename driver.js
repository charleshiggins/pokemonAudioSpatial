document.addEventListener("DOMContentLoaded", function (event) {
    level = 0
    theGame = new PokemonAudioSpatialGame 
    theLevel = new Level(level)
    theLevel.init()
});


function goNextLevel() { //can put stats here to persist between levels
    level++
    if(level < allLevelData.length){
        nextLevel = new Level(level)
        nextLevel.init()
    
    }
    else{
        console.log('Game Complete!')
    }
    console.log(theGame)
}