import React, { useEffect, useRef, useState } from 'react';

const CELL_SIZE = 20; // px
const TICK_INTERVAL = 100; // ms

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};
const OPPOSITE = {
  ArrowUp: 'ArrowDown',
  ArrowDown: 'ArrowUp',
  ArrowLeft: 'ArrowRight',
  ArrowRight: 'ArrowLeft',
};

function getRandomEmptyCell(snake, gridSize) {
  while (true) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if (!snake.some(seg => seg.x === x && seg.y === y)) {
      return { x, y };
    }
  }
}

export default function SnakeGame({ snakeImage, baitImage }) {
  const canvasRef = useRef();
  const [canvasSize, setCanvasSize] = useState(getBoardSize());
  const [snake, setSnake] = useState([
    { x: Math.floor(getBoardSize() / CELL_SIZE / 2), y: Math.floor(getBoardSize() / CELL_SIZE / 2) }
  ]);
  const [direction, setDirection] = useState('ArrowRight');
  const [nextDirection, setNextDirection] = useState('ArrowRight');
  const [bait, setBait] = useState(getRandomEmptyCell([{ x: Math.floor(getBoardSize() / CELL_SIZE / 2), y: Math.floor(getBoardSize() / CELL_SIZE / 2) }], Math.floor(getBoardSize() / CELL_SIZE)));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  function getBoardSize() {
    const min = Math.min(window.innerWidth, window.innerHeight);
    return Math.floor(min * 0.9 / CELL_SIZE) * CELL_SIZE;
  }

  // Load images
  const snakeImgRef = useRef();
  const baitImgRef = useRef();
  const bgImgRef = useRef();
  useEffect(() => {
    if (snakeImage) {
      const img = new window.Image();
      img.src = snakeImage;
      snakeImgRef.current = img;
    }
    if (baitImage) {
      const img = new window.Image();
      img.src = baitImage;
      baitImgRef.current = img;
    }
    const img = new window.Image();
    img.onload = () => { bgImgRef.current = img; };
    img.onerror = () => { bgImgRef.current = null; };
    img.src = require('./clouds-bg.png');
  }, [snakeImage, baitImage]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (DIRECTIONS[e.key] && OPPOSITE[e.key] !== direction) {
        setNextDirection(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setCanvasSize(getBoardSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Board/grid size in cells
  const gridSize = Math.floor(canvasSize / CELL_SIZE);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        let newDir = nextDirection;
        let head = { ...prevSnake[0] };
        head.x += DIRECTIONS[newDir].x;
        head.y += DIRECTIONS[newDir].y;

        // Check collisions
        if (
          head.x < 0 || head.x >= gridSize ||
          head.y < 0 || head.y >= gridSize ||
          prevSnake.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        let ateBait = head.x === bait.x && head.y === bait.y;
        let newSnake = [head, ...prevSnake];
        if (!ateBait) {
          newSnake.pop();
        } else {
          setScore(s => s + 1);
          setBait(getRandomEmptyCell(newSnake, gridSize));
        }
        setDirection(newDir);
        return newSnake;
      });
    }, TICK_INTERVAL);
    return () => clearInterval(interval);
  }, [nextDirection, bait, gameOver, gridSize]);

  // Draw
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    // Draw background
    if (bgImgRef.current) {
      ctx.drawImage(bgImgRef.current, 0, 0, canvasSize, canvasSize);
    } else {
      ctx.fillStyle = '#87cefa';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    }
    // Draw snake
    for (let seg of snake) {
      if (snakeImgRef.current && snakeImgRef.current.complete && snakeImgRef.current.naturalWidth > 0) {
        ctx.drawImage(snakeImgRef.current, seg.x * CELL_SIZE * canvasSize / (gridSize * CELL_SIZE), seg.y * CELL_SIZE * canvasSize / (gridSize * CELL_SIZE), canvasSize / gridSize, canvasSize / gridSize);
      } else {
        ctx.fillStyle = '#1e90ff';
        ctx.fillRect(seg.x * canvasSize / gridSize, seg.y * canvasSize / gridSize, canvasSize / gridSize, canvasSize / gridSize);
      }
    }
    // Draw bait
    if (baitImgRef.current && baitImgRef.current.complete && baitImgRef.current.naturalWidth > 0) {
      ctx.drawImage(baitImgRef.current, bait.x * canvasSize / gridSize, bait.y * canvasSize / gridSize, canvasSize / gridSize, canvasSize / gridSize);
    } else {
      ctx.fillStyle = '#ff3c3c';
      ctx.fillRect(bait.x * canvasSize / gridSize, bait.y * canvasSize / gridSize, canvasSize / gridSize, canvasSize / gridSize);
    }
    // Game Over overlay
    if (gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.floor(canvasSize/12)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', canvasSize / 2, canvasSize / 2);
      ctx.font = `${Math.floor(canvasSize/24)}px sans-serif`;
      ctx.fillText('Score: ' + score, canvasSize / 2, canvasSize / 2 + canvasSize/15);
    }
  }, [snake, bait, gameOver, snakeImage, baitImage, score, canvasSize, gridSize]);

  // Restart handler
  const handleRestart = () => {
    setSnake([{ x: Math.floor(getBoardSize() / CELL_SIZE / 2), y: Math.floor(getBoardSize() / CELL_SIZE / 2) }]);
    setDirection('ArrowRight');
    setNextDirection('ArrowRight');
    setBait(getRandomEmptyCell([{ x: Math.floor(getBoardSize() / CELL_SIZE / 2), y: Math.floor(getBoardSize() / CELL_SIZE / 2) }], Math.floor(getBoardSize() / CELL_SIZE)));
    setGameOver(false);
    setScore(0);
  };

  // Touch controls for mobile
  useEffect(() => {
    let startX = null, startY = null;
    const handleTouchStart = (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    };
    const handleTouchEnd = (e) => {
      if (startX === null || startY === null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20 && direction !== 'ArrowLeft') setNextDirection('ArrowRight');
        else if (dx < -20 && direction !== 'ArrowRight') setNextDirection('ArrowLeft');
      } else {
        if (dy > 20 && direction !== 'ArrowUp') setNextDirection('ArrowDown');
        else if (dy < -20 && direction !== 'ArrowDown') setNextDirection('ArrowUp');
      }
      startX = null;
      startY = null;
    };
    const canvas = canvasRef.current;
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [direction]);

  return (
    <div style={{ position: 'relative', width: canvasSize, height: canvasSize, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{ background: '#fafafa', border: '2px solid #222', display: 'block', width: '100%', height: '100%', maxWidth: '90vw', maxHeight: '90vh' }}
      />
      <div style={{ position: 'absolute', top: 10, left: 10, color: '#222', fontSize: 18, fontWeight: 'bold' }}>
        Score: {score}
      </div>
      {gameOver && (
        <button
          onClick={handleRestart}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 24,
            padding: '16px 32px',
            borderRadius: 12,
            border: 'none',
            background: '#1e90ff',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          Restart
        </button>
      )}
    </div>
  );
}
