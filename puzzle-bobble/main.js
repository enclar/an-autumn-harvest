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

//! Function to generate bubble grid
const addBubbleGrid = (rows, cols) => {
  for (let i=0; i<rows; i++) { // For the number of rows
      for (let j=0; j<cols; j++) { // For the number of columns
          const $bubble = addBubble();
          if (i%2 === 0) { // If it is an even row
              $bubble.css("left", (j*50)); // Top left coords of bubble
              $bubble.css("top", (i*50));
              $("#grid").append($bubble);
          } else if (i%2 !== 0 && j !== cols-1) { // If it is an odd row
              $bubble.css("left", (j*50)+25); // Accounting for offset
              $bubble.css("top", (i*50));
              $("#grid").append($bubble);
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

  addBubbleGrid(5, 10);
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