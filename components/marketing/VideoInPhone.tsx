'use client';

import { VideoPlayer } from './VideoPlayer';

interface VideoInPhoneProps {
  src: string;
  poster: string;
  className?: string;
}

export function VideoInPhone({ src, poster, className = '' }: VideoInPhoneProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Phone frame wrapper */}
      <div className="relative mx-auto" style={{ width: '320px', maxWidth: '100%' }}>
        {/* Phone frame */}
        <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
          {/* Screen bezel */}
          <div className="bg-black rounded-[2rem] p-1">
            {/* Screen area */}
            <div className="relative bg-white rounded-[1.5rem] overflow-hidden aspect-[9/16] p-3">
              {/* Video player with border around the poster/image inside */}
              <div className="w-full h-full border-4 border-black rounded-lg overflow-hidden relative">
                <VideoPlayer src={src} poster={poster} className="w-full h-full" />
              </div>
            </div>
          </div>
          {/* Home indicator (for modern iPhones) */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
