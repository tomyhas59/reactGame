import React, { useState } from "react";
import useInput from "../hooks/useInput";

const TextRPG = () => {
  const [text, onChangeText, setText] = useInput();
  const [start, setStart] = useState(false);
  const [adventure, setAdeventure] = useState(false);
  const [monster, setMonster] = useState(null);
  const [message, setMessage] = useState("");

  const monsterList = [
    { name: "슬라임", hp: 25, att: 10, xp: 10 },
    { name: "스켈레톤", hp: 50, att: 15, xp: 20 },
    { name: "마왕", hp: 155, att: 35, xp: 60 },
  ];

  const startGame = () => {
    setText(text);
    setStart(true);
  };

  const startAdventure = () => {
    setAdeventure(true);
    setStart(false);
    const randomIndex = Math.floor(Math.random() * monsterList.length);
    const randomMonster = monsterList[randomIndex];
    setMonster(randomMonster.name);
    setMessage(`몬스터와 마주쳤다. ${randomMonster.name}인 것 같다`);
  };

  const escape = () => {
    setStart(true);
    setAdeventure(false);
  };

  if (start) {
    return (
      <>
        <div>{text} 모험 시작</div>
        <div>레벨 : </div>
        <div>HP: </div>
        <div>XP: </div>
        <div>ATT: </div>
        <button onClick={startAdventure}>모험</button>
        <button>휴식</button>
        <button>종료</button>
      </>
    );
  } else if (adventure) {
    return (
      <>
        <div>{message}</div>
        <button onClick={startAdventure}>공격</button>
        <button>회복</button>
        <button onClick={escape}> 도망</button>
      </>
    );
  } else {
    return (
      <form onSubmit={startGame}>
        <input
          placeholder="주인공 이름을 입력하세요"
          value={text}
          onChange={onChangeText}
        />
        <button>시작</button>
      </form>
    );
  }
};

export default TextRPG;
