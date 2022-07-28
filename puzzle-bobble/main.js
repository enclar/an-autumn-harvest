import $ from "jquery";

//* VARIABLES
const $rows = $(".row");

//* FUNCTIONS
//! Creating a function to select a color from array of chosen colors
const colors = ["red", "yellow", "blue", "green"];

const randomColor = (arr) => {
  const ranNum = Math.floor(Math.random() * arr.length);
  return arr[ranNum];
};

//! Creating a function to generate a bubble
const addBubble = () =>  {
  const $bubble = $("<div>").addClass("bubble");
  return $bubble;
};

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

//! Creating a function to add in a bubble in an even row
// const addEvenRow = (i, j) => { // Function takes row & col number as a parameter
//   const $bubble = addBubble();

//   const $bubbleColor = randomColor(colors);
//   $bubble.addClass($bubbleColor);

//   $bubble.css("left", (j*50)); // Distance from the left of the container
//   $bubble.css("top", (i*50)); // Distance from the top of the container

//   $bubble.attr("data-row", i); // Setting row data
//   $bubble.attr("data-col", j); // Setting column data

//   // bubbleGrid.push(new Bubble(i, j, [(i*50), (j*50)], $bubbleColor)); // Appending bubble data to bubble grid array

//   bubbleGrid.push([i, j]);

//   $(".row").eq(i).append($bubble); // Adding the bubble into i row of grid

// };

//! Creating a function to add in a bubble in an odd row
// const addOddRow = (i, j) => { // Function takes row & col number as a parameter
//   const $bubble = addBubble();

//   const $bubbleColor = randomColor(colors);
//   $bubble.addClass($bubbleColor);

//   $bubble.css("left", (j*50)+25); // Distance from the left of the container
//   $bubble.css("top", (i*50)); // Distance from the top of the container

//   $bubble.attr("data-row", i); // Setting row data
//   $bubble.attr("data-col", j); // Setting column data

//   // bubbleGrid.push(new Bubble(i, j, [(i*50), (j*50)], $bubbleColor)); // Appending bubble data to bubble grid array
  
//   bubbleGrid.push([i, j]);

//   $(".row").eq(i).append($bubble); // Adding the bubble into i row of grid
// };

//! Creating an array to hold the coordinates of each bubble generated
const bubbleGrid = [];

//! Creating a function to generate a bubble in the bubble grid
const addBubbleInGrid = (row, col) => {
  // Creating the bubble and giving it a color
  const $bubble = addBubble();
  $bubble.addClass(randomColor(colors));

  // Setting the coordinates of the bubble
  $bubble.css("left", col*25);
  $bubble.css("top", row*50);

  // Adding row and col data to an array
  bubbleGrid.push(`${row}, ${col}`);

  // Appending the bubble to the respective row
  $rows.eq(row).append($bubble);
  console.log(`Appended a bubble at ${[row, col]}`);
};

//! Creating a function to generate a grid of bubbles
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
};

//! Creating a function to generate shooter bubble
const getShooter = () => {
  // Generating bubble and giving it a color
  const $shooter = addBubble().addClass(randomColor(colors));

  // Attaching the shooter-bubble id to the shooter bubble
  $shooter.attr("id", "shooter-bubble")

  // Appending bubble to the shooter div
  $("#shooter").append($shooter);
};

//! Creating a div to show angle of shooting
const $trajectory = $("<div>").attr("id", "trajectory");
$("#game-screen").append($trajectory);

//! Creating a variable to store the angle of rotation
let rotateAngle = 0;

//! Creating a function to rotate trajectory
const rotateTrajectory = (angle) => {
  $("#trajectory").css("transform", `rotate(${angle}deg)`);
};

//! Creating a function to check which is the lowest row that the bubble can land in
const firstEmptyRow = () => {
  let emptyRow = 0;
  for (let i=0; i<9; i++) {
    if ($rows.eq(i).children().length === 0) {
      console.log(`The first empty row is row ${i}`);
      return emptyRow = i;
    };
  };
};

//! Creating an array to hold the possible intersections
let possibleIntersections = [];

//! Creating a function to convert angle from degrees to radians
const convertAngle = (angle) => {
  // Checking if angle is negative
  if (angle < 0) {
    angle = -(angle);
  }
  return angle * (Math.PI / 180);
};

//! Creating function to find possible launch positions
const possiblePositions = (lowestRow) => {
  const angleInRadians = convertAngle(rotateAngle); // Converting angle to radians

  for (let i=0; i<=lowestRow; i++) {
    const yDist = (9-i) * 50;
    let xDist, col;
    if (rotateAngle >= 0) { // If bubble is shooting towards the right
      xDist = 250 + (yDist * Math.tan(angleInRadians));
      col = Math.round(xDist/50);
      console.log("angle is", rotateAngle);
      console.log("yDist is", yDist);
      console.log("xDist is", xDist);
      console.log("xDist/50 is", xDist/50);
      possibleIntersections.push([i, col]);
    } else { // If bubble is shooting towards the left
      xDist = 250 - (yDist * Math.tan(angleInRadians));
      col = Math.round(xDist/50);
      possibleIntersections.push([i, col]);
    };
  };

  console.log(possibleIntersections);
};

//! Function to check if position is empty
const finalPosition = (arr) => {
  let trajectory;
  for (const position of arr) {
    if (!bubbleGrid.includes(position)) { // Checking if the div is filled
      trajectory = position; // The lowest div that is not filled will be the final position
    };
  };

  const bottom = (trajectory[0]-1) * 50;
  let left;
  console.log(trajectory[0], trajectory [1]);

  if (trajectory[0]%2 === 0) { // If it is an even row
    left = (trajectory[1] * 50) - 250;
  } else { // If it is an odd row
    left = (trajectory[1] * 50) - 250;
  };

  shootBubble(left, bottom);

  // const $shooter = $("#shooter-bubble");
  // $shooter.remove();
  // $rows.eq(row).append($shooter.attr("id", ""))
}

//! Function to shoot bubble
const shootBubble = (left, bottom) => {
  $("#shooter-bubble ").animate({
    left: "+=" + left,
    bottom: "+=" + bottom
  });
};


//! LOAD AFTER DOM HAS LOADED
$(() => {

  $("#start-screen").hide();

  addBubbleGrid(5, 10); // Generating a grid of 5 rows with 9/10 bubbles per row
  console.log(bubbleGrid); // Putting the coordinates of all the bubbles into an array

  getShooter(); // Generating the shooter bubble
  
  console.log(firstEmptyDiv());

  //! Event listener to change angle of shooting
  $(window).on("keydown", (event) => {
    if (event.which === 39) { // Listening for pressdown of right arrow key
      if (rotateAngle <= 45) { // Preventing arrow from rotating out of the playing field
        rotateAngle += 1; // Angle of rotation changes by 10deg with each press
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
      possiblePositions(firstEmptyDiv());
      finalPosition(possibleIntersections);
      // shootBubble(); // Shooting the bubble
      // getShooter(); // Generating a new shooter bubble
      rotateAngle = 0; // Resetting the trajectory angle to zero
      rotateTrajectory(rotateAngle); // Resetting trajectory div to center
    };
  });

})