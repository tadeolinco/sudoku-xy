import React from 'react'
import { Grid } from 'semantic-ui-react'

const SolutionTable = props => {
  return (
    <div style={{ display: props.display }}>
      <Grid columns={4}>
        <Grid.Column className="sol">
          <div className="sol-header">SUDOKU</div>
          <div className="sol-count">{props.solutionCount.all}</div>
        </Grid.Column>

        <Grid.Column className="sol">
          <div className="sol-header">SUDOKU X</div>
          <div className="sol-count">{props.solutionCount.x}</div>
        </Grid.Column>

        <Grid.Column className="sol">
          <div className="sol-header">SUDOKU Y</div>
          <div className="sol-count">{props.solutionCount.y}</div>
        </Grid.Column>

        <Grid.Column className="sol">
          <div className="sol-header">SUDOKU XY</div>
          <div className="sol-count">{props.solutionCount.xy}</div>
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default SolutionTable
