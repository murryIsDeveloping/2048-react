import React from "react";
import Tile from "./Tile";
import { newTiles, gameEnd, mergeTiles } from "./Tiles";
import ToolBar from "./Toolbar";
import { Swipeable } from "react-swipeable";

const initSize = 4;

class Game extends React.Component {
  state = {
    size: initSize,
    tiles: newTiles(initSize),
    score: 0,
    gameover: false,
  };

  reset = () => {
    this.setState((state) => ({
      ...state,
      tiles: newTiles(state.size),
      score: 0,
      gameover: false,
    }));
  };

  sizeCtl = (size) => {
    if (size >= 3 && size <= 8) {
      this.setState((state) => ({
        ...state,
        size: size,
        tiles: newTiles(size),
        score: 0,
        gameover: false,
      }));
    }
  };

  merge = (direction) => {
    let tiles = this.state.tiles;
    let { tiles: newTiles, score } = mergeTiles(tiles, direction);

    this.setState((state) => ({
      ...state,
      score: state.score + score,
      tiles: newTiles,
      gameover: gameEnd(newTiles),
    }));
  };

  resetBtn() {
    return <button onClick={this.reset}>&#8634;</button>;
  }

  render() {
    const tilesClassNames = `tiles g-${this.state.size}`;
    return (
      <div
        className="board"
        tabIndex="0"
        onKeyDown={(event) => this.merge(event.key)}
      >
        <ToolBar
          reset={this.reset}
          sizeCtl={this.sizeCtl}
          size={this.state.size}
          merge={this.merge}
        ></ToolBar>

        <h3 className="score">Score: {this.state.score}</h3>
        {this.state.gameover ? (
          <React.Fragment>
            <h2>Game Over!</h2>
            <button class="red" onClick={this.reset}>
              &#8634;
            </button>
          </React.Fragment>
        ) : null}
        <Swipeable
          onSwipedLeft={(_) => this.merge("LEFT")}
          onSwipedRight={(_) => this.merge("RIGHT")}
          onSwipedUp={(_) => this.merge("UP")}
          onSwipedDown={(_) => this.merge("DOWN")}
        >
          <div className={tilesClassNames}>
            {this.state.tiles.map((row, rIndex) =>
              row.map((tile, tIndex) => {
                let key = `${rIndex}-${tIndex}`;
                return <Tile value={tile} key={key}></Tile>;
              })
            )}
          </div>
        </Swipeable>
        <p className="directions">
          <strong>Merge tiles together to gain points.</strong>
          <br/>If your on a computer use the arrow keys. 
          <br/>If on a mobile swipe the tiles.
          <br/> If your feeling really brave toggle the <strong>"use hand motion controller" </strong> 
          and try to play by waving your hands side to side and using them as controls.
        </p>
      </div>
    );
  }
}

export default Game;
