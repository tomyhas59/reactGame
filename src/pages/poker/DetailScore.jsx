import styled from "styled-components";
import { usePokerStore } from "../../stores/pokerStore";
import { getCardLabel } from "./Hand";

const DetailScore = () => {
  const { scoreDetail, playerJokers } = usePokerStore();

  const hasAllFace = playerJokers.some((j) => j.effect === "all-face");

  return (
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
        <Label>
          조커 보너스
          {hasAllFace && (
            <span style={{ color: "red", fontSize: "12px" }}>(all-face)</span>
          )}
        </Label>
        <Value>{scoreDetail?.bonus}</Value>
      </Row>
      <Row>
        <Label>족보 배수</Label>
        <Value>x{scoreDetail?.newMultiplier}</Value>
      </Row>
      <Row>
        <Label>이번 턴 점수</Label>
        <Value>{scoreDetail?.finalScore}</Value>
      </Row>
      <Row>
        <Label style={{ color: "#d32f2f" }}>총 누적 점수</Label>
        <StrongValue>{scoreDetail?.total}</StrongValue>
      </Row>
    </DetailScoreContainer>
  );
};

export default DetailScore;

const DetailScoreContainer = styled.div`
  padding: 16px;
  width: 350px;
  background-color: #f8fff8;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  border: 2px solid #4caf50;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  @media (max-width: 600px) {
    width: 90%;
    padding: 16px 20px;
  }
`;

const Title = styled.h3`
  margin-bottom: 16px;
  font-size: 22px;
  color: #388e3c;
  border-bottom: 2px solid #c8e6c9;
  padding-bottom: 6px;
  text-align: center;
  font-weight: bold;

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const Row = styled.p`
  font-size: 16px;
  color: #333;
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px dotted #4caf50;
  @media (max-width: 600px) {
    font-size: 15px;
  }
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

  @media (max-width: 600px) {
    font-size: 17px;
  }
`;

const Equation = styled.span`
  font-family: monospace;
`;
