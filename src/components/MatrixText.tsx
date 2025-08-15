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
        {isComplete && [...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-green-400 rounded-full opacity-80
                       animate-float shadow-[0_0_12px_rgba(0,255,65,0.9)]
                       will-change-transform"
            style={{
              left: `${10 + i * 10}%`,
              top: `${25 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + i * 0.2}s`
            }}
          />
        ))}
      </div>
      
      {/* Lignes de scan effet CRT subtiles */}
      <div className="absolute inset-0 pointer-events-none opacity-20
                      bg-gradient-to-b from-transparent via-green-400/10 to-transparent
                      animate-scan-lines will-change-transform" />
    </div>
  );
};