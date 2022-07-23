import $ from "jquery";

//* FUNCTIONS
//! Array of possible colors
const colors = ["red", "yellow", "blue", "green"];

//! Function to generate bubble
const addBubble = () =>  {
  const $bubble = $("<div>").addClass("bubble");
  const ranNum = Math.floor(Math.random() * colors.length);
  $bubble.addClass(colors[ranNum]);
  return $bubble;
};

//! Function to generate bubble grid
const addBubbleGrid = (rows, cols) => {
  for (let i=0; i<rows; i++) { // For the number of rows
      for (let j=0; j<cols; j++) { // For the number of columns
          const $bubble = addBubble();
          if (i%2 === 0) { // If it is an even row
              $bubble.css("left", (j*50));
              $bubble.css("top", (i*50));
              $("#grid").append($bubble);
          } else if (i%2 !== 0 && j !== cols-1) { // If it is an odd row
              $bubble.css("left", (j*50)+25);
              $bubble.css("top", (i*50));
              $("#grid").append($bubble);
          };
      };
  };
};


$(() => {

  addBubbleGrid(5, 10);
  
})