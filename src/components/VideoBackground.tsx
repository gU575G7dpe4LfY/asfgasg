import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface VideoBackgroundProps {
  videoUrl: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configuration optimale pour PC/navigateur
    video.preload = 'auto';
    video.playsInline = true;
    video.muted = false; // Son activé par défaut
    
    const handleCanPlay = () => {
      setIsLoaded(true);
      // Tentative de lecture automatique avec son
      video.play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {
          // Si échec avec son, essayer en muet puis réactiver
          video.muted = true;
          video.play()
            .then(() => {
              setIsPlaying(true);
              setIsMuted(true);
              // Réactiver le son après 1 seconde
              setTimeout(() => {
                video.muted = false;
                setIsMuted(false);
              }, 1000);
            })
            .catch(() => {
              setHasError(true);
            });
        });
    };

    const handleError = () => {
      setHasError(true);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(video.muted);

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [videoUrl]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => setHasError(true));
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  };

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        controls={false}
        style={{ 
          filter: 'brightness(0.7) contrast(1.2) saturate(0.8)',
          willChange: 'transform'
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>

      {/* Overlay pour améliorer la lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* Contrôles vidéo discrets */}
      {isLoaded && (
        <div className="absolute bottom-6 right-6 flex gap-3 z-30">
          <button
            onClick={togglePlayPause}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full 
                       backdrop-blur-sm transition-all duration-300 
                       hover:scale-110 active:scale-95
                       border border-white/20 hover:border-white/40
                       shadow-lg hover:shadow-xl"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          <button
            onClick={toggleMute}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full 
                       backdrop-blur-sm transition-all duration-300 
                       hover:scale-110 active:scale-95
                       border border-white/20 hover:border-white/40
                       shadow-lg hover:shadow-xl"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* Indicateur de chargement */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-green-400 text-xl font-mono animate-pulse">
            Chargement de la vidéo...
          </div>
        </div>
      )}
    </>
  );
};