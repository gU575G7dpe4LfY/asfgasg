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
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configuration agressive pour forcer la lecture avec son
    video.preload = 'auto';
    video.playsInline = true;
    video.autoplay = true;
    video.muted = false; // Tentative directe avec son
    video.volume = 1.0; // Volume maximum
    
    // Attributs HTML5 pour forcer l'autoplay
    video.setAttribute('autoplay', 'true');
    video.setAttribute('muted', 'false');
    video.setAttribute('playsinline', 'true');

    const forcePlayWithSound = async () => {
      try {
        // Première tentative avec son
        video.muted = false;
        video.volume = 1.0;
        await video.play();
        setIsPlaying(true);
        setIsMuted(false);
        setSoundEnabled(true);
        console.log('✅ Lecture avec son réussie');
      } catch (error) {
        console.log('❌ Échec lecture avec son, tentative en muet...');
        try {
          // Fallback en muet si échec
          video.muted = true;
          await video.play();
          setIsPlaying(true);
          setIsMuted(true);
          
          // Tentative de réactivation du son après 100ms
          setTimeout(() => {
            video.muted = false;
            video.volume = 1.0;
            setIsMuted(false);
            setSoundEnabled(true);
            console.log('🔊 Son réactivé après lecture');
          }, 100);
        } catch (mutedError) {
          console.error('❌ Échec total de lecture:', mutedError);
          setHasError(true);
        }
      }
    };

    const handleCanPlay = () => {
      setIsLoaded(true);
      forcePlayWithSound();
    };

    const handleLoadedData = () => {
      // Tentative supplémentaire quand les données sont chargées
      forcePlayWithSound();
    };

    const handleError = () => {
      console.error('❌ Erreur de chargement vidéo');
      setHasError(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      // Vérification et activation du son à chaque lecture
      if (video.muted) {
        video.muted = false;
        video.volume = 1.0;
        setIsMuted(false);
        setSoundEnabled(true);
      }
    };

    const handlePause = () => setIsPlaying(false);
    
    const handleVolumeChange = () => {
      setIsMuted(video.muted);
      setSoundEnabled(!video.muted && video.volume > 0);
    };

    // Gestionnaires d'événements
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    // Tentatives multiples de lecture avec son
    const attemptPlay = () => {
      if (video.readyState >= 2) { // HAVE_CURRENT_DATA
        forcePlayWithSound();
      }
    };

    // Tentatives répétées toutes les 500ms pendant 5 secondes
    const playAttempts = setInterval(attemptPlay, 500);
    setTimeout(() => clearInterval(playAttempts), 5000);

    // Activation du son sur toute interaction utilisateur
    const enableSoundOnInteraction = () => {
      if (video && video.muted) {
        video.muted = false;
        video.volume = 1.0;
        setIsMuted(false);
        setSoundEnabled(true);
        console.log('🔊 Son activé par interaction utilisateur');
      }
    };

    // Écoute de tous les types d'interactions
    const interactionEvents = ['click', 'touchstart', 'keydown', 'mousemove', 'scroll'];
    interactionEvents.forEach(event => {
      document.addEventListener(event, enableSoundOnInteraction, { once: true });
    });

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      clearInterval(playAttempts);
      
      interactionEvents.forEach(event => {
        document.removeEventListener(event, enableSoundOnInteraction);
      });
    };
  }, [videoUrl]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      // Forcer le son à chaque reprise
      video.muted = false;
      video.volume = 1.0;
      video.play().catch(() => setHasError(true));
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    if (!video.muted) {
      video.volume = 1.0;
    }
  };

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 flex items-center justify-center text-red-400 font-mono">
          Erreur de chargement vidéo
        </div>
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        autoPlay
        playsInline
        controls={false}
        muted={false}
        preload="auto"
        style={{ 
          filter: 'brightness(0.7) contrast(1.2) saturate(0.8)',
          willChange: 'transform'
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>

      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* Contrôles vidéo optimisés */}
      {isLoaded && (
        <div className="absolute bottom-6 right-6 flex gap-3 z-30">
          <button
            onClick={togglePlayPause}
            className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-full 
                       backdrop-blur-sm transition-all duration-300 
                       hover:scale-110 active:scale-95
                       border border-green-400/30 hover:border-green-400/60
                       shadow-lg hover:shadow-xl hover:shadow-green-400/20"
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
            className={`bg-black/60 hover:bg-black/80 text-white p-3 rounded-full 
                       backdrop-blur-sm transition-all duration-300 
                       hover:scale-110 active:scale-95
                       border shadow-lg hover:shadow-xl
                       ${soundEnabled && !isMuted 
                         ? 'border-green-400/60 hover:shadow-green-400/20' 
                         : 'border-red-400/30 hover:border-red-400/60 hover:shadow-red-400/20'
                       }`}
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

      {/* Indicateur de statut son */}
      {isLoaded && (
        <div className="absolute top-6 right-6 z-30">
          <div className={`px-3 py-1 rounded-full text-xs font-mono backdrop-blur-sm
                          ${soundEnabled && !isMuted 
                            ? 'bg-green-400/20 text-green-400 border border-green-400/40' 
                            : 'bg-red-400/20 text-red-400 border border-red-400/40'
                          }`}>
            {soundEnabled && !isMuted ? '🔊 SON ACTIVÉ' : '🔇 SON DÉSACTIVÉ'}
          </div>
        </div>
      )}

      {/* Message d'instruction pour l'utilisateur */}
      {isLoaded && isMuted && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40
                        bg-black/80 text-green-400 px-6 py-3 rounded-lg border border-green-400/40
                        backdrop-blur-sm animate-pulse">
          <div className="text-center font-mono text-sm">
            Cliquez n'importe où pour activer le son
          </div>
        </div>
      )}

      {/* Indicateur de chargement */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-green-400 text-xl font-mono animate-pulse">
            Chargement de la vidéo avec son...
          </div>
        </div>
      )}
    </>
  );
};