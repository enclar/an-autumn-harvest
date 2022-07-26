import $ from "jquery";

//* FUNCTIONS
//! Function to select color from array of chosen colors
const colors = ["red", "yellow", "blue", "green"];

const randomColor = (arr) => {
  const ranNum = Math.floor(Math.random() * arr.length);
  return arr[ranNum];
};

//! Function to generate bubble
const addBubble = () =>  {
  const $bubble = $("<div>").addClass("bubble");
  return $bubble;
};

//! Creating a bubble class
class Bubble {
  constructor(row, col, coords, color) {
    this.row = row;
    this.col = col;
    this.coords = coords;
    this.color = color;
  };
};

//! Creating an array to hold the coordinates of each bubble generated
const bubbleGrid = [];

//! Creating a function to add in a bubble in an even row
const addEvenRow = (i, j) => { // Function takes row & col number as a parameter
  const $bubble = addBubble();

  const $bubbleColor = randomColor(colors);
  $bubble.addClass($bubbleColor);

  $bubble.css("left", (j*50)); // Distance from the left of the container
  $bubble.css("top", (i*50)); // Distance from the top of the container

  $bubble.attr("data-row", i); // Setting row data
  $bubble.attr("data-col", j); // Setting column data

  bubbleGrid.push(new Bubble(i, j, [(i*50), (j*50)], $bubbleColor)); // Appending bubble data to bubble grid array

  $(".row").eq(i).append($bubble); // Adding the bubble into i row of grid

};

//! Creating a function to add in a bubble in an odd row
const addOddRow = (i, j) => { // Function takes row number as a parameter
  const $bubble = addBubble();

  const $bubbleColor = randomColor(colors);
  $bubble.addClass($bubbleColor);

  $bubble.css("left", (j*50)+25); // Distance from the left of the container
  $bubble.css("top", (i*50)); // Distance from the top of the container

  $bubble.attr("data-row", i); // Setting row data
  $bubble.attr("data-col", j); // Setting column data

  bubbleGrid.push(new Bubble(i, j, [(i*50), (j*50)], $bubbleColor)); // Appending bubble data to bubble grid array
  
  $(".row").eq(i).append($bubble); // Adding the bubble into i row of grid
};

//! Function to generate bubble grid
const addBubbleGrid = (rows, cols) => {
  for (let i=0; i<rows; i++) { // For the number of rows
      for (let j=0; j<cols; j++) { // For the number of columns
          if (i%2 === 0) { // If it is an even row
            addEvenRow(i, j); // Add a bubble in an even row
          } else if (i%2 !== 0 && j !== cols-1) { // If it is an odd row
            addOddRow(i, j); // Add a bubble in an odd row
          };
      };
  };
};

//! Function to generate shooter bubble
const getShooter = () => {
  const $shooter = addBubble().addClass(randomColor(colors));
  $shooter.attr("id", "shooter-bubble")
  $("#shooter").append($shooter);
};

//! Div to show angle of shooting
const $trajectory = $("<div>").attr("id", "trajectory");
$("#game-screen").append($trajectory);

//! Functions to rotate trajectory
let rotateAngle = 0;

const rotateTrajectory = (angle) => {
  $("#trajectory").css("transform", `rotate(${angle}deg)`);
};

//! Function to shoot bubble
const shootBubble = () => {
  $("#shooter-bubble ").animate({
    left: "+=50",
    bottom: "+=200"
  });
};

//! Function to check where the bubble should stop
const $rows = $(".row");

const firstEmptyDiv = () => { // Checking the lowest row which contains bubbles
  let lowestRow = 8;
  for (let i=0; i<9; i++) {
    if ($rows.eq(i).children().length === 0) {
      return lowestRow = i-1;
    };
  };
};

let possibleIntersections = [];



// check if array has a bubble of those row/col coords
// const shooterPosition = () => {
//   const colToCheck = 
// }

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
        rotateAngle += 10; // Angle of rotation changes by 10deg with each press
        rotateTrajectory(rotateAngle);
      };
    };
    if (event.which === 37) {
      if (rotateAngle >= -45) {
        rotateAngle -= 10;
        rotateTrajectory(rotateAngle);
      };
    };
  });

  //! Event listener to shoot
  $(window).on("keydown", (event) => {
    if (event.which === 32) { // Listening for pressdown of spacebar
      shootBubble(); // Shooting the bubble
      // getShooter(); // Generating a new shooter bubble
      rotateAngle = 0; // Resetting the trajectory angle to zero
      rotateTrajectory(rotateAngle); // Resetting trajectory div to center
    };
  });

})