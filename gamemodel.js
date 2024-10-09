class GameModel {
  constructor(ctx) {
    this.ctx = ctx; // The rendering context for the game
    this.fallingPiece = null; // The currently falling piece (initially none)
    this.grid = this.makeStartingGrid(); // Initialize the game grid
  }

  // Creates the starting grid filled with zeros
  makeStartingGrid() {
    let grid = [];
    for (var i = 0; i < ROWS; i++) {
      grid.push([]); // Create a new row
      for (var j = 0; j < COLS; j++) {
        grid[grid.length - 1].push(0); // Fill the row with zeros
      }
    }
    return grid; // Return the completed grid
  }

  // Check for collisions with other pieces or boundaries
  collision(x, y) {
    const shape = this.fallingPiece.shape; // Get the shape of the falling piece
    const n = shape.length; // Get the size of the shape
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (shape[i][j] > 0) {
          // Check for filled cells
          let p = x + j; // Calculate the grid position
          let q = y + i;
          if (p >= 0 && p < COLS && q < ROWS) {
            if (this.grid[q][p] > 0) {
              // Check for collision with existing pieces
              return true;
            }
          } else {
            return true; // Out of bounds
          }
        }
      }
    }
    return false; // No collision detected
  }

  // Render the current game state to the canvas
  renderGameState() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let cell = this.grid[i][j]; // Get the value of the current cell
        this.ctx.fillStyle = COLORS[cell]; // Set the color based on the cell value
        this.ctx.fillRect(j, i, 1, 1); // Draw the cell on the canvas
      }
    }

    // Render the falling piece if it exists
    if (this.fallingPiece !== null) {
      this.fallingPiece.renderPiece();
    }
  }

  // Move the falling piece down
  moveDown() {
    if (this.fallingPiece === null) {
      this.renderGameState(); // Render the game state if no piece is falling
      return;
    } else if (this.collision(this.fallingPiece.x, this.fallingPiece.y + 1)) {
      // Check for collision if moving down
      const shape = this.fallingPiece.shape;
      const x = this.fallingPiece.x;
      const y = this.fallingPiece.y;
      shape.map((row, i) => {
        row.map((cell, j) => {
          let p = x + j;
          let q = y + i;
          if (p >= 0 && p < COLS && q < ROWS && cell > 0) {
            this.grid[q][p] = shape[i][j]; // Place the piece in the grid
          }
        });
      });

      // Check if the piece is at the top (game over)
      if (this.fallingPiece.y === 0) {
        alert("Game over!"); // Alert the player
        this.grid = this.makeStartingGrid(); // Reset the grid
      }
      this.fallingPiece = null; // Reset the falling piece
    } else {
      this.fallingPiece.y += 1; // Move the piece down
    }
    this.renderGameState(); // Render the updated game state
  }

  // Move the falling piece left or right
  move(right) {
    if (this.fallingPiece === null) {
      return; // Do nothing if no piece is falling
    }

    let x = this.fallingPiece.x; // Current x position
    let y = this.fallingPiece.y; // Current y position
    if (right) {
      if (!this.collision(x + 1, y)) {
        this.fallingPiece.x += 1; // Move right if no collision
      }
    } else {
      if (!this.collision(x - 1, y)) {
        this.fallingPiece.x -= 1; // Move left if no collision
      }
    }
    this.renderGameState(); // Render the updated game state
  }

  // Rotate the falling piece
  rotate() {
    if (this.fallingPiece !== null) {
      let shape = this.fallingPiece.shape; // Get the current shape
      for (let y = 0; y < shape.length; ++y) {
        for (let x = 0; x < y; ++x) {
          // Rotate the shape 90 degrees
          [this.fallingPiece.shape[x][y], this.fallingPiece.shape[y][x]] = [
            this.fallingPiece.shape[y][x],
            this.fallingPiece.shape[x][y],
          ];
        }
      }

      // Reverse the rows to complete the rotation
      this.fallingPiece.shape.forEach((row) => row.reverse());
    }
    this.renderGameState(); // Render the updated game state
  }

  drop() {
    if (this.fallingPiece === null) {
      return; // No piece to drop
    }

    // Drop the piece until it hits the bottom or collides with another piece
    while (!this.collision(this.fallingPiece.x, this.fallingPiece.y + 1)) {
      this.fallingPiece.y += 1; // Move the piece down
    }

    // Finalize the position of the piece
    const shape = this.fallingPiece.shape;
    const x = this.fallingPiece.x;
    const y = this.fallingPiece.y;

    shape.map((row, i) => {
      row.map((cell, j) => {
        let p = x + j;
        let q = y + i;
        if (p >= 0 && p < COLS && q < ROWS && cell > 0) {
          this.grid[q][p] = shape[i][j]; // Place the piece in the grid
        }
      });
    });

    if (this.fallingPiece.y === 0) {
      alert("Game over!"); // Check for game over
      this.grid = this.makeStartingGrid(); // Reset the grid
    }

    this.fallingPiece = null; // Reset the falling piece
    this.renderGameState(); // Render the updated game state
  }
}
