import React from "react";
import Tile from "./Tile";
import GameControls from "./GameControls";
import { newTiles, gameEnd, mergeTiles } from "./Tiles";

class Game extends React.Component {
  state = {
    tiles: newTiles(4),
    score: 0,
    gameover: false
  };

  reset = () => {
    this.setState((state) => ({
      ...state,
      tiles: newTiles(4),
      score: 0,
      gameover: false
    }));
  };

  merge = (direction, tiles) => {
    let { tiles: newTiles, score } = mergeTiles(tiles, direction);

    this.setState((state) => ({
      ...state,
      score: state.score + score,
      tiles: newTiles,
      gameover: gameEnd(newTiles),

    }));
  };

  render() {
    return (
      <div
        className="board"
        tabIndex="0"
        onKeyDown={(event) => this.merge(event.key, this.state.tiles)}
      >
        <h2>2048</h2>
        <GameControls
          gameover={this.state.gameover}
          score={this.state.score}
          reset={this.reset}
        ></GameControls>
        <div className="tiles">
          {this.state.tiles.map((row, rIndex) =>
            row.map((tile, tIndex) => {
              let key = `${rIndex}-${tIndex}`
              return <Tile value={tile} key={key} ></Tile>
            })
          )}
        </div>
      </div>
    );
  }
}

export default Game;
