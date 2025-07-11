import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const BOARD_SIZE = 10;
const EMOJIS = ["🍎", "🍊", "🍉", "🍇", "🍓", "🍒", "🍍", "🥝", "🥑", "🥥"];

function App() {
  const [board, setBoard] = useState([]);
  const [first, setFirst] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [records, setRecords] = useState([]);
  const [timerActive, setTimerActive] = useState(false);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const initBoard = useCallback(() => {
    const totalCells = (BOARD_SIZE - 2) * (BOARD_SIZE - 2);
    const totalPairs = totalCells / 2;
    // 사용할 이모지 리스트를 이모지 배열에서 필요한 개수만큼만 자르기 (중복 없게)
    let emojisNeeded = totalPairs;
    let emojisForGame = [];

    // EMOJIS 배열이 충분히 크지 않으면 반복해서 채우기
    while (emojisForGame.length < emojisNeeded) {
      emojisForGame = emojisForGame.concat(EMOJIS);
    }
    emojisForGame = emojisForGame.slice(0, emojisNeeded);

    // 각 이모지를 2개씩 만들어서 쌍으로 만듦
    const cells = shuffle([...emojisForGame, ...emojisForGame]);

    const newBoard = Array.from({ length: BOARD_SIZE }, (_, i) =>
      Array.from({ length: BOARD_SIZE }, (_, j) => {
        if (
          i === 0 ||
          i === BOARD_SIZE - 1 ||
          j === 0 ||
          j === BOARD_SIZE - 1
        ) {
          return 0;
        }
        return cells.pop();
      })
    );

    setBoard(newBoard);
    setFirst(null);
    setStartTime(Date.now());
    setElapsedTime(0);
  }, []);

  useEffect(() => {
    initBoard();
    const saved = JSON.parse(localStorage.getItem("onetGameRecords") || "[]");
    setRecords(saved);
  }, [initBoard]);

  useEffect(() => {
    if (!timerActive) return;
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive]);

  const onCellClick = (x, y) => {
    if (!board[x][y]) return;
    if (!first) {
      setFirst({ x, y });
      if (!timerActive) {
        setStartTime(Date.now());
        setElapsedTime(0);
        setTimerActive(true);
      }
      return;
    }

    if (first.x === x && first.y === y) return;

    if (
      board[first.x][first.y] === board[x][y] &&
      canConnect(board, first.x, first.y, x, y)
    ) {
      const newBoard = board.map((row) => row.slice());
      newBoard[first.x][first.y] = 0;
      newBoard[x][y] = 0;
      setBoard(newBoard);
      setFirst(null);

      if (!hasAnyConnectablePair(newBoard)) {
        endGame();
      }
    } else {
      setFirst(null);
    }
  };

  const hasAnyConnectablePair = (brd) => {
    for (let i = 1; i < BOARD_SIZE - 1; i++) {
      for (let j = 1; j < BOARD_SIZE - 1; j++) {
        if (brd[i][j] === 0) continue;
        for (let x = 1; x < BOARD_SIZE - 1; x++) {
          for (let y = 1; y < BOARD_SIZE - 1; y++) {
            if (i === x && j === y) continue;
            if (brd[x][y] === 0) continue;
            if (brd[i][j] !== brd[x][y]) continue;
            if (canConnect(brd, i, j, x, y)) return true;
          }
        }
      }
    }
    return false;
  };

  const endGame = () => {
    setTimerActive(false);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    alert(`더 이상 이을 쌍이 업습니다! \n소요 시간: ${timeTaken}초`);
    saveRecord(timeTaken);
  };

  const saveRecord = () => {
    const newRecords = [...records, elapsedTime];
    localStorage.setItem("onetGameRecords", JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  function canConnect(board, x1, y1, x2, y2) {
    const MAX_TURN = 2;
    const boardSize = board.length;
    const visited = Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => Array(4).fill(Infinity))
    );

    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    const queue = [];

    for (let d = 0; d < 4; d++) {
      visited[x1][y1][d] = 0;
      queue.push({ x: x1, y: y1, dir: d, turn: 0 });
    }

    while (queue.length) {
      const { x, y, dir, turn } = queue.shift();

      let nx = x;
      let ny = y;

      while (true) {
        nx += dirs[dir][0];
        ny += dirs[dir][1];

        if (nx < 0 || ny < 0 || nx >= boardSize || ny >= boardSize) break;

        if ((nx !== x2 || ny !== y2) && board[nx][ny] !== 0) break;

        if (visited[nx][ny][dir] <= turn) continue;

        visited[nx][ny][dir] = turn;

        if (nx === x2 && ny === y2) return true;

        for (let nd = 0; nd < 4; nd++) {
          const t = dir === nd ? turn : turn + 1;
          if (t <= MAX_TURN && visited[nx][ny][nd] > t) {
            queue.push({ x: nx, y: ny, dir: nd, turn: t });
          }
        }
      }
    }

    return false;
  }

  const startNewGame = () => {
    setTimerActive(false);
    setElapsedTime(0);
    initBoard();
  };

  return (
    <Container>
      <Title>🧩 ONET GAME</Title>
      <ButtonGroup>
        <Button onClick={startNewGame}>새 게임 ▶️</Button>
      </ButtonGroup>
      <StatusBar>⏱️ 경과 시간: {elapsedTime}초</StatusBar>
      <GameBoard size={BOARD_SIZE}>
        {board.map((row, i) =>
          row.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              removed={cell === 0}
              selected={first && first.x === i && first.y === j}
              onClick={() => onCellClick(i, j)}
            >
              {cell !== 0 ? cell : ""}
            </Cell>
          ))
        )}
      </GameBoard>
      <RecordList>
        <h3>🏆 베스트 기록 TOP 5</h3>
        <ul>
          {records
            .sort((a, b) => a - b)
            .slice(0, 5)
            .map((r, idx) => (
              <li key={idx} data-rank={idx + 1}>
                {r}초
              </li>
            ))}
        </ul>
      </RecordList>
    </Container>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  min-height: 100vh;
`;

const Title = styled.h1`
  margin-top: 20px;
`;

const ButtonGroup = styled.div`
  margin: 10px;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const StatusBar = styled.div`
  margin: 10px;
  font-size: 18px;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: ${({ size }) => `repeat(${size}, minmax(30px, 1fr))`};
  gap: 4px;
`;

const Cell = styled.div`
  font-size: 24px;
  padding: 8px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.removed ? "transparent" : props.selected ? "lightblue" : "silver"};
  border-radius: 6px;
  cursor: ${(props) => (props.removed ? "default" : "pointer")};
  visibility: ${(props) => (props.removed ? "hidden" : "visible")};
  transition: background 0.2s;
`;

const RecordList = styled.div`
  max-width: 500px;
  width: 90vw;
  background: #fff;
  padding: 24px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  text-align: left;

  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.6rem;
    font-weight: 700;
    color: #333;
    border-bottom: 2px solid #4caf50;
    padding-bottom: 8px;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-size: 1.1rem;
    color: #555;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: #f9fefa;
    box-shadow: inset 0 0 6px #e2f0d9;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #eaf7e9;
    }

    &::before {
      content: attr(data-rank);
      display: inline-block;
      width: 28px;
      height: 28px;
      line-height: 28px;
      margin-right: 16px;
      text-align: center;
      font-weight: 700;
      color: white;
      border-radius: 50%;
      background-color: #4caf50;
      box-shadow: 0 2px 6px rgba(76, 175, 80, 0.5);
      font-size: 1rem;
      user-select: none;
    }
  }
`;
