import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const PLAYLIST = [
  {
    name: 'Dinner Table Ambience',
    src: '/audio/track1-ambience.mp3',
  },
  {
    name: 'Restaurant Music',
    src: '/audio/track2-music.mp3',
  },
];

export const AudioPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const dimVolume = 0.2; // Dim volume (20%)

  useEffect(() => {
    let isSubscribed = true;
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio();
      audio.preload = 'none';
      audio.volume = dimVolume;
      audioRef.current = audio;
    }

    audio.src = PLAYLIST[currentTrackIndex].src;

    audio.onended = () => {
      if (isSubscribed) {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
      }
    };

    const startPlayback = () => {
      if (!audioRef.current || !isSubscribed) return;
      audioRef.current
        .play()
        .then(() => {
          if (isSubscribed) setIsPlaying(true);
        })
        .catch(() => {});
    };

    // On user interaction, start audio smoothly without pre-buffering on initial load
    const handleInteraction = () => {
      startPlayback();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      isSubscribed = false;
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [currentTrackIndex]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = dimVolume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div
      className="fixed top-3 right-3 sm:top-3.5 sm:right-3.5 z-50 select-none"
      title={`Now Playing: ${PLAYLIST[currentTrackIndex].name} (20% vol)`}
    >
      <div className="bg-black/90 text-white backdrop-blur-md px-2 py-0.5 rounded-full border border-neutral-800 shadow-md flex items-center gap-1.5 text-[9px]">
        {/* Animated sound wave bars when playing */}
        {isPlaying && !isMuted ? (
          <div className="flex items-end gap-[1.5px] h-2.5 w-2.5">
            <span className="w-[1.5px] bg-white rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" style={{ height: '60%' }} />
            <span className="w-[1.5px] bg-white rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" style={{ height: '100%' }} />
            <span className="w-[1.5px] bg-white rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" style={{ height: '40%' }} />
          </div>
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 ml-0.5" />
        )}

        <span className="text-[9px] font-medium text-neutral-400 hidden xs:inline sm:inline max-w-[85px] sm:max-w-[110px] truncate">
          {PLAYLIST[currentTrackIndex].name}
        </span>

        {/* Mute / Unmute toggle button */}
        <button
          onClick={toggleMute}
          className="text-neutral-400 hover:text-white cursor-pointer p-0.5 rounded transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-2.5 h-2.5 text-neutral-500" /> : <Volume2 className="w-2.5 h-2.5 text-white" />}
        </button>

        {/* Play / Pause toggle */}
        <button
          onClick={togglePlayPause}
          className="text-[8px] text-neutral-400 hover:text-white font-mono px-1 border-l border-neutral-800 cursor-pointer"
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
      </div>
    </div>
  );
};
