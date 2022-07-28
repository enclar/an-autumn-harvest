import $ from "jquery";

//! Defining a variable for all the divs with row class
const $rows = $(".row");

//! Creating function to add divs into each row
const addDivs = () => {
  for (let i=0; i<10; i++) {
    for (let j=0; j<20; j++) {
      $rows.eq(i).append($("<div>"));
    };
  };
};

//! Function to select a color from array of chosen colors
const colors = ["red", "yellow", "blue", "green"];

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

//! Creating an array to hold the coordinates of each bubble generated
const bubbleGrid = [];

//! Function to generate a bubble in the bubble grid
// const addBubbleInGrid = (row, col) => {
//   // Creating the bubble and giving it a color
//   const $bubble = addBubble();
//   $bubble.addClass(randomColor(colors));

//   // Setting the coordinates of the bubble
//   $bubble.css("left", col*25);
//   $bubble.css("top", row*50);

//   // Adding row and col data to an array
//   bubbleGrid.push(`${row}${col}`);

//   // Appending the bubble to the respective row
//   $rows.eq(row).append($bubble);
//   console.log(`Appended a bubble at ${[row, col]}`);
// };

const addBubbleInGrid = (row, col) => {
  // Selecting the corresponding div
  const $bubble = $rows.eq(row).children().eq(col);

  $bubble.addClass("bubble");
  $bubble.addClass(randomColor(colors));

  // Setting the coordinates of the bubble
  $bubble.css("left", col*25);
  $bubble.css("top", row*50);

  bubbleGrid.push(`${row}${col}`);
  console.log(`Appended a bubble at ${[row, col]}`);
};

//! Function to generate a grid of bubbles
const addBubbleGrid = (rows, cols) => {
  // Looping each row
  for (let i=0; i<rows; i++) {

    // Checking if the row is odd or even
    if (i%2 == 0) {
      for (let j=0; j<cols-1; j+=2) {
        addBubbleInGrid(i, j);
      };
    } else {
      for (let j=1; j<cols-2; j+=2) {
        addBubbleInGrid(i, j);
      };
    };
  };
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

//! Creating a variable to store the angle of rotation
let rotateAngle = 0;

//! Function to rotate trajectory
const rotateTrajectory = (angle) => {
  $("#trajectory").css("transform", `rotate(${angle}deg)`);
};

//! Function to check which is the lowest row that the bubble can land in
// const firstEmptyRow = () => {
//   let emptyRow = 0;
//   for (let i=0; i<9; i++) {
//     if ($rows.eq(i).children().length === 0) {
//       return emptyRow = i;
//     };
//   };
// };

//! Creating an array to hold the possible intersections
let possibleLandingCoords = [];

//! Function to convert angle from degrees to radians
const convertAngle = (angle) => {
  // Checking if angle is negative
  if (angle < 0) {
    angle = -(angle);
  }
  return angle * (Math.PI / 180);
};

//! Function to find possible positions a bubble could land in
const landingCoords = () => { // Argument taken is the first empty row
  // Checking that the first empty row is correct
  // console.log(`The first empty row is row${emptyRow}`);

  // Defining variables
  let yDist, xDist, col;

  console.log(`The trajectory angle is ${rotateAngle}`);
  const angleInRadians = convertAngle(rotateAngle);

  for (let row=0; row<=9; row++) {
      yDist = ((9-row) * 50) + 25;
      xDist = yDist * Math.tan(angleInRadians);

      if (rotateAngle >= 0) {
          col = Math.round((xDist)/25);
          console.log(col);
          if (row%2 == 0 && col%2 != 0 && col>=0 && col<=9) {
              col += 9;
              possibleLandingCoords.unshift(`${row}${col}`);
          } else if (row%2 != 0 && col%2 == 0 && col>=0 && col<=8) {
              col += 9;
              possibleLandingCoords.unshift(`${row}${col}`);
          }
      } else if (rotateAngle < 0) {
          col = Math.round((xDist)/25);
          if (row%2 == 0 && col%2 != 0 && 9-col>=0 && 9-col<=9) {
              col = 9-col;
              possibleLandingCoords.unshift(`${row}${col}`);
          } else if (row%2 != 0 && col%2 == 0 && 9-col>=0 && 9-col<=8) {
              col = 9-col;
              possibleLandingCoords.unshift(`${row}${col}`);
          };
      };
  };
  // Log and return an array of the possible landing coordinates
  console.log(`These are the possible landing coordinates: ${possibleLandingCoords}`);
  return possibleLandingCoords;
}

//! Creating an array to store matching colors
const colorCluster = [];

//! Function to check if the possible positions are empty
const finalPosition = (arr) => { // Argument taken is an array of possible landing coords

  // Create a variable to store the final position where the bubble should land
  let finalLandingCoord;

  for (const coord of possibleLandingCoords) {
    if (!bubbleGrid.includes(coord)) {
      finalLandingCoord = coord;
    };
  };
  // Log and return the position for the bubble to land on
  console.log(`The bubble will land on ${finalLandingCoord}`);
  colorCluster.push(finalLandingCoord);
  return finalLandingCoord;
};

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

  addShooterToGrid(row, col);
};

//! Determining which positions to check
// let the bubble be at x
// check bubble at row-x col-(x-2)
// check bubble at row-x col(x+2)
// check bubble at row-(x-1) col(x-1)
// check bubble at row-(x-1) col(x+1)
// check bubble at row-(x+1) col(x-1)
// check bubble at row-(x+1) col(x+1)

//! Function to check if shooter is in a color cluster
const checkCluster = (arr) => { // The argument is an array with the clustered colors
  for (let i=0; i<arr.length; i++) {

    const row = parseInt(arr[i][0]);
    const col = parseInt(arr[i].substr(1));
    console.log(`This is the row and col we are looking at:`, row, col);

    const $clusterColor = $rows.eq(row).children().eq(col).attr("class");
    console.log(`The class we are using as a ref is ${$clusterColor}`);

    const bubblesToCheck = [`${row}${col-2}`, `${row}${col+2}`, `${row-1}${col-1}`, `${row-1}${col+1}`, `${row+1}${col-1}`, `${row+1}${col+1}`];
    console.log(`These are the bubbles to check: ${bubblesToCheck}`);

    for (let j=0; j<6; j++) {
      const bubble = bubblesToCheck[j]
      const row1 = parseInt(bubble[0]);
      const col1 = parseInt(bubble.substr(1));

      const $checkingColor = $rows.eq(row1).children().eq(col1).attr("class")
      console.log(`The bubble we are looking at is ${row1}${col1} and the class we are trying to match is ${$checkingColor}`);

      if ($checkingColor == $clusterColor && !colorCluster.includes(bubble)) {
        colorCluster.push(`${row1}${col1}`);
      }
    };
    console.log(`These are the bubbles to be removed: ${colorCluster}`);
  };
};

//! Function to add bubble into bubble grid and out of shooter div
const addShooterToGrid = (row, col) => {
  const $shooterClass = $("#shooter-bubble").attr("class");
  console.log($shooterClass);

  const $bubble = $rows.eq(row).children().eq(col);
  $bubble.attr("class", $shooterClass);
  $bubble.css("left", col*25);
  $bubble.css("top", row*50);

  bubbleGrid.push(`${row}${col}`);
  console.log(`Appended a bubble at ${[row, col]}`);
};

//! Function to 'reload' the shooter
const reloadShooter = () => {
  $("#shooter-bubble").remove();
  $rows.eq(9).append("<div>");

  addShooter();

  console.log("Reloaded shooter bubble");
};


//* LOAD AFTER DOM HAS LOADED
$(() => {

  //! Hide the start screen
  $("#start-screen").hide();

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
      // Shooting the bubble
      // const emptyRow = firstEmptyRow();
      const possibleCoords = landingCoords();
      const finalCoord = finalPosition(possibleCoords);
      shootBubble(finalCoord);

      // Removing the bubble as a shooter and adding it into the grid at the correct position
      addShooterToGrid(finalCoord);
      console.log(`These are the bubbles to check: ${colorCluster}`);

      // Checking if the shooter had any clusters
      checkCluster(colorCluster);
      
      // If a cluster is detected, remove the items in that cluster
      // if (colorCluster.length >= 3) {
      //   for (let i=0; i<colorCluster.length; i++) {
      //     const row = parseInt(colorCluster[i][0]);
      //     const col = parseInt(colorCluster[i].substr(1));

      //     // Remove the bubble class from the div at that position
      //     $rows.eq(row).children().eq(col).attr("class", "");
      //   };
      // };

      // Generating a new shooter and clearing everything
      reloadShooter();
      possibleLandingCoords = [];
    };
  });

});