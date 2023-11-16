import React, { useEffect, useState } from "react";
import useInput from "../hooks/useInput";

const FindMine = () => {
  const [row, onChangeRow] = useInput();
  const [cell, onChangeCell] = useInput();
  const [mine, onChangeMine] = useInput();
  const [data, setData] = useState([]);
  const [halted, setHalted] = useState(false);
  const [openedCount, setOpenedCount] = useState(0);

  const CODE = {
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    MINE: -7,
    CLICKED_MINE: -6,
    OPENED: 0,
  };

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j] >= 0) {
          arr.push(data[i][j]);
        }
      }
    }
    setOpenedCount(arr.length);
  }, [data]);

  useEffect(() => {
    if (row && cell && mine && openedCount === row * cell - mine) {
      setTimeout(() => {
        alert("승리했습니다!");
      }, 500);
    }
  }, [cell, mine, openedCount, row]);

  const plantMine = () => {
    const candidate = Array(row * cell)
      .fill()
      .map((arr, i) => i);

    const shuffle = [];
    while (candidate.length > row * cell - mine) {
      const chosen = candidate.splice(
        Math.floor(Math.random() * candidate.length),
        1
      )[0];
      shuffle.push(chosen);
    }

    const gameData = [];
    for (let i = 0; i < row; i++) {
      const rowData = []; // 여기서 초기화
      gameData.push(rowData);
      for (let j = 0; j < cell; j++) {
        rowData.push(CODE.NORMAL);
      }
    }
    for (let k = 0; k < shuffle.length; k++) {
      const ver = Math.floor(shuffle[k] / cell);
      const hor = shuffle[k] % cell;
      gameData[ver][hor] = CODE.MINE;
    }
    return gameData;
  };

  const countMine = (rowIndex, cellIndex) => {
    const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];
    let count = 0;

    const checkCell = (r, c) => {
      if (
        r >= 0 &&
        r < row &&
        c >= 0 &&
        c < cell &&
        mines.includes(data[r][c])
      ) {
        count++;
      }
    };

    checkCell(rowIndex - 1, cellIndex - 1);
    checkCell(rowIndex - 1, cellIndex);
    checkCell(rowIndex - 1, cellIndex + 1);
    checkCell(rowIndex, cellIndex - 1);
    checkCell(rowIndex, cellIndex + 1);
    checkCell(rowIndex + 1, cellIndex - 1);
    checkCell(rowIndex + 1, cellIndex);
    checkCell(rowIndex + 1, cellIndex + 1);

    return count;
  };

  const showMine = (clickedRowIndex, clickedCellIndex) => {
    const newData = [...data];
    const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];

    newData.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (mines.includes(cell)) {
          if (
            (rowIndex !== clickedRowIndex || cellIndex !== clickedCellIndex) &&
            cell !== CODE.FLAG &&
            cell !== CODE.CLICKED_MINE
          ) {
            newData[rowIndex][cellIndex] = "X";
          }
        }
      });
    });

    setData(newData);
  };

  const open = (rowIndex, cellIndex) => {
    if (halted) return;
    const newData = [...data];

    if (openedCount === 0) {
      let firstCellData = newData[rowIndex][cellIndex];
      while (firstCellData === CODE.MINE) {
        const newMineRowIndex = Math.floor(Math.random() * row);
        const newMineCellIndex = Math.floor(Math.random() * cell);
        if (newData[newMineRowIndex][newMineCellIndex] !== CODE.MINE) {
          newData[rowIndex][cellIndex] = CODE.NORMAL; //클릭한 셀 노말로 바꾸고
          newData[newMineRowIndex][newMineCellIndex] = CODE.MINE; //새로운 셀에 지뢰 심기
        }
        firstCellData = newData[rowIndex][cellIndex];
      }
    }

    const count = countMine(rowIndex, cellIndex);

    const checkSurroundingCells = (r, c) => {
      if (r < 0 || r >= row || c < 0 || c >= cell) {
        return;
      }

      if (
        newData[r][c] === CODE.OPENED ||
        newData[r][c] === CODE.FLAG_MINE ||
        newData[r][c] === CODE.FLAG ||
        newData[r][c] === CODE.QUESTION_MINE ||
        newData[r][c] === CODE.QUESTION
      ) {
        return;
      }

      const mineCount = countMine(r, c);
      newData[r][c] = mineCount;

      if (mineCount === 0) {
        checkSurroundingCells(r - 1, c - 1);
        checkSurroundingCells(r - 1, c);
        checkSurroundingCells(r - 1, c + 1);
        checkSurroundingCells(r, c - 1);
        checkSurroundingCells(r, c + 1);
        checkSurroundingCells(r + 1, c - 1);
        checkSurroundingCells(r + 1, c);
        checkSurroundingCells(r + 1, c + 1);
      }
    };

    switch (newData[rowIndex][cellIndex]) {
      case CODE.OPENED:
      case CODE.FLAG_MINE:
      case CODE.FLAG:
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return;
      case CODE.NORMAL:
        newData[rowIndex][cellIndex] = count;
        if (count === 0) {
          checkSurroundingCells(rowIndex - 1, cellIndex - 1);
          checkSurroundingCells(rowIndex - 1, cellIndex);
          checkSurroundingCells(rowIndex - 1, cellIndex + 1);
          checkSurroundingCells(rowIndex, cellIndex - 1);
          checkSurroundingCells(rowIndex, cellIndex + 1);
          checkSurroundingCells(rowIndex + 1, cellIndex - 1);
          checkSurroundingCells(rowIndex + 1, cellIndex);
          checkSurroundingCells(rowIndex + 1, cellIndex + 1);
        }
        break;
      case CODE.MINE:
        newData[rowIndex][cellIndex] = CODE.CLICKED_MINE;
        setHalted(true);
        showMine(rowIndex, cellIndex);
        setTimeout(() => {
          alert("실패");
        }, 500);
        break;
      default:
        return;
    }

    setData(newData);
  };

  const onSubmit = (e) => {
    setData([]);
    setHalted(false);
    setOpenedCount(0);
    e.preventDefault();
    const gameData = plantMine();
    setData(gameData);
  };

  const getStyle = (cellData) => {
    switch (cellData) {
      case CODE.NORMAL:
      case CODE.MINE:
        return { background: "#444" };
      case CODE.OPENED:
        return {
          background: "white",
        };
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return { background: "yellow" };
      case CODE.FLAG_MINE:
      case CODE.FLAG:
        return { background: "red" };
      default:
        return {
          background: "white",
        };
    }
  };

  const getText = (cellData) => {
    switch (cellData) {
      case CODE.NORMAL:
        return "";
      case CODE.MINE:
        return "X";
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return "?";
      case CODE.FLAG_MINE:
      case CODE.FLAG:
        return "!";
      case CODE.CLICKED_MINE:
        return "펑";
      default:
        return cellData || ""; // 0이면 빈 문자
    }
  };

  const onRightClick = (rowIndex, cellIndex) => (e) => {
    e.preventDefault();
    const newData = [...data].map((row) => [...row]);
    const cellData = newData[rowIndex][cellIndex];

    if (cellData === CODE.MINE) {
      newData[rowIndex][cellIndex] = CODE.QUESTION_MINE;
    } else if (cellData === CODE.QUESTION_MINE) {
      newData[rowIndex][cellIndex] = CODE.FLAG_MINE;
    } else if (cellData === CODE.FLAG_MINE) {
      newData[rowIndex][cellIndex] = CODE.MINE;
    } else if (cellData === CODE.NORMAL) {
      newData[rowIndex][cellIndex] = CODE.QUESTION;
    } else if (cellData === CODE.QUESTION) {
      newData[rowIndex][cellIndex] = CODE.FLAG;
    } else if (cellData === CODE.FLAG) {
      newData[rowIndex][cellIndex] = CODE.NORMAL;
    }
    setData(newData);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={row} onChange={onChangeRow} size="5" />
        <input value={cell} onChange={onChangeCell} size="5" />
        <input value={mine} onChange={onChangeMine} size="5" />
        <button type="submit">생성</button>
      </form>

      <div>열린 개수 :{openedCount}</div>
      <table>
        <tbody>
          {data &&
            data.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                {rowData.map((cellData, cellIndex) => (
                  <td
                    onClick={() => open(rowIndex, cellIndex)}
                    onContextMenu={(e) => onRightClick(rowIndex, cellIndex)(e)}
                    key={cellIndex}
                    style={getStyle(cellData)}
                  >
                    {getText(cellData)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default FindMine;
