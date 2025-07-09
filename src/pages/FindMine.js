import { useEffect, useState } from "react";
import useInput from "../hooks/useInput";
import styled from "styled-components";

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

const FindMine = () => {
  const [row, onChangeRow] = useInput();
  const [cell, onChangeCell] = useInput();
  const [mine, onChangeMine] = useInput();
  const [board, setBoard] = useState([]);
  const [halted, setHalted] = useState(false);
  const [openedCount, setOpenedCount] = useState(0);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] >= 0) {
          arr.push(board[i][j]);
        }
      }
    }
    setOpenedCount(arr.length);
  }, [board]);

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

    const gameBoard = [];
    for (let i = 0; i < row; i++) {
      const rowBoard = []; // 여기서 초기화
      gameBoard.push(rowBoard);
      for (let j = 0; j < cell; j++) {
        rowBoard.push(CODE.NORMAL);
      }
    }
    for (let k = 0; k < shuffle.length; k++) {
      const ver = Math.floor(shuffle[k] / cell);
      const hor = shuffle[k] % cell;
      gameBoard[ver][hor] = CODE.MINE;
    }
    return gameBoard;
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
        mines.includes(board[r][c])
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
    const newBoard = [...board];
    const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];

    newBoard.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (mines.includes(cell)) {
          if (
            (rowIndex !== clickedRowIndex || cellIndex !== clickedCellIndex) &&
            cell !== CODE.FLAG &&
            cell !== CODE.CLICKED_MINE
          ) {
            newBoard[rowIndex][cellIndex] = "💣";
          }
        }
      });
    });

    setBoard(newBoard);
  };

  const open = (rowIndex, cellIndex) => {
    if (halted) return;
    const newBoard = [...board];

    if (openedCount === 0) {
      let firstCellBoard = newBoard[rowIndex][cellIndex];
      while (firstCellBoard === CODE.MINE) {
        const newMineRowIndex = Math.floor(Math.random() * row);
        const newMineCellIndex = Math.floor(Math.random() * cell);
        if (newBoard[newMineRowIndex][newMineCellIndex] !== CODE.MINE) {
          newBoard[rowIndex][cellIndex] = CODE.NORMAL; //클릭한 셀 노말로 바꾸고
          newBoard[newMineRowIndex][newMineCellIndex] = CODE.MINE; //새로운 셀에 지뢰 심기
        }
        firstCellBoard = newBoard[rowIndex][cellIndex];
      }
    }

    const count = countMine(rowIndex, cellIndex);

    const checkSurroundingCells = (r, c) => {
      if (r < 0 || r >= row || c < 0 || c >= cell) {
        return;
      }

      if (
        newBoard[r][c] === CODE.OPENED ||
        newBoard[r][c] === CODE.FLAG_MINE ||
        newBoard[r][c] === CODE.FLAG ||
        newBoard[r][c] === CODE.QUESTION_MINE ||
        newBoard[r][c] === CODE.QUESTION
      ) {
        return;
      }

      const mineCount = countMine(r, c);
      newBoard[r][c] = mineCount;

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

    switch (newBoard[rowIndex][cellIndex]) {
      case CODE.OPENED:
      case CODE.FLAG_MINE:
      case CODE.FLAG:
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return;
      case CODE.NORMAL:
        newBoard[rowIndex][cellIndex] = count;
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
        newBoard[rowIndex][cellIndex] = CODE.CLICKED_MINE;
        setHalted(true);
        showMine(rowIndex, cellIndex);
        setTimeout(() => {
          alert("실패");
        }, 500);
        break;
      default:
        return;
    }

    setBoard(newBoard);
  };

  const onSubmit = (e) => {
    setBoard([]);
    setHalted(false);
    setOpenedCount(0);
    e.preventDefault();
    const gameBoard = plantMine();
    setBoard(gameBoard);
  };

  const getStyle = (cellBoard) => {
    switch (cellBoard) {
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

  const getText = (cellBoard) => {
    switch (cellBoard) {
      case CODE.NORMAL:
        return "";
      case CODE.MINE:
        return ""; //지뢰 위치 표시 X
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return "❓";
      case CODE.FLAG_MINE:
      case CODE.FLAG:
        return "🚩";
      case CODE.CLICKED_MINE:
        return "💥";
      default:
        return cellBoard || ""; // 0이면 빈 문자
    }
  };

  const onRightClick = (rowIndex, cellIndex) => (e) => {
    e.preventDefault();
    const newBoard = [...board].map((row) => [...row]);
    const cellBoard = newBoard[rowIndex][cellIndex];

    if (cellBoard === CODE.MINE) {
      newBoard[rowIndex][cellIndex] = CODE.QUESTION_MINE;
    } else if (cellBoard === CODE.QUESTION_MINE) {
      newBoard[rowIndex][cellIndex] = CODE.FLAG_MINE;
    } else if (cellBoard === CODE.FLAG_MINE) {
      newBoard[rowIndex][cellIndex] = CODE.MINE;
    } else if (cellBoard === CODE.NORMAL) {
      newBoard[rowIndex][cellIndex] = CODE.QUESTION;
    } else if (cellBoard === CODE.QUESTION) {
      newBoard[rowIndex][cellIndex] = CODE.FLAG;
    } else if (cellBoard === CODE.FLAG) {
      newBoard[rowIndex][cellIndex] = CODE.NORMAL;
    }
    setBoard(newBoard);
  };

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <Input value={row} onChange={onChangeRow} size="5" placeholder="행" />
        <Input value={cell} onChange={onChangeCell} size="5" placeholder="열" />
        <Input
          value={mine}
          onChange={onChangeMine}
          size="5"
          placeholder="지뢰 개수"
        />
        <Button type="submit">생성</Button>
      </form>

      <OpenedCount>열린 개수: {openedCount}</OpenedCount>
      <Table>
        <tbody>
          {board &&
            board.map((rowBoard, rowIndex) => (
              <TableRow key={rowIndex}>
                {rowBoard.map((cellBoard, cellIndex) => (
                  <TableBoard
                    onClick={() => open(rowIndex, cellIndex)}
                    onContextMenu={(e) => onRightClick(rowIndex, cellIndex)(e)}
                    key={cellIndex}
                    style={getStyle(cellBoard)}
                  >
                    {getText(cellBoard)}
                  </TableBoard>
                ))}
              </TableRow>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default FindMine;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  min-height: 100vh;
`;

const Input = styled.input`
  margin-right: 10px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const OpenedCount = styled.div`
  margin-top: 10px;
`;

const Table = styled.table`
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableRow = styled.tr``;

const TableBoard = styled.td`
  width: 30px;
  height: 30px;
  text-align: center;
  border: 1px solid #ccc;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;
