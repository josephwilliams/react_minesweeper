import React, {Component} from 'react';
import BoardComponent from './board_comp';
import Board from '../js/board.js';

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
      console.log('else! game component');
    }

    // if (this.state.board.isOver(tile)) {
    //   this.state.board.endGame();
    // }

    this.setState({ board: this.state.board });
  }

  render () {
    return (
      <div className="game-container">
        <h1>minesweeper</h1>

      </div>
    )
  }
}
