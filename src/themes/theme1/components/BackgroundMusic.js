import React, { useState, useEffect, useRef } from 'react';

/**
 * @component BackgroundMusic
 * @description Background music player with mute/unmute toggle
 * Features auto-loop and volume control
 */
const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(false); // Start unmuted to attempt autoplay
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  // Handle initial setup and audio loading
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // Lower default volume
      audioRef.current.loop = true;
      
      const handleCanPlay = () => {
        // console.log('Audio loaded and ready to play');
        setIsLoaded(true);
        setError(null);
      };

      const handleError = (e) => {
        // console.error('Audio error:', e);
        setError('Audio loading error');
        setIsLoaded(false);
      };

      audioRef.current.addEventListener('canplay', handleCanPlay);
      audioRef.current.addEventListener('error', handleError);

      // Attempt to load audio
      try {
        audioRef.current.load();
      } catch (err) {
        // console.error('Error loading audio:', err);
        setError('Failed to load audio');
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplay', handleCanPlay);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.pause();
        }
      };
    }
  }, []); // Only run on mount

  // Handle user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // Optional: Automatically start playing when user interacts
        // setIsMuted(false);
      }
    };

    // Listen for both click and keydown for accessibility
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted]);

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current && isLoaded) {
      try {
        if (!isMuted) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              // console.error('Playback error:', error);
              setError('Playback failed');
              setIsMuted(true); // Fallback to muted state
            });
          }
        } else {
          audioRef.current.pause();
        }
      } catch (error) {
        // console.error('Playback control error:', error);
        setError('Playback control failed');
        setIsMuted(true); // Fallback to muted state
      }
    }
  }, [isMuted, isLoaded]);

  const toggleMute = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setIsMuted(!isMuted);
  };

  // Get the correct audio URL based on environment
  const getAudioUrl = () => {
    const baseUrl = process.env.PUBLIC_URL || '';
    return `${baseUrl}/background-music.mp3`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio
        ref={audioRef}
        src={getAudioUrl()}
        preload="auto"
        type="audio/mpeg"
        autoPlay
      />
      <button
        onClick={toggleMute}
        className={`music-toggle p-2 rounded-full bg-black/60 border-2 
                   ${isMuted ? 'border-red-500/50' : 'border-green-500/50'} 
                   hover:border-matrix transition-all duration-300
                   ${error ? 'border-yellow-500/50' : ''}`}
        aria-label={!hasInteracted ? 'Enable background music' : (isMuted ? 'Unmute music' : 'Mute music')}
        title={error ? `Audio error: ${error}` : undefined}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default BackgroundMusic; 