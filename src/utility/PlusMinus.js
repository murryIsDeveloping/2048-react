import React from 'react';

const PlusMinus = (props) => {
  return (
    <div className="plus-minus">
        <div className="plus-minus-btn" onClick={() => props.valueChanged(props.value-1)}>{"<"}</div> 
        <span className="plus-minus-value">{props.value}</span>
        <div className="plus-minus-btn" onClick={() => props.valueChanged(props.value+1)}>{">"}</div>
    </div>
  );
}

export default PlusMinus