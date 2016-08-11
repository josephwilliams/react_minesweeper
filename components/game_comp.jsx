import React, {Component} from 'react';
import BoardComponent from './board_comp';
import Board from '../js/board.js';
import HeaderComponent from './header_comp';

export default class Game extends React.Component {
  constructor (props) {
    super();
    this.state = { board: new Board(10), gridSize: 10, numBombs: 10 };
    this.updateBoard = this.updateBoard.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
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

  resetBoard (gridSize, numBombs) {
    this.setState({ board: new Board(gridSize, numBombs) });
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
        <HeaderComponent
          displayMessage={this.displayMessage}
          resetBoard={this.resetBoard}
        />
        <BoardComponent
          board={this.state.board}
          updateBoard={this.updateBoard}
          adjacentBombCount={this.state.board.adjacentBombCount}
        />
        <p style={{color:"rgba(64, 50, 50, 0.67)"}}>hold alt to place a flag</p>
      </div>
    )
  }
}
