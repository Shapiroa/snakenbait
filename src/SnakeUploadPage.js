import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnakeGame } from './SnakeGameContext';
import './upload-page.css';

export default function SnakeUploadPage() {
  const { snakeImage, setSnakeImage } = useSnakeGame();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSnakeImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (snakeImage) navigate('/upload-bait');
  };

  return (
    <div className="upload-page">
      <h1>Upload Your Snake</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      {snakeImage && (
        <div className="image-preview">
          <img src={snakeImage} alt="Snake Preview" style={{ maxWidth: 200, maxHeight: 200 }} />
        </div>
      )}
      <button onClick={handleContinue} disabled={!snakeImage} style={{ marginTop: 24 }}>
        Continue
      </button>
    </div>
  );
}
