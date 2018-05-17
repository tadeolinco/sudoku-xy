import React from 'react'
import { Table } from 'semantic-ui-react'

const Board = props => {
  if (!props.gameStarted) return null

  return (
    <Table celled>
      <Table.Body id='board-game'>
        {props.puzzle.map((row, i) => (
          <Table.Row key={i}>
            {row.map((cell, j) => {
              const disabled = cell !== 0
              const borderTop =
                i !== 0 && i % Math.sqrt(props.size) === 0
                  ? '2px solid gray'
                  : ''
              const borderLeft =
                j !== 0 && j % Math.sqrt(props.size) === 0
                  ? '2px solid gray'
                  : ''
              return (
                <Table.Cell className='board-cell' key={j} style={{ textAlign: 'center', borderTop, borderLeft  }}>
                  {disabled ? (
                    cell
                  ) : (
                    <input
                      className="cell"
                      style={{
                        fontWeight: 'bold',
                        width: 26,
                        textAlign: 'center',
                        border: '1px solid gray',
                        borderRadius: '5px',
                        padding: 4,
                      }}
                      type="text"
                      onChange={e => {
                        props.changePuzzleInput(i, j, e.target.value, e)
                      }}
                      value={props.puzzleInput[i][j]}
                    />
                  )}
                </Table.Cell>
              )
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default Board
