export const JOKER_CARDS = [
  {
    id: "1",
    name: "스트레이트 x2",
    description: "스트레이트 족보일 때 점수 2배",
    effect: "straight-x2",
  },
  {
    id: "2",
    name: "이지 플러시",
    description:
      "다이아, 하트를 같은 문양 취급, 클로버, 스페이드를 같은 문양 취급",
    effect: "easy-flush",
  },
  {
    id: "3",
    name: "짝수 +5",
    description: "2,4,6,8,10 카드마다 +5",
    effect: "even+5",
  },
  {
    id: "4",
    name: "그림",
    description: "J, Q, K 카드마다 +10",
    effect: "face+10",
  },
  {
    id: "5",
    name: "올그림",
    description: "모든 카드를 그림 카드 취급",
    effect: "all-face",
  },
];
