import React, { useState } from "react";

const Calculator = () => {
  const [numOne, setNumOne] = useState("");
  const [numTwo, setNumTwo] = useState("");
  const [operator, setOperator] = useState("");
  const [result, setResult] = useState("");

  const onClickNumber = (number) => {
    if (!operator) {
      const newNumOne = numOne + number;
      setNumOne(newNumOne);
      setResult(newNumOne);
    } else {
      const newNumTwo = numTwo + number;
      setNumTwo(newNumTwo);
      setResult(newNumTwo);
    }
  };
  const onMinusClick = () => {
    if (!operator) {
      if (numOne[0] === "-") {
        setNumOne(numOne.substring(1));
        setResult(result.substring(1));
      } else {
        setNumOne("-" + numOne);
        setResult("-" + result);
      }
    } else {
      if (numTwo[0] === "-") {
        setNumTwo(numTwo.substring(1));
        setResult(result.substring(1));
      } else {
        setNumTwo("-" + numTwo);
        setResult("-" + result);
      }
    }
  };

  const onClickOperator = (op) => {
    if (!numOne) return;
    if (operator !== op) {
      setOperator(op);
      setNumTwo("");
    }
  };

  const calculateResult = () => {
    if (numTwo) {
      let calculatedResult;
      switch (operator) {
        case "+":
          calculatedResult = parseFloat(numOne) + parseFloat(numTwo);
          break;
        case "-":
          calculatedResult = parseFloat(numOne) - parseFloat(numTwo);
          break;
        case "/":
          calculatedResult = parseFloat(numOne) / parseFloat(numTwo);
          break;
        case "*":
          calculatedResult = parseFloat(numOne) * parseFloat(numTwo);
          break;
        default:
          alert("올바른 연산자가 아닙니다.");
          clearCalculator();
          return;
      }
      setNumOne(calculatedResult.toString());
      setResult(calculatedResult.toString());
    } else {
      alert("숫자와 연산자를 모두 입력하세요.");
    }
  };

  const clearCalculator = () => {
    setNumOne("");
    setNumTwo("");
    setOperator("");
    setResult("");
  };

  const buttons = [
    ["1", "2", "3", "+"],
    ["4", "5", "6", "-"],
    ["7", "8", "9", "/"],
    ["±", "0", "*", "=", "C"],
  ];

  return (
    <div>
      <input
        style={{ textAlign: "right", fontSize: "50px", width: "300px" }}
        readOnly
        value={operator}
      />
      <table>
        <tbody>
          {buttons.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((btnText) => (
                <td key={btnText}>
                  <button
                    style={{
                      width: "100px",
                      height: "100px",
                      fontSize: "50px",
                    }}
                    onClick={() => {
                      if (btnText === "±") {
                        onMinusClick();
                      } else if (btnText === "=") {
                        calculateResult();
                      } else if (btnText === "C") {
                        clearCalculator();
                      } else if (isNaN(btnText)) {
                        onClickOperator(btnText);
                      } else {
                        onClickNumber(btnText);
                      }
                    }}
                  >
                    {btnText}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <input
        readOnly
        type="text"
        value={result}
        style={{ textAlign: "right", fontSize: "50px", width: "300px" }}
      />
    </div>
  );
};
export default Calculator;
