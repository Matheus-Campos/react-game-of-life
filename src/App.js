import React, { useState } from 'react';

import Cell from './components/Cell';

function createEmptyCells(emptyCells) {
  for (let i = 0; i < 100; ++i) {
    emptyCells[i] = Array(100);
    for (let j = 0; j < 100; ++j) {
      emptyCells[i][j] = false;
    }
  }

  return emptyCells;
}

const emptyCells = createEmptyCells(Array(100));

function App() {
  const [prevCells, setPrevCells] = useState(emptyCells);
  const [cells, setCells] = useState(emptyCells);
  const [started, setStarted] = useState(false);
  const [gameInterval, setGameInterval] = useState(0);

  /**
   * Fill the table with inactive cells, properly indexed for toggling
   * the active property.
   */
  function generateTable() {
    return cells.map((row, rowIndex) =>
      row.map((active, cellIndex) => (
        <Cell
          active={active}
          handleClick={() => handleClick(rowIndex, cellIndex)}
          key={`${rowIndex}${cellIndex}`}
        />
      ))
    );
  }

  /**
   * Run one round of the game. Is called every second by setInterval in
   * startGame generator function.
   */
  function runGame() {
    const newCells = cells.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        const neighbors = [
          prevCells[rowIndex - 1][cellIndex],
          prevCells[rowIndex][cellIndex - 1],
          prevCells[rowIndex + 1][cellIndex],
          prevCells[rowIndex][cellIndex + 1],
          prevCells[rowIndex - 1][cellIndex - 1],
          prevCells[rowIndex - 1][cellIndex + 1],
          prevCells[rowIndex + 1][cellIndex - 1],
          prevCells[rowIndex + 1][cellIndex + 1]
        ];

        const activeNeighbors = neighbors
          .map(n => (n ? 1 : 0))
          .reduce((prev, next) => prev + next, 0);

        if (cell && (activeNeighbors >= 4 || activeNeighbors <= 1)) {
          return false;
        }

        if (!cell && activeNeighbors === 3) {
          return true;
        }

        return cell;
      })
    );

    console.log(newCells);

    setPrevCells(cells);
    setCells(newCells);
  }

  /**
   * Create a game state, setting an interval to the runGame function
   * and cleaning the table and the interval after all.
   */
  function startGame() {
    setStarted(true);
    setGameInterval(setInterval(runGame, 2000));
  }

  function endGame() {
    clearInterval(gameInterval);
    setCells(emptyCells);
    setPrevCells(emptyCells);
    setStarted(false);
  }

  /**
   * Toggle the active property of cells.
   *
   * @param {Number} rowIndex the index of the clicked cell row
   * @param {Number} cellIndex the index of the clicked cell in the row
   */
  function handleClick(rowIndex, cellIndex) {
    const newCells = [...cells];
    newCells[rowIndex][cellIndex] = !cells[rowIndex][cellIndex];

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
