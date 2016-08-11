import React, {Component} from 'react';
import TileComponent from './tile_comp';

export default class Board extends React.Component {
  renderRows () {
    var board = this.props.board.grid;
    return board.map((row, rowIdx) => {
      return (
        <div className="row" key={rowIdx}>
          {this.renderRowTiles(row, rowIdx)}
        </div>
      );
    });
  }

  renderRowTiles (row, rowIdx) {
    return row.map((tile, colIdx) => {
      let gridSize = this.props.board.gridSize;
      return (
        <TileComponent
          tile={tile}
          gameState={this.props.board.gameState}
          adjacentBombCount={this.props.adjacentBombCount}
          pos={[rowIdx, colIdx]}
          key={rowIdx * gridSize + colIdx}
        />
      );
    });
  }

  handleClick (event) {
    let tileStr = event.target.dataset.tag;
    let pos = tileStr.split(",").map(Number)
    if (this.props.board.gameState) {
      let flag = event.altKey ? true : false;
      this.props.updateBoard(pos, flag);
    }
  }

  render () {
    return (
      <div className="board-container" onClick={this.handleClick.bind(this)}>
        {this.renderRows()}
      </div>
    )
  }
}
