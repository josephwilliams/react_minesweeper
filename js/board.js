export default class Board {
  constructor(gridSize, numBombs) {
    this.gridSize = gridSize;
    this.numBombs = numBombs ? numBombs : this.gridSize;
    this.grid = [];
    this.bombCounts = [];       // mapping of adjacent bomb counts of each tile
    this.gameState = true;      // if game is still ongoing
    this.correctFlagCount = 0;  // flagged bomb tile count
    this.exploredCount = 0;     // explored tile count
    this.DELTAS = [[-1,-1],[-1,0],[-1,1],[0,-1],
                   [0,1],[1,-1],[1,0],[1,1]];
    this.generateTiles();
    this.randomizeTiles();
    this.setupGrid();
    this.getAdjacentBombCounts();
  }

  generateTiles () {
    let tileCount = this.gridSize * this.gridSize;
    let gridTiles = new Array(tileCount - this.numBombs).fill(true);
    let bombTiles = new Array(this.numBombs).fill(0);
    this.grid = gridTiles.concat(bombTiles);
  }

  randomizeTiles () {
    let j = 0;
    let temp;
    for (let i = this.grid.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = this.grid[i];
      this.grid[i] = this.grid[j];
      this.grid[j] = temp;
    }
  }

  setupGrid () {
    let newGrid = [];
    for (let i = 0; i < this.gridSize; i++) {
      let row = this.grid.slice(i * this.gridSize, i * this.gridSize + this.gridSize);
      newGrid.push(row);
    }

    this.grid = newGrid;
  }

  getAdjacentBombCounts () {
    let tempGrid = [];
    for (let i = 0; i < this.gridSize; i++) {
      tempGrid.push([]);
      for (let j = 0; j < this.gridSize; j++) {
        let bombCount = this.adjacentBombCount([i, j]);
        tempGrid[i].push(bombCount);
      }
    }

    this.bombCounts = tempGrid;
  }

  adjacentBombCount (pos) {
    let bombCount = 0;
    this.adjacentTiles(pos).forEach(tile => {
      if (tile === 0) {
        bombCount++;
      }
    });

    return bombCount;
  }

  adjacentTiles (pos) {
    let tiles = [];
    this.DELTAS.forEach(delta => {
      let row = pos[0] + delta[0];
      let col = pos[1] + delta[1];
      if (this.withinBounds([row, col])) {
        let tile = this.grid[row][col];
        tiles.push(tile);
      }
    });

    return tiles;
  }

  withinBounds (pos) {
    return pos[0] >= 0 && pos[0] < this.gridSize &&
           pos[1] >= 0 && pos[1] < this.gridSize;
  }

  toggleFlag (pos) {
    let row = pos[0];
    let col = pos[1];
    if (this.grid[row][col] === ""){           // flagged tile
      this.grid[row][col] = true;              // returns to unexplored
    } else if (this.grid[row][col] === 1) {    // bomb tile with flag
      this.grid[row][col] = 0;                 // returns to unexplored bomb
      this.correctFlagCount--;
    } else if (this.grid[row][col] === 0) {    // bomb tile unexplored
      this.grid[row][col] = 1;                 // switches to bomb tile with flag
      this.correctFlagCount++;
    } else if (this.grid[row][col] === true) { // unexplored tile
      this.grid[row][col] = "";                // switches to flag tile unexplored
    }
  }

  beginExploration (pos) {
    let tile = this.grid[pos[0]][pos[1]];
    if (tile === 0) {
      this.endGame();
    } else {
      this.explore(pos);
    }
  }

  explore (pos) {
    if (this.withinBounds(pos)) {
      let tile = this.grid[pos[0]][pos[1]];
      if (tile === "" || tile === false) {
        return;
      }

      this.grid[pos[0]][pos[1]] = false; // explored
      this.exploredCount++;
      if (this.bombCounts[pos[0]][pos[1]] === 0 && tile !== 0) {
        this.DELTAS.forEach(delta => {
          let row = pos[0] + delta[0];
          let col = pos[1] + delta[1];
          this.explore([row, col]);
        });
      }
    }
  }

  won () {
    let tileCount = this.gridSize * this.gridSize;
    return (tileCount - this.correctFlagCount - this.exploredCount) === 0 ||
           (tileCount - this.exploredCount === this.numBombs) ||
           (this.correctFlagCount === this.numBombs);
  }

  endGame () {
    this.gameState = false;
  }
}
