import React, { Component } from 'react';
import Board from './containers/Board';
import SolutionTable from './containers/SolutionTable';
import Cell from './components/Cell';
import { Button, Input, Container } from 'semantic-ui-react';

class App extends Component {
  constructor(props) {
    super(props);
    this.boardRef = React.createRef();
    this.state = {
      puzzle: null,
      size: 0
    }
  }

  readInputFile = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const { puzzle } = JSON.parse(reader.result);
        this.setState({ puzzle, size: puzzle[0].length })
      };
      reader.readAsText(file);
    }
  }

  toggleBoard() {

  }

  render() {
    return (
      <Container textAlign="center">
        <h1>sudoku xy</h1>
        <Input type="file" onChange={this.readInputFile}></Input>
        <Board ref={this.boardRef}>
          {this.state.puzzle && this.state.puzzle.map((row, i) => {
            return (
              <div key={i} className="boardRow">
                {this.state.puzzle[i].map((col, j) => {
                  return <Cell key={j} value={this.state.puzzle[i][j]} />
                })}
              </div>
            )
          })}
          <br />
        </Board>
        <Button onClick={this.toggleBoard.bind(this)}> GIVE UP </Button>
        <SolutionTable style={{ display: "none" }} />
      </Container>
    );
  }
}

export default App;
