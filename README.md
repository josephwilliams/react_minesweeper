## Minesweeper built with React.js and Javascript
### Optimizing Minesweeper

My first attempt at minesweeper with React.js and Javascript worked as intended (more or less), but was far from optimized and had fundamental issues with how `state` and `props` are intended to operate.

Here's my initial setup, pre-refactoring.
My `Game` Component:
```javascript
export default class Game extends React.Component {
  constructor (props) {
    super();
    this.state = { board: new Board(10) };
    this.updateBoard = this.updateBoard.bind(this);
  }

  updateBoard (tile, flagged) {
    if (flagged) {
      tile.toggleFlag();
    } else {
      tile.minesweep();
    }

    if (this.state.board.isOver(tile)) {
      this.state.board.endGame();
    }

    this.setState({ board: this.state.board });
  }

  render () {
    return (
      <div className="game-container">
        <h1>minesweeper</h1>
        <p style={{color:"#aaaaaa"}}>hold alt to place a flag</p>
        <p>{this.state.board.message}</p>
        <BoardComponent
          board={this.state.board}
          updateBoard={this.updateBoard}
        />
      </div>
    )
  }
}
```

My `Board` Component:
```javascript
export default class Board extends React.Component {
  renderRows () {
    var board = this.props.board.grid;
    return board.map((arr, rowIdx) => {
      return (
        <div className="row" key={rowIdx}>
          {this.renderRowTiles(arr, rowIdx)}
        </div>
      );
    });
  }

  renderRowTiles (arr, rowIdx) {
    return arr.map((tile, colIdx) => {
      return (
        <TileComponent
          tile={tile}
          updateBoard={this.props.updateBoard}
          key={[rowIdx, colIdx]}
          />
      );
    });
  }

  render () {
    return (
      <div className="board-container">
        {this.renderRows()}
      </div>
    )
  }
}
```

My `Tile` Component:
```javascript
export default class Tile extends React.Component {
  handleClick (event) {
    let flag = event.altKey ? true : false;
    this.props.updateBoard(this.props.tile, flag);
  }

  render () {
    var klass, content;
    if (this.props.tile.explored && this.props.tile.hasBomb) {
      klass = "tile-bomb";
      content = "\uD83D\uDCA3";
    } else if (this.props.tile.flagged) {
      klass = "tile-flagged";
      content = "\u2691";
    } else if (this.props.tile.explored) {
      klass = "tile-explored";
      content = this.props.tile.countAdjacentBombs();
    } else {
      klass = "tile-unexplored";
      content = null;
    }

    return (
      <div className={klass} onClick={this.handleClick.bind(this)}>
         <div className="tile-content">
           {content}
         </div>
      </div>
    )
  }
}
```

And the Javascript files:
My `board.js`:
```javascript
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

  isOver (tile) {
    return this.lostGame() || this.wonGame();
  }

  wonGame () {
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

  lostGame () {
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
}
```

My `tile.js`:
```javascript
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
```

#### Random Bomb Placement
My first attempt - and terribly inefficient.  What would happen if the board had 1000 tiles and 999 bombs? There'd be countless duplicates.
```javascript
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
```

To refactor, I had to rethink
