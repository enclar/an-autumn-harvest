// import $ from "jquery";

//* DEFINING VARIABLES
const $rows = $(".row"); // Variable to store all divs with row class
let bubbleGrid = []; // Array to store coords of all bubbles in the grid
const colors = ["red", "yellow", "blue", "green", "orange"]; // Array to hold bubble colors
let rotateAngle = 0; // Variable to store angle of rotation for trajectory
let landingPosition = '';
let altLandingPosition = '';
let colorCluster = []; // Array for temp bubble storage to check for clusters
let floaters = []; // Array for temp bubble storage to check for floaters
let tempFloaters = []; // Array for temp bubble storage to check for floaters
let notFloaters = []; // Array for temp bubbles storage when a bubble is not a floater
let counter = 0;


//* DEFINING FUNCTIONS
//! Function to start the game
const startGame = () => {
  $("#start-screen").hide();
  $("#game-screen").show();
  $("#score-screen").hide();

  //! Adding div grid
  addDivs(19);

  //! Generating a grid with 9/10 bubbles per row
  addBubbleGrid(5, 20);
  
  //! Generating shooter bubble
  addShooter();
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

//! Function to generate a bubble in the bubble grid
const addBubbleInGrid = (row, col) => { // Argument taken is row and col data
  // Selecting the corresponding div which will contain a bubble
  const $bubble = $rows.eq(row).children().eq(col);

  // Giving it a bubble class so it takes on the respective properties
  $bubble.addClass(randomColor(colors));

  // Setting the coordinates of the bubble
  $bubble.css("left", col*25);
  $bubble.css("top", row*50);

  // Adding bubble coordinates into array
  bubbleGrid.push(`${row}${col}`);
  // bubbleColors.push($bubble.attr("class"));
  console.log(`Appended a bubble at ${[row, col]}`);
};

//! Function to generate a grid of bubbles
const addBubbleGrid = (rows, cols) => { // Argument taken is total num of rows and cols
  // Looping each row
  for (let i=0; i<rows; i++) {

    // Checking if the row is odd or even
    if (i%2 == 0) { // In even row only even cols should have bubbles
      for (let j=0; j<cols-1; j+=2) {
        addBubbleInGrid(i, j);
      };
    } else { // In odd row only odd cols should have bubbles
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

  // Adding color property to it and check if bubbles of that color are still in the grid
  // let color = randomColor(colors);
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

//! Function to convert angle from degrees to radians
const convertAngle = (angle) => {
  return angle * (Math.PI / 180);
};

//! Function to check where a vertical bubble should land
const checkStraight = () => {
  for (let i=9; i>=0; i--) {
    if (bubbleGrid.includes(`${i-1}${9}`)) {
      landingPosition = `${i}${10}`;
      colorCluster.push(landingPosition);
      console.log(`The bubble will land at ${landingPosition}`)
      return landingPosition;
    } else if (bubbleGrid.includes(`${i-1}${8}`) || bubbleGrid.includes(`${i-1}${10}`)) {
      landingPosition = `${i}${9}`;
      colorCluster.push(landingPosition);
      console.log(`The bubble will land at ${landingPosition}`)
      return landingPosition;
    };
  };
};

//! Function to check for collisions
const checkCollision = (row) => { // Argument taken is the row which the function is checking

  console.log(`We are checking row ${row}`);
  // Convert angle from deg to radians
  const angleInRadians = convertAngle(rotateAngle);
  
  // Deriving the yDist for the position we are checking
  const yDist = (9-row) * 50;
  
  // Deriving the xDist and col we are checking - These numbers are for the center of the bubble
  const xDist = yDist * Math.tan(angleInRadians) + 250;
  const col = Math.round(xDist / 25);
  
  // Deriving the xDist and col of the right boundary
  const xDistR = xDist + 25;
  const colR = Math.floor((xDistR) / 25);
  
  // Deriving the xDist and col of the left boundary
  const xDistL = xDist - 25;
  const colL = Math.ceil(xDistL / 25);

  console.log(`The bounds are at ${colR} and ${colL} and we are checking ${col}`);

  // Checking for a collision on the right
  rightCollision(row, col, colR, xDistR);

  // If there is no right collision, check for left collision
  if (landingPosition != '') {
    colorCluster.push(landingPosition);
    console.log(`The bubble will land at ${landingPosition}`)
    return landingPosition;
  } else {
    leftCollision(row, col, colL, xDistL);
  };

  // If there are no left or right collisions
  if (landingPosition != '') {
    colorCluster.push(landingPosition);
    console.log(`The bubble will land at ${landingPosition}`)
    return landingPosition;

  // If not at row 0, check the row above
  } else if (row != 0) {
    checkCollision(row-1);

  // If already checked until row 0
  } else if (row == 0) {
    if (col%2 != 0) {
      landingPosition = `${row}${col-1}`;
      colorCluster.push(landingPosition);
      console.log(`The bubble will land at ${landingPosition}`)
      return landingPosition;
    } else if (col%2 != 0 && col == Math.floor(xDist / 25)) {
      landingPosition = `${row}${col}`;
      colorCluster.push(landingPosition);
      console.log(`The bubble will land at ${landingPosition}`)
      return landingPosition;
    } else if (col%2 != 0 && col == Math.ceil(xDist / 25)) {
      landingPosition = `${row}${col-2}`;
      colorCluster.push(landingPosition);
      console.log(`The bubble will land at ${landingPosition}`)
      return landingPosition;
    };
  };
};


//! Function to check collisions on the right
const rightCollision = (row, col, colR, xDistR) => {
  
  // Check for bubble on the right, degree of collision tbc
  if (bubbleGrid.includes(`${row}${colR}`)) {
    // Check if intended position is empty
    if (!bubbleGrid.includes(`${row}${col-1}`)) {
      // Check for minor collision
      if (xDistR - (colR*25) <= 10) {
        landingPosition = `${row}${col-1}`;
      // Check for major collision
      } else if (xDistR - (colR*25) > 10) {
        landingPosition = `${row+1}${col-1}`
      };
    // Check if intended position is filled
    } if (bubbleGrid.includes(`${row}${col-1}`)) {
      // If angle of rotation is positive
      if (rotateAngle > 0) {
        // Check for minor collision
        if (xDistR - (colR*25) <= 10) {
          landingPosition = `${row+1}${col-2}`;
        // Check for major collision
        } else if (xDistR - (colR*25) > 10) {
          landingPosition = `${row+1}${col-1}`;
        };
      // If angle of rotation is negative
      } else if (rotateAngle < 0) {
        landingPosition = `${row+1}${colR-1}`
      };
    };
  // Check for major collision
  } else if (bubbleGrid.includes(`${row}${colR-1}`)) {
    landingPosition = `${row+1}${colR-2}`;
  };
};

//! Function to check collisions on the left
const leftCollision = (row, col, colL, xDistL) => {
  
  // Check for bubble on the left, degree of collision tbc
  if (bubbleGrid.includes(`${row}${colL-2}`)) {
    // Check if intended position is empty
    if (!bubbleGrid.includes(`${row}${col-1}`)) {
      // Check for minor collision
      if ((colL*25) - xDistL <= 10) {
        landingPosition = `${row}${col-1}`;
      // Check for major collision
      } else if ((colL*25) - xDistL > 10) {
        landingPosition = `${row+1}${col-1}`;
      };
    // Check if intended position is filled
    } else if (bubbleGrid.includes(`${row}${col-1}`)) {
      // Check if angle of rotation is positive
      if (rotateAngle >= 0) {
        // Check for minor collision
        if ((colL*25) - xDistL <= 10) {
          landingPosition = `${row+1}${col-2}`;
        // Check for major collision
        } else if ((colL*25) - xDistL > 10) {
          landingPosition = `${row+1}${col-1}`
        };
      // Check if angle of rotation is negative
      } else if (rotateAngle < 0) {
        landingPosition = `${row+1}${colL-1}`;
      };      
    };
    
  // Checking for major collision
  } else if (bubbleGrid.includes(`${row}${colL-1}`)) {
    landingPosition = `${row+1}${colL}`;
  };
};

//! Check if the landing position is out of the grid
const outOfScreen = (coord) => {

  console.log(`We are checking if ${coord} is out of screen`);

  // Initializing the variables
  const row = parseInt(coord[0]);
  const col = parseInt(coord.substr(1));

  // Checking if the bubble will be out of screen
  if (row%2 == 0) {
    if (col<0) {
      altLandingPosition = `${row-1}${col-2}`;
    } else if (col > 18) {
      altLandingPosition = `${row-1}${col+2}`;
    };
  } else if (row%2 != 0) {
    if (col<1) {
      altLandingPosition = `${row-1}${col-3}`;
    } else if (col > 17) {
      altLandingPosition = `${row-1}${col+3}`;
    };
  };
  return altLandingPosition;
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
  console.log(`These are the bubbles in the grid: ${bubbleGrid}`);
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
  
      // If the color is a match and the bubble is not inside the cluster array
      if ($checkingColor == $clusterColor && !colorCluster.includes(bubble)) {
        colorCluster.push(`${row1}${col1}`);
        checkCluster(bubble);
      };
    }
  };
  // console.log(colorCluster);
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

//! Function to check through the array and check for clusters of floaters
const checkForFloaters = (arr) => { // Argument taken is an array of bubbles remaining in the grid
  floaters = [];
  notFloaters = [];

  // Running through a for loop of each coord in the array
  for (const coord of arr) {
    console.log(`We are now checking ${coord}`);

    // Ensure bubble has not been classified as a floater/non-floater
    if (!floaters.includes(coord) && !notFloaters.includes(coord)) {
      // Adding the coord as the first item in the array
      tempFloaters = [coord];
      recursiveCheck(arr, coord);
      
      // Check if any of the bubbles are in row 0
      const row0 = tempFloaters.some((coord) => {return coord[0] == 0});

      if (row0 == true) {
        notFloaters = notFloaters.concat(tempFloaters);
      } else {
        floaters = floaters.concat(tempFloaters);
      }
    };
  };
  return floaters;
};

//! Function to check which bubbles are floaters
const recursiveCheck = (arr, coord) => {
  const row = parseInt(coord[0]);
  const col = parseInt(coord.substr(1));

  // Coordinates of 6 surrounding bubbles to check
  const bubblesToCheck = [`${row}${col-2}`, `${row}${col+2}`, `${row-1}${col-1}`, `${row-1}${col+1}`, `${row+1}${col-1}`, `${row+1}${col+1}`];

  // Running through each of the 6 coords
  for (let coord of bubblesToCheck) {
    // Check if there is a bubble at that coordinate and if it's already been tagged as a floater bubble
    if (arr.includes(coord) && !tempFloaters.includes(coord) && !floaters.includes(coord) && !notFloaters.includes(coord)) {
      tempFloaters.push(coord);
      recursiveCheck(arr, coord);
    };
  };
  return tempFloaters;
};

//! Function to check and edit the colors of all the bubbles in the grid
const colorCheck = (arr) => {

  const bubbleColors = [];

  for (let i=0; i<arr.length; i++) {
    const coord = arr[i]
    const row = parseInt(coord[0]);
    const col = parseInt(coord.substr(1));
    const $color = $rows.eq(row).children().eq(col).attr("class");

    bubbleColors.push($color);
  };

  for (let i=0; i<colors.length; i++) {
    if (!bubbleColors.includes(colors[i])) {
      colors.splice(i, 1);
    };
  };

  console.log(`These are the colors left in the array: ${colors}`);
};


//! Function to 'reload' the shooter
const reloadShooter = () => {
  // Removing the existing shooter and appending a new div to the shooter row
  $("#shooter-bubble").remove();
  $rows.eq(9).append("<div>");

  // Checking the color array
  colorCheck(bubbleGrid);

  // Assigning the div to be a shooter bubble
  addShooter();

  console.log("Reloaded shooter bubble");
};

//! Function to check if the game should end
const checkGameState = () => {
  // Check if there are any bubbles left on the screen
  if (bubbleGrid.length == 0) {
    reloadShooter()
    $("#trajectory").hide();
    console.log("The game has ended!");
    $("#win").show();
  // Check if the bubbles have touched the bottom of the screen
  } else if (colorCluster.length<=2 && colorCluster[0][0] == 8){
    reloadShooter();
    console.log("The game has ended...");
    $("#lose").show();
  // Check if the game should continue
  } else {
    // Resetting
    reloadShooter();
    colorCluster = [];
    landingPosition = '';
    altLandingPosition = '';
  };
};


//* LOAD AFTER DOM HAS LOADED
$(() => {

  //! Hide the game screen, instructions and results message
  $("#game-screen").hide();
  $(".msg").hide();
  $("#htp").hide();

  //! Adding event listener to open and close instructions
  $("#htp-btn").on("click", () => {
    $("#htp").show();
  });

  $("#x-btn").on("click", () => {
    $("#htp").hide();
  });

  //! Adding event listener to start game
  $("#start-btn").on("click", startGame);

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

      if (rotateAngle == 0) {
        checkStraight();
      } else {
        checkCollision(9);
      };

      // Check if bubble will go out of screen
      outOfScreen(landingPosition);

      // If bubble will go out of screen
      if (altLandingPosition != '') {
        console.log(`Out of screen bubble! The alternate landing position is at ${altLandingPosition}`);
        shootBubble(altLandingPosition);
          
        // Display the warning
        setTimeout(() => {
          $("#anyhow").show();
        }, 300);
          
        setTimeout(() => {
          $("#anyhow").hide();
          checkGameState();
        }, 1000);

        // If bubble lands within grid
        } else {
          // Shoot the bubble into the position
          shootBubble(landingPosition);

          //! Run these functions after a certain delay (1000ms)
          setTimeout(() => {
            // Add the shooter bubble into the grid
            addShooterToGrid(landingPosition);
            
            // Check if the bubble is in a color cluster
            checkCluster(landingPosition);
              
            // Remove bubbles if cluster if 3 or more
            if (colorCluster.length >= 3) {
              removeCluster(colorCluster);
                
              console.log(`These are the bubbles in the grid: ${bubbleGrid}`);
              console.log(`We will now check for floaters`);

              // If bubbles were removed
              checkForFloaters(bubbleGrid);
              console.log(`These are the floaters to be removed ${floaters}`);
              setTimeout(() => {
                removeCluster(floaters);
              }, 250);
            };
              
            // Check the game state
            checkGameState();
          }, 1000);
        };
    };
  });

  //! Close result message and reload page upon ending of game
  $(".end-x").on("click", () => {
    location.reload();
  });

});