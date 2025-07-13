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

export const judgeYaku = (cards) => {
  const nums = cards.map((card) => card.number).sort((a, b) => a - b);
  const suits = cards.map((card) => card.suit);

  const countNumbers = (cards) => {
    return cards.reduce((acc, card) => {
      acc[card.number] = (acc[card.number] || 0) + 1;
      return acc;
    }, {});
  };

  const counts = Object.values(countNumbers(cards));
  const isOnePair = counts.filter((count) => count === 2).length === 1;
  const isTwoPair = counts.filter((count) => count === 2).length === 2;
  const isTriple = counts.filter((count) => count === 3).length === 1;
  const isFourCard = counts.filter((count) => count === 4).length === 1;
  const isFullHouse = isOnePair && isTriple;

  // 기본 스트레이트 판정
  let isStraight = nums.every((n, i) => i === 0 || n === nums[i - 1] + 1);

  // A-10-J-Q-K 스트레이트 판정 (1,10,11,12,13)
  const isLowAceStraight =
    JSON.stringify(nums) === JSON.stringify([1, 10, 11, 12, 13]);

  const isFlush = suits.every((s) => s === suits[0]);

  if (isStraight || isLowAceStraight) {
    if (isFlush) return { yakuName: "스트레이트 플러시", yakuScore: 100 };
    return { yakuName: "스트레이트", yakuScore: 40 };
  }

  if (isFourCard) return { yakuName: "포카드", yakuScore: 80 };
  if (isFullHouse) return { yakuName: "풀하우스", yakuScore: 60 };
  if (isFlush) return { yakuName: "플러시", yakuScore: 50 };
  if (isTriple) return { yakuName: "트리플", yakuScore: 30 };
  if (isTwoPair) return { yakuName: "투페어", yakuScore: 20 };
  if (isOnePair) return { yakuName: "원페어", yakuScore: 10 };

  return { yakuName: "하이카드", yakuScore: 5 };
};

export const calculateFinalScore = (cards, jokers) => {
  const { yakuName, yakuScore } = judgeYaku(cards);

  // 카드 숫자 합계 (올그림 효과 처리)
  const hasAllFace = jokers.some((j) => j.effect === "all-face");
  const cardSum = cards.reduce((sum, card) => {
    const value = hasAllFace ? card.number + 10 : card.number;
    return sum + value;
  }, 0);

  // 보너스 점수 계산
  let bonus = 0;
  jokers.forEach((joker) => {
    if (joker.effect === "even+5") {
      cards.forEach((card) => {
        if ([2, 4, 6, 8, 10].includes(card.number)) bonus += 5;
      });
    }
    if (joker.effect === "face+10") {
      cards.forEach((card) => {
        if ([11, 12, 13].includes(card.number)) bonus += 10;
      });
    }
  });

  // 3️ multiplier 계산
  let multiplier = 1;
  jokers.forEach((joker) => {
    if (joker.effect === "straight-x2") {
      if (yakuName.includes("스트레이트")) {
        multiplier *= 2;
      }
    }
  });

  // 최종 점수
  const baseScore = yakuScore + cardSum + bonus;
  const finalScore = baseScore * multiplier;
  return {
    yakuName,
    yakuScore,
    cardSum,
    bonus,
    multiplier,
    finalScore,
  };
};

const Poker = () => {
  const deck = usePokerStore((state) => state.deck);
  const hand = usePokerStore((state) => state.hand);
  const startNewGame = usePokerStore((state) => state.startNewGame);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  return (
    <Container>
      <h1>포커 게임</h1>
      <div>
        <h2>내 카드 (8장)</h2>
        <ul>
          {hand.map((card) => (
            <li key={card.id}>
              {card.suit} {card.number}
            </li>
          ))}
        </ul>
        <div>남은 덱: {deck.length}</div>
      </div>
      {/* 여기에 카드 선택, 버리기, 플레이 버튼 UI 추가 가능 */}
    </Container>
  );
};

export default Poker;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  height: 100vh;
`;
