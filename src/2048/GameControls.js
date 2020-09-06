import React from "react";

const GameControls = (props) => {
  if (props.gameover) {
    return (
      <div className="score">
        <h2>Game Over!</h2>
        <h3>Score: {props.score}</h3>
        <button onClick={props.reset}>RESET</button>
      </div>
    );
  } else {
    return (
      <div className="score">
        <h3>Score: {props.score}</h3>
      </div>
    );
  }
};

export default GameControls;
