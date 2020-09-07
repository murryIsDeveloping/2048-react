import React from 'react';

const Toggle = (props) => {
  return (
      <div className={"toggle" + (props.show ? " active" : "")} onClick={props.onToggle}>
          <div className="inner-toggle"></div>
      </div>
  );
}

export default Toggle