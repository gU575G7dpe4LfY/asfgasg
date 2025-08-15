import React, { useState, useEffect } from 'react';

export const MatrixText: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const targetText = 'matrix';

  useEffect(() => {
    let currentIndex = 0;
    let typingTimeout: NodeJS.Timeout;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= targetText.length) {
        setDisplayText(targetText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsComplete(true);
      }
    }, 150);

    // Animation du curseur clignotant
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 400);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
      clearTimeout(typingTimeout);
    };
  }, []);

  return (
    <div className="text-center select-none relative z-20">
      <div className="relative">
        {/* Texte principal avec effets de glow optimisés */}
        <h1 className={`text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] 
                       font-bold font-mono 
                       text-white 
                       ${isComplete ? 'glow-effect' : ''}
                       drop-shadow-[0_0_50px_rgba(0,255,65,0.9)]
                       tracking-wider
                       transform hover:scale-102 transition-all duration-700 ease-out
                       will-change-transform
                       filter brightness-110`}>
          {displayText}
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} 
                           transition-opacity duration-100 
                           text-green-400 
                           drop-shadow-[0_0_30px_rgba(0,255,65,1)]`}>
            |
          </span>
        </h1>
      </div>
      
      {/* Particules flottantes optimisées */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isComplete && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-90
                       animate-float shadow-[0_0_20px_rgba(0,255,65,1)]
                       will-change-transform"
            style={{
              left: `${5 + i * 8}%`,
              top: `${20 + (i % 4) * 15}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + i * 0.3}s`
            }}
          />
        ))}
      </div>
      
      {/* Effets de lumière radiale premium */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isComplete && (
          <>
            {/* Cercles de lumière pulsants */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                           w-96 h-96 rounded-full border border-green-400/20
                           animate-pulse-ring shadow-[0_0_100px_rgba(0,255,65,0.3)]" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                           w-[32rem] h-[32rem] rounded-full border border-green-400/10
                           animate-pulse-ring-delayed shadow-[0_0_150px_rgba(0,255,65,0.2)]" />
            
            {/* Rayons de lumière rotatifs */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                           w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/30 to-transparent
                           animate-rotate-slow origin-center" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                           w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/20 to-transparent
                           animate-rotate-reverse origin-center" />
            
            {/* Particules d'énergie orbitales */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`orbital-${i}`}
                className="absolute top-1/2 left-1/2 w-1 h-1 bg-green-400 rounded-full
                           shadow-[0_0_15px_rgba(0,255,65,1)] animate-orbital"
                style={{
                  transformOrigin: `${120 + i * 20}px 0`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${8 + i}s`
                }}
              />
            ))}
          </>
        )}
      </div>
      
      {/* Effet de distorsion holographique */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/5 to-transparent
                        animate-hologram-wave transform skew-y-1" />
      </div>
    </div>
  );
};