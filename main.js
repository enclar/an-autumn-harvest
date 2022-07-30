import $ from "jquery";

//* DEFINING VARIABLES
const $rows = $(".row"); // Variable to store all divs with row class
let bubbleGrid = []; // Array to store coords of all bubbles in the grid
const colors = ["red", "yellow", "blue", "green"]; // Array to hold bubble colors
let rotateAngle = 0; // Variable to store angle of rotation for trajectory
let possibleLandingCoords = []; // Array to hold possible landing points when a bubble is shot
let optionalLandingCoords = [];
let colorCluster = []; // Array for temp bubble storage to check for clusters
let counter = 0;


//* DEFINING FUNCTIONS
//! Function to start the game
const startGame = () => {
  $("#start-screen").hide();
  $("#game-screen").show();
  $("#score-screen").hide();

  // Resetting all the values
  rotateAngle = 0;
  possibleLandingCoords = [];
  optionalLandingCoords = [];
  colorCluster = [];
  counter = 0;
};

//! Function to display score screen
const showScore = () => {
  $("#start-screen").hide();
  $("#game-screen").hide();
  $("#score-screen").show();
};

//! Function to restart game
const restartGame = () => {
  $("#start-screen").show();
  $("#game-screen").hide();
  $("#score-screen").hide();  
};

//! Function to add divs into each row
const addDivs = () => {
  for (let i=0; i<10; i++) {
    for (let j=0; j<20; j++) {
      $rows.eq(i).append($("<div>"));
    };
  };
};

//! Function to select a color from array of chosen colors
const randomColor = (arr) => {
  const ranNum = Math.floor(Math.random() * arr.length);
  return arr[ranNum];
};

//! Function to generate a bubble
// const addBubble = () =>  {
//   const $bubble = $("<div>").addClass("bubble");
//   return $bubble;
// };

//! Creating a bubble class
// class Bubble {
//   constructor(row, col, coords, color) {
//     this.row = row;
//     this.col = col;
//     this.coords = coords;
//     this.color = color;
//   }
//   getColor() {
//     return this.color
//   }
// };

//! Function to generate a bubble in the bubble grid
const addBubbleInGrid = (row, col) => { // Argument taken is row and col data
  // Selecting the corresponding div which will contain a bubble
  const $bubble = $rows.eq(row).children().eq(col);

  // Giving it a bubble class so it takes on the respective properties
  $bubble.addClass("bubble");
  $bubble.addClass(randomColor(colors));

  // Setting the coordinates of the bubble
  $bubble.css("left", col*25);
  $bubble.css("top", row*50);

  // Adding bubble coordinates into array
  bubbleGrid.push(`${row}${col}`);
  console.log(`Appended a bubble at ${[row, col]}`);
};

//! Function to generate a grid of bubbles
const addBubbleGrid = (rows, cols) => { // Argument taken is total num of rows and cols
  // Looping each row
  for (let i=0; i<rows; i++) {

    // Checking if the row is odd or even
    if (i%2 == 0) { // In even row, only even cols should have bubbles
      for (let j=0; j<cols-1; j+=2) {
        addBubbleInGrid(i, j);
      };
    } else { // In odd row, only odd cols should have bubbles
      for (let j=1; j<cols-2; j+=2) {
        addBubbleInGrid(i, j);
      };
    };
  };
  // Logging the coordinates of all the bubbles in the grid
  console.log(`These are the coordinates of bubbles in the grid: ${bubbleGrid}`);
};

//! Function to generate shooter bubble
const addShooter = () => {
  // Selecting the corresponding div
  const $shooter = $rows.eq(-1).children().eq(9);

  // Adding properties to it
  $shooter.addClass("bubble");
  $shooter.addClass(randomColor(colors));

  // Attaching the shooter-bubble id to the shooter bubble
  $shooter.attr("id", "shooter-bubble");
};

//! Creating a div to show angle of shooting
const $trajectory = $("<div>").attr("id", "trajectory");
$("#game-screen").append($trajectory);

//! Function to rotate trajectory
const rotateTrajectory = (angle) => {
  $("#trajectory").css("transform", `rotate(${angle}deg)`);
};

//! Function to check which is the lowest row that the bubble can land in
// None of the divs are empty any more!! So this will not work!!
// const firstEmptyRow = () => {
//   let emptyRow = 0;
//   for (let i=0; i<9; i++) {
//     if ($rows.eq(i).children().length === 0) {
//       emptyRow = i;
//       console.log(`The highest empty row is ${emptyRow}`);
//       return emptyRow;
//     };
//   };
// };

//! Function to convert angle from degrees to radians
const convertAngle = (angle) => {
  // Checking if angle is negative so it can be converted if needed
  if (angle < 0) {
    angle = -(angle);
  }
  return angle * (Math.PI / 180);
};

//! Function to find possible positions a bubble could land in
const landingCoords = () => {
  // Checking that the first empty row is correct
  // console.log(`The first empty row is row${emptyRow}`);

  // Defining variables
  let yDist, xDist, col;

  // Converting the angle from deg to rad
  const angleInRadians = convertAngle(rotateAngle);
  console.log(`The trajectory angle is ${rotateAngle}deg and ${angleInRadians}rad`);

  // Running through each row
  for (let row=0; row<=9; row++) {
    yDist = ((9-row) * 50) + 25;
    xDist = yDist * Math.tan(angleInRadians);
    col = Math.round(xDist / 25);

    if (rotateAngle >= 0) {

      if (row%2 != col%2 && col>=0 && col<=9) {
        col += 9;
        possibleLandingCoords.unshift(`${row}${col}`);
      } else if (row%2 == col%2 && col>=0 && col<=10) {
        col += 8;
        optionalLandingCoords.unshift(`${row}${col}`);
      }
    } else if (rotateAngle < 0) {
      if (row%2 != col%2 && 9-col>=0 && 9-col<=9) {
        col = 9-col;
        possibleLandingCoords.unshift(`${row}${col}`);
      } else if (row%2 == col%2 && 8-col>=0 && 8-col<=9) {
        col = 8-col;
        optionalLandingCoords.unshift(`${row}${col}`);
      }
    };
  };
  // Log and return an array of the possible landing coordinates
  // possibleLandingCoords.concat(optionalLandingCoords);
  console.log(`These are the possible landing coordinates: ${possibleLandingCoords} and ${optionalLandingCoords}`);
  possibleLandingCoords.concat(optionalLandingCoords);
  return possibleLandingCoords;
};


//! Function to check if the possible positions are empty
const finalPosition = (arr) => {
  // Create a variable to store the final position where the bubble should land
  let finalLandingCoord;

  // Running a for loop through all the 
  for (const coord of arr) {
    const row = parseInt(coord[0]);
    const col = parseInt(coord.substr(1));
    // Other positions to check
    const toCheck = [`${row-1}${col+1}`, `${row-1}${col-1}`];

    if (!bubbleGrid.includes(coord)) {
      console.log(`${coord} is not in the bubbleGrid array`);
      // console.log(`We are checking for ${toCheck[0]} or ${toCheck[1]}`);
      if (bubbleGrid.includes(toCheck[0]) || bubbleGrid.includes(toCheck[1])) {
        finalLandingCoord = coord;
        colorCluster.push(finalLandingCoord);
        console.log(`The bubble will land on ${finalLandingCoord}`);
        return finalLandingCoord;
      };
    } else if (arr.indexOf(coord) == arr.length-1 && !bubbleGrid.includes(coord)) {
      finalLandingCoord = coord;
      colorCluster.push(finalLandingCoord);
      console.log(`The bubble will land on ${finalLandingCoord}`);
      return finalLandingCoord;
    } else if (row == 0) {
      finalLandingCoord = coord;
      colorCluster.push(finalLandingCoord);
      console.log(`The bubble will land on ${finalLandingCoord}`);
      return finalLandingCoord;
    }
  }
}

//! Function to shoot bubble
const shootBubble = (coord) => { // Argument taken is the finalLandingCoord
  // Using parseInt to get the row and col of the coord
  const row = parseInt(coord[0]);
  const col = parseInt(coord.substr(1));

  // Assining variable for left and bottom distance
  const bottomDist = (9-row) * 50;
  let leftDist;

  if (rotateAngle >= 0) {
    leftDist = (col-9)*25;
    $("#shooter-bubble").animate({
      left: `+=${leftDist}`,
      bottom: `+=${bottomDist}`
    }, "slow");
  } else {
    leftDist = (9-col)*25;
    $("#shooter-bubble").animate({
      left: `-=${leftDist}`,
      bottom: `+=${bottomDist}`
    }, "slow");
  };
};

//! Function to check if shooter is in a color cluster
const checkCluster = (coord) => { // Argument is coords of a bubble to check
  const row = parseInt(coord[0]);
  const col = parseInt(coord.substr(1));
  // console.log(`This is the row and col we are looking at:`, row, col);

  // Getting the color of the center bubble
  const $clusterColor = $rows.eq(row).children().eq(col).attr("class");
  // console.log(`The class we are using as a ref is ${$clusterColor}`);

  // Coordinates of 6 surrounding bubbles to check
  const bubblesToCheck = [`${row}${col-2}`, `${row}${col+2}`, `${row-1}${col-1}`, `${row-1}${col+1}`, `${row+1}${col-1}`, `${row+1}${col+1}`];
  // console.log(`These are the bubbles to check: ${bubblesToCheck}`);

  // For loop to check those 6 coordinates
  for (let j=0; j<6; j++) {
    if (bubbleGrid.includes(bubblesToCheck[j])) {
      const bubble = bubblesToCheck[j]
      const row1 = parseInt(bubble[0]);
      const col1 = parseInt(bubble.substr(1));
  
      // Getting the color of each surrounding bubble
      const $checkingColor = $rows.eq(row1).children().eq(col1).attr("class")
      // console.log(`The bubble we are looking at is ${row1}${col1} and the class we are trying to match is ${$checkingColor}`);
  
      // If the color is a match and the bubble is not inside the cluster array
      if ($checkingColor == $clusterColor && !colorCluster.includes(bubble)) {
        colorCluster.push(`${row1}${col1}`);
        checkCluster(bubble);
      };
    }
  };
  console.log(colorCluster);
};

