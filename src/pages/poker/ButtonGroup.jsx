import styled from "styled-components";
import { calculateFinalScore, usePokerStore } from "../../stores/pokerStore";
import { useState } from "react";

const ButtonGroup = ({
  isAnimating,
  animateDrawCard,
  setAnimCard,
  setIsAnimating,
}) => {
  const {
    deck,
    hand,
    selectedCards,
    setDeck,
    setHand,
    setScoreDetail,
    setSelectedCards,
    playerJokers,
    setRemainingTurns,
    setDiscardChances,
    setShowYaku,
    stageScore,
    setIsStart,
    setIsJokerChoiceOpen,
  } = usePokerStore();

  const [totalScore, setTotalScore] = useState(0);

  const isCardSelected = selectedCards.length > 0;
  const hasEnoughDeck = deck.length >= selectedCards.length;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //선택된 카드를 버리고 새로 뽑는 애니메이션
  const drawAndUpdateCard = async () => {
    if (isAnimating || !isCardSelected || !hasEnoughDeck) {
      alert(
        !isCardSelected
          ? "카드를 선택하세요"
          : !hasEnoughDeck
          ? "덱에 카드가 부족합니다"
          : ""
      );
      return;
    }

    setIsAnimating(true);

    const cardsToDraw = deck.slice(0, selectedCards.length);
    const newHand = hand.filter((card) => !selectedCards.includes(card));
    setHand(newHand);

    let remainingDeck = deck.slice(selectedCards.length);

    // 카드 한 장씩 뽑고 애니메이션 적용
    for (let i = 0; i < cardsToDraw.length; i++) {
      await animateDrawCard(cardsToDraw[i], newHand.length + i);
      setHand((prev) => [...prev, cardsToDraw[i]]);
      remainingDeck = remainingDeck.slice(1);
      setDeck(remainingDeck);
      await delay(100);
    }

    setAnimCard(null);
    setIsAnimating(false);
    setSelectedCards([]);
    setShowYaku(false);
  };

  const handlePlay = () => {
    if (!isCardSelected) return alert("플레이할 카드를 선택하세요.");

    const remainingTurns = usePokerStore.getState().remainingTurns;
    if (remainingTurns <= 0) return;

    const result = calculateFinalScore(selectedCards, playerJokers);
    setScoreDetail(result);
    setShowYaku(true);

    const nextScore = totalScore + result.finalScore;
    setTotalScore(nextScore);
    setRemainingTurns((prev) => prev - 1);

    // 성공/실패 판정 후 카드 리플레이
    setTimeout(() => {
      const isLastTurn = remainingTurns === 1;
      const isClear = nextScore >= stageScore;

      if (isClear) {
        alert("성공");
        setIsJokerChoiceOpen(true);
        setShowYaku(false);
        setSelectedCards([]);
        setTotalScore(0);
        return;
      }

      if (isLastTurn && !isClear) {
        alert("실패");
        setIsStart(false);
        setShowYaku(false);
        setSelectedCards([]);
        setTotalScore(0);
        return;
      }

      drawAndUpdateCard();
    }, 3000);
  };

  const handleDiscard = () => {
    if (!isCardSelected) return alert("버릴 카드를 선택하세요.");

    const discardChances = usePokerStore.getState().discardChances;
    if (discardChances <= 0) return;

    setDiscardChances((prev) => prev - 1);
    drawAndUpdateCard();
  };

  return (
    <ButtonGroupContainer>
      <button onClick={handlePlay}>플레이</button>
      <button onClick={handleDiscard}>버리기</button>
    </ButtonGroupContainer>
  );
};

export default ButtonGroup;

const ButtonGroupContainer = styled.div`
  display: flex;
  gap: 12px;

  button {
    flex: 1 1 auto;
    min-width: 120px;
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

  @media (max-width: 600px) {
    button {
      flex: 1 1 100%;
      font-size: 14px;
      padding: 10px;
    }
  }
`;
