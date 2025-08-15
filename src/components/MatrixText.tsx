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
        {/* Texte principal avec effets de glow */}
        <h1 className={`text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] 
                       font-bold font-mono 
                       text-white 
                       ${isComplete ? 'animate-pulse-glow' : ''}
                       drop-shadow-[0_0_35px_rgba(255,255,255,0.8)]
                       tracking-wider
                       transform hover:scale-105 transition-all duration-500 ease-out
                       will-change-transform
                       text-shadow-[0_0_20px_rgba(255,255,255,0.5)]`}>
          {displayText}
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} 
                           transition-opacity duration-100 
                           text-white 
                           drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]`}>
            |
          </span>
        </h1>
        
        {/* Effet de reflection */}
        <h1 className="absolute top-full left-0 right-0
                       text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] 
                       font-bold font-mono 
                       text-white 
                       opacity-10
                       scale-y-[-1]
                       tracking-wider
                       blur-[1px]
                       bg-gradient-to-b from-white/10 to-transparent bg-clip-text
                       pointer-events-none">
          {displayText}
        </h1>
      </div>
      
      {/* Particules flottantes autour du texte */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isComplete && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60
                       animate-float shadow-[0_0_8px_rgba(255,255,255,0.8)]
                       will-change-transform"
            style={{
              left: `${5 + i * 8}%`,
              top: `${20 + (i % 4) * 15}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2.5 + i * 0.3}s`
            }}
          />
        ))}
      </div>
      
      {/* Lignes de scan effet CRT */}
      <div className="absolute inset-0 pointer-events-none opacity-30
                      bg-gradient-to-b from-transparent via-white/5 to-transparent
                      animate-scan-lines will-change-transform" />
    </div>
  );
};