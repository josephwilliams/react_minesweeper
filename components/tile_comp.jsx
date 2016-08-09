import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';

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
