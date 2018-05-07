import React from 'react'
import { Table } from 'semantic-ui-react'

const Board = props => {
  if (!props.gameStarted) return null

  return (
    <Table celled>
      <Table.Body>
        {props.puzzle.map((row, i) => (
          <Table.Row key={i}>
            {row.map((cell, j) => {
              const disabled = cell !== 0
              return (
                <Table.Cell key={j} style={{ textAlign: 'center' }}>
                  {disabled ? (
                    cell
                  ) : (
                    <input
                      style={{
                        width: 26,
                        textAlign: 'center',
                        border: '1px solid gray',
                        borderRadius: '5px',
                        padding: 4,
                      }}
                      type="text"
                      onChange={e => {
                        props.changePuzzleInput(i, j, e.target.value)
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
