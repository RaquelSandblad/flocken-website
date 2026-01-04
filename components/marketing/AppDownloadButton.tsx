'use client';

import { trackAppInstall } from '@/lib/tracking';

interface AppDownloadButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  source?: string;
}

export function AppDownloadButton({ 
  href, 
  children,
  className = '',
  source = 'website'
}: AppDownloadButtonProps) {
  const handleClick = () => {
    // Detect platform from URL
    const isAndroid = href.includes('play.google.com');
    const isIOS = href.includes('apps.apple.com');
    
    if (isAndroid) {
      trackAppInstall('android', source);
    } else if (isIOS) {
      trackAppInstall('ios', source);
    }
  };

  return (
    <a 
      href={href} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

