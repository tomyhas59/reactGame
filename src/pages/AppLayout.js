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
    <LayoutWrapper>
      <Header>
        <Link to="/">
          <Main>Y의 즐거운 게임 세상</Main>
        </Link>
      </Header>
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
    </LayoutWrapper>
  );
};

export default AppLayout;

const Header = styled.header`
  position: fixed;
  text-align: center;
  padding: 10px;
  top: 0;
  width: 100%;
  height: 70px;
  z-index: 2000;
  background-color: #fff;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(0, 0, 0, 0.05);
`;

const Main = styled.div`
  width: 1000px;
  margin: 0 auto;
  color: green;
  text-shadow: 3px 3px yellowgreen;
  font-size: 50px;
  &:hover {
    color: yellowgreen;
    text-shadow: 3px 3px green;
  }
`;

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-top: 1rem;
  & a {
    text-decoration: none;
  }
`;

const ContentWrapper = styled.article`
  padding-top: 100px;
  width: 50%;
  margin: 0 auto;
  border: 1px solid;
`;

const Aside = styled.aside`
  position: fixed;
  background-color: yellowgreen;
  width: 15%;
  top: 70px;
  bottom: 0;
  padding-top: 25px;
  & ul {
    margin: 0;
    padding: 0;
    @media (max-width: 750px) {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
  }
  & ul > a {
    text-align: center;
    text-decoration: none;
    color: #000;
  }
  & ul > a > li {
    background-color: white;
    width: 80%;
    margin: 0 auto;
    text-align: center;
    list-style: none;
    border: 1px solid;
    padding: 5px;
    margin-top: 5px;
    border-radius: 20%;
    box-shadow: 2px 2px;
    cursor: pointer;
    &:hover {
      background-color: darkgrey;
      color: antiquewhite;
    }
    @media (max-width: 750px) {
      width: 20px;
    }
  }
`;
