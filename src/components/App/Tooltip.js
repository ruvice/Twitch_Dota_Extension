import React from 'react'

const Tooltip = (props) => {
  const { tooltipString } = props
  
  return (
    <>
      <p>{tooltipString || 'Waiting for event...'}</p>
    </>
  )
}

export default Tooltip;
