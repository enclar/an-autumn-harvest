# An Autumnal Harvest - Inspired by Puzzle Bobble

## About The Game
### History and Significance
Puzzle Bobble is a tile-matching puzzle arcade game developed and published by Taito in 1994.

It features a screen filled with multi-coloured bubbles which players must attempt to clear within a given timeframe by shooting more bubbles and making color matches.

Due to time constraints, some simplifications have been made, although core functionality is still present. I hope to expand the basic gameplay to include added functionality in the future.

Growing up, I didn't have much of an interest in playing games and this was the only one that would catch my attention every time I was brought to an arcade. Recreating this childhood favourite was definitely an exciting challenge and I really enjoyed the process.

### Gameplay and Instructions
The game begins with a rectangular arena filled with multi-colored bubbles. At the bottom of the arena, the player controls a pointer which aims and fires bubbles into the arena. The color of the bubbles to be fired is randomly generated and chosen from a pre-specified selection of colours.

The main objective of the game is to clear all the bubbles on the screen and ensure that they don't accumulate and reach the bottom of the arena. The bubbles are shot in a straight line based on an angle fixed by the player. If the fired bubble lands and creates a cluster of 3 or more similarly coloured bubbles, they will explode and be cleared. Any bubbles left hanging below will also be cleared. Points are added each time bubbles are cleared.

In an arcade setting, players use a joystick and button to control the shooting trajectory. In my online adaption, players will use the left and right arrow keys to control the shooting trajectory and the space bar to shoot the bubble.

## Technical Structure and Programmatic Code
### Game States
The game has two main screens - A start screen and a game screen. The contents for each screen is stored in a separate div and will be shown/hidden through the use of event listeners.

On the start screen, players click the start button to be brought to the game screen.

When the game finishes, players will exit to the main screen to restart the game if they wish.

### Setting up the playing arena (HTML & JS)
The playing arena consists of 9 rows, each containing 10 divs

### Logic for shooting
![Puzzle Bobble](https://i0.wp.com/www.thexboxhub.com/wp-content/uploads/2018/12/neogeo-puzzle-bobble.jpeg?fit=1920%2C1080&ssl=1)