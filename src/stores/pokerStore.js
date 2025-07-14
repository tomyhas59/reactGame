import { create } from "zustand";
import { generateDeck, shuffle } from "../pages/poker";

export const usePokerStore = create((set, get) => ({
  deck: [],
  hand: [],
  selectedCards: [],
  scoreDetail: null,
  stage: 1,
  remainingTurns: 3,
  discardChances: 3,
  playerJokers: [],

  setDeck: (deck) => set({ deck }),
  setHand: (hand) => set({ hand }),
  setSelectedCards: (cards) => set({ selectedCards: cards }),
  setScoreDetail: (newScore) =>
    set((state) => {
      const currentTotal = state.scoreDetail?.total || 0;
      const updatedTotal = currentTotal + newScore.finalScore;

      return {
        scoreDetail: {
          ...newScore,
          total: updatedTotal, // ✅ 누적 점수 추가
        },
      };
    }),
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

  // 나중에 필요한 카드 선택, 버리기, 플레이 함수 등 추가 가능
}));
