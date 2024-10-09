// Get references to the HTML elements for the game canvas and scoreboard
let canvas = document.getElementById("game-canvas");
let scoreboard = document.getElementById("scoreboard");

// Get the drawing context for the canvas and scale it for the game blocks
let ctx = canvas.getContext("2d");
ctx.scale(BLOCK_SIDE_LENGTH, BLOCK_SIDE_LENGTH); // Scale the canvas context for block size

// Create a new instance of the GameModel
let model = new GameModel(ctx);

// Initialize the score variable
let score = 0;

// Set an interval to update the game state at regular intervals
setInterval(() => {
  newGameState(); // Call the function to update the game state
}, GAME_CLOCK); // GAME_CLOCK defines the speed of the game

// Function to create a new game state
let newGameState = () => {
  fullSend(); // Check for filled rows and update the score

  // If there is no falling piece, create a new one
  if (model.fallingPiece === null) {
    const rand = Math.round(Math.random() * 6) + 1; // Generate a random number for the piece
    const newPiece = new Piece(SHAPES[rand], ctx); // Create a new piece based on the random shape
    model.fallingPiece = newPiece; // Set the new piece as the falling piece
    model.moveDown(); // Move the new piece down
  } else {
    model.moveDown(); // If there is already a piece, just move it down
  }
};

// Function to check for filled rows and update the score
const fullSend = () => {
  // Helper function to check if a row is filled
  const allFilled = (row) => {
    for (let x of row) {
      if (x === 0) {
        return false; // If any cell in the row is empty, return false
      }
    }
    return true; // All cells are filled
  };

  // Loop through the grid and check for filled rows
  for (let i = 0; i < model.grid.length; i++) {
    if (allFilled(model.grid[i])) {
      score += SCORE_WORTH; // Update the score
      model.grid.splice(i, 1); // Remove the filled row from the grid
      model.grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Add a new empty row at the top
    }
  }

  // Update the scoreboard display with the current score
  scoreboard.innerHTML = "Score: " + String(score);
};

// Event listener for keyboard controls
document.addEventListener("keydown", (e) => {
  e.preventDefault(); // Prevent default actions (like scrolling)
  switch (e.key) {
    case "ArrowUp": // Rotate the piece
      model.rotate();
      break;
    case "ArrowRight": // Move the piece right
      model.move(true);
      break;
    case "ArrowDown": // Move the piece down
      model.moveDown();
      break;
    case "ArrowLeft": // Move the piece left
      model.move(false);
      break;
    case " ": // Spacebar to drop the piece immediately
      model.drop(); // Call the drop method
      break;
  }
});
