import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const AppLayout = ({ children }) => {
  const links = [
    { to: "baseball", label: "숫자 야구 게임" },
    { to: "calculator", label: "계산기" },
    { to: "catchMole", label: "두더지 잡기" },
    { to: "concentration", label: "카드 뒤집기" },
    { to: "findMine", label: "지뢰찾기" },
    { to: "lotto", label: "로또" },
    { to: "make2048", label: "2048게임" },
    { to: "responseCheck", label: "반응속도체크" },
    { to: "RSP", label: "가위바위보" },
    { to: "textRPG", label: "텍스트RPG" },
    { to: "wordGame", label: "끝말잇기" },
    { to: "gugudan", label: "구구단" },
  ];

  return (
    <>
      <Header>
        <Link to="/">
          <Title>심심풀이</Title>
        </Link>
      </Header>
      <MainWrapper>
        <Aside>
          <ul>
            {links.map((link, index) => (
              <Link to={link.to} key={index}>
                <li>{link.label}</li>
              </Link>
            ))}
          </ul>
        </Aside>
        <ContentWrapper>{children}</ContentWrapper>
      </MainWrapper>
    </>
  );
};

export default AppLayout;

const Header = styled.header`
  text-align: center;
  padding: 10px;
  top: 0;
  width: 100%;
  height: 70px;
  z-index: 2000;
  background-color: #444;
  color: #fff;
  font-family: "Arial", sans-serif;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(0, 0, 0, 0.05);
  & a {
    text-decoration: none;
    color: #fff;
  }
`;

const Title = styled.div`
  width: 100%;
  margin: 0 auto;
  color: #ff0;
  text-shadow: 3px 3px #f00;
  font-size: 50px;
  font-family: "Arial", sans-serif;
  &:hover {
    color: #f00;
    text-shadow: 3px 3px #ff0;
  }
`;

const MainWrapper = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 15% 70%;
  grid-column-gap: 30px;

  @media (max-width: 750px) {
    grid-template-columns: 25% 75%;
  }
`;

const Aside = styled.aside`
  padding-top: 25px;
  background-color: #444;
  & ul {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr;
    @media (max-width: 750px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  & ul > a {
    text-align: center;
    text-decoration: none;
    color: #fff;
    margin-bottom: 10px;
    font-family: "Arial", sans-serif;
  }
  & ul > a > li {
    background-color: #4caf50;
    text-align: center;
    list-style: none;
    border: 1px solid #fff;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 2px #666;
    cursor: pointer;
    &:hover {
      background-color: #45a049;
    }
    @media (max-width: 750px) {
      width: 1rem;
      height: 8rem;
    }
  }
`;

const ContentWrapper = styled.article`
  padding: 20px;
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  font-family: "Arial", sans-serif;
  font-size: 1.2rem;
`;
