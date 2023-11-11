import React, { useState, useEffect, useCallback } from "react";

const Game2048 = () => {
  const [data, setData] = useState([]);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [reGame, setReGame] = useState(false);

  const startGame = useCallback(() => {
    const initialData = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => 0)
    );
    const newData = put2ToRandomCell(initialData);
    setData(newData);
    setScore(0);
    setReGame(false);
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

  const reGameStart = useCallback(() => {
    startGame();
  }, [startGame]);

  const back = useCallback(() => {
    const updatedHistory = [...history]; // 변경된 히스토리를 복사
    const prevData = updatedHistory.pop(); // 마지막 요소 가져오기
    if (!prevData) return;
    setScore(prevData.score);
    setData(prevData.table);
    setHistory(updatedHistory); // 업데이트된 히스토리 설정
  }, [history, setData, setScore, setHistory]);

  const moveCells = useCallback(
    (direction) => {
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          table: JSON.parse(JSON.stringify(data)),
          score: score,
        },
      ]);
      switch (direction) {
        case "left": {
          const newData = [[], [], [], []]; //배열 초기화 (이동 후 데이터 담을 공간)
          data.forEach((rowData, i) => {
            rowData.forEach((cellData, j) => {
              if (cellData) {
                const currentRow = newData[i]; //현재 행의 새로운 데이터 배열
                const prevData = currentRow[currentRow.length - 1];
                if (prevData === cellData) {
                  setScore(score + currentRow[currentRow.length - 1] * 2);
                  currentRow[currentRow.length - 1] *= -2;
                } else {
                  newData[i].push(cellData);
                }
              }
            });
          });
          console.log(newData);
          [1, 2, 3, 4].forEach((rowData, i) => {
            [1, 2, 3, 4].forEach((cellData, j) => {
              data[i][j] = Math.abs(newData[i][j]) || 0;
            });
          });

          break;
        }
        case "right": {
          const newData = [[], [], [], []];
          data.forEach((rowData, i) => {
            rowData.forEach((cellData, j) => {
              if (rowData[3 - j]) {
                const currentRow = newData[i];
                const prevData = currentRow[currentRow.length - 1];
                if (prevData === rowData[3 - j]) {
                  setScore(score + currentRow[currentRow.length - 1] * 2);
                  currentRow[currentRow.length - 1] *= -2;
                } else {
                  newData[i].push(rowData[3 - j]);
                }
              }
            });
          });
          console.log(newData);
          [1, 2, 3, 4].forEach((rowData, i) => {
            [1, 2, 3, 4].forEach((cellData, j) => {
              data[i][3 - j] = Math.abs(newData[i][j]) || 0;
            });
          });

          break;
        }
        case "up": {
          const newData = [[], [], [], []];
          data.forEach((rowData, i) => {
            rowData.forEach((cellData, j) => {
              if (cellData) {
                const currentRow = newData[j];
                const prevData = currentRow[currentRow.length - 1];
                if (prevData === cellData) {
                  setScore(score + currentRow[currentRow.length - 1] * 2);
                  currentRow[currentRow.length - 1] *= -2;
                } else {
                  newData[j].push(cellData);
                }
              }
            });
          });
          console.log(newData);
          [1, 2, 3, 4].forEach((cellData, i) => {
            [1, 2, 3, 4].forEach((rowData, j) => {
              data[j][i] = Math.abs(newData[i][j]) || 0;
            });
          });

          break;
        }
        case "down": {
          const newData = [[], [], [], []];
          data.forEach((rowData, i) => {
            rowData.forEach((cellData, j) => {
              if (data[3 - i][j]) {
                const currentRow = newData[j];
                const prevData = currentRow[currentRow.length - 1];
                if (prevData === data[3 - i][j]) {
                  setScore(score + currentRow[currentRow.length - 1] * 2);
                  currentRow[currentRow.length - 1] *= -2;
                } else {
                  newData[j].push(data[3 - i][j]);
                }
              }
            });
          });
          console.log(newData);
          [1, 2, 3, 4].forEach((cellData, i) => {
            [1, 2, 3, 4].forEach((rowData, j) => {
              data[3 - j][i] = Math.abs(newData[i][j]) || 0;
            });
          });
          break;
        }
        default:
          break;
      }
      if (data.flat().includes(2048)) {
        setTimeout(() => {
          alert("승리!");
          setReGame(true);
        }, 500);
      } else if (!data.flat().includes(0)) {
        alert("패배");
        setReGame(true);
      } else {
        setData(put2ToRandomCell(data));
      }
    },
    [data, score, setHistory]
  );

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
      <button id="back" onClick={back}>
        뒤로
      </button>
      {reGame && <button onClick={reGameStart}>다시 하기</button>}
    </div>
  );
};

export default Game2048;
