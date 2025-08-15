import React, { useEffect, useRef } from 'react';
import { VideoBackground } from './components/VideoBackground';
import { MatrixText } from './components/MatrixText';

function App() {
  // Votre vidéo personnalisée
  const videoUrl = "/ssstik.io_@edit.ciraw_1755251251328.mp4";

  return (
    <div className="min-h-screen bg-black overflow-hidden relative antialiased">
      <VideoBackground videoUrl={videoUrl} />
      <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
        <MatrixText />
      </div>
    </div>
  );
}

export default App;