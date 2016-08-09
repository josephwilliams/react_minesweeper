export default class Tile {
  constructor (board, pos) {
    this.board = board;
    this.pos = pos;
    this.hasBomb = false;
    this.flagged = false;
    this.explored = false;
    this.nearbyBombs = 0;
    this.deltas = [[-1,-1],[-1,0],[-1,1],[0,-1],
                   [0,1],[1,-1],[1,0],[1,1]];
  }

  plantBomb () {
    this.hasBomb = true;
  }

  toggleFlag () {
    this.flagged = !this.flagged;
  }

  explore () {
    this.explored = true;
  }

  withinBounds (pos) {
    let gridSize = this.board.gridSize;
    return pos[0] >= 0 && pos[0] < gridSize &&
           pos[1] >= 0 && pos[1] < gridSize;
  }

  adjacentTiles () {
    var tiles = [];
    this.deltas.forEach(delta => {
      let row = this.pos[0] + delta[0];
      let col = this.pos[1] + delta[1];
      if (this.withinBounds([row, col])) {
        let tile = this.board.grid[row][col];
        tiles.push(tile);
      }
    });

    return tiles;
  }

  countAdjacentBombs () {
    var bombCount = 0;
    this.adjacentTiles().forEach(tile => {
      if (tile.hasBomb)
      bombCount++;
    });

    return bombCount;
  }

  minesweep () {
    if (this.flagged || this.explored) {
      return this;
    }

    this.explore();
    this.board.message = "[" + this.pos + "] explored!";
    if (this.countAdjacentBombs() === 0 && !this.hasBomb) {
      this.adjacentTiles().forEach(tile => {
        tile.minesweep();
      });
    }
  }
}