//! Function to remove cluster (if applicable)
const removeCluster = (arr) => { // Argument taken is an array of clustered bubbles with the same color
  for (let i=0; i<arr.length; i++) {
    const coord = arr[i]
    const row = parseInt(coord[0]);
    const col = parseInt(coord.substr(1));

    // Remove the bubble class from the div at that position
    $rows.eq(row).children().eq(col).attr("class", "");

    const coordIndex = bubbleGrid.indexOf(coord);
    bubbleGrid.splice(coordIndex, 1);
    // console.log(`These are the bubbles in the grid: ${bubbleGrid}`);
  };
  counter += arr.length;
  $("#score").text(`SCORE: ${counter}`);
};

//! Function to add bubble into bubble grid and out of shooter div
const addShooterToGrid = (coord) => {
  // Storing the color of the shooter bubble
  const $shooterClass = $("#shooter-bubble").attr("class");
  // console.log($shooterClass);

  const row = parseInt(coord[0]);
  const col = parseInt(coord.substr(1));  

  // Identifying the new div which should contain the bubble
  const $bubble = $rows.eq(row).children().eq(col);

  // Assigning it the correct color
  $bubble.attr("class", $shooterClass);

  // Moving it to the correct position
  $bubble.css("left", col*25);
  $bubble.css("top", row*50);

  // Adding this new coord to the arr containing coords of bubbles in the grid
  bubbleGrid.push(`${row}${col}`);
  console.log(`Appended a bubble at ${row}${col}`);
  // console.log(`Appended a bubble at ${[row, col]}`);
  console.log(`These are the bubbles in the grid: ${bubbleGrid}`);
};

//! Function to 'reload' the shooter
const reloadShooter = () => {
  // Removing the existing shooter and appending a new div to the shooter row
  $("#shooter-bubble").remove();
  $rows.eq(9).append("<div>");

  // Assigning the div to be a shooter bubble
  addShooter();

  console.log("Reloaded shooter bubble");
};

//! Function to check if the game should end
const checkGameState = () => {
  // Check if there are any bubbles left on the screen
  if (bubbleGrid.length == 0) {
    reloadShooter()
    console.log("The game has ended!");
    $("#win").show();
  } else if (colorCluster.length<=2 && colorCluster[0][0] == 8){
    reloadShooter();
    console.log("The game has ended...");
    $("#lose").show();
    setTimeout(() => {
      showScore()
    }, 1500);
  } else { // The game should go on
    reloadShooter();
    possibleLandingCoords = [];
    optionalLandingCoords = [];
    colorCluster = [];
  };
};


//* LOAD AFTER DOM HAS LOADED
$(() => {

  //! Hide the game screen and score screen
  // $("#start-screen").hide();
  $("#game-screen").hide();
  $("#score-screen").hide();
  $(".msg").hide();

  //! Adding event listener to start game
  $("#start-btn").on("click", startGame);

  //! Adding div grid
  addDivs(19);

  //! Generating a grid with 9/10 bubbles per row
  addBubbleGrid(5, 20);

  //! Generating shooter bubble
  addShooter();

  //! Event listener to change angle of shooting
  $(window).on("keydown", (event) => {
    if (event.which === 39) { // Listening for pressdown of right arrow key
      if (rotateAngle <= 45) { // Preventing arrow from rotating out of the playing field
        rotateAngle += 1; // Angle of rotation changes by 1deg with each press
        rotateTrajectory(rotateAngle);
      };
    };
    if (event.which === 37) {
      if (rotateAngle >= -45) {
        rotateAngle -= 1;
        rotateTrajectory(rotateAngle);
      };
    };
  });

  //! Event listener to shoot
  $(window).on("keydown", (event) => {
    if (event.which === 32) { // Listening for pressdown of spacebar
      // Check the possible landing coords
      const plc = landingCoords(); // Will return an array of possible landing coords
      
      // Check which is the highest available landing coord
      const flc = finalPosition(plc); // Will return a str of the landing coord

      // Shoot the bubble into the position
      shootBubble(flc);

      //! Run these functions after a certain delay (1000ms)
      setTimeout(() => {
        // Add the shooter bubble into the grid
        addShooterToGrid(flc);
      
        // Check if the bubble is in a color cluster
        checkCluster(flc);
        
        // Remove bubbles if cluster if 3 or more
        if (colorCluster.length >= 3) {
          removeCluster(colorCluster);
        };
        
        // Check the game state
        checkGameState();
      }, 1000);
    };
  });

  $("#return").on("click", restartGame);

});