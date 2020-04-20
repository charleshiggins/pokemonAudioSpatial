class Level {
    constructor(level) {
        console.log('in the console')
        this.currDirection = []
        this.currLevel = level
        this.currentPosition = allLevelData[level].playerCoordinates
        this.pokemonCoordinates = allLevelData[level].pokemonCoordinates
        this.completed = false
        this.keyInputListener
        this.levelScore = 0
        this.levleTimer
    }

    init() {
        this.drawGrid()
        this.createKeyListener()
        this.pokemonSound()
    }

    getRelativePosition(sound) {
        let x = sound[0] - this.currentPosition[0]
        let y = sound[1] - this.currentPosition[1]
        return [x, y]
    }
    findNearestPokemon() {
        console.log(this.pokemonCoordinates)
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
            tableString += '<tr class = row' + i + '>'
            for (let j = 0; j < 10; j++) {
                if (this.currentPosition[0] == j && this.currentPosition[1] == i) {
                    tableString += '<td class = "row' + i + '  col' + j + '"><img src = "player.png"></td>'
                }
                if (this.isTherePokemonAt(j, i)) {
                    tableString += '<td class = "row' + i + '  col' + j + '"><img src = "' + this.parsePokemon(this.isTherePokemonAt(j, i).id) + '"></td>'
                }
                else {
                    tableString += '<td class = "row' + i + ' col' + j + '"></td>'
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
                this.currDirection = 'left'
                this.move('left')
                break
            case 'ArrowRight':
                this.currDirection = 'right'
                this.move('right')
                break
            case 'ArrowUp':
                this.currDirection = 'up'
                this.move('up')
                break
            case 'ArrowDown':
                this.currDirection = 'down'
                this.move('down')
                break
            case ' ':
                if (!this.completed) {
                    this.throwPokeball()
                }
                else {
                    document.removeEventListener('keydown', this.keyInputListener);
                    goNextLevel(this.levelScore)
                }
                break
            default:
                console.log(e)
        }
    }

    createKeyListener() {
        this.keyInputListener = ((e) => this.handleKeyInput(e)).bind(this)
        document.addEventListener('keydown', this.keyInputListener);
    }

    move(direction) {
        switch (direction) {
            case 'left':
                if (this.peekMove([this.currentPosition[0] - 1, this.currentPosition[1]])) {
                    this.updateGrid([this.currentPosition[0] - 1, this.currentPosition[1]])
                    this.levelScore -= 12
                }
                break

            case 'right':
                if (this.peekMove([this.currentPosition[0] + 1, this.currentPosition[1]])) {
                    this.updateGrid([this.currentPosition[0] + 1, this.currentPosition[1]])
                    this.levelScore -= 12
                }
                break
            case 'up':
                if (this.peekMove([this.currentPosition[0], this.currentPosition[1] - 1])) {
                    this.updateGrid([this.currentPosition[0], this.currentPosition[1] - 1])
                    this.levelScore -= 12
                }
                break

            case 'down':
                if (this.peekMove([this.currentPosition[0], this.currentPosition[1] + 1])) {
                    this.updateGrid([this.currentPosition[0], this.currentPosition[1] + 1])
                    this.levelScore -= 12
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
                    console.log('viable left catch')
                    this.catchPokemon(this.currentPosition[0] - 1, this.currentPosition[1])
                }
                else {
                    console.log('no viable left catch')
                }
                break

            case 'right':
                if (this.isTherePokemonAt(this.currentPosition[0] + 1, this.currentPosition[1])) {
                    console.log('viable right catch')
                    this.catchPokemon(this.currentPosition[0] + 1, this.currentPosition[1])

                }
                else {
                    console.log('no viable right catch')

                }
                break

            case 'up':
                if (this.isTherePokemonAt(this.currentPosition[0], this.currentPosition[1] - 1)) {
                    console.log('viable up catch')
                    this.catchPokemon(this.currentPosition[0], this.currentPosition[1] - 1)

                }
                else {
                    console.log('no viable up catch')

                }
                break

            case 'down':
                if (this.isTherePokemonAt(this.currentPosition[0], this.currentPosition[1] + 1)) {
                    console.log('viable down catch')
                    this.catchPokemon(this.currentPosition[0], this.currentPosition[1] + 1)

                }
                else {
                    console.log('no viable down catch')
                }
                break
            default:
                console.log('this is an issue')
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
        var finishedLevelMsg = 'Level complete! You got ' +  this.levelScore + ' points. Press space to continue'
        document.querySelector('#gameArea').innerHTML = finishedLevelMsg
        this.say(finishedLevelMsg)

    }
    say(text) {
        var utterThis  = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterThis);
      }
}



