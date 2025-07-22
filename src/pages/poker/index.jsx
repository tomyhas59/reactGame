import { styled } from "styled-components";
import {
  DISCARD_CHANCES,
  generateDeck,
  REMAINING_TURNS,
  shuffle,
  usePokerStore,
} from "../../stores/pokerStore";
import { useCallback, useEffect, useRef, useState } from "react";
import Hand from "./Hand";
import DetailScore from "./DetailScore";
import ButtonGroup from "./ButtonGroup";
import RemainDeck from "./RemainDeck";
import Header from "./Header";
import JokerPanel from "./JokerPanel";
import JokerChoiceModal from "./JokerChoiceModal";
import gsap from "gsap";
import Card from "./Card";

export const Poker = () => {
  const {
    startNewGame,
    selectedCards,
    stage,
    remainingTurns,
    scoreDetail,
    addPlayerJoker,
    setStage,
    setRemainingTurns,
    setDeck,
    setHand,
    setScoreDetail,
    setDiscardChances,
    showYaku,
  } = usePokerStore();

  const [isStart, setIsStart] = useState(false);
  const [isJokerChoiceOpen, setIsJokerChoiceOpen] = useState(false);
  const [animCard, setAnimCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const deckRef = useRef(null);
  const slotsRef = useRef([]);
  slotsRef.current = [];

  const pokerCards = scoreDetail?.pokerCards ?? [];
  const pokerName = scoreDetail?.pokerName ?? "";

  const addSlotRef = (el) => {
    if (el && !slotsRef.current.includes(el)) slotsRef.current.push(el);
  };

  const startButton = useCallback(() => {
    setIsStart(true);
    startNewGame();
  }, [startNewGame]);

  const handleJokerSelect = useCallback(
    (joker) => {
      addPlayerJoker(joker);
      setStage(stage * 2);
      setRemainingTurns(REMAINING_TURNS);
      setIsJokerChoiceOpen(false);
      setDiscardChances(DISCARD_CHANCES);
      const newDeck = shuffle(generateDeck());
      setHand(newDeck.slice(0, 8));
      setDeck(newDeck.slice(8));
      setScoreDetail(null);
    },
    [
      setScoreDetail,
      addPlayerJoker,
      setStage,
      setRemainingTurns,
      stage,
      setDeck,
      setDiscardChances,
      setHand,
    ]
  );

  // 스테이지 성공 시 조커 선택 모달 띄우기

  useEffect(() => {
    if (stage <= scoreDetail?.total) {
      setTimeout(() => {
        alert("성공");
        setIsJokerChoiceOpen(true);
      }, 5000);
    }
  }, [stage, scoreDetail]);

  useEffect(() => {
    if (remainingTurns === 0 && scoreDetail?.total != null) {
      setTimeout(() => {
        if (stage > scoreDetail.total) {
          alert("실패");
          setIsStart(false);
        } else {
          setIsJokerChoiceOpen(true);
        }
      }, 5000);
    }
  }, [remainingTurns, stage, scoreDetail, startNewGame]);

  const animateDrawCard = useCallback((card, targetIndex) => {
    return new Promise((resolve) => {
      if (!deckRef.current || !slotsRef.current[targetIndex]) {
        resolve();
        return;
      }
      const deckRect = deckRef.current.getBoundingClientRect();
      const slotRect = slotsRef.current[targetIndex].getBoundingClientRect();

      setAnimCard({
        card,
        startX: deckRect.left,
        startY: deckRect.top,
        endX: slotRect.left,
        endY: slotRect.top,
        key: card.id,
      });

      requestAnimationFrame(() => {
        const animEl = document.getElementById(`anim-card-${card.id}`);
        if (!animEl) {
          resolve();
          return;
        }
        gsap.set(animEl, { x: 0, y: 0, opacity: 1 });
        gsap.to(animEl, {
          duration: 0.3,
          x: slotRect.left - deckRect.left,
          y: slotRect.top - deckRect.top,
          ease: "power2.out",
          onComplete: () => {
            resolve();
          },
        });
      });
    });
  }, []);

  if (!isStart) {
    return (
      <Container>
        <StartButton onClick={startButton}>게임 시작</StartButton>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Middle>
        <DetailScore />
        <JokerPanel />
      </Middle>
      {showYaku && (
        <ShowYakuWrapper>
          <CardWrapper>
            {selectedCards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </CardWrapper>
          <YakuName>{pokerName}</YakuName>
        </ShowYakuWrapper>
      )}
      <RemainDeck deckRef={deckRef} />
      <Bottom>
        <HandSection>
          <Hand addSlotRef={addSlotRef} />
          <ButtonGroup
            animateDrawCard={animateDrawCard}
            setAnimCard={setAnimCard}
            setIsAnimating={setIsAnimating}
            isAnimating={isAnimating}
          />
        </HandSection>
      </Bottom>
      {isJokerChoiceOpen && (
        <JokerChoiceModal
          onSelect={handleJokerSelect}
          onClose={() => setIsJokerChoiceOpen(false)}
        />
      )}
      {animCard && (
        <AnimCard
          id={`anim-card-${animCard.key}`}
          style={{
            position: "fixed",
            left: animCard.startX,
            top: animCard.startY,
          }}
        >
          <Card card={animCard.card} idx={animCard.card.id} />
        </AnimCard>
      )}
    </Container>
  );
};

export default Poker;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 5px;
`;

const Middle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Bottom = styled.div`
  margin-top: 10px;
`;

const HandSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const StartButton = styled.button`
  padding: 14px 28px;
  margin: 100px auto;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #388e3c;
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    width: 50%;
    font-size: 16px;
    padding: 12px 20px;
  }
`;

const AnimCard = styled.div`
  width: 120px;
  height: 170px;
  position: fixed;
  border-radius: 10px;
  background-color: #1565c0;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  user-select: none;
  z-index: 9999;
  @media (max-width: 1200px) {
    width: 90px;
    height: 120px;
  }

  @media (max-width: 800px) {
    width: 70px;
    height: 100px;
  }
`;

const ShowYakuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 30px;
  gap: 12px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 24px;
  background: rgba(41, 42, 119, 0.9);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 9999;
`;

const CardWrapper = styled.div`
  display: flex;
`;
const YakuName = styled.h3`
  font-size: 32px;
  font-weight: bold;
  color: #ffeb3b;
  text-shadow: 0 0 10px rgba(255, 235, 59, 0.8),
    0 0 20px rgba(255, 235, 59, 0.6);
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.9;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;
