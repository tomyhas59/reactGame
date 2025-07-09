import { useState } from "react";
import styled from "styled-components";

const Calculator = () => {
  const [numOne, setNumOne] = useState("");
  const [numTwo, setNumTwo] = useState("");
  const [operator, setOperator] = useState("");

  const onClickNumber = (number) => {
    if (!operator) {
      setNumOne((prev) => prev + number);
    } else {
      setNumTwo((prev) => prev + number);
    }
  };

  const onMinusClick = () => {
    if (!operator) {
      setNumOne((prev) => toggleMinus(prev));
    } else {
      setNumTwo((prev) => toggleMinus(prev));
    }
  };

  const toggleMinus = (num) => {
    if (!num) return "-";
    if (num === "-") return "";
    return num[0] === "-" ? num.slice(1) : "-" + num;
  };

  const onClickOperator = (op) => {
    if (!numOne) {
      alert("먼저 숫자를 입력하세요.");
      return;
    }
    if (operator) {
      alert("이미 연산자를 선택했습니다.");
      return;
    }
    setOperator(op);
  };
  const calculateResult = () => {
    if (!numOne || !operator || !numTwo) {
      alert("계산식을 완성해주세요.");
      return;
    }
    let calculated;
    const n1 = parseFloat(numOne);
    const n2 = parseFloat(numTwo);
    switch (operator) {
      case "+":
        calculated = n1 + n2;
        break;
      case "-":
        calculated = n1 - n2;
        break;
      case "*":
        calculated = n1 * n2;
        break;
      case "/":
        if (n2 === 0) {
          alert("0으로 나눌 수 없습니다!");
          clearCalculator();
          return;
        }
        calculated = n1 / n2;
        break;
      default:
        alert("올바른 연산자가 아닙니다.");
        clearCalculator();
        return;
    }
    setNumOne(calculated.toString());
    setNumTwo("");
    setOperator("");
  };

  const clearCalculator = () => {
    setNumOne("");
    setNumTwo("");
    setOperator("");
  };

  const buttons = [
    ["1", "2", "3", "+"],
    ["4", "5", "6", "-"],
    ["7", "8", "9", "/"],
    ["±", "0", "*", "="],
    ["C"],
  ];

  const handleButtonClick = (btn) => {
    if (btn === "±") onMinusClick();
    else if (btn === "=") calculateResult();
    else if (btn === "C") clearCalculator();
    else if (["+", "-", "/", "*"].includes(btn)) onClickOperator(btn);
    else onClickNumber(btn);
  };

  return (
    <Container>
      <Content>
        <Display value={`${numOne}${operator}${numTwo}`} readOnly />
        <ButtonGrid>
          {buttons.map((row, rowIndex) => (
            <ButtonRow key={rowIndex}>
              {row.map((btnText) => (
                <Button
                  key={btnText}
                  onClick={() => handleButtonClick(btnText)}
                  isOperator={["+", "-", "/", "*", "="].includes(btnText)}
                >
                  {btnText}
                </Button>
              ))}
            </ButtonRow>
          ))}
        </ButtonGrid>
      </Content>
    </Container>
  );
};

export default Calculator;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  height: 100vh;
`;

const Content = styled.div`
  background-color: #d3d3d3;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 1px 1px 1px #4f4f4f;
  @media (max-width: 750px) {
    width: 80%;
  }
`;

const Display = styled.input`
  width: 100%;
  padding: 20px;
  border: 2px solid #4caf50;
  border-radius: 10px;
  font-size: 2rem;
  text-align: right;
  margin-bottom: 20px;
  background-color: #fff;
  color: #333;
  @media (max-width: 750px) {
    font-size: 1.5rem;
  }
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 80px);
  grid-gap: 10px;
  @media (max-width: 750px) {
    grid-template-columns: repeat(4, 60px);
    grid-gap: 5px;
  }
`;

const ButtonRow = styled.div`
  display: contents;
`;

const Button = styled.button`
  width: 80px;
  height: 80px;
  background-color: ${({ isOperator }) => (isOperator ? "#ff5722" : "#4caf50")};
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: ${({ isOperator }) =>
      isOperator ? "#e64a19" : "#45a049"};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 750px) {
    width: 60px;
    height: 60px;
    font-size: 1.2rem;
  }
`;
