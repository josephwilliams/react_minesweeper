export default class Board {
  constructor(gridSize, numBombs) {
    this.gridSize = gridSize;
    this.numBombs = numBombs ? numBombs : this.gridSize;
    this.grid = [];
    this.bombCounts = [];
    this.gameState = true;
    this.message = "let's begin!";
    this.DELTAS = [[-1,-1],[-1,0],[-1,1],[0,-1],
                   [0,1],[1,-1],[1,0],[1,1]];
    this.generateTiles();
    this.randomizeTiles();
    this.setupGrid();
    this.determineBombCounts();
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
      let row = this.grid.slice(i * this.gridSize, i * this.gridSize + this.gridSize - 1);
      newGrid.push(row);
    }

    this.grid = newGrid;
  }

  determineBombCounts () {
    let tempGrid = this.grid;
    tempGrid.map((row, rowIdx) => {
      row.map((tile, colIdx) => {
        tile = this.adjacentBombCount([rowIdx, colIdx]);
      });
    });

    this.bombCounts = tempGrid;
  }

  adjacentBombCount (pos) {
    let bombCount = 0;
    this.adjacentTiles(pos).forEach(tile => {
      if (tile === 0)
      bombCount++;
    });

    return bombCount;
  }

  adjacentTiles (pos) {
    console.log("pos:"+ pos);
    const tiles = [];
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
    this.grid[row][col] = this.grid[row][col] === "" ? true : "";
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
    let tile = this.grid[pos[0]][pos[1]];
    if (tile === "" || tile === "false") {
      return;
    }

    this.grid[pos[0]][pos[1]] = false; // explored
    this.message = "[" + this.pos + "] explored!";
    if (this.adjacentBombCount(pos) === 0 && tile !== 0) {
      this.adjacentTiles().forEach(pos => {
        this.explore(pos);
      });
    }
  }

  won () {
    let exploredTiles = 0;
    this.grid.forEach(row => {
      row.forEach(tile => {
        if (!tile.hasBomb && tile.explored)
          exploredTiles++;
      });
    });

    let totalTiles = this.gridSize * this.gridSize;
    return exploredTiles === totalTiles - this.numBombs;
  }

  endGame () {
    this.message = this.won() ? "you win!" : "you lose!";
    this.gameState = false;
  }
}
