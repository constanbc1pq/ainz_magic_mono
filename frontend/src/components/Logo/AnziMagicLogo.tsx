import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AnziMagicLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const LogoContainer = styled(Box)<{ size: 'small' | 'medium' | 'large' }>(({ theme, size }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(size === 'small' ? 1 : size === 'medium' ? 1.5 : 2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.6))',
  },
}));

const LogoIcon = styled('svg')<{ size: 'small' | 'medium' | 'large' }>(({ theme, size }) => {
  const dimensions = {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 64, height: 64 },
  };

  return {
    width: dimensions[size].width,
    height: dimensions[size].height,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
    transition: 'all 0.3s ease',
  };
});

const LogoText = styled(Typography)<{ size: 'small' | 'medium' | 'large' }>(({ theme, size }) => {
  const fontSizes = {
    small: '1.5rem',
    medium: '2rem',
    large: '2.5rem',
  };

  return {
    fontSize: fontSizes[size],
    fontWeight: 700,
    background: 'linear-gradient(135deg, #d4af37 0%, #ffd700 50%, #ffed4a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    letterSpacing: '0.02em',
    fontFamily: '"Crimson Text", "Times New Roman", serif',
  };
});

const AnziMagicLogo: React.FC<AnziMagicLogoProps> = ({ 
  size = 'medium', 
  showText = true 
}) => {
  return (
    <LogoContainer size={size}>
      <LogoIcon size={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer magical circle */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4,2"
        />
        
        {/* Inner magical circle */}
        <circle
          cx="32"
          cy="32"
          r="24"
          stroke="url(#gradient2)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />
        
        {/* Central crown/skull symbol */}
        <g transform="translate(32, 32)">
          {/* Crown base */}
          <path
            d="M-12,-8 L-8,-12 L-4,-8 L0,-12 L4,-8 L8,-12 L12,-8 L10,-4 L-10,-4 Z"
            fill="url(#gradient3)"
            stroke="url(#gradient4)"
            strokeWidth="1"
          />
          
          {/* Crown jewels */}
          <circle cx="-8" cy="-10" r="1.5" fill="#ff6b6b" />
          <circle cx="0" cy="-10" r="2" fill="#4ecdc4" />
          <circle cx="8" cy="-10" r="1.5" fill="#ff6b6b" />
          
          {/* Skull-like design */}
          <ellipse cx="0" cy="-2" rx="8" ry="6" fill="url(#gradient5)" />
          
          {/* Eye sockets */}
          <circle cx="-3" cy="-3" r="2" fill="#000000" />
          <circle cx="3" cy="-3" r="2" fill="#000000" />
          
          {/* Glowing eyes */}
          <circle cx="-3" cy="-3" r="1" fill="#d4af37" opacity="0.8" />
          <circle cx="3" cy="-3" r="1" fill="#d4af37" opacity="0.8" />
          
          {/* Nose cavity */}
          <path d="M0,0 L-1,3 L1,3 Z" fill="#000000" />
          
          {/* Mouth/jaw */}
          <path
            d="M-4,2 Q0,6 4,2 Q2,4 0,4 Q-2,4 -4,2"
            fill="url(#gradient6)"
            stroke="#000000"
            strokeWidth="0.5"
          />
        </g>
        
        {/* Magical runes around the circle */}
        <g opacity="0.7">
          {/* Rune 1 */}
          <path d="M32,4 L32,8 M30,6 L34,6" stroke="url(#gradient7)" strokeWidth="1" strokeLinecap="round" />
          
          {/* Rune 2 */}
          <g transform="rotate(60, 32, 32)">
            <path d="M32,4 L32,8 M30,6 L34,6" stroke="url(#gradient7)" strokeWidth="1" strokeLinecap="round" />
          </g>
          
          {/* Rune 3 */}
          <g transform="rotate(120, 32, 32)">
            <path d="M32,4 L32,8 M30,6 L34,6" stroke="url(#gradient7)" strokeWidth="1" strokeLinecap="round" />
          </g>
          
          {/* Rune 4 */}
          <g transform="rotate(180, 32, 32)">
            <path d="M32,4 L32,8 M30,6 L34,6" stroke="url(#gradient7)" strokeWidth="1" strokeLinecap="round" />
          </g>
          
          {/* Rune 5 */}
          <g transform="rotate(240, 32, 32)">
            <path d="M32,4 L32,8 M30,6 L34,6" stroke="url(#gradient7)" strokeWidth="1" strokeLinecap="round" />
          </g>
          
          {/* Rune 6 */}
          <g transform="rotate(300, 32, 32)">
            <path d="M32,4 L32,8 M30,6 L34,6" stroke="url(#gradient7)" strokeWidth="1" strokeLinecap="round" />
          </g>
        </g>
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffd700" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffed4a" stopOpacity="0.8" />
          </linearGradient>
          
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6a4c93" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5a96" stopOpacity="0.8" />
          </linearGradient>
          
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffd700" stopOpacity="1" />
            <stop offset="100%" stopColor="#b8860b" stopOpacity="0.9" />
          </linearGradient>
          
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffed4a" stopOpacity="1" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="1" />
          </linearGradient>
          
          <radialGradient id="gradient5" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2d2d2d" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#1a1a1a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0d0d0d" stopOpacity="1" />
          </radialGradient>
          
          <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0d0d0d" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6a4c93" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5a96" stopOpacity="1" />
          </linearGradient>
        </defs>
      </LogoIcon>
      
      {showText && (
        <LogoText size={size} variant="h4">
          AnziMagic
        </LogoText>
      )}
    </LogoContainer>
  );
};

export default AnziMagicLogo;