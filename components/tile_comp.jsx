import React, {Component} from 'react';

export default class Tile extends React.Component {
  handleClick (event) {
    let flag = event.altKey ? true : false;
    this.props.updateBoard(this.props.tile, flag);
  }

  render () {
    var klass, content;
    if (this.props.tile.explored && this.props.tile.hasBomb) {
      content = "&#128163;";
      klass = "tile-bomb";
    } else if (this.props.tile.flagged) {
      console.log('flagged');
      content = "\u2691";
      klass = "tile-flagged";
    } else if (this.props.tile.explored) {
      content = this.props.tile.countAdjacentBombs();
      klass = "tile-explored";
    } else {
      content = null;
      klass = "tile-unexplored";
    }

    return (
      <div className="tile-container">
        <div className={klass} onClick={this.handleClick.bind(this)}>
           <div className="tile-content">
             {content}
           </div>
        </div>
      </div>
    )
  }
}
