import Tile from './tile';

export default class Board {
  constructor(gridSize, numBombs) {
    this.gridSize = gridSize;
    this.numBombs = numBombs ? numBombs : this.gridSize;
    this.grid = [];
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
}
