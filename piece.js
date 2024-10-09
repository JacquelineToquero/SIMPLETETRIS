class Piece {
  constructor(shape, ctx) {
    this.shape = shape; // The shape of the piece (2D array)
    this.ctx = ctx; // The rendering context
    this.y = 0; // Initial vertical position
    this.x = Math.floor(COLS / 2); // Initial horizontal position (centered)
  }

  // Render the piece with a grid structure
  renderPiece() {
    const gridSize = 1; // Size of each grid cell

    this.shape.map((row, i) => {
      row.map((cell, j) => {
        if (cell > 0) {
          // Draw the piece
          this.ctx.fillStyle = COLORS[cell]; // Set the color based on the cell value
          this.ctx.fillRect(this.x + j, this.y + i, gridSize, gridSize); // Draw the piece cell
        }

        // RANDOM BLOCK HAHAHAAH
        //this.ctx.strokeStyle = "white"; // Set the grid line color to white
        //this.ctx.strokeRect(this.x + j, this.y + i, gridSize, gridSize); // Draw the grid cell outline
      });
    });
  }
}
