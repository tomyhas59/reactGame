import React from "react";
import AppLayout from "./pages/AppLayout";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WordGame from "./pages/WordGame";
import RSP from "./pages/RSP";
import TextRPG from "./pages/TextRPG";
import ResponseCheck from "./pages/ResponseCheck";
import Make2048 from "./pages/Make2048";
import Lotto from "./pages/Lotto";
import FindMine from "./pages/FindMine";
import Concentration from "./pages/Concentration";
import CatchMole from "./pages/CatchMole";
import Calculator from "./pages/Calculator";
import Baseball from "./pages/Baseball";
import Main from "./pages/Main";
import Gugudan from "./pages/Gugudan";
import Onet from "./pages/Onet";
import Poker from "./pages/poker";

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/wordGame" element={<WordGame />} />
          <Route path="/textRPG" element={<TextRPG />} />
          <Route path="/RSP" element={<RSP />} />
          <Route path="/responseCheck" element={<ResponseCheck />} />
          <Route path="/make2048" element={<Make2048 />} />
          <Route path="/findMine" element={<FindMine />} />
          <Route path="/lotto" element={<Lotto />} />
          <Route path="/concentration" element={<Concentration />} />
          <Route path="/catchMole" element={<CatchMole />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/baseball" element={<Baseball />} />
          <Route path="/gugudan" element={<Gugudan />} />
          <Route path="/onet" element={<Onet />} />
          <Route path="/poker" element={<Poker />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
