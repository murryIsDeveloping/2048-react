import React from "react";

const GameControls = (props) => {
  if (props.gameover) {
    return (
      <div className="score">
        <h2>Game Over!</h2>
        <h2>Score: {props.score}</h2>
        <button onClick={props.reset}>RESET</button>
      </div>
    );
  } else {
    return (
      <div className="score">
        <SizeControls size={props.size} sizeCtl={props.sizeCtl}></SizeControls>
        <h3>Score: {props.score}</h3>
      </div>
    );
  }
};

const SizeControls = (props) => {
    return (
      <div className="size-contoller">
        <h3>Size Contols</h3>
        <button onClick={() => props.sizeCtl(-1)}>-</button> 
        <span>{props.size}</span>
        <button onClick={() => props.sizeCtl(1)}>+</button>
      </div>   
    )
}

export default GameControls;
