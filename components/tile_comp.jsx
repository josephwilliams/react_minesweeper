import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';

export default class Tile extends React.Component {
  handleClick (event) {
    let flag = event.altKey ? true : false;
    this.props.updateBoard(this.props.pos, flag);
  }

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

    return (
      <div className={klass} onClick={this.handleClick.bind(this)}>
         <div className="tile-content">
           {content}
         </div>
      </div>
    )
  }
}
