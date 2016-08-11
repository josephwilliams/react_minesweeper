import React, {Component} from 'react';

const Tile = (props) => {
  let klass, content = null;
  if (props.tile === 0) {               // bomb
    if (props.gameState){
      klass = "tile-unexplored";
    } else {
      klass = "tile-bomb";              // exposed when game ends
      content = "\uD83D\uDCA3";
    }
  } else if (props.tile === 1) {        // bomb with flag
    if (props.gameState){
      klass = "tile-flagged";
      content = "\u2691";
    } else {                            // exposed when game ends
      klass = "tile-bomb";
      content = "\uD83D\uDCA3";
    }
  } else if (props.tile === "") {       // flag, unexplored
    klass = "tile-flagged";
    content = "\u2691";
  } else if (props.tile === false) {    // explored
    klass = "tile-explored";
    content = props.adjacentBombCount;
  } else {                              // unexplored
    if (props.gameState){
      klass = "tile-unexplored";
    } else {                            // exposed when game ends
      klass = "tile-explored";
      content = props.adjacentBombCount;
    }
  }

  return (
    <div className={klass}>
       <div className="tile-content" data-tag={props.pos}>
         {content}
       </div>
    </div>
  )
}

export default Tile;
