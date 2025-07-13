import { create } from "zustand";
import { generateDeck, shuffle } from "../pages/poker";

export const usePokerStore = create((set, get) => ({
  deck: [],
  hand: [],
  selectedForPlay: [],
  selectedForDiscard: [],
  totalScore: 0,
  stage: 1,
  remainingTurns: 3,
  discardChances: 3,
  playerJokers: [],

  setDeck: (deck) => set({ deck }),
  setHand: (hand) => set({ hand }),
  setSelectedForPlay: (cards) => set({ selectedForPlay: cards }),
  setSelectedForDiscard: (cards) => set({ selectedForDiscard: cards }),
  setTotalScore: (score) => set({ totalScore: score }),
  setStage: (stage) => set({ stage }),
  setRemainingTurns: (turns) => set({ remainingTurns: turns }),
  setDiscardChances: (chances) => set({ discardChances: chances }),
  setPlayerJokers: (jokers) => set({ playerJokers: jokers }),

  // 게임 시작 시 덱 생성, 셔플, 8장 뽑기
  startNewGame: () => {
    const newDeck = shuffle(generateDeck());
    set({
      deck: newDeck.slice(8),
      hand: newDeck.slice(0, 8),
      selectedForPlay: [],
      selectedForDiscard: [],
      totalScore: 0,
      stage: 1,
      remainingTurns: 3,
      discardChances: 3,
      playerJokers: [],
    });
  },

  // 나중에 필요한 카드 선택, 버리기, 플레이 함수 등 추가 가능
}));
