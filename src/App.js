import React, { useState } from 'react';

import Cell from './components/Cell';

const emptyCells = Array(100).fill(false);

function App() {
  const [prevCells, setPrevCells] = useState(emptyCells);
  const [cells, setCells] = useState(emptyCells);
  const [started, setStarted] = useState(false);
  const [gameTimeout, setGameTimeout] = useState(0);

  /**
   * Fill the table with inactive cells, properly indexed for toggling
   * the active property.
   */
  function generateTable() {
    return cells.map((active, index) => (
      <Cell
        active={active}
        handleClick={() => handleClick(index)}
        key={index}
      />
    ));
  }

  /**
   * Run one round of the game. Is called every second by setInterval in
   * startGame generator function.
   */
  function runGame() {
    const newCells = cells.map((active, index) => {
      let neighbors = [prevCells[index - 10], prevCells[index + 10]];

      // 10 is the number of cells in one row
      if (index % 10 === 0) {
        neighbors.push(
          prevCells[index + 11],
          prevCells[index - 9],
          prevCells[index + 1]
        );
      } else if (index % 10 === 9) {
        neighbors.push(
          prevCells[index - 11],
          prevCells[index + 9],
          prevCells[index - 1]
        );
      } else {
        neighbors.push(
          prevCells[index - 11],
          prevCells[index + 11],
          prevCells[index - 9],
          prevCells[index + 9],
          prevCells[index - 1],
          prevCells[index + 1]
        );
      }

      const activeNeighbors = neighbors
        .map(n => (n !== undefined && n.active ? 1 : 0))
        .reduce((prev, next) => prev + next, 0);

      if (active) {
        if (activeNeighbors < 2 || activeNeighbors > 3) return false;

        return active;
      } else {
        if (activeNeighbors === 3) return true;

        return active;
      }
    });

    console.log(newCells);

    setPrevCells(cells);
    setCells(newCells);

    setGameTimeout(setTimeout(runGame, 1000));
  }

  /**
   * Create a game state, setting an interval to the runGame function
   * and cleaning the table and the interval after all.
   */
  function startGame() {
    setStarted(true);
    runGame();
  }

  function endGame() {
    setCells(emptyCells);
    setPrevCells(emptyCells);
    setStarted(false);
    clearTimeout(gameTimeout);
  }

  /**
   * Toggle the active property of cells.
   *
   * @param {Number} cellIndex the index of the clicked cell
   */
  function handleClick(cellIndex) {
    const newCells = cells.map((active, index) =>
      index === cellIndex ? { active: !active } : active
    );

    setPrevCells(newCells);
    setCells(newCells);
  }

  return (
    <div className="container">
      <div className="game">{generateTable()}</div>

      <div className="settings">
        <button type="button" onClick={started ? endGame : startGame}>
          {started ? 'Stop' : 'Start'}
        </button>
      </div>

      <div>
        <strong>For a space that is 'populated':</strong>
        <br />
        <ul>
          <li>Each cell with one or no neighbors dies, as if by solitude.</li>
          <li>
            Each cell with four or more neighbors dies, as if by overpopulation.
          </li>
          <li>Each cell with two or three neighbors survives.</li>
        </ul>

        <br />
        <strong>For a space that is 'empty' or 'unpopulated'</strong>
        <ul>
          <li>Each cell with three neighbors becomes populated.</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
