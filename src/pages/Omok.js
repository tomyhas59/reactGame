import React, { useState, useEffect } from "react";

const Cell = ({ onMoleClick, onBombClick, gopherVisible, bombVisible }) => {
  return (
    <div className="cell">
      <div className="hole"></div>
      <div
        className={`gopher ${gopherVisible ? "" : "hidden"}`}
        onClick={onMoleClick}
      ></div>
      <div
        className={`bomb ${bombVisible ? "" : "hidden"}`}
        onClick={onBombClick}
      ></div>
      <div className="hole-front"></div>
    </div>
  );
};

const Omok = () => {
  const [time, setTime] = useState(8);
  const [score, setScore] = useState(0);
  const [life, setLife] = useState(3);
  const [started, setStarted] = useState(false);
  const [gopherPercent] = useState(0.3);
  const [bombPercent] = useState(0.5);
  const [holes, setHoles] = useState(Array(9).fill(null));
  let timerId;
  let tickId;

  useEffect(() => {
    const tick = () => {
      setHoles((prevHoles) => {
        const newHoles = prevHoles.map((hole, index) => {
          if (hole) return hole;

          const randomValue = Math.random();

          if (randomValue < gopherPercent) {
            return setTimeout(() => {
              setHoles((prevHoles) => {
                const updatedHoles = [...prevHoles];
                updatedHoles[index] = null;
                return updatedHoles;
              });
            }, 1000);
          } else if (randomValue < bombPercent) {
            return setTimeout(() => {
              setHoles((prevHoles) => {
                const updatedHoles = [...prevHoles];
                updatedHoles[index] = null;
                return updatedHoles;
              });
            }, 1000);
          }

          return null;
        });

        return newHoles;
      });
    };

    if (started) {
      timerId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0.1) {
            clearInterval(timerId);
            clearInterval(tickId);
            alert(`게임 오버! 점수는 ${score}점`);
            resetGame();
            return 0;
          }
          return (prevTime * 10 - 1) / 10;
        });
      }, 100);

      tickId = setInterval(tick, 1000);

      return () => {
        clearInterval(timerId);
        clearInterval(tickId);
      };
    }

    return undefined;
  }, [gopherPercent, bombPercent, started, score]);

  const resetGame = () => {
    setTime(8);
    setScore(0);
    setLife(3);
    setStarted(false);
    setHoles(Array(9).fill(null));
  };

  const handleStartClick = () => {
    if (!started) {
      setStarted(true);
    }
  };

  const handleMoleClick = (index) => {
    if (holes[index]) {
      setScore((prevScore) => prevScore + 1);
      clearTimeout(holes[index]);
      setHoles((prevHoles) => {
        const updatedHoles = [...prevHoles];
        updatedHoles[index] = null;
        return updatedHoles;
      });
    }
  };

  const handleBombClick = (index) => {
    if (holes[index]) {
      setLife((prevLife) => prevLife - 1);
      clearTimeout(holes[index]);
      setHoles((prevHoles) => {
        const updatedHoles = [...prevHoles];
        updatedHoles[index] = null;
        return updatedHoles;
      });

      if (life === 1) {
        clearInterval(tickId);
        alert(`게임 오버! 점수는 ${score}점`);
        resetGame();
      }
    }
  };

  return (
    <div>
      <div>
        <span id="timer">{time.toFixed(1)}</span>초{" "}
        <span id="score">{score}</span>점 <span id="life">{life}</span>목숨
        <button id="start" onClick={handleStartClick}>
          시작
        </button>
      </div>
      <div id="game">
        <div className="row">
          {holes.map((hole, index) => (
            <Cell
              key={index}
              onMoleClick={() => handleMoleClick(index)}
              onBombClick={() => handleBombClick(index)}
              gopherVisible={hole !== null && Math.random() < gopherPercent}
              bombVisible={hole !== null && Math.random() < bombPercent}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Omok;
