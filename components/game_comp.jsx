import React, {Component} from 'react';
import BoardComponent from './board_comp';
import Board from '../js/board.js';

export default class Game extends React.Component {
  constructor (props) {
    super();
    this.state = { board: new Board(10) };
    this.updateBoard = this.updateBoard.bind(this);
  }

  updateBoard (pos, flagged) {
    if (flagged) {
      this.state.board.toggleFlag(pos);
    } else {
      this.state.board.beginExploration(pos);
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
