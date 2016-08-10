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
      let adjacentBombCount = this.props.board.bombCounts[rowIdx][colIdx];
      return (
        <TileComponent
          tile={tile}
          updateBoard={this.props.updateBoard}
          gameState={this.props.board.gameState}
          adjacentBombCount={adjacentBombCount}
          pos={[rowIdx, colIdx]}
          key={rowIdx * gridSize + colIdx}
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
