import React, { createContext, useContext, useState } from 'react';
import type { Category } from './questions';
const GameContext = createContext<any>(undefined);
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [category, setCategory] = useState("");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const startGame = (t1, t2, cat) => {
    setTeam1Name(t1); setTeam2Name(t2); setCategory(cat);
    setScore1(0); setScore2(0); setIsActive(true);
  };
  return (
    <GameContext.Provider value={{ team1Name, team2Name, category, score1, score2, isActive, startGame, addScore: (t, p) => t === 1 ? setScore1(s => s+p) : setScore2(s => s+p), endGame: () => setIsActive(false), resetGame: () => setIsActive(false) }}>
      {children}
    </GameContext.Provider>
  );
}
export const useGame = () => useContext(GameContext);
