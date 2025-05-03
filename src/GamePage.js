import React from 'react';
import { useSnakeGame } from './SnakeGameContext';
import SnakeGame from './SnakeGame';

export default function GamePage() {
  const { snakeImage, baitImage } = useSnakeGame();

  return (
    <div className="game-page">
      <h1>Snake Game</h1>
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 16 }}>Snake: <img src={snakeImage} alt="Snake" style={{ width: 40, height: 40, verticalAlign: 'middle' }} /></span>
        <span>Bait: <img src={baitImage} alt="Bait" style={{ width: 40, height: 40, verticalAlign: 'middle' }} /></span>
      </div>
      <div id="game-canvas-container">
        <SnakeGame snakeImage={snakeImage} baitImage={baitImage} />
      </div>
    </div>
  );
}
