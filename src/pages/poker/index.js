import { styled } from "styled-components";
import { usePokerStore } from "../../stores/pokerStore";
import { useEffect } from "react";

//52장 카드 생성
export const generateDeck = () => {
  const suits = ["♠️", "♥️", "♦️", "♣️"];
  const deck = [];

  suits.forEach((suit) => {
    for (let num = 1; num <= 13; num++) {
      deck.push({ id: `card-${num}-${suit}`, number: num, suit });
    }
  });
  return deck;
};

//셔플
export const shuffle = (deck) => {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
export const judgePoker = (cards) => {
  const cardNumbers = cards.map((card) => card.number).sort((a, b) => a - b);
  const suits = cards.map((card) => card.suit);

  const countNumbers = (cards) => {
    return cards.reduce((acc, card) => {
      acc[card.number] = (acc[card.number] || 0) + 1;
      return acc;
    }, {});
  };

  const numCounts = countNumbers(cards);
  const counts = Object.values(numCounts);

  const isOnePair = counts.filter((count) => count === 2).length === 1;
  const isTwoPair = counts.filter((count) => count === 2).length === 2;
  const isTriple = counts.filter((count) => count === 3).length === 1;
  const isFourCard = counts.filter((count) => count === 4).length === 1;
  const isFullHouse = isOnePair && isTriple;

  let isStraight =
    cardNumbers.length === 5 &&
    cardNumbers.every((n, i) => i === 0 || n === cardNumbers[i - 1] + 1);
  const isLowAceStraight =
    JSON.stringify(cardNumbers) === JSON.stringify([1, 10, 11, 12, 13]);

  const isFlush = suits.length === 5 && suits.every((s) => s === suits[0]);

  // 스트레이트 계열
  if (isStraight || isLowAceStraight) {
    const straightCards = isLowAceStraight ? [1, 10, 11, 12, 13] : cardNumbers;
    if (isFlush) {
      return {
        pokerName: "스트레이트 플러시",
        pokerScore: 100,
        pokerCards: straightCards,
      };
    }
    return {
      pokerName: "스트레이트",
      pokerScore: 40,
      pokerCards: straightCards,
    };
  }

  // 포카드
  if (isFourCard) {
    const quad = Object.keys(numCounts).find((k) => numCounts[k] === 4);
    const pokerCards = [quad, quad, quad, quad];
    return {
      pokerName: "포카드",
      pokerScore: 80,
      pokerCards,
    };
  }

  // 풀하우스
  if (isFullHouse) {
    const triple = Object.keys(numCounts).find((k) => numCounts[k] === 3);
    const pair = Object.keys(numCounts).find((k) => numCounts[k] === 2);
    const pokerCards = [triple, triple, triple, pair, pair];
    return {
      pokerName: "풀하우스",
      pokerScore: 60,
      pokerCards,
    };
  }

  // 플러시
  if (isFlush) {
    return {
      pokerName: "플러시",
      pokerScore: 50,
      pokerCards: cardNumbers,
    };
  }

  // 트리플
  if (isTriple) {
    const triple = Object.keys(numCounts).find((k) => numCounts[k] === 3);
    const pokerCards = [triple, triple, triple];

    return {
      pokerName: "트리플",
      pokerScore: 30,
      pokerCards,
    };
  }

  // 투페어
  if (isTwoPair) {
    const pairs = Object.keys(numCounts)
      .filter((k) => numCounts[k] === 2)
      .map(Number)
      .sort((a, b) => b - a);

    const pokerCards = [...pairs.flatMap((p) => [p, p])];
    return {
      pokerName: "투페어",
      pokerScore: 20,
      pokerCards,
    };
  }

  // 원페어
  if (isOnePair) {
    const pair = Object.keys(numCounts).find((k) => numCounts[k] === 2);
    const pokerCards = [pair, pair];
    return {
      pokerName: "원페어",
      pokerScore: 10,
      pokerCards,
    };
  }

  // 하이카드
  const highest = Math.max(...cardNumbers);
  return {
    pokerName: "하이카드",
    pokerScore: 5,
    pokerCards: [highest],
  };
};

export const calculateFinalScore = (cards, jokers) => {
  const { pokerName, pokerScore, pokerCards } = judgePoker(cards);

  // 카드 숫자 합계 (올그림 효과 처리)
  const hasAllFace = jokers.some((j) => j.effect === "all-face");

  const cardSum = pokerCards.reduce((sum, cardNum) => {
    const value = hasAllFace ? 10 : Number(cardNum);
    return sum + value;
  }, 0);

  // 보너스 점수 계산
  let bonus = 0;
  jokers.forEach((joker) => {
    if (joker.effect === "even+5") {
      pokerCards.forEach((card) => {
        if ([2, 4, 6, 8, 10].includes(pokerCards.number)) bonus += 5;
      });
    }
    if (joker.effect === "face+10") {
      pokerCards.forEach((card) => {
        if ([11, 12, 13].includes(pokerCards.number)) bonus += 10;
      });
    }
  });

  // 3️ multiplier 계산
  let multiplier = 1;
  jokers.forEach((joker) => {
    if (joker.effect === "straight-x2") {
      if (pokerName.includes("스트레이트")) {
        multiplier *= 2;
      }
    }
  });

  // 최종 점수
  const baseScore = pokerScore + cardSum + bonus;
  const finalScore = baseScore * multiplier;
  return {
    pokerName,
    pokerScore,
    cardSum,
    bonus,
    multiplier,
    finalScore,
    pokerCards,
  };
};

const Poker = () => {
  const {
    deck,
    hand,
    selectedCards,
    scoreDetail,
    setScoreDetail,
    stage,
    remainingTurns,
    discardChances,
    playerJokers,
    setDeck,
    setHand,
    setSelectedCards,
    setStage,
    setRemainingTurns,
    setDiscardChances,
    setPlayerJokers,
    startNewGame,
    toggleSelectCards,
  } = usePokerStore();

  // 플레이 버튼 클릭 시 선택된 카드 hand에서 제거
  const onPlay = () => {
    if (selectedCards.length === 0) return alert("플레이할 카드를 선택하세요.");

    const selectedCount = selectedCards.length;

    const newHand = hand.filter(
      (card) => !selectedCards.find((c) => c.id === card.id)
    );

    setHand(newHand);

    const drawnCards = deck.slice(0, selectedCount);
    const remainingDeck = deck.slice(selectedCount);
    const updatedHand = [...newHand, ...drawnCards];

    const resultScore = calculateFinalScore(selectedCards, playerJokers);

    setScoreDetail(resultScore);

    setTimeout(() => {
      setHand(updatedHand);
    }, 1000);
    setDeck(remainingDeck);

    setSelectedCards([]);
  };

  // 버리기 버튼 클릭 시 선택된 카드 hand에서 제거하고 덱에 넣기
  const onDiscard = () => {
    if (selectedCards.length === 0) return alert("버릴 카드를 선택하세요.");

    const selectedCount = selectedCards.length;
    // 버릴 카드들을 hand에서 제거
    const newHand = hand.filter(
      (card) => !selectedCards.find((c) => c.id === card.id)
    );

    setHand(newHand);

    const drawnCards = deck.slice(0, selectedCount);
    const remainingDeck = deck.slice(selectedCount);

    const updatedHand = [...newHand, ...drawnCards];

    setTimeout(() => {
      setHand(updatedHand);
    }, 1000);
    setDeck(remainingDeck);
    setSelectedCards([]);
  };

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const truePipPatterns = {
    1: [[2, 1]],
    2: [
      [1, 1],
      [3, 1],
    ],
    3: [
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    4: [
      [1, 0],
      [1, 2],
      [3, 0],
      [3, 2],
    ],
    5: [
      [1, 0],
      [1, 2],
      [2, 1],
      [3, 0],
      [3, 2],
    ],
    6: [
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 2],
      [3, 0],
      [3, 2],
    ],
    7: [
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 2],
      [3, 0],
      [3, 2],
      [2, 1],
    ],
    8: [
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 2],
      [3, 0],
      [3, 2],
      [1, 1],
      [3, 1],
    ],
    9: [
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 2],
      [3, 0],
      [3, 2],
      [4, 1],
      [2, 1],
    ],
    10: [
      [0, 0],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 2],
      [3, 0],
      [3, 2],
      [4, 0],
      [4, 2],
    ],
  };

  const getSuitColor = (suit) =>
    suit === "♥️" || suit === "♦️" ? "red" : "black";

  const getCardLabel = (num) => {
    if (num === 1) return "A";
    if (num === 11) return "J";
    if (num === 12) return "Q";
    if (num === 13) return "K";
    return num;
  };

  return (
    <Container>
      <div>
        <h2>내 카드 (8장)</h2>
        <CardWrapper>
          {hand.map((card) => (
            <Card
              onClick={() => toggleSelectCards(card)}
              key={card.id}
              selected={selectedCards.some((c) => c.id === card.id)}
            >
              <TopRight $suitColor={getSuitColor(card.suit)}>
                {getCardLabel(card.number)}
                <span style={{ fontSize: "8px" }}>{card.suit}</span>
              </TopRight>
              {card.number >= 11 ? (
                <JQKArt>
                  <Crown>👑</Crown>
                </JQKArt>
              ) : (
                <SuitGrid>
                  {Array.from({ length: 5 }).map((_, row) =>
                    Array.from({ length: 3 }).map((_, col) => {
                      const match = truePipPatterns[card.number]?.some(
                        ([r, c]) => r === row && c === col
                      );
                      return (
                        <Pip
                          key={`${row}-${col}`}
                          $suitColor={getSuitColor(card.suit)}
                        >
                          {match ? card.suit : ""}
                        </Pip>
                      );
                    })
                  )}
                </SuitGrid>
              )}
              <BottomLeft $suitColor={getSuitColor(card.suit)}>
                {getCardLabel(card.number)}
                <span style={{ fontSize: "8px" }}>{card.suit}</span>
              </BottomLeft>
            </Card>
          ))}
        </CardWrapper>
        <DetailScoreContainer>
          <Title>스코어 상세</Title>
          <Row>
            <Label>족보</Label>
            <Value>{scoreDetail?.pokerName}</Value>
          </Row>
          <Row>
            <Label>족보 점수</Label>
            <Value>{scoreDetail?.pokerScore}</Value>
          </Row>
          <Row>
            <Label>카드 합계</Label>
            <Value>
              {scoreDetail?.pokerCards?.length > 0 && (
                <Equation>
                  {scoreDetail.pokerCards
                    .map((num) => getCardLabel(num))
                    .join(" + ")}
                  = {scoreDetail.cardSum}
                </Equation>
              )}
            </Value>
          </Row>
          <Row>
            <Label>조커 보너스</Label>
            <Value>{scoreDetail?.bonus}</Value>
          </Row>
          <Row>
            <Label>배수</Label>
            <Value>x{scoreDetail?.multiplier}</Value>
          </Row>
          <Row>
            <Label>이번 턴 점수</Label>
            <Value>{scoreDetail?.finalScore}</Value>
          </Row>
          <Hr />
          <Row>
            <StrongValue>총 누적 점수: {scoreDetail?.total}</StrongValue>
          </Row>
        </DetailScoreContainer>
      </div>
      <ButtonGroup>
        <button onClick={onPlay}>플레이</button>
        <button onClick={onDiscard}>버리기</button>
      </ButtonGroup>
      <RemainDeckContainer>
        {deck.map((_, idx) => (
          <RemainCard key={idx} index={idx}>
            {deck.length}
          </RemainCard>
        ))}
      </RemainDeckContainer>

      {/* 여기에 카드 선택, 버리기, 플레이 버튼 UI 추가 가능 */}
    </Container>
  );
};

