import React from 'react'
import { Table } from 'semantic-ui-react'

const SolutionTable = props => {
  const includesStyle = {
    backgroundColor: '#21ba45',
    color: '#fff',
  }

  return (
    <div style={{ display: props.display, margin: 'auto', width: '50vh' }}>
      <Table textAlign="center">
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>TOTAL SOLUTIONS</Table.HeaderCell>
            <Table.HeaderCell style={props.x ? includesStyle : null}>
              X
            </Table.HeaderCell>
            <Table.HeaderCell style={props.y ? includesStyle : null}>
              Y
            </Table.HeaderCell>
            <Table.HeaderCell style={props.x && props.y ? includesStyle : null}>
              XY
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{props.solutionCount.all}</Table.Cell>
            <Table.Cell style={props.x ? includesStyle : null}>
              {props.solutionCount.x}
            </Table.Cell>
            <Table.Cell style={props.y ? includesStyle : null}>
              {props.solutionCount.y}
            </Table.Cell>
            <Table.Cell style={props.x && props.y ? includesStyle : null}>
              {props.solutionCount.xy}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  )
}

export default SolutionTable
