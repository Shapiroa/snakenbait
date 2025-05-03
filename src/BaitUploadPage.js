import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnakeGame } from './SnakeGameContext';
import './upload-page.css';

export default function BaitUploadPage() {
  const { baitImage, setBaitImage } = useSnakeGame();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setBaitImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePlay = () => {
    if (baitImage) navigate('/play');
  };

  return (
    <div className="upload-page">
      <h1>Upload Your Bait</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      {baitImage && (
        <div className="image-preview">
          <img src={baitImage} alt="Bait Preview" style={{ maxWidth: 200, maxHeight: 200 }} />
        </div>
      )}
      <button onClick={handlePlay} disabled={!baitImage} style={{ marginTop: 24 }}>
        Play!
      </button>
    </div>
  );
}
