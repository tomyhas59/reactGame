import { useState } from "react";
import useInput from "../hooks/useInput";
import styled from "styled-components";

const TextRPG = () => {
  const [text, onChangeText, setText] = useInput();
  const [start, setStart] = useState(false);
  const [main, setMain] = useState(true);
  const [adventure, setAdventure] = useState(false);
  const [hero, setHero] = useState(null);
  const [monster, setMonster] = useState(null);
  const [message, setMessage] = useState("");

  const monsterList = [
    { name: "슬라임", hp: 25, att: 10, xp: 10 },
    { name: "스켈레톤", hp: 50, att: 15, xp: 20 },
    { name: "마왕", hp: 155, att: 35, xp: 60 },
  ];

  // ===== 유닛 생성 헬퍼
  const createUnit = (name, hp, att, xp, lev = 1) => ({
    name,
    maxHp: hp,
    hp,
    xp,
    att,
    lev,
    attack(target) {
      target.hp -= this.att;
    },
    getXp(gainedXp) {
      this.xp += gainedXp;
      let leveledUp = false;
      while (this.xp >= this.lev * 15) {
        this.xp -= this.lev * 15;
        this.lev += 1;
        this.maxHp += 5;
        this.att += 5;
        this.hp = this.maxHp;
        leveledUp = true;
      }
      return leveledUp;
    },
  });

  // ===== 주인공 생성
  const createHero = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      alert("주인공 이름을 입력하세요");
      return;
    }

    const newHero = createUnit(text.trim(), 100, 10, 0);
    setHero(newHero);
    setStart(true);
    setMain(false);
    setMessage("");
  };

  // ===== 몬스터 생성
  const createMonster = () => {
    const randomIndex = Math.floor(Math.random() * monsterList.length);
    const randomMonsterData = monsterList[randomIndex];
    const newMonster = createUnit(
      randomMonsterData.name,
      randomMonsterData.hp,
      randomMonsterData.att,
      randomMonsterData.xp
    );
    setMonster(newMonster);
  };

  // ===== 모험 시작
  const startAdventure = () => {
    createMonster();
    setAdventure(true);
    setStart(false);
    setMessage("몬스터를 만났다!");
  };

  // ===== 공격
  const attack = () => {
    if (!hero || !monster) return;

    // Hero attacks monster
    const updatedHero = { ...hero };
    const updatedMonster = { ...monster };
    updatedHero.attack(updatedMonster);

    if (updatedMonster.hp <= 0) {
      const xp = updatedMonster.xp;
      const leveledUp = updatedHero.getXp(xp);
      setHero({ ...updatedHero });
      setMonster(null);
      setAdventure(false);
      setStart(true);
      setMessage(
        `${updatedMonster.name}을(를) 처치! 경험치 +${xp} ${
          leveledUp ? `\n레벨업! 레벨 ${updatedHero.lev}` : ""
        }`
      );
      return;
    }

    // Monster counterattacks
    updatedMonster.attack(updatedHero);

    if (updatedHero.hp <= 0) {
      setHero(null);
      setMonster(null);
      setAdventure(false);
      setStart(false);
      setMain(true);
      setText("");
      setMessage(`${hero.lev} 레벨에서 전사했습니다. 새 주인공을 생성하세요.`);
      return;
    }

    setHero(updatedHero);
    setMonster(updatedMonster);
    setMessage(
      `${updatedHero.name}이(가) ${updatedMonster.name}에게 피해를 입혔습니다.`
    );
  };

  // ===== 회복
  const heal = () => {
    if (!hero || !monster) return;

    const updatedHero = { ...hero };
    if (updatedHero.hp === updatedHero.maxHp) {
      setMessage("체력이 이미 가득 찼습니다!");
      return;
    }

    updatedHero.hp = Math.min(updatedHero.maxHp, updatedHero.hp + 20);
    updatedHero.hp -= monster.att;

    if (updatedHero.hp <= 0) {
      setHero(null);
      setMonster(null);
      setAdventure(false);
      setStart(false);
      setMain(true);
      setText("");
      setMessage(`${hero.lev} 레벨에서 전사했습니다. 새 주인공을 생성하세요.`);
      return;
    }

    setHero(updatedHero);
    setMessage(`HP 20 회복! 몬스터의 공격으로 ${monster.att} 피해를 입음`);
  };

  // ===== 도망
  const escape = () => {
    setAdventure(false);
    setStart(true);
    setMonster(null);
    setMessage("무사히 도망쳤습니다!");
  };

  // ===== 휴식
  const rest = () => {
    if (!hero) return;
    const updatedHero = { ...hero, hp: hero.maxHp };
    setHero(updatedHero);
    setMessage("휴식을 취해 체력을 모두 회복했습니다.");
  };

  // ===== 게임 종료
  const quit = () => {
    setHero(null);
    setMonster(null);
    setAdventure(false);
    setStart(false);
    setMain(true);
    setMessage("");
    setText("");
  };

  // ===== 화면 렌더링
  if (main) {
    return (
      <StyledForm onSubmit={createHero}>
        <StyledInput
          placeholder="주인공 이름을 입력하세요"
          value={text}
          onChange={onChangeText}
        />
        <GreenButton type="submit">시작</GreenButton>
        <Message>{message}</Message>
      </StyledForm>
    );
  }

  if (start) {
    return (
      <Container>
        <StyledHeader>{hero.name} 모험 시작!</StyledHeader>
        <Stats hero={hero} />
        <RedButton onClick={startAdventure}>모험</RedButton>
        <BlueButton onClick={rest}>휴식</BlueButton>
        <GrayButton onClick={quit}>종료</GrayButton>
        <Message>{message}</Message>
      </Container>
    );
  }

  if (adventure && monster) {
    return (
      <Container>
        <Stats hero={hero} />
        <AdventureInfo>
          {monster.name} - HP: {monster.hp}/{monster.maxHp} ATT: {monster.att}
        </AdventureInfo>
        <RedButton onClick={attack}>공격</RedButton>
        <GreenButton onClick={heal}>회복</GreenButton>
        <GrayButton onClick={escape}>도망</GrayButton>
        <Message>{message}</Message>
      </Container>
    );
  }

  return null;
};

export default TextRPG;

// ===== Stats 컴포넌트
const Stats = ({ hero }) => (
  <>
    <StyledInfo>레벨: {hero.lev}</StyledInfo>
    <StyledInfo>
      HP: {hero.hp}/{hero.maxHp}
    </StyledInfo>
    <StyledInfo>
      XP: {hero.xp}/{15 * hero.lev}
    </StyledInfo>
    <StyledInfo>ATT: {hero.att}</StyledInfo>
  </>
);

// ===== Styled Components
const Container = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: #45a049;
  }
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  min-height: 100vh;
`;

const Message = styled.div`
  margin-top: 15px;
  white-space: pre-wrap;
`;

const AdventureInfo = styled.div`
  margin-top: 20px;
`;

const RedButton = styled(Button)`
  background-color: #f44336;
  &:hover {
    background-color: #d32f2f;
  }
`;

const BlueButton = styled(Button)`
  background-color: #2196f3;
  &:hover {
    background-color: #1976d2;
  }
`;

const GrayButton = styled(Button)`
  background-color: #9e9e9e;
  &:hover {
    background-color: #757575;
  }
`;

const GreenButton = styled(Button)`
  background-color: #4caf50;
  &:hover {
    background-color: #45a049;
  }
`;

const StyledHeader = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StyledInfo = styled.div`
  margin-top: 8px;
  font-size: 18px;
`;
