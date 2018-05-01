import React from 'react'
import { Input } from 'semantic-ui-react'

const LoadGame = props => {
  return (
    <div style={{ display: props.display }}>
      <label htmlFor="file" className="ui icon button">
        <i className="file icon" style={{ paddingRight: 20 }} />
        New Game
      </label>
      <Input
        onChange={props.readInputFile}
        type="file"
        id="file"
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default LoadGame
