import React, { useState } from "react";
import useInput from "../hooks/useInput";

const FindMine = () => {
  const [row, onChangeRow, setRow] = useInput();
  const [cell, onChangeCell, setCell] = useInput();
  const [mine, onChangeMine, setMine] = useInput();
  const [openCount, setOpenCount] = useState(0);
  const [data, setData] = useState([]);
  const [cellClasses, setCellClasses] = useState([]);

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
    const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];
    let i = 0;
    mines.includes(data[rowIndex - 1]?.[cellIndex - 1]) && i++;
    mines.includes(data[rowIndex - 1]?.[cellIndex]) && i++;
    mines.includes(data[rowIndex - 1]?.[cellIndex + 1]) && i++;
    mines.includes(data[rowIndex][cellIndex - 1]) && i++;
    mines.includes(data[rowIndex][cellIndex + 1]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex - 1]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex + 1]) && i++;
    return i;
  };

  const open = (rowIndex, cellIndex) => {
    if (data[rowIndex]?.[cellIndex] >= CODE.OPENED) return;

    const count = countMine(rowIndex, cellIndex);
    const newData = [...data];
    newData[rowIndex][cellIndex] = count;
    setData(newData);
    setOpenCount((v) => v + 1);

    console.log(openCount);
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
                  <td onClick={() => open(rowIndex, cellIndex)} key={cellIndex}>
                    {cellData !== CODE.NORMAL ? cellData : null}
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
