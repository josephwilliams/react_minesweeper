import React, {Component} from 'react';

export default class Tile extends React.Component {
  constructor () {
    super();
  }

  handleClick () {

  }

  render () {
    var klass, content;
    if (this.props.tile.explored && this.props.tile.hasBomb) {
      content = "&#128163;";
      klass = "tile-bomb";
    } else if (this.props.tile.flagged) {
      content = "&#9873";
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
        <div className={klass}
             onClick={() => this.handleClick()}>
             {content}
        </div>
      </div>
    )
  }
}
