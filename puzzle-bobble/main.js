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
  $bubble.addClass(randomColor(colors));
  return $bubble;
};

//! Creating an array to hold the coordinates of each bubble generated
const bubbleGrid = [];

//! Creating a function to add in a bubble in an even row
const addEvenRow = (i, j) => { // Function takes row number as a parameter
  const $bubble = addBubble();
  $bubble.css("left", (j*50)); // Distance from the left of the container
  $bubble.css("top", (i*50)); // Distance from the top of the container

  $bubble.attr("data-row", i); // Setting row data
  $bubble.attr("data-col", j); // Setting column data

  bubbleGrid.push([i, j]);

  $("#grid").append($bubble); // Adding the bubble into the grid

};

//! Creating a function to add in a bubble in an odd row
const addOddRow = (i, j) => { // Function takes row number as a parameter
  const $bubble = addBubble();
  $bubble.css("left", (j*50)+25); // Distance from the left of the container
  $bubble.css("top", (i*50)); // Distance from the top of the container

  $bubble.attr("data-row", i); // Setting row data
  $bubble.attr("data-col", j); // Setting column data

  bubbleGrid.push([i, j]);
  
  $("#grid").append($bubble); // Adding the bubble into the grid

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
  const $shooter = addBubble();
  $shooter.attr("id", "shooter"); 
  $("#game-screen").append($shooter);
};

//! Function to shoot bubble
const shootBubble = () => {
  $("#shooter").animate({
    left: "+=50",
    bottom: "+=200"
  }); 
};

//! Create a div to show angle 
//! Function to rotate clockwise
const rotateClockwise = () => {

};

$(() => {

  $("#start-screen").hide();

  addBubbleGrid(5, 10); // Generating a grid of 5 rows with 10 bubbles per row
  console.log(bubbleGrid); // Checking that all the row and 

  getShooter();

  //! Event listener to shoot
  // $(window).on("keydown", (event) => {
  //   if (event.which === 32) {
  //     shootBubble();
      
  //   }
  // });

  //! Event listener to change angle of shooting
  // $(window).on("keydown", (event) => {
  //   if (event.which === 39) {
  //     rotate
  //   }
  // })

})