import React, { useState, useEffect } from 'react';

import Cell from './components/Cell';

const emptyCells = Array(70).fill({ active: false });

function App() {
  const [prevCells, setPrevCells] = useState(emptyCells);
  const [cells, setCells] = useState(emptyCells);
  const [started, setStarted] = useState(false);
  const [game, setGame] = useState(startGame());
  const [gameState, setGameState] = useState({ value: undefined, done: false });

  useEffect(() => console.log(prevCells, cells), [cells, prevCells]);

  /**
   * Fill the table with inactive cells, properly indexed for toggling
   * the active property.
   */
  function generateTable() {
    return cells.map((cell, index) => (
      <Cell
        key={index}
        handleClick={e => handleClick(e, index)}
        active={cell.active}
      />
    ));
  }

  /**
   * Run one round of the game. Is called every second by setInterval in
   * startGame generator function.
   */
  function runGame() {
    console.log('running the game...');

    const newCells = cells.map((cell, index) => {
      const neighbors = [
        prevCells[index - 1],
        prevCells[index + 1],
        prevCells[index - 10],
        prevCells[index - 9],
        prevCells[index - 11],
        prevCells[index + 10],
        prevCells[index + 9],
        prevCells[index + 11]
      ];

      const activeNeighbors = neighbors
        .map(n => (n !== undefined && n.active ? 1 : 0))
        .reduce((prev, next) => prev + next);

      console.log(index, activeNeighbors);

      if (cell.active) {
        if (activeNeighbors < 2 || activeNeighbors > 3)
          return { active: false };

        return cell;
      } else {
        if (activeNeighbors === 3) return { active: true };

        return cell;
      }
    });

    setPrevCells(cells);
    setCells(newCells);
  }

  /**
   * Create a game state, setting an interval to the runGame function
   * and cleaning the table and the interval after all.
   */
  function* startGame() {
    setStarted(true);
    const interval = yield setInterval(runGame, 1000);

    setCells(emptyCells);
    setPrevCells(emptyCells);
    setStarted(false);
    clearInterval(interval);
  }

  /**
   * Control the game state created by startGame generator function.
   * Pause and unpause the game.
   */
  function toggleGameState() {
    if (!gameState.done) {
      const gs = game.next(gameState.value);
      setGameState(gs);
    } else {
      const g = startGame();
      setGame(g);
      setGameState(g.next());
    }
  }

  /**
   * Toggle the active property of cells.
   *
   * @param {Event} event the event triggered by click
   * @param {Number} cellIndex the index of the clicked cell
   */
  function handleClick(event, cellIndex) {
    const newCells = cells.map((cell, index) =>
      index === cellIndex ? { active: !cell.active } : cell
    );

    setPrevCells(newCells);
    setCells(newCells);
  }

  return (
    <div className="container">
      <div className="game">{generateTable()}</div>

      <div className="settings">
        <button type="button" onClick={toggleGameState}>
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
