const randomIndex = (length) => Math.floor(Math.random() * length);
const randomValue = () => (Math.random() > 0.3 ? "2" : "4");
const boardFull = (tiles) =>
  tiles.every((row) => row.every((tile) => tile !== ""));

export const gameEnd = (tiles) => {
  if (boardFull(tiles)) {
    // check rows
    for (let x = 0; x < tiles.length - 1; x++) {
      for (let y = 0; y < tiles.length; y++) {
        if (tiles[x][y] === tiles[x + 1][y]) {
          return false;
        }
      }
    }

    //check columns
    for (let x = 0; x < tiles.length; x++) {
      for (let y = 0; y < tiles.length - 1; y++) {
        if (tiles[x][y] === tiles[x][y + 1]) {
          return false;
        }
      }
    }

    return true;
  }
};

export const setValue = (tiles) => {
  const l = tiles.length;
  const [x, y] = [randomIndex(l), randomIndex(l)];
  if (tiles[x][y] !== "") {
    return setValue(tiles);
  } else {
    return tiles.map((row, rowIndex) =>
      row.map((tile, columnIndex) => {
        if (rowIndex === x && columnIndex === y) {
          return randomValue();
        } else {
          return tile;
        }
      })
    );
  }
};

export const newTiles = (size) => {
  const tiles = Array(size).fill(Array(size).fill(""));
  return setValue(setValue(tiles));
};

const turnMatrix = (turns, matrix) => {
  if (turns === 0) {
    return matrix;
  }

  const turnedMatrix = matrix[0].map((val, index) =>
    matrix.map((row) => row[index]).reverse()
  );
  return turnMatrix(turns - 1, turnedMatrix);
};

const merge = (tiles, row = [], score = 0) => {
  if (tiles.length <= 1) {
    return { tiles: [...row, ...tiles], score };
  }

  const [t1, t2, ...rest] = tiles;

  return t1 === t2 ? merge(rest, [...row, (t1 * 2).toString()], score+Number(t1)) : merge([t2, ...rest], [...row, t1], score)
};

const calcCells = (tiles) => {
  let totalScore = 0;
  let matrix = []
  tiles.forEach((row) => {
    let {tiles: merged, score } = merge(row.filter((x) => x !== ""));
    totalScore += score
    let padding = tiles.length - merged.length;
    matrix.push([...merged, ...Array(padding).fill("")]);
  });

  return {
    tiles: matrix,
    score: totalScore
  }
}

const mergeFn = (turns) => (tiles) => {
  if (turns === 0) {
    return calcCells(tiles);
  } else {
    const { tiles: matrix, score } = calcCells(turnMatrix(turns, tiles))
    return {
      tiles: turnMatrix(4 - turns, matrix),
      score
    }
  }
};

const mergeLeft = mergeFn(0);
const mergeDown = mergeFn(1);
const mergeRight = mergeFn(2);
const mergeUp = mergeFn(3);

const matrixEqual = (matrix1, matrix2) => JSON.stringify(matrix1) === JSON.stringify(matrix2)

export const mergeTiles = (tiles, direction) => {
  const merged = direction === "ArrowLeft" || direction === "LEFT" ? mergeLeft(tiles)
               : direction === "ArrowRight" || direction === "RIGHT" ? mergeRight(tiles)
               : direction === "ArrowDown" || direction === "DOWN" ? mergeDown(tiles)
               : direction === "ArrowUp" || direction === "UP" ? mergeUp(tiles)
               : { tiles, score: 0 };
    


  return matrixEqual(merged.tiles, tiles) ? merged : { score: merged.score, tiles: setValue(merged.tiles)}
};
