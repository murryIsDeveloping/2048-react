import React from "react";
import Tile from "./Tile";
import GameControls from "./GameControls";
import { newTiles, gameEnd, mergeTiles } from "./Tiles";
import Video from "./Video"

const initSize = 4

class Game extends React.Component {
  state = {
    size: initSize,
    tiles: newTiles(initSize),
    score: 0,
    gameover: false
  };

  reset = () => {
    this.setState((state) => ({
      ...state,
      tiles: newTiles(state.size),
      score: 0,
      gameover: false
    }));
  };

  sizeCtl = (val) => {
    const size = this.state.size + val
    if(size >= 3 && size <= 8) {
      this.setState(state => ({
        ...state,
        size: size,
        tiles: newTiles(size),
        score: 0,
        gameover: false
      }))
    }
  }

  merge = (direction) => {
    let tiles = this.state.tiles
    let { tiles: newTiles, score } = mergeTiles(tiles, direction);

    this.setState((state) => ({
      ...state,
      score: state.score + score,
      tiles: newTiles,
      gameover: gameEnd(newTiles),

    }));
  };

  render() {
    const tilesClassNames = `tiles g-${this.state.size}`
    return (
      <div
        className="board"
        tabIndex="0"
        onKeyDown={(event) => this.merge(event.key)}
      >
        <h2>2048</h2>
        <p>Use the arrow keys to control the direction the tiles move. Merge tiles together to gain points.</p>
        <Video merge={this.merge}></Video>
        <GameControls
          gameover={this.state.gameover}
          score={this.state.score}
          reset={this.reset}
          sizeCtl={this.sizeCtl}
          size={this.state.size}
        ></GameControls>
        <div className={tilesClassNames}>
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
