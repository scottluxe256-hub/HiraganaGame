import { useState } from 'react';
import type { GameState, AnswerRecord } from './types'; // <-- Tambahkan kata 'type'
import { Home } from './components/Home';
import { Ingame } from './components/Ingame';
import { Result } from './components/Result';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('HOME');
  const [records, setRecords] = useState<AnswerRecord[]>([]);

  const handleStart = () => {
    setRecords([]);
    setGameState('PLAYING');
  };

  const handleEndGame = (finalRecords: AnswerRecord[]) => {
    setRecords(finalRecords);
    setGameState('RESULT');
  };

  const handleRestart = () => {
    setGameState('HOME');
  };

  return (
    <main className="min-h-screen bg-gray-900 font-sans">
      {gameState === 'HOME' && <Home onStart={handleStart} />}
      {gameState === 'PLAYING' && <Ingame onEndGame={handleEndGame} />}
      {gameState === 'RESULT' && <Result records={records} onRestart={handleRestart} />}
    </main>
  );
}
