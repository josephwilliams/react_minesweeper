import React, {Component} from 'react';
import BoardComponent from './board_comp';
import Board from '../js/board.js';

export default class Game extends React.Component {
  constructor (props) {
    super();
    this.state = { board: new Board(10) };
  }

  updateBoard (tile, flagged) {
    if (flagged) {
      tile.toggleFlag();
    } else {
      tile.explore();
    }

    this.setState({ board: this.state.board });
  }

  render () {
    return (
      <div className="game-container">
        <BoardComponent
          board={this.state.board}
          updateBoard={this.updateBoard}
        />
      </div>
    )
  }
}
