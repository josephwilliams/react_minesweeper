import Tile from './tile';

export default class Board {
  constructor(gridSize, numBombs) {
    this.gridSize = gridSize;
    this.numBombs = numBombs ? numBombs : this.gridSize;
    this.grid = [];
    this.message = "let's begin!";
    this.generateGrid();
    this.plantBombs();
  }

  generateGrid () {
    for (let i = 0; i < this.gridSize; i++) {
      this.grid.push([]);
      for (let j = 0; j < this.gridSize; j++) {
        const tile = new Tile(this, [i, j]);
        this.grid[i].push(tile);
      }
    }
  }

  plantBombs () {
    var totalPlantedBombs = 0;
    while (totalPlantedBombs < this.numBombs) {
      let row = Math.floor(Math.random() * (this.gridSize - 1));
      let col = Math.floor(Math.random() * (this.gridSize - 1));
      let tile = this.grid[row][col];
      if (!tile.hasBomb) {
        tile.plantBomb();
        totalPlantedBombs++;
      }
    }
  }

  flattenedGrid () {
    return (
      this.grid.reduce((a, b) => {
        return a.concat(b);
      })
    );
  }

  isOver (tile) {
    return tile.hasBomb || this.wonGame();
  }

  wonGame () {
    var exploredTiles = 0;
    var flattened = this.flattenedGrid();
    for (let i = 0; i < flattened.length; i++) {
      let tile = flattened[i];
      if (!tile.hasBomb && tile.explored)
        exploredTiles++;
    }

    return exploredTiles === ((this.gridSize * this.gridSize) - this.numBombs);
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
}
