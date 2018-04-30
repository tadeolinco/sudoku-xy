import React, { Component } from 'react';
// import Board from './containers/Board';
import SolutionTable from './containers/SolutionTable';
// import Cell from './components/Cell';
import { Button, Input, Container, Grid } from 'semantic-ui-react';

class App extends Component {
  constructor(props) {
    super(props);
    this.boardRef = React.createRef();
    this.state = {
      puzzle: null,
      size: 0,
      gameOver: false
    }
  }

  toggleGameOver = () => {
    const currentState = this.state.gameOver
    this.setState({ gameOver: !currentState })
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

  render() {
    return (
      <Container textAlign="center">
        <h1>sudoku xy</h1>
        <Input type="file" onChange={this.readInputFile}></Input>

        <div id="board" style={{ width: 50*this.state.size, height: 50*this.state.size, margin: 0 }}>
          <Grid columns={this.state.size}>
            { this.state.puzzle && this.state.puzzle.map((row, i) => {
              return (
                <Grid.Row key={i} className="row" row_val={row}>
                  {
                    row.map((cell, j) => {
                      const disabled = cell === 0 ? false : true
                      return(
                        <Grid.Column key={j} textAlign='center'>
                           { disabled && <input disabled value={cell} style={{ width: 20 }}/>}
                           { !disabled && <input style={{ width: 20 }} /> }
                        </Grid.Column>
                      )
                    })
                  }
                </Grid.Row>
              )
            })}
          </Grid>
        </div>

        <Button onClick={this.toggleGameOver}> GIVE UP </Button>
        <SolutionTable style={{ display: "none" }} />
      </Container>
    );
  }
}

export default App;
