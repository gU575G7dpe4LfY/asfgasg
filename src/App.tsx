import React, { useEffect, useRef } from 'react';
import { VideoBackground } from './components/VideoBackground';
import { MatrixText } from './components/MatrixText';

function App() {
  // Votre vidéo personnalisée
  const videoUrl = "/ssstik.io_@edit.ciraw_1755251251328.mp4";

  return (
    <div className="min-h-screen bg-black overflow-hidden relative antialiased professional-shadow">
      <VideoBackground videoUrl={videoUrl} />
      
      {/* Overlay professionnel pour améliorer le contraste */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30 pointer-events-none z-5" />
      
      <div className="absolute inset-0 flex items-center justify-center z-10 p-4 backdrop-blur-[0.5px]">
        <MatrixText />
      </div>
      
      {/* Indicateur discret de qualité professionnelle */}
      <div className="absolute bottom-4 left-4 z-20 opacity-60 hover:opacity-100 transition-opacity duration-300">
        <div className="text-green-400 text-xs font-mono tracking-wider">
          MATRIX SYSTEM v2.0
        </div>
      </div>
    </div>
  );
}

export default App;