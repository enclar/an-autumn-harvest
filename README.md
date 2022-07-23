# Project 1 - Puzzle Bobble

## User Stories/Journey

* Start Screen
GAME STATE
1) Welcome message
2) Start button
3) Highscore button

PLAYER ACTIONS
1) Click start buttton
2) Click highscore button

COMPUTER RESPONSE
1) Transit to game screen if start button is pressed
2) Display highscores if highscore button is pressed

* Game Screen
GAME STATE
1) Hexagonal bubble grid
2) Shooter bubble
3) Scoreboard
4) Timer

PLAYER ACTIONS
1) Use arrow keys to change angle of shooter bubble trajectory
2) Use spacebar to launch shooter bubble

COMPUTER RESPONSE
1) When spacebar is pressed, launch shooter bubble into bubble grid as per specified angle
2) Change the direction of the shooter bubble if it hits the side of the wall
3) End the trajectory of the shooter bubble when it reaches the first bubble in the grid blocking its line of movement
4) When shooter bubble has ended its trajectory, check if it has created a cluster of 3 or more same coloured bubbles
    - If it has, explode those bubbles and add to the score counter
    - If not, generate a new shooter bubble and wait for 1)
5) Check if there are any floating bubbles, explore them and add to the score counter
6) Check if there are any bubbles left on the screen
    - If there are none, player has won the game

* Score Screen
GAME STATE
1) Scoreboard
2) Restart butto