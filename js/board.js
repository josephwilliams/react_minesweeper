import Tile from './tile';

export default class Board {
  constructor(gridSize, numBombs) {
    this.gridSize = gridSize;
    this.numBombs = numBombs ? numBombs : this.gridSize;
    this.grid = [];
    this.message = "let's begin!";
    this.gameState = true;
    this.generateTiles();
    this.scrambleTiles();
    this.generateGrid();
    console.log(this.grid);
  }

  generateTiles () {
    let tileCount = this.gridSize * this.gridSize;
    let grid = new Array(tileCount - this.numBombs).fill(true);
    let bombTiles = new Array(this.numbBombs).fill(0);
    this.grid = grid.concat(bombTiles);
  }

  scrambleTiles () {
    let j = 0;
    let temp;
    for (let i = this.grid.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = this.grid[i];
      this.grid[i] = this.grid[j];
      this.grid[j] = temp;
    }
  }

  generateGrid () {
    let newGrid = [];
    // for (let i = 0; i < this.gridSize.length; i++) {
    //   let row = this.grid.slice(i * this.gridSize, i * this.gridSize * i);
    //   newGrid.push(row);
    // }

    let i = 1;
    while (this.grid.length > 0) {
      let row = this.grid.splice(i * this.gridSize, i * this.gridSize * i);
      newGrid.push(row);
      i++;
    }

    this.grid = newGrid;
  }

  isOver (tile) {
    return this.lost() || this.won();
  }

  won () {
    var exploredTiles = 0;
    this.grid.forEach(row => {
      row.forEach(tile => {
        if (!tile.hasBomb && tile.explored)
          exploredTiles++;
      });
    });

    let totalTiles = this.gridSize * this.gridSize;
    return exploredTiles === totalTiles - this.numBombs;
  }

  lost () {
    var bombed = false;
    this.grid.forEach(row => {
      row.forEach(tile => {
        if (tile.hasBomb && tile.explored)
          bombed = true;
      });
    });

    return bombed;
  }

  endGame () {
    this.message = this.wonGame() ? "you win!" : "you lose!";
    this.showBoard();
  }

  showBoard () {
    this.grid.forEach(row => {
      row.map(tile => {
        tile.explore();
      });
    });
  }

  withinBounds (pos) {
    return pos[0] >= 0 && pos[0] < this.gridSize &&
           pos[1] >= 0 && pos[1] < this.gridSize;
  }

  adjacentTiles (pos) {
    let tiles = [];
    Board.DELTAS.forEach(delta => {
      let row = this.pos[0] + delta[0];
      let col = this.pos[1] + delta[1];
      if (this.withinBounds([row, col])) {
        let tile = this.grid[row][col];
        tiles.push(tile);
      }
    });

    return tiles;
  }

  adjacentBombCount (pos) {
    let bombCount = 0;
    this.adjacentTiles(pos).forEach(tile => {
      if (tile === 0)
        bombCount++;
    });

    return bombCount;
  }

  // minesweep () {
  //   if (this.flagged || this.explored) {
  //     return this;
  //   }
  //
  //   this.explore();
  //   this.board.message = "[" + this.pos + "] explored!";
  //   if (this.adjacentBombCount() === 0 && !this.hasBomb) {
  //     this.adjacentTiles().forEach(tile => {
  //       tile.minesweep();
  //     });
  //   }
  // }
}

Board.DELTAS = [[-1,-1],[-1,0],[-1,1],[0,-1],
[0,1],[1,-1],[1,0],[1,1]];
