export default class Tile {
  constructor (board, pos) {
    this.board = board;
    this.pos = pos;
    this.hasBomb = false;
    this.flagged = false;
    this.explored = false;
    this.deltas = [[-1,-1],[-1,0],[-1,1],[0,-1],
                   [0,1],[1,-1],[1,0],[1,1]];
  }

  plantBomb () {
    this.hasBomb = true;
  }

  toggleFlag () {
    this.flagged = !this.flagged;
  }

  explore () {

  }
}