class Level {
    constructor(level) {
        this.currDirection = []
        this.currLevel = level + 1
        this.currentPosition = allLevelData[level].playerCoordinates
        this.pokemonCoordinates = allLevelData[level].pokemonCoordinates
        this.completed = false
        this.keyInputListener
        this.levelScore = 0
    }

    init() {
        this.drawGrid()
        this.createKeyListener()
        this.initSound()
    }
    initSound() {
        var sound = new Howl({
            src: ['Audio/Instructions.mp3'] 
        });
        sound.play();

    }

    getRelativePosition(sound) {
        let x = sound[0] - this.currentPosition[0]
        let y = sound[1] - this.currentPosition[1]
        return [x, y]
    }
    findNearestPokemon() {
        let nearestDistance = null
        let nearestPokemon = null
        for (let i = 0; i < this.pokemonCoordinates.length; i++) {
            let dist = Math.sqrt(Math.pow(this.pokemonCoordinates[i].coordinates[0] - this.currentPosition[0], 2) + Math.pow(this.pokemonCoordinates[i].coordinates[1] - this.currentPosition[1], 2))
            if (!nearestDistance || dist < nearestDistance) {
                nearestDistance = dist
                nearestPokemon = this.pokemonCoordinates[i]
            }
        }
        return nearestPokemon
    }
    pokemonSound() {
        let nearest = this.findNearestPokemon()
        let audioFile = this.parsePokemonAudio(nearest.id)
        let position = this.getRelativePosition(nearest.coordinates)
        var sound = new Howl({
            src: [audioFile]
        });
        var id = sound.play();
        sound.pos(position[0] * 5, position[1] * 5, 0, id);
    }

    drawGrid() {
        document.querySelector('#gameArea').innerHTML = ''
        let tableString = '<table id = "gameGrid">'
        for (let i = 0; i < 10; i++) {
            tableString += '<tr>'
            for (let j = 0; j < 10; j++) {
                if (this.currentPosition[0] == j && this.currentPosition[1] == i) {
                    tableString += '<td><img src = "player.png" alt="Player"></td>'
                }
                if (this.isTherePokemonAt(j, i)) {
                    tableString += '<td><img src = "' + this.parsePokemon(this.isTherePokemonAt(j, i).id) + '"alt=' + this.getPokemonName(this.isTherePokemonAt(j, i).id) + ' class = "hidden"></td>'
                }
                else {
                    tableString += '<td></td>'
                }
            }
            tableString += '</tr>'
        }
        tableString += '</table>'
        document.querySelector('#gameArea').innerHTML = tableString
    }

    parsePokemon(pID) {
        for (let i = 0; i < allPokemonData.length; i++) {
            if (allPokemonData[i].pokemonID == pID) {
                return allPokemonData[i].sprite
            }
        }
        return null
    }
    getPokemonName(pID) {
        for (let i = 0; i < allPokemonData.length; i++) {
            if (allPokemonData[i].pokemonID == pID) {
                return allPokemonData[i].name
            }
        }
        return null
    }

    parsePokemonAudio(pID) {
        for (let i = 0; i < allPokemonData.length; i++) {
            if (allPokemonData[i].pokemonID == pID) {
                return allPokemonData[i].audio
            }
        }
        return null

    }
    handleKeyInput(e) {
        switch (e.key) {
            case 'ArrowLeft':
                if (!this.completed) {
                    this.currDirection = 'left'
                    this.move('left')
                }
                break
            case 'ArrowRight':
                if (!this.completed) {
                    this.currDirection = 'right'
                    this.move('right')
                }
                break
            case 'ArrowUp':
                if (!this.completed) {
                    this.currDirection = 'up'
                    this.move('up')
                }
                break
            case 'ArrowDown':
                if (!this.completed) {
                    this.currDirection = 'down'
                    this.move('down')
                }
                break
            case ' ':
                if (!this.completed) {
                    this.throwPokeball()
                }
                else if (this.currLevel < allLevelData.length) {
                    document.removeEventListener('keyup', this.keyInputListener);
                    goNextLevel(this.handleLevelScore(this.levelScore))
                }
                else {
                    document.removeEventListener('keyup', this.keyInputListener);
                    restartGame()
                }
                break
            default:
                console.log(e)
        }
    }

    createKeyListener() {
        this.keyInputListener = ((e) => this.handleKeyInput(e)).bind(this)
        document.addEventListener('keyup', this.keyInputListener);
    }

