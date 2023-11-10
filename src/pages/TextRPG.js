import React, { useState } from "react";
import useInput from "../hooks/useInput";

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

  function createUnit(name, hp, att, xp) {
    return {
      name: name,
      maxHp: hp,
      hp: hp,
      xp: xp,
      att: att,
    };
  }

  function createHero(name) {
    if (!name) return;
    setText(name);
    setStart(true);
    setMain(false);
    const hero = createUnit(name, 100, 10, 0);
    hero.lev = 1;

    hero.attack = function (target) {
      target.hp -= hero.att;
    };

    hero.getXp = function (xp) {
      this.xp += xp;
      if (this.xp >= this.lev * 15) {
        this.xp -= this.lev * 15;
        this.lev += 1;
        this.maxHp += 5;
        this.att += 5;
        this.hp = this.maxHp;
        setMessage(`레벨 업! 레벨${this.lev}`);
      }
    };
    setHero(hero);
  }

  function createMonster(randomMonster) {
    const { name, hp, att, xp } = randomMonster;
    const newMonster = createUnit(name, hp, att, xp);

    newMonster.attack = function (target) {
      target.hp -= att;
    };
    setMonster(newMonster);
  }

  const startAdventure = () => {
    setAdventure(true);
    setStart(false);
    const randomIndex = Math.floor(Math.random() * monsterList.length);
    const randomMonster = monsterList[randomIndex];
    createMonster(randomMonster);
    setMessage(`몬스터와 마주쳤다. ${randomMonster.name}인 것 같다`);
  };

  //공격 회복 도망--------------------------------------------------
  const attack = (hero, monster) => {
    hero.attack(monster); // 주인공이 몬스터를 공격
    if (monster.hp <= 0) {
      const xp = monster.xp;
      setMessage(`${monster.name}을(를) 처치했습니다! 경험치 +${xp}`);
      hero.getXp(xp); // 주인공의 경험치 증가
      setMonster(null);
      setStart(true);
      setAdventure(false);
    } else {
      // 몬스터가 살아있는 경우, 몬스터가 주인공을 공격
      monster.attack(hero); // 몬스터가 주인공을 공격
      setMessage(`${hero.name}은(는) ${monster.name}에게 피해를 입었습니다.`);
    }
    if (hero.hp <= 0) {
      quit();
      setMessage(`${hero.lev}레벨에서 전사, 새 주인공을 생성하세요`);
      return;
    }
    setHero({ ...hero }); // 주인공 상태 업데이트
    setMonster({ ...monster }); // 몬스터 상태 업데이트
  };

  const heal = (hero, monster) => {
    if (hero.hp === hero.maxHp) {
      setMessage("체력이 가득 차 있습니다");
      return;
    }
    hero.hp = Math.min(hero.maxHp, hero.hp + 20);
    hero.hp -= monster.att;
    setMessage(`HP 20 회복하고 ${monster.att}의 대미지를 입었습니다`);
    if (hero.hp <= 0) {
      quit();
      setMessage(`${hero.lev}레벨에서 전사, 새 주인공을 생성하세요`);
      return;
    }
    setHero({ ...hero });
  };

  const escape = () => {
    setStart(true);
    setAdventure(false);
    setMonster(null);
    setMessage("부리나케 도망쳤다");
  };

  const rest = (hero) => {
    hero.hp = hero.maxHp;
    setHero({ ...hero });
    setMessage("충분한 휴식을 취했다.");
  };

  function quit() {
    setHero(null);
    setMonster(null);
    setAdventure(false);
    setStart(false);
    setMain(true);
    setMessage("");
  }

  if (start) {
    return (
      <>
        <div>{text} 모험 시작</div>
        <div>레벨 : {hero.lev}</div>
        <div>
          HP: {hero.hp}/{hero.maxHp}
        </div>
        <div>
          XP: {hero.xp}/{15 * hero.lev}
        </div>
        <div>ATT: {hero.att}</div>
        <button onClick={startAdventure}>모험</button>
        <button onClick={() => rest(hero)}>휴식</button>
        <button onClick={quit}>종료</button>
        <div>{message}</div>
      </>
    );
  } else if (adventure) {
    return (
      <>
        <div>레벨 : {hero.lev}</div>
        <div>
          HP: {hero.hp}/{hero.maxHp}
        </div>
        <div>
          XP: {hero.xp}/{15 * hero.lev}
        </div>
        <div>ATT: {hero.att}</div>
        <button onClick={() => attack(hero, monster)}>공격</button>
        <button onClick={() => heal(hero, monster)}>회복</button>
        <button onClick={escape}> 도망</button>
        <div>{message}</div>
        <div>
          {monster.name}: HP:{monster.hp}/{monster.maxHp} ATT:{monster.att}
        </div>
      </>
    );
  } else if (main) {
    return (
      <form onSubmit={() => createHero(text)}>
        <input
          placeholder="주인공 이름을 입력하세요"
          value={text}
          onChange={onChangeText}
        />
        <button>시작</button>
        <div>{message}</div>
      </form>
    );
  }
};

export default TextRPG;
