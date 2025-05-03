import React, { createContext, useState, useContext } from 'react';

const SnakeGameContext = createContext();

export function SnakeGameProvider({ children }) {
  const [snakeImage, setSnakeImage] = useState(null);
  const [baitImage, setBaitImage] = useState(null);

  return (
    <SnakeGameContext.Provider value={{ snakeImage, setSnakeImage, baitImage, setBaitImage }}>
      {children}
    </SnakeGameContext.Provider>
  );
}

export function useSnakeGame() {
  return useContext(SnakeGameContext);
}
