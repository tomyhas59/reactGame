import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
    <Container>
      <div>
        결과:
        {winBalls.slice(0, i).map((winBall) => (
          <Ball style={{ backgroundColor: getColor(winBall) }}>{winBall}</Ball>
        ))}
      </div>
      <div>
        보너스 볼:
        {i === 7 && (
          <Ball style={{ backgroundColor: getColor() }}>{bonusBall}</Ball>
        )}
      </div>
      {i === 7 && <Button onClick={reDraw}>다시 뽑기</Button>}
    </Container>
  );
};

export default Lotto;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  min-height: 100vh;
`;
const Ball = styled.div`
  display: inline-block;
  border: 1px solid #000;
  border-radius: 20px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  text-align: center;
  margin-right: 20px;
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;
