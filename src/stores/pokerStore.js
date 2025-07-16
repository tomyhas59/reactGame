import { create } from "zustand";

export const STAGE_SCORE = 500;
export const REMAINING_TURNS = 3;
export const DISCARD_CHANCES = 3;

export const usePokerStore = create((set, get) => ({
  deck: [],
  hand: [],
  selectedCards: [],
  scoreDetail: null,
  stage: null,
  remainingTurns: null,
  discardChances: null,
  playerJokers: [],

  setDeck: (deck) => set({ deck }),
  setHand: (hand) => set({ hand }),
  setSelectedCards: (cards) => set({ selectedCards: cards }),
  setScoreDetail: (newScore) =>
    set((state) => {
      if (newScore === null) {
        // 초기화
        return { scoreDetail: null };
      }

      const currentTotal = state.scoreDetail?.total || 0;
      const updatedTotal = currentTotal + newScore.finalScore;

      return {
        scoreDetail: {
          ...newScore,
          total: updatedTotal,
        },
      };
    }),

  setStage: (stage) => set({ stage }),
  setRemainingTurns: (updater) =>
    set((state) => ({
      remainingTurns:
        typeof updater === "function" ? updater(state.remainingTurns) : updater,
    })),
  setDiscardChances: (updater) =>
    set((state) => ({
      discardChances:
        typeof updater === "function" ? updater(state.discardChances) : updater,
    })),
  addPlayerJoker: (joker) =>
    set((state) => ({
      playerJokers: [...state.playerJokers, joker],
    })),

  // 게임 시작 시 덱 생성, 셔플, 8장 뽑기
  startNewGame: () => {
    const newDeck = shuffle(generateDeck());
    set({
      deck: newDeck.slice(8),
      hand: newDeck.slice(0, 8),
      selectedForPlay: [],
      selectedForDiscard: [],
      totalScore: 0,
      stage: STAGE_SCORE,
      remainingTurns: REMAINING_TURNS,
      discardChances: DISCARD_CHANCES,
      playerJokers: [],
      scoreDetail: null,
    });
  },

  toggleSelectCards: (card) =>
    set((state) => {
      const exists = state.selectedCards.find((c) => c.id === card.id);
      if (!exists && state.selectedCards.length >= 5) {
        return {};
      }
      return {
        selectedCards: exists
          ? state.selectedCards.filter((c) => c.id !== card.id)
          : [...state.selectedCards, card],
      };
    }),
}));

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

//족보 판단
const judgePoker = (cards) => {
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
        multiplier: 20,
      };
    }
    return {
      pokerName: "스트레이트",
      pokerScore: 40,
      pokerCards: straightCards,
      multiplier: 4,
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
      multiplier: 10,
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
      multiplier: 6,
    };
  }

  // 플러시
  if (isFlush) {
    return {
      pokerName: "플러시",
      pokerScore: 50,
      pokerCards: cardNumbers,
      multiplier: 5,
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
      multiplier: 3,
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
      multiplier: 2,
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
      multiplier: 1,
    };
  }

  // 하이카드
  const highest = Math.max(...cardNumbers);
  return {
    pokerName: "하이카드",
    pokerScore: 5,
    pokerCards: [highest],
    multiplier: 1,
  };
};

export const calculateFinalScore = (cards, jokers) => {
  const { pokerName, pokerScore, pokerCards, multiplier } = judgePoker(cards);

  const cardSum = pokerCards.reduce((sum, cardNum) => {
    return sum + Number(cardNum);
  }, 0);

  // 보너스 점수 계산
  let bonus = 0;
  jokers.forEach((joker) => {
    if (joker.effect === "all-face") {
      bonus += pokerCards.length * 10;
    }
    if (joker.effect === "even+50") {
      pokerCards.forEach((cardNum) => {
        if ([2, 4, 6, 8, 10].includes(Number(cardNum))) bonus += 50;
      });
    }
    if (joker.effect === "face+100") {
      pokerCards.forEach((cardNum) => {
        if ([11, 12, 13].includes(Number(cardNum))) bonus += 100;
      });
    }
  });

  //  multiplier 계산
  let newMultiplier = multiplier;
  jokers.forEach((joker) => {
    if (joker.effect === "straight-x4") {
      if (pokerName.includes("스트레이트")) {
        newMultiplier += 4;
      }
    }
  });

  // 최종 점수
  const baseScore = pokerScore + cardSum + bonus;
  const finalScore = baseScore * newMultiplier;
  return {
    pokerName,
    pokerScore,
    cardSum,
    bonus,
    newMultiplier,
    finalScore,
    pokerCards,
  };
};

//카드 모양 정의
export const cardPattern = {
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
