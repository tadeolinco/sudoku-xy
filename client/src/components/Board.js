import React from 'react';
import { Grid } from 'semantic-ui-react';

const Board = (props) => {
  if (!props.gameStarted) return null;

  return (
    <Grid columns={props.size}>
      { props.puzzle && props.puzzle.map((row, i) => {
        return (
          <Grid.Row key={i} className="board-row" row_val={row}>
            {
              row.map((cell, j) => {
                const disabled = cell === 0 ? false : true
                const classNameString = (disabled && props.gameOver) ? "board-cell given" : "board-cell input"
                return(
                  <Grid.Column key={j} textAlign='center' className={classNameString}>
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
  );
}

export default Board;