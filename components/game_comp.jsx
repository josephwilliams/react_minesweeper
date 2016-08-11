import React, {Component} from 'react';
import BoardComponent from './board_comp';
import Board from '../js/board.js';

export default class Game extends React.Component {
  constructor (props) {
    super();
    this.state = { board: new Board(10) };
    this.updateBoard = this.updateBoard.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.adjacentBombCount = this.state.board.adjacentBombCount.bind(null, this);
  }

  updateBoard (pos, flagged) {
    if (flagged) {
      this.state.board.toggleFlag(pos);
    } else {
      this.state.board.beginExploration(pos);
    }

    if (this.state.board.won())
      this.state.board.endGame();

    this.setState({ board: this.state.board });
  }

  resetBoard () {
    this.setState({ board: new Board(4, 2) });
  }

  showRestart () {
    if (!this.state.board.gameState)
      return (
        <p onClick={this.resetBoard}>restart!</p>
      )
  }

  displayMessage () {
    let message;
    if (!this.state.board.gameState) {
      if (this.state.board.won()) {
        message = "you win!";
      } else {
        message = "you lose!"
      }
    } else {
      message = "here we go!"
    }

    return message;
  }

  render () {
    return (
      <div className="game-container">
        <h1>minesweeper</h1>
          <p style={{color:"#aaaaaa"}}>hold alt to place a flag</p>
          <p>{this.displayMessage()}</p>
          <BoardComponent
            board={this.state.board}
            updateBoard={this.updateBoard}
            adjacentBombCount={this.state.board.adjacentBombCount}
          />
        {this.showRestart()}
      </div>
    )
  }
}
