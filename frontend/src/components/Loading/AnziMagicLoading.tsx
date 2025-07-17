import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { useTheme } from '@mui/material/styles';

interface AinzMagicLoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.8), 0 0 30px rgba(212, 175, 55, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
  }
`;

const AinzMagicLoading: React.FC<AinzMagicLoadingProps> = ({ 
  message = "AinzMagic正在施展魔法...", 
  size = 'medium' 
}) => {
  const theme = useTheme();
  
  const sizeMap = {
    small: { progress: 32, container: 120 },
    medium: { progress: 48, container: 160 },
    large: { progress: 64, container: 200 },
  };

  const { progress, container } = sizeMap[size];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: container,
        gap: 2,
        py: 4,
      }}
    >
      {/* Animated Loading Circle */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: `${pulseAnimation} 2s ease-in-out infinite`,
        }}
      >
        {/* Outer glow ring */}
        <Box
          sx={{
            position: 'absolute',
            width: progress + 20,
            height: progress + 20,
            borderRadius: '50%',
            background: `conic-gradient(
              ${theme.palette.secondary.main} 0deg,
              ${theme.palette.primary.main} 90deg,
              ${theme.palette.secondary.main} 180deg,
              ${theme.palette.primary.main} 270deg,
              ${theme.palette.secondary.main} 360deg
            )`,
            animation: `${glowAnimation} 3s ease-in-out infinite, rotation 2s linear infinite`,
            opacity: 0.3,
          }}
        />
        
        {/* Main loading spinner */}
        <CircularProgress
          size={progress}
          thickness={4}
          sx={{
            color: theme.palette.secondary.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        
        {/* Center magical symbol */}
        <Box
          sx={{
            position: 'absolute',
            fontSize: progress * 0.4,
            color: theme.palette.secondary.main,
            animation: `${pulseAnimation} 1.5s ease-in-out infinite`,
          }}
        >
          ✨
        </Box>
      </Box>

      {/* Loading message */}
      <Typography
        variant={size === 'small' ? 'body2' : size === 'medium' ? 'body1' : 'h6'}
        color="text.secondary"
        textAlign="center"
        sx={{
          fontWeight: 500,
          letterSpacing: '0.5px',
          animation: `${pulseAnimation} 2s ease-in-out infinite`,
        }}
      >
        {message}
      </Typography>

      {/* Magical particles */}
      <Box
        sx={{
          position: 'absolute',
          width: container,
          height: container,
          pointerEvents: 'none',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            width: 4,
            height: 4,
            background: theme.palette.secondary.main,
            borderRadius: '50%',
            animation: `${pulseAnimation} 3s ease-in-out infinite`,
          },
          '&::before': {
            top: '20%',
            left: '10%',
            animationDelay: '0s',
          },
          '&::after': {
            bottom: '20%',
            right: '10%',
            animationDelay: '1s',
          },
        }}
      />
    </Box>
  );
};

export default AinzMagicLoading;