import React, { useState, useEffect, useCallback } from "react";

const Game2048 = () => {
  const [data, setData] = useState([]);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);

  const startGame = useCallback(() => {
    const initialData = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => 0)
    );
    const newData = put2ToRandomCell(initialData);
    setData(newData);
    setScore(0);
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const put2ToRandomCell = (currentData) => {
    const newData = currentData.map((row) => row.slice());
    const emptyCells = [];
    newData.forEach((rowData, i) => {
      rowData.forEach((cellData, j) => {
        if (cellData === 0) {
          emptyCells.push([i, j]);
        }
      });
    });
    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      newData[randomCell[0]][randomCell[1]] = 2;
    }
    return newData;
  };

  const moveCells = useCallback([data, score]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowUp") {
        moveCells("up");
      } else if (e.key === "ArrowDown") {
        moveCells("down");
      } else if (e.key === "ArrowLeft") {
        moveCells("left");
      } else if (e.key === "ArrowRight") {
        moveCells("right");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [moveCells]);

  return (
    <div>
      <table id="table">
        {data.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className={`color-${cell}`}>
                {cell === 0 ? "" : cell}
              </td>
            ))}
          </tr>
        ))}
      </table>

      <div id="score">{score}</div>
      <button
        id="back"
        onClick={() => {
          /* 히스토리로 되돌아가는 로직 */
        }}
      >
        뒤로
      </button>
    </div>
  );
};

export default Game2048;
