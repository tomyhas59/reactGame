import { create } from "zustand";

export const STAGE_SCORE = 100;
export const REMAINING_TURNS = 3;
export const DISCARD_CHANCES = 3;

export const usePokerStore = create((set, get) => ({
  isStart: false,

  deck: [],
  hand: [],
  selectedCards: [],
  scoreDetail: null,
  stageScore: null,
  remainingTurns: null,
  discardChances: null,

  isJokerChoiceOpen: false,
  playerJokers: [],

  showPlayCards: false,

  setIsStart: (value) => set({ isStart: value }),

  //setHand((prev)=> [...prev, addHand]) 가능케 하는 함수 ↓
  setDeck: (updater) =>
    set((state) => ({
      deck: typeof updater === "function" ? updater(state.deck) : updater,
    })),
  setHand: (updater) =>
    set((state) => ({
      hand: typeof updater === "function" ? updater(state.hand) : updater,
    })),

  setShowPlayCards: (value) => set({ showPlayCards: value }),
  setSelectedCards: (cards) => set({ selectedCards: cards }),
  setScoreDetail: (scoreDetail) => set({ scoreDetail }),
  setStageScore: (stageScore) => set({ stageScore }),
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

  setIsJokerChoiceOpen: (value) => set({ isJokerChoiceOpen: value }),
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
      stageScore: STAGE_SCORE,
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

  const numberToJQK = (number) => {
    if (number === 11) return "J";
    else if (number === 12) return "Q";
    else if (number === 13) return "K";
    else return number;
  };

  // 스트레이트 계열
  if (isStraight || isLowAceStraight) {
    const straightCards = isLowAceStraight ? [1, 10, 11, 12, 13] : cardNumbers;
    const highest = Math.max(cardNumbers);
    if (isFlush) {
      return {
        pokerName: `${suits[0]}${numberToJQK(
          Number(highest)
        )} 스트레이트 플러시`,
        pokerScore: 100,
        pokerCards: straightCards,
        multiplier: 20,
      };
    }
    return {
      pokerName: `${Number(Math.max(cardNumbers))} 스트레이트`,
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
      pokerName: `${numberToJQK(Number(quad))} 포카드`,
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
      pokerName: `${numberToJQK(Number(triple))}, ${numberToJQK(
        Number(pair)
      )} 풀하우스`,
      pokerScore: 60,
      pokerCards,
      multiplier: 6,
    };
  }

  // 플러시
  if (isFlush) {
    return {
      pokerName: `${suits[0]} 플러시`,
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
      pokerName: `${numberToJQK(Number(triple))} 트리플`,
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
      pokerName: `${numberToJQK(Number(pairs[0]))}, ${numberToJQK(
        Number(pairs[1])
      )} 투페어`,
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
      pokerName: `${numberToJQK(Number(pair))} 원페어`,
      pokerScore: 10,
      pokerCards,
      multiplier: 1,
    };
  }

  // 하이카드
  const highest = Math.max(...cardNumbers);

  return {
    pokerName: `${numberToJQK(highest)} 하이카드`,
    pokerScore: 5,
    pokerCards: [highest],
    multiplier: 1,
  };
};

export const calculateFinalScore = (cards, jokers) => {
  const hasEasyFlush = jokers.some((j) => j.effect === "easy-flush");

  const adjustedCards = hasEasyFlush
    ? cards.map((card) => {
        let newSuit = card.suit;
        if (card.suit === "♠️" || card.suit === "♣️") newSuit = "black";
        else if (card.suit === "♥️" || card.suit === "♦️") newSuit = "red";
        return { ...card, suit: newSuit };
      })
    : cards;

  const { pokerName, pokerScore, pokerCards, multiplier } =
    judgePoker(adjustedCards);

  const cardSum = pokerCards.reduce((sum, cardNum) => {
    return sum + Number(cardNum);
  }, 0);

  // 보너스 점수 계산
  let bonus = 0;
  const FACE_CARDS = [11, 12, 13];
  const EVEN_NUMBERS = [2, 4, 6, 8, 10];
  const FIBONACCI_NUMBERS = [2, 4, 6, 8, 10];

  const isAllFaceJoker = jokers.some((j) => j.effect === "all-face");

  jokers.forEach((joker) => {
    switch (joker.effect) {
      case "all-face":
        bonus += pokerCards.length * 10;
        break;

      case "even+50":
        pokerCards.forEach((num) => {
          if (EVEN_NUMBERS.includes(Number(num))) bonus += 50;
        });
        break;

      case "face+100":
        pokerCards.forEach((num) => {
          const n = Number(num);
          if (isAllFaceJoker || FACE_CARDS.includes(n)) {
            bonus += 100;
          }
        });
        break;
      case "easy-flush":
        /** 위에 있음 */
        break;
      case "fibonacci":
        pokerCards.forEach((num) => {
          if (FIBONACCI_NUMBERS.includes(Number(num))) bonus += 50;
        });
        break;

      default:
        console.warn(`Unhandled joker effect: ${joker.effect}`);
        break;
    }
  });

  //  multiplier 계산
  let newMultiplier = multiplier;
  jokers.forEach((joker) => {
    switch (joker.effect) {
      case "straight-x4":
        if (pokerName.includes("스트레이트")) {
          newMultiplier += 4;
        }
        break;
      case "small-card":
        if (cards.length <= 3) {
          newMultiplier += 3;
        }
        break;
      default:
        console.warn(`Unhandled joker effect: ${joker.effect}`);
        break;
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
