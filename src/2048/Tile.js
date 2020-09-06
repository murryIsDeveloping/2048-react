import React from 'react'

const Tile = (props) => {
    const classNames = `tile v-${props.value}`
    return <div className="tile-wrapper"><div className={classNames}><span>{props.value}</span></div></div>
}

export default Tile