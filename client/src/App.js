import { Button, Container, Grid } from 'semantic-ui-react'
import React, { Component } from 'react'

import Board from './components/Board'
import LoadGame from './components/LoadGame'
import SolutionTable from './components/SolutionTable'

class App extends Component {
  constructor(props) {
    super(props)
    this.boardRef = React.createRef()
    this.state = {
      puzzle: null,
      size: 0,
      displayLoadGame: '',
      displayShowSolution: 'none',
      displaySolutionBox: 'none',
      gameOver: false,
      gameStarted: false,
      solutions: null,
      solutionCount: null,
      currSolIndex: 0,
    }
  }

  gameOver = () => {
    // Solution count object
    const testSolutionCount = {
      all: 123,
      x: 32,
      y: 11,
      xy: 21,
    }

    // Solution object format:
    // { x: true, y: false, puzzle: [] }
    const testSolution = [
      {
        x: true,
        y: false,
        puzzle: [
          [1, 1, 1, 1, 1, 1, 6, 1, 7],
          [1, 8, 1, 7, 1, 1, 1, 4, 1],
          [1, 3, 2, 4, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 9, 1, 1, 1],
          [3, 1, 1, 1, 4, 1, 1, 2, 9],
          [1, 1, 4, 8, 1, 1, 1, 1, 1],
          [1, 2, 1, 1, 1, 3, 5, 6, 1],
          [1, 9, 1, 2, 1, 4, 1, 3, 1],
          [8, 1, 3, 1, 1, 1, 1, 1, 2],
        ],
      },
      {
        x: false,
        y: true,
        puzzle: [
          [2, 2, 2, 2, 2, 2, 6, 2, 7],
          [2, 8, 2, 7, 2, 2, 2, 4, 2],
          [2, 3, 2, 4, 2, 2, 2, 2, 2],
          [2, 2, 2, 2, 2, 9, 2, 2, 2],
          [3, 2, 2, 2, 4, 2, 2, 2, 9],
          [2, 2, 4, 8, 2, 2, 2, 2, 2],
          [2, 2, 2, 2, 2, 3, 5, 6, 2],
          [2, 9, 2, 2, 2, 4, 2, 3, 2],
          [8, 2, 3, 2, 2, 2, 2, 2, 2],
        ],
      },
      {
        x: true,
        y: true,
        puzzle: [
          [3, 3, 3, 3, 3, 3, 6, 3, 7],
          [3, 8, 3, 7, 3, 3, 3, 4, 3],
          [3, 3, 3, 4, 3, 3, 3, 3, 3],
          [3, 3, 3, 3, 3, 9, 3, 3, 3],
          [3, 3, 3, 3, 4, 3, 3, 3, 9],
          [3, 3, 4, 8, 3, 3, 3, 3, 3],
          [3, 3, 3, 3, 3, 3, 5, 6, 3],
          [3, 9, 3, 3, 3, 4, 3, 3, 3],
          [8, 3, 3, 3, 3, 3, 3, 3, 3],
        ],
      },
    ]

    this.setState({
      gameOver: true,
      displayLoadGame: '',
      displayShowSolution: 'none',
      displaySolutionBox: '',
      solutions: testSolution,
      solutionCount: testSolutionCount,
    })
  }

  prevSolution = () => {
    let curr = this.state.currSolIndex - 1
    if (curr < 0) curr = this.state.solutions.length - 1
    if (curr === this.state.solutions.length) curr = 0
    this.setState({
      currSolIndex: curr,
    })
  }

  nextSolution = () => {
    let curr = this.state.currSolIndex + 1
    if (curr < 0) curr = this.state.solutions.length - 1
    if (curr === this.state.solutions.length) curr = 0
    this.setState({
      currSolIndex: curr,
    })
  }

  newGame = () => {
    this.setState({
      puzzle: null,
      size: 0,
      displayLoadGame: 'none',
      displayShowSolution: 'none',
      displaySolutionBox: 'none',
      gameOver: false,
      gameStarted: true,
      solutions: null,
      solutionCount: null,
      currSolIndex: 0,
    })
  }

  readInputFile = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const { puzzle } = JSON.parse(reader.result)
        this.setState({
          puzzle,
          size: puzzle[0].length,
          displayShowSolution: '',
        })
      }
      reader.readAsText(file)
    }
  }

  checkAnswer = () => {
    // check input answer here
    alert('boi u play sudoku!')

    this.newGame()
    this.setState({ displayLoadGame: '' })
  }

  render() {
    return (
      <Container textAlign="center">
        <h1>SUDOKU XY</h1>
        <LoadGame
          newGame={this.newGame}
          readInputFile={this.readInputFile}
          display={this.state.displayLoadGame}
        />

        <div style={{ width: '100%', textAlign: 'center' }}>
          <Grid id="board" style={{ margin: 0 }}>
            <Grid.Column width={4}>
              <Button
                onClick={this.prevSolution}
                style={{ display: this.state.displaySolutionBox }}
              >
                left
              </Button>
            </Grid.Column>

            <Grid.Column width={8} textAlign="center">
              {!this.state.gameOver &&
                this.state.puzzle && (
                  <Board
                    gameOver={false}
                    gameStarted={this.state.gameStarted}
                    size={this.state.size}
                    puzzle={this.state.puzzle}
                    style={{
                      width: 50 * this.state.size,
                      height: 50 * this.state.size,
                    }}
                  />
                )}
              {this.state.gameOver && (
                <Board
                  gameOver={true}
                  gameStarted={this.state.gameStarted}
                  size={this.state.size}
                  puzzle={this.state.solutions[this.state.currSolIndex].puzzle}
                  style={{
                    width: 50 * this.state.size,
                    height: 50 * this.state.size,
                  }}
                />
              )}
            </Grid.Column>

            <Grid.Column width={4}>
              <Button
                onClick={this.nextSolution}
                style={{ display: this.state.displaySolutionBox }}
              >
                right
              </Button>
            </Grid.Column>
          </Grid>
        </div>

        <div>
          <Button
            onClick={this.checkAnswer}
            style={{ display: this.state.displayShowSolution }}
          >
            Check Answer
          </Button>
          <Button
            onClick={this.gameOver}
            style={{ display: this.state.displayShowSolution }}
          >
            Show Solutions
          </Button>
        </div>
        {this.state.gameOver && (
          <SolutionTable
            solutionCount={this.state.solutionCount}
            x={this.state.solutions[this.state.currSolIndex].x}
            y={this.state.solutions[this.state.currSolIndex].y}
            display={this.state.displaySolutionBox}
          />
        )}
      </Container>
    )
  }
}

export default App
