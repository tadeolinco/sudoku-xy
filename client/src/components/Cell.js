import React from 'react'

const Cell = (props) => {
  const disabled = props.value === 0 ? false : true
  return (
    <div style={{ float: "left" }}>
      <input value={props.value} disabled={disabled} />
    </div>
  )
}

export default Cell;