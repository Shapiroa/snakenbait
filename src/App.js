import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SnakeGameProvider } from './SnakeGameContext';
import SnakeUploadPage from './SnakeUploadPage';
import BaitUploadPage from './BaitUploadPage';
import GamePage from './GamePage';

function App() {
  return (
    <SnakeGameProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/upload-snake" replace />} />
        <Route path="/upload-snake" element={<SnakeUploadPage />} />
        <Route path="/upload-bait" element={<BaitUploadPage />} />
        <Route path="/play" element={<GamePage />} />
      </Routes>
    </SnakeGameProvider>
  );
}

export default App;
