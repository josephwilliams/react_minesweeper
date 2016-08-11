import React from 'react';

export default class Header extends React.Component {
  constructor (props) {
    super();
    this.state = { gridSize: 10, numBombs: 10 };
  }

  updateValue (attribute) {
    return event => this.setState({ [attribute]: Number(event.target.value) });
  }

  clickReset () {

  }

  render () {
    return (
      <div className="header">
        <h1>minesweeper</h1>
        <div className="message-container">{this.props.displayMessage()}</div>
        <label>grid size
          <input type="number" min={1} max={100}
                 onChange={this.updateValue('gridSize')}
                 value={this.state.gridSize}
                 placeholder={10}/>
        </label>
        <label># bombs
          <input type="number" min={0} max={Math.pow(this.state.gridSize, 2)}
                 onChange={this.updateValue('numBombs')}
                 value={this.state.numBombs}
                 placeholder={10}/>
        </label>
        <div className="restart-link" onClick={() => this.props.resetBoard(this.state.gridSize, this.state.numBombs)}>
          RESTART
        </div>
      </div>
    )
  }
}
