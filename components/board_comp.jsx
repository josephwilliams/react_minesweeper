import React, {Component} from 'react';
import TileComponent from './tile_comp';

export default class Board extends React.Component {
  renderRows () {
    var board = this.props.board.grid;
    return board.map((arr, rowIdx) => {
      return (
        // with this, we can render the rows separately,
        // avoiding any kind of CSS wrapping issues
        <div className="row" key={rowIdx}>
          {this.renderRowTiles(arr, rowIdx)}
        </div>
      );
    });
  }

  renderRowTiles (arr, rowIdx) {
    return arr.map((tile, colIdx) => {
      // tile contains grid position and board object props
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