    move(direction) {
        switch (direction) {
            case 'left':
                if (this.peekMove([this.currentPosition[0] - 1, this.currentPosition[1]])) {
                    this.updateGrid([this.currentPosition[0] - 1, this.currentPosition[1]])
                    this.levelScore -= 55
                }
                break

            case 'right':
                if (this.peekMove([this.currentPosition[0] + 1, this.currentPosition[1]])) {
                    this.updateGrid([this.currentPosition[0] + 1, this.currentPosition[1]])
                    this.levelScore -= 55
                }
                break
            case 'up':
                if (this.peekMove([this.currentPosition[0], this.currentPosition[1] - 1])) {
                    this.updateGrid([this.currentPosition[0], this.currentPosition[1] - 1])
                    this.levelScore -= 55
                }
                break

            case 'down':
                if (this.peekMove([this.currentPosition[0], this.currentPosition[1] + 1])) {
                    this.updateGrid([this.currentPosition[0], this.currentPosition[1] + 1])
                    this.levelScore -= 55
                }
                break
            default:
                console.log(direction)
        }
        this.pokemonSound()

    }

    peekMove(location) {
        if (location[0] > 9 || location[0] < 0 || location[1] > 9 || location[1] < 0) {
            return false
        }
        else if (this.isTherePokemonAt(location[0], location[1])) {
            return false
        }
        else {
            return true
        }
    }
    updateGrid(newLoc) {
        this.currentPosition = newLoc
        this.drawGrid()
        this.findNearestPokemon()
    }
    throwPokeball() {
        switch (this.currDirection) {
            case 'left':
                if (this.isTherePokemonAt(this.currentPosition[0] - 1, this.currentPosition[1])) {
                    say("Caught " + this.getPokemonName(this.isTherePokemonAt(this.currentPosition[0] - 1, this.currentPosition[1]).id))
                    this.catchPokemon(this.currentPosition[0] - 1, this.currentPosition[1])
                }
                else {
                    say("Miss!")
                }
                break

            case 'right':
                if (this.isTherePokemonAt(this.currentPosition[0] + 1, this.currentPosition[1])) {
                    say("Caught " + this.getPokemonName(this.isTherePokemonAt(this.currentPosition[0] + 1, this.currentPosition[1]).id))
                    this.catchPokemon(this.currentPosition[0] + 1, this.currentPosition[1])
                }
                else {
                    say("Miss!")
                }
                break

            case 'up':
                if (this.isTherePokemonAt(this.currentPosition[0], this.currentPosition[1] - 1)) {
                    say("Caught " + this.getPokemonName(this.isTherePokemonAt(this.currentPosition[0], this.currentPosition[1] - 1).id))
                    this.catchPokemon(this.currentPosition[0], this.currentPosition[1] - 1)
                }
                else {
                    say("Miss!")
                }

                break

            case 'down':
                if (this.isTherePokemonAt(this.currentPosition[0], this.currentPosition[1] + 1)) {
                    say("Caught " + this.getPokemonName(this.isTherePokemonAt(this.currentPosition[0], this.currentPosition[1] + 1).id))
                    this.catchPokemon(this.currentPosition[0], this.currentPosition[1] + 1)
                }
                else {
                    say("Miss!")
                }
                break
            default:
        }

    }
    isTherePokemonAt(x, y) {
        for (let i = 0; i < this.pokemonCoordinates.length; i++) {
            if (this.pokemonCoordinates[i].coordinates[0] == x && this.pokemonCoordinates[i].coordinates[1] == y) {
                return this.pokemonCoordinates[i]
            }
        }
        return false

    }
    catchPokemon(x, y) {
        for (let i = 0; i < this.pokemonCoordinates.length; i++) {
            if (this.pokemonCoordinates[i].coordinates[0] == x && this.pokemonCoordinates[i].coordinates[1] == y) {
                this.pokemonCoordinates.splice(i, 1)
                this.levelScore += 3000
                this.drawGrid()
                if (this.checkLevelComplete()) {
                    this.finishLevel()
                }
            }
        }
        return false

    }
    checkLevelComplete() {
        if (this.pokemonCoordinates.length == 0) {
            return true
        }
        else {
            return false
        }
    }
    finishLevel() {
        this.completed = true;
        if (this.currLevel < allLevelData.length) {
            var finishedLevelMsg = 'Level complete! You got ' + this.levelScore + ' points. Press space to continue.'
            document.querySelector('#gameArea').innerHTML = finishedLevelMsg
            say(finishedLevelMsg)
        }
        else {
            var finishedLevelMsg = 'You win! You got ' + calculateTotalScore(this.handleLevelScore(this.levelScore)) + ' points. Press space to play again.'
            document.querySelector('#gameArea').innerHTML = finishedLevelMsg
            say(finishedLevelMsg)

        }

    }
    handleLevelScore() {
        if (this.levelScore <= 1000) {
            this.levelScore = 1000
        }
        return this.levelScore
    }
}