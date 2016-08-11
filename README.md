## Minesweeper built with React.js and Javascript
### Optimizing Minesweeper

My first attempt at minesweeper with React.js and Javascript worked as intended (more or less), but was far from optimized and had fundamental issues with how `state` and `props` are intended to operate within `React.js`.

Here's my initial setup, pre-refactoring.

* I rendered react through a div on a static HTML page using NPMs through a `bundle.js` file with `webpack`.

```javascript
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Game from './components/game_comp';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  ReactDOM.render(<Game />, root)
});
```

##### My Original Components and JS Files
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

## Refactoring for Optimization

#### Random Bomb Placement
My first attempt at a random bomb placement - and terribly inefficient. What would happen if the board had 1000 tiles and 999 bombs? There'd be countless duplicates.
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

To refactor, I had to rethink how I was setting up my `board.grid`.  

I'm generating an Array, `grid`, whose length is the total number of tiles on the grid, `tileCount`, less the number of bombs, `this.numBombs` and filling it with `true`, the value I've chosen to represent an unexplored tile.

I'm then creating an array of length `this.numBombs` that contain only `0`, my value for a bomb tile.

Using my `randomizeTiles()` function, I shuffled the tiles within the `this.grid` array.  Next, with `setupGrid()`, I changed what was one array into an array of arrays to simulate rows on a grid.

```javascript
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
```

### New Tile States
As mentioned, I'm using new values to represent tile states. This will decrease coupling of inputs and potentially be more reliable.

```javascript
flagged tile: "" // falsey
explored tile: false // falsey
unexplored tile: true // truthy
bombed tile: 0 // falsey
bombed tile with flag: 1 // truthy
```

### Changing the flow of the game
I re-situated a lot of the logic.  Specifically, I changed the `withinBounds`, `adjacentTiles`, `countAdjacentBombs`, and `minesweep` functions from the `Tile` to the `Board` class.

Ultimately, after simplifying how `this.grid` stores `tiles`, I was able to delete the `Tile` class entirely, converting much of its logic to the `Board class`.

This did leave me with some unruly functions, like `toggleFlag`, in the `Board` class. Furthermore, I had to form the class around the tile variable nomenclature.

```javascript
toggleFlag (pos) {
  let row = pos[0];
  let col = pos[1];
  if (this.grid[row][col] === ""){           // flagged tile
    this.grid[row][col] = true;              // returns to unexplored
    this.flagCount--;
  } else if (this.grid[row][col] === 1) {    // bomb tile with flag
    this.grid[row][col] = 0;                 // returns to unexplored bomb
    this.flagCount--;
  } else if (this.grid[row][col] === 0) {    // bomb tile unexplored
    this.grid[row][col] = 1;                 // switches to bomb tile with flag
    this.flagCount++;
  } else if (this.grid[row][col] === true) { // unexplored tile
    this.grid[row][col] = "";                // switches to flag tile unexplored
    this.flagCount++;
  }
}
```

### Tile Deltas
My original implementation re-instantiated `this.deltas`, an array of arrays, for each instantiated `Tile`. To fix this, I attached `this.DELTAS` to the `Board` class, which only renders once.

```javascript
export default class Board {
  constructor(gridSize, numBombs) {
    this.DELTAS = [[-1,-1],[-1,0],[-1,1],[0,-1],
               [0,1],[1,-1],[1,0],[1,1]];
```

### Tile Component Overhaul
My new `Tile` component's `render()` method was updated to fit the new simplified tile distinction pattern.

I passed a `gameState` prop from the `Board` component to expose bomb tiles and unexplored tiles when the game ends.  This allowed me to delete the `showBoard()` function in the `Board` class.

```javascript
render () {
  let klass, content = null;
  if (this.props.tile === 0) {
    if (this.props.gameState){
      klass = "tile-unexplored";
    } else {
      klass = "tile-bomb";
      content = "\uD83D\uDCA3";
    }
  } else if (this.props.tile === "") {
    klass = "tile-flagged";
    content = "\u2691";
  } else if (this.props.tile === false) {
    klass = "tile-explored";
    content = this.props.adjacentBombCount;
  } else {
    if (this.props.gameState){
      klass = "tile-unexplored";
    } else {
      klass = "tile-explored";
      content = this.props.adjacentBombCount;
    }
  }
```
#### A Single Click Event Handler

I was also able to refactor out the click event handler function that was recreated with each `Tile`.  Rather, I attached `this.props.pos` as a `data-tag` on each tile's container class.

```javascript
<div className={klass} data-tag={this.props.pos}>
```
By doing this and attaching a click event handler to the `Board` component, I was able to read the position with `event.target.dataset.tag`.

```javascript
handleClick (event) {
  let tileStr = event.target.dataset.tag;
  let pos = tileStr.split(",").map(Number)
  if (this.props.board.gameState) {
    let flag = event.altKey ? true : false;
    this.props.updateBoard(pos, flag);
  }
}
```

This left the `Tile` class with only a `render` method.  As such, I turned it into a functional component.  ES6 + React = Awesome.

#### Exploring and Ending the Game
Soon after, I began refactoring my mine minesweeping methods, the recursive `explore()` function, newly in my `Board` class.  `explore()` was to be enacted after `beginExploration()`, which would check for defeat conditions, e.g. clicking a bomb tile.  As a result, I got rid of my `lostGame()` function and my `isOver()` function.  A loss would be immediately interpreted, and win conditions, via `won()` would be checked at the end of each turn.

```javascript
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
```
