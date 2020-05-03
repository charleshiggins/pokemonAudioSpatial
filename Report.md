Description
“Catch all the Pokemon!” is a game where you encounter Pokemon and catch them. The player hears a pokemon on the map make a noise, and they have to navigate towards the sound to catch them. The player progresses once they catch all the Pokemon present in the level. As the player continues through the levels, they encounter rarer and more evolved Pokemon.

Intended Audience
This game is designed in particular for young people with visual impairments.

Technologies used
Since it’s a game built for the browser, the application is written largely with vanilla javascript. I also leveraged the howler.js library to handle the audio elements of the game. 

How to build and deploy
The easiest way to build the project locally is to navigate to the project directory in the command line and input python -m http.server. The game will be playable in the browser at localhost:8000. A deployed version of the game is available at https://charleshiggins.github.io/pokemonAudioSpatial/. Since the code is all client-side, deploying the project to a different web server is as simple as uploading the directory- no additional configuration is necessary.

Problems encountered
Development was fairly smooth. Initially, I ran into CORS errors when I was trying to play the audio files by running the javascript using the file:// protocol in my browser, but this was solved by serving the files over a local testing server. 

Future work
Future projects could extend the methods of using spatial audio in this game. In particular, they could incorporate a full 3d plane of spatiality. Additionally, more simple features could greatly enhance the gameplay of this sort of game. For example, including units to avoid or objects and terrain in the way could be fun additions to the game. 



