import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

function Concentration() {
  //이미지 데이터
  const imgCount = 10;
  const colorArr = useMemo(() => {
    const importedImages = [];
    for (let i = 1; i <= imgCount; i++) {
      importedImages.push(require(`../img/animal_${i}.png`));
    }
    return importedImages;
  }, []);

  const [colors, setColors] = useState(colorArr);
  const total = 10;

  const initialCards = useCallback(() => {
    const colors = [...colorArr]; //리셋 시 color 초기화
    let randomColors = [];
    while (colors.length > 0) {
      const random = Math.floor(Math.random() * colors.length);
      randomColors = randomColors.concat(colors.splice(random, 1));
    }
    let selectedColors = randomColors.slice(0, total / 2);
    let colorCopy = [...selectedColors, ...selectedColors];
    let newShuffled = [];
    for (let i = 0; colorCopy.length > 0; i += 1) {
      const randomIndex = Math.floor(Math.random() * colorCopy.length);
      newShuffled = [...newShuffled].concat(colorCopy.splice(randomIndex, 1));
    }
    setColors(newShuffled);
    return newShuffled.map(() => false); // 모든 카드 front, false면 front
  }, [colorArr]);

  const [cards, setCards] = useState(initialCards);
  const [clicked, setClicked] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [clickable, setClickable] = useState(true);
  const [firstStart, setFirstStart] = useState(false);
  const [startTime, setStartTime] = useState();

  const handleClick = (index) => {
    if (!clickable || !firstStart) {
      return; // 클릭 불가능할 때 함수를 실행하지 않음
    }
    if (!cards[index] && clicked.length < 2) {
      // 클릭한 카드가 back이고 클릭된 카드가 2개 미만(2개까지 클릭 가능)
      const updatedCards = [...cards];
      updatedCards[index] = true; // front면 back으로
      setCards(updatedCards);
      // 클릭한 카드의 인덱스를 clicked 상태에 추가
      setClicked((prevClicked) => [...prevClicked, index]);
    }
  };

  useEffect(() => {
    if (clicked.length === 2) {
      // 클릭한 카드가 2개인 경우
      const [firstIndex, secondIndex] = clicked;
      if (colors[firstIndex] === colors[secondIndex]) {
        // 두 카드의 색상이 같으면
        setCompleted((prevCompleted) => [
          ...prevCompleted,
          firstIndex,
          secondIndex,
        ]);
        setClicked([]);
      } else {
        // 두 카드의 색상이 다르면 1초 후에 두 카드를 다시 뒤집음
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[firstIndex] = false;
          updatedCards[secondIndex] = false;
          setCards(updatedCards);
          setClicked([]);
        }, 1000);
      }
    }
  }, [cards, clicked, colors]);

  const startGame = useCallback(() => {
    setFirstStart(true);
    setClickable(false);
    const startCard = [...cards];
    for (let i = 0; i < cards.length; i++) {
      setTimeout(() => {
        startCard[i] = true;
        setCards([...startCard]);
      }, i * 500); // 0.5초 간격으로 카드 뒤집기
    }
    setTimeout(() => {
      setClickable(true);
      const flippedCard = [...cards];
      // 모든 카드가 다시 뒤집히도록
      for (let i = 0; i < cards.length; i++) {
        flippedCard[i] = false;
      }
      setCards([...flippedCard]);
      setStartTime(new Date());
    }, cards.length * 500 + 3000); // 모든 카드가 뒤집힌 후 3초 후에 다시 뒤집기
  }, [cards]);

  const reset = useCallback(() => {
    setClicked([]);
    setCompleted([]);
    setCards(initialCards());
    setFirstStart(false);
  }, [initialCards]);

  useEffect(() => {
    if (completed.length === total) {
      const endTime = new Date();
      setTimeout(() => {
        alert(`${(endTime - startTime) / 1000}초 성공`);
        reset();
      }, 200);
    }
  }, [completed.length, reset, startTime]);

  return (
    <Container>
      <Button onClick={startGame}>게임 시작</Button>
      {completed.length === total && <Button onClick={reset}>리셋</Button>}
      <CardGrid>
        {cards.map((isFlipped, index) => (
          <CardContainer key={index} onClick={() => handleClick(index)}>
            <Front isFlipped={isFlipped}></Front>
            <Back isFlipped={isFlipped} color={colors[index]}></Back>
          </CardContainer>
        ))}
      </CardGrid>
    </Container>
  );
}
export default Concentration;

const Container = styled.div`
  width: 100%;
  border: 1px solid;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  margin: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  @media (max-width: 750px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CardContainer = styled.div`
  width: 150px;
  height: 250px;
  perspective: 1000px; /* 원근 거리 설정 */
  cursor: pointer;
  @media (max-width: 750px) {
    width: 75px;
    height: 125px;
  }
`;

const Card = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  transition: transform 0.5s;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const Front = styled(Card)`
  background-color: #2196f3;
  transform: ${(props) =>
    props.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"};
`;

const Back = styled(Card)`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${(props) => props.color});
  transform: ${(props) =>
    props.isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)"};
`;
