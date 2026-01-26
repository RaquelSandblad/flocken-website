'use client';

import { useState, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  poster: string;
  className?: string;
}

export function VideoPlayer({ src, poster, className = '' }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowControls(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowControls(false);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls={showControls}
        preload="metadata"
        poster={poster}
        onPause={handlePause}
        onEnded={handleEnded}
        onClick={isPlaying ? undefined : handlePlay}
      >
        <source src={src} type="video/mp4" />
        Din webbläsare stödjer inte video-taggen.
      </video>
      
      {/* Central play button overlay */}
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all group cursor-pointer z-10"
          aria-label="Spela video"
        >
          <div className="relative">
            {/* Outer circle with shadow */}
            <div className="absolute inset-0 bg-white/90 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity scale-150"></div>
            
            {/* Play button circle */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              {/* Play icon */}
              <svg 
                className="w-10 h-10 md:w-12 md:h-12 text-flocken-olive ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
