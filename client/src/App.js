import Axios from 'axios'
import React, { Component, Fragment } from 'react'
import { Button, Container, Grid, Icon, Segment } from 'semantic-ui-react'
import Board from './components/Board'
import LoadGame from './components/LoadGame'
import SolutionTable from './components/SolutionTable'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      puzzle: null,
      puzzleInput: [],
      size: 0,
      displayLoadGame: '',
      displayShowSolution: 'none',
      displaySolutionBox: 'none',
      gameOver: false,
      gameStarted: false,
      solutions: null,
      solutionCount: null,
      currSolIndex: 0,
      gettingSolutions: false,
    }
  }

  gameOver = async () => {
    try {
      this.setState({ gettingSolutions: true })

      const {
        data: { solutions, xs, ys, xys },
      } = await Axios.post('/solve', { puzzle: this.state.puzzle })
      // Solution count object
      const solutionCount = {
        all: solutions.length,
        x: xs,
        y: ys,
        xy: xys,
      }
      this.setState({
        gameOver: true,
        displayLoadGame: '',
        displayShowSolution: 'none',
        displaySolutionBox: '',
        solutions: solutions,
        solutionCount: solutionCount,
      })
    } catch (err) {
      console.log(err.response)
    } finally {
      this.setState({ gettingSolutions: false })
    }
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
      puzzleInput: [],
      size: 0,
      displayLoadGame: 'none',
      displayShowSolution: 'none',
      displaySolutionBox: 'none',
      gameOver: false,
      gameStarted: true,
      solutions: null,
      solutionCount: null,
      currSolIndex: 0,
      gettingSolutions: false,
    })
  }

  readInputFile = e => {
    const file = e.target.files[0]
    if (file) {
      this.newGame()
      const reader = new FileReader()
      reader.onload = () => {
        const { puzzle } = JSON.parse(reader.result)
        this.setState({
          puzzle,
          puzzleInput: puzzle.map(row => row.map(cell => cell || '')),
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

  changePuzzleInput = (x, y, value) => {
    // last character should be from 1-9, or just blank (catches backspace)
    if (/[1-9]$/.test(value) || value === '') {
      // set value to the last character of the string
      // eg. value is currently '1', user inputs '2', value becomes '12'
      // user really means that s/he wants to change '1' to '2', so we
      // simply get the last character of the string
      if (value) {
        value = +value[value.length - 1]
      }
      this.setState({
        puzzleInput: this.state.puzzleInput.map((row, i) =>
          row.map((cell, j) => {
            if (i === x && j === y) return value
            return cell
          })
        ),
      })
    }
  }

  render() {
    return (
      <Segment
        loading={this.state.gettingSolutions}
        style={{ height: '100vh' }}
      >
        <Container textAlign="center">
          <h1>SUDOKU XY</h1>
          <LoadGame
            readInputFile={this.readInputFile}
            display={this.state.displayLoadGame}
          />

          <div style={{ width: '100%', textAlign: 'center' }}>
            <Grid id="board" style={{ margin: 0 }}>
              <Grid.Column width={4} verticalAlign="middle">
                <Button
                  icon
                  onClick={this.prevSolution}
                  style={{ display: this.state.displaySolutionBox }}
                >
                  <Icon name="angle left" />
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
                      puzzleInput={this.state.puzzleInput}
                      changePuzzleInput={this.changePuzzleInput}
                      style={{
                        width: 50 * this.state.size,
                        height: 50 * this.state.size,
                      }}
                    />
                  )}
                {this.state.gameOver && (
                  <Fragment>
                    <h3>Solution #{this.state.currSolIndex + 1}</h3>
                    <Board
                      gameOver={true}
                      gameStarted={this.state.gameStarted}
                      size={this.state.size}
                      puzzle={
                        this.state.solutions[this.state.currSolIndex].puzzle
                      }
                      puzzleInput={this.state.puzzleInput}
                      changePuzzleInput={this.changePuzzleInput}
                      style={{
                        width: 50 * this.state.size,
                        height: 50 * this.state.size,
                      }}
                    />
                  </Fragment>
                )}
              </Grid.Column>

              <Grid.Column width={4} verticalAlign="middle">
                <Button
                  icon
                  onClick={this.nextSolution}
                  style={{ display: this.state.displaySolutionBox }}
                >
                  <Icon name="angle right" />
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
      </Segment>
    )
  }
}

export default App
