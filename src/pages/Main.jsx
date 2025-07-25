import styled, { keyframes } from "styled-components";

const Main = () => {
  return (
    <Container>
      <WelcomeText>환영합니다</WelcomeText>
    </Container>
  );
};

export default Main;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  height: 100%;
  background: linear-gradient(135deg, #f3ec78, #af4261);
  animation: ${gradientShift} 5s ease infinite;
`;

const WelcomeText = styled.h1`
  font-size: 3rem;
  text-align: center;
  color: #fff;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  animation: ${fadeInUp} 2s ease-out forwards;
`;