export default Poker;

const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 40px;
  height: 100vh;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
`;

const Card = styled.div`
  position: relative;
  width: 120px;
  height: 180px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;
  border: 2px solid ${({ selected }) => (selected ? "blue" : "gray")};
  background-color: ${({ selected }) => (selected ? "#d0eaff" : "white")};
  transition: all 0.2s ease-in-out;

  transform: ${({ selected }) =>
    selected ? "translateY(-30px)" : "translateY(0)"};
  &:hover {
    background-color: silver;
  }
`;

const TopRight = styled.div`
  font-size: 12px;
  color: ${({ $suitColor }) => $suitColor};
  text-align: right;
`;

const BottomLeft = styled.div`
  font-size: 14px;
  color: ${({ $suitColor }) => $suitColor};
  text-align: left;
`;

const SuitGrid = styled.div`
  display: grid;
  position: absolute;
  top: 10px;
  left: 15px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(5, 1fr);
  flex-grow: 1;
  padding: 4px;
  align-items: center;
  justify-items: center;
`;

const Pip = styled.span`
  font-size: 20px;
  color: ${({ $suitColor }) => $suitColor};
`;

const JQKArt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 48px;
`;

const Crown = styled.div`
  font-size: 60px;
`;

const ButtonGroup = styled.div`
  position: absolute;
  top: 2%;
  right: 30%;
  button {
    margin-right: 12px;
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 6px;
    border: none;
    background-color: #4caf50;
    color: white;
    transition: background-color 0.3s;

    &:hover {
      background-color: #45a049;
    }
  }
`;

