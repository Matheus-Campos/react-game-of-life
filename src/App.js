import React, { useState, useEffect } from 'react';

import Cell from './components/Cell';

const emptyCells = Array(70).fill({ active: false });

function App() {
  const [cells, setCells] = useState(emptyCells);
  const [started, setStarted] = useState(false);
  const [game, setGame] = useState(startGame());
  const [gameState, setGameState] = useState({ value: undefined, done: false });

  // useEffect(() => console.log(cells, started, game, gen));

  function generateTable() {
    return cells.map((cell, index) => (
      <Cell
        key={index}
        handleClick={e => handleClick(e, index)}
        active={cell.active}
      />
    ));
  }

  function runGame() {
    console.log('running the game...');
  }

  function* startGame() {
    setStarted(true);
    const interval = yield setInterval(runGame, 1000);

    setCells(emptyCells);
    setStarted(false);
    clearInterval(interval);
  }

  function handleClick(event, cellIndex) {
    setCells(
      cells.map((cell, index) =>
        index === cellIndex ? { active: !cell.active } : cell
      )
    );
  }

  return (
    <div className="container">
      <div className="game">{generateTable()}</div>

      <div className="settings">
        <button
          type="button"
          onClick={() => {
            if (!gameState.done) {
              const gs = game.next(gameState.value);
              setGameState(gs);
            } else {
              const g = startGame();
              setGame(g);
              setGameState(g.next());
            }
          }}
        >
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
