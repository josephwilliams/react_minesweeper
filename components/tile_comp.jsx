import React, {Component} from 'react';

export default class Tile extends React.Component {
  render () {
      let klass, content = null;
      if (this.props.tile === 0) {               // bomb
        if (this.props.gameState){
          klass = "tile-unexplored";
        } else {
          klass = "tile-bomb";              // exposed when game ends
          content = "\uD83D\uDCA3";
        }
      } else if (this.props.tile === 1) {        // bomb with flag
        if (this.props.gameState){
          klass = "tile-flagged";
          content = "\u2691";
        } else {                            // exposed when game ends
          klass = "tile-bomb";
          content = "\uD83D\uDCA3";
        }
      } else if (this.props.tile === "") {       // flag, unexplored
      klass = "tile-flagged";
      content = "\u2691";
    } else if (this.props.tile === false) {    // explored
      klass = "tile-explored";
      content = this.props.adjacentBombCount(this.props.pos);
    } else {                              // unexplored
      if (this.props.gameState){
        klass = "tile-unexplored";
      } else {                            // exposed when game ends
        klass = "tile-explored";
        content = this.props.adjacentBombCount(this.props.pos);
      }
    }

    return (
      <div className={klass}>
        <div className="tile-content" data-tag={this.props.pos}>
          {content}
        </div>
      </div>
    )
  }
}
