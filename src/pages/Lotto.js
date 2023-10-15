import React, { useState, useEffect } from "react";

const Lotto = () => {
  const [winBalls, setWinBalls] = useState([]);
  const [bonusBall, setBonusBall] = useState(null);
  const [i, setI] = useState(0);

  const draw = () => {
    const candidate = Array(45)
      .fill()
      .map((v, i) => i + 1);
    const shuffle = [];
    for (let i = 0; i < 7; i++) {
      const random = Math.floor(Math.random() * candidate.length);
      const spliceArray = candidate.splice(random, 1);
      const value = spliceArray[0];
      shuffle.push(value);
    }
    const newWinBalls = shuffle.splice(0, 6).sort((a, b) => a - b);
    const newBonusBall = shuffle[shuffle.length - 1];
    setWinBalls(newWinBalls);
    setBonusBall(newBonusBall);
  };

  const getColor = (winBall) => {
    const number = winBall || bonusBall;
    if (number < 10) return "red";
    if (number < 20) return "orange";
    if (number < 30) return "yellow";
    if (number < 40) return "blue";
    return "green";
  };

  useEffect(() => {
    draw();
  }, []);

  useEffect(() => {
    if (i < 7) {
      const timer = setTimeout(() => {
        setI(i + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [i]);

  const reDraw = () => {
    setI(0);
    setWinBalls([]);
    setBonusBall(null);

    setTimeout(() => {
      draw();
    }, 1000);
  };

  return (
    <div>
      <div>
        결과:
        {winBalls.slice(0, i).map((winBall) => (
          <div
            className="ball"
            style={{ color: "white", backgroundColor: getColor(winBall) }}
          >
            {winBall}
          </div>
        ))}
      </div>
      <div>
        보너스 볼:
        {i === 7 && (
          <div
            className="ball"
            style={{ color: "white", backgroundColor: getColor() }}
          >
            {bonusBall}
          </div>
        )}
      </div>
      {i === 7 && <button onClick={reDraw}>다시 뽑기</button>}
    </div>
  );
};

export default Lotto;
