import React, { useState } from "react";
import useInput from "../hooks/useInput";

const FindMine = () => {
  const [row, onChangeRow, setRow] = useInput();
  const [cell, onChangeCell, setCell] = useInput();
  const [mine, onChangeMine, setMine] = useInput();
  const [openCount, setOpenCount] = useState(0);
  const [data, setData] = useState([]);

  const CODE = {
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    MINE: -6,
    OPENED: 0,
  };

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
      const rowData = [];
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
    const newData = [...data];
    const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];
    let i = 0;
    mines.includes(newData[rowIndex - 1]?.[cellIndex - 1]) && i++;
    mines.includes(newData[rowIndex - 1]?.[cellIndex]) && i++;
    mines.includes(newData[rowIndex - 1]?.[cellIndex + 1]) && i++;
    mines.includes(newData[rowIndex][cellIndex - 1]) && i++;
    mines.includes(newData[rowIndex][cellIndex + 1]) && i++;
    mines.includes(newData[rowIndex + 1]?.[cellIndex - 1]) && i++;
    mines.includes(newData[rowIndex + 1]?.[cellIndex]) && i++;
    mines.includes(newData[rowIndex + 1]?.[cellIndex + 1]) && i++;
    return i;
  };

  const open = (rowIndex, cellIndex) => {
    const newData = [...data];

    if (newData[rowIndex]?.[cellIndex] >= CODE.OPENED) return;

    const count = countMine(rowIndex, cellIndex);
    newData[rowIndex][cellIndex] = count;
    setData(newData);
    setOpenCount(openCount + 1);

    if (openCount === row * cell - mine) {
      alert("성공");
    }
    return count;
  };

  const drawTable = () => {
    const gameData = plantMine();
    setData(gameData);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    drawTable();
  };

  const getStyle = (cellData) => {
    switch (cellData) {
      case CODE.NORMAL:
      case CODE.MINE:
        return { background: "#444" };
      case CODE.OPENED:
        return {
          background: "blue",
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

      default:
        return "";
    }
  };

  const onRightClick = (rowIndex, cellIndex) => (e) => {
    e.preventDefault();
    const newData = [...data];
    const cellData = data[rowIndex][cellIndex];

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
      <div id="timer"></div>
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
      <div id="result"></div>
    </div>
  );
};

export default FindMine;