const DetailScoreContainer = styled.div`
  margin-top: 24px;
  padding: 24px 28px;
  max-width: 420px;
  background-color: #f8fff8;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  border: 2px solid #4caf50;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: "Helvetica Neue", sans-serif;
  transition: all 0.3s ease;
`;

const Title = styled.h3`
  margin-bottom: 16px;
  font-size: 22px;
  color: #388e3c;
  border-bottom: 2px solid #c8e6c9;
  padding-bottom: 6px;
  text-align: center;
  font-weight: bold;
`;

const Row = styled.p`
  margin: 6px 0;
  font-size: 16px;
  color: #333;
  line-height: 1.4;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Label = styled.span`
  font-weight: 500;
  color: #2e7d32;
`;

const Value = styled.span`
  font-weight: 600;
  color: #1b5e20;
`;

const StrongValue = styled.strong`
  color: #d32f2f;
  font-size: 18px;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 16px 0;
  width: 100%;
`;

const Equation = styled.span`
  font-family: monospace;
`;

const RemainDeckContainer = styled.div`
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 140px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
`;

const RemainCard = styled.div`
  position: absolute;
  width: 120px;
  height: 180px;
  font-size: 36px;
  font-weight: bold;
  border-radius: 12px;
  background: linear-gradient(135deg, #1565c0, #1e88e5);
  border: 2px solid #0d47a1;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  transform: ${({ index }) => `translate(${index * 0.8}px, ${index * -0.8}px)`};
  z-index: ${({ index }) => index};
  transition: transform 0.2s ease;
  color: #fff;
  text-align: center;
  line-height: 180px;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0,
      rgba(255, 255, 255, 0.1) 8px,
      transparent 8px,
      transparent 16px
    );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 6px;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    pointer-events: none;
  }
`;
