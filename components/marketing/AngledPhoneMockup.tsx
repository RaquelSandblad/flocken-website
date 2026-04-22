'use client';

import Image from 'next/image';

interface AngledPhoneMockupProps {
  /** Path to app screenshot image */
  screenshot: string;
  /** Alt text for accessibility */
  alt: string;
  /** Phone frame width in pixels (default: 280) */
  width?: number;
  /** Rotation on Y axis in degrees — negative tilts right edge toward viewer (default: -12) */
  rotateY?: number;
  /** Rotation on X axis in degrees — positive tilts top away (default: 3) */
  rotateX?: number;
  /** Perspective distance in pixels — lower = more dramatic (default: 1000) */
  perspective?: number;
  /** Disable 3D perspective (useful for mobile where flat looks better) */
  flat?: boolean;
  /** Additional CSS classes on the outer wrapper */
  className?: string;
  /** Optional badge text (top-right corner) */
  badge?: string;
}

/**
 * Device mockup with CSS 3D perspective transform.
 *
 * Uses a Tailwind-built phone frame (inspired by Flowbite pattern)
 * with real app screenshots inside. No AI-generated images.
 *
 * See DESIGN_SYSTEM.md section 3 for design rationale.
 */
export function AngledPhoneMockup({
  screenshot,
  alt,
  width = 280,
  rotateY = -12,
  rotateX = 3,
  perspective = 1000,
  flat = false,
  className = '',
  badge,
}: AngledPhoneMockupProps) {
  const transform = flat
    ? 'none'
    : `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

  // Shadow direction should match rotation: if right edge comes forward (negative rotateY),
  // shadow falls to the left. Offset = roughly 2x the rotation angle.
  const shadowX = flat ? 0 : Math.round(rotateY * -2);
  const shadowY = flat ? 8 : 16;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ perspective: flat ? 'none' : `${perspective}px` }}
    >
      <div className="relative">
        {/* Phone frame */}
        <div
          className="relative bg-gray-900 rounded-[2.5rem] p-[10px] transition-transform duration-500 ease-out"
          style={{
            transform,
            transformStyle: 'preserve-3d',
            width: `${width}px`,
            boxShadow: `${shadowX}px ${shadowY}px 64px rgba(0, 0, 0, 0.08), ${Math.round(shadowX / 3)}px ${Math.round(shadowY / 2)}px 20px rgba(0, 0, 0, 0.06)`,
          }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[25px] bg-gray-900 rounded-b-2xl z-10" />

          {/* Screen */}
          <div className="rounded-[2rem] overflow-hidden aspect-[9/19.5] bg-white">
            <Image
              src={screenshot}
              alt={alt}
              width={width * 2}
              height={Math.round(width * 2 * (19.5 / 9))}
              className="w-full h-full object-cover"
              quality={90}
            />
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/30 rounded-full" />
        </div>

        {/* Optional badge */}
        {badge && (
          <div className="absolute -top-3 -right-3 bg-flocken-olive text-white px-3 py-1.5 rounded-full text-small font-semibold shadow-card z-20">
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Two overlapping phones for showing a flow (e.g., browse → book).
 */
interface DualPhoneMockupProps {
  /** Front phone (primary, more prominent) */
  frontScreenshot: string;
  frontAlt: string;
  /** Back phone (secondary, slightly faded) */
  backScreenshot: string;
  backAlt: string;
  /** Width of each phone (default: 260) */
  width?: number;
  /** Disable 3D on mobile */
  flat?: boolean;
  className?: string;
}

export function DualPhoneMockup({
  frontScreenshot,
  frontAlt,
  backScreenshot,
  backAlt,
  width = 260,
  flat = false,
  className = '',
}: DualPhoneMockupProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: flat ? 'none' : '1200px' }}
    >
      {/* Back phone — offset right and behind */}
      <div
        className="absolute top-8 right-0 z-0"
        style={{
          transform: flat
            ? 'translateX(20px)'
            : 'rotateY(-8deg) rotateX(3deg) translateZ(-40px) translateX(20px)',
          transformStyle: 'preserve-3d',
          opacity: 0.85,
        }}
      >
        <AngledPhoneMockup
          screenshot={backScreenshot}
          alt={backAlt}
          width={width}
          flat={true} // Inner phone doesn't add its own perspective
        />
      </div>

      {/* Front phone — left and forward */}
      <div
        className="relative z-10"
        style={{
          transform: flat
            ? 'none'
            : 'rotateY(-15deg) rotateX(5deg) translateZ(20px)',
          transformStyle: 'preserve-3d',
        }}
      >
        <AngledPhoneMockup
          screenshot={frontScreenshot}
          alt={frontAlt}
          width={width}
          flat={true} // Inner phone doesn't add its own perspective
        />
      </div>
    </div>
  );
}
