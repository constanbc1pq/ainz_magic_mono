import React from 'react';
import { Card, CardProps, Box, useTheme, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AinzMagicCardProps extends Omit<CardProps, 'variant'> {
  ainzVariant?: 'default' | 'elevated' | 'outlined' | 'glowing';
  glowColor?: string;
}

const StyledCard = styled(Card)<{ ainzVariant?: string; glowColor?: string }>(({ theme, ainzVariant, glowColor }) => {
  const baseStyles = {
    background: `linear-gradient(135deg, 
      ${alpha(theme.palette.background.paper, 0.95)} 0%, 
      ${alpha(theme.palette.background.paper, 0.85)} 100%)`,
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, 
        ${alpha(theme.palette.secondary.main, 0.05)} 0%, 
        ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
      opacity: 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
    },
    
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.3)}, 
                 0 0 0 1px ${alpha(theme.palette.secondary.main, 0.4)}`,
      
      '&::before': {
        opacity: 1,
      },
    },
  };

  const variantStyles = {
    default: {},
    elevated: {
      boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.2)}`,
      '&:hover': {
        boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.4)}`,
      },
    },
    outlined: {
      border: `2px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
      '&:hover': {
        border: `2px solid ${alpha(theme.palette.secondary.main, 0.6)}`,
      },
    },
    glowing: {
      boxShadow: `0 0 20px ${alpha(glowColor || theme.palette.secondary.main, 0.4)}`,
      border: `1px solid ${alpha(glowColor || theme.palette.secondary.main, 0.5)}`,
      '&:hover': {
        boxShadow: `0 0 30px ${alpha(glowColor || theme.palette.secondary.main, 0.6)}`,
        border: `1px solid ${alpha(glowColor || theme.palette.secondary.main, 0.8)}`,
      },
    },
  };

  return {
    ...baseStyles,
    ...(ainzVariant && variantStyles[ainzVariant as keyof typeof variantStyles] || {}),
  };
});

const AinzMagicCard: React.FC<AinzMagicCardProps> = ({ 
  children, 
  ainzVariant = 'default',
  glowColor,
  ...props 
}) => {
  const theme = useTheme();

  return (
    <StyledCard 
      {...props}
      ainzVariant={ainzVariant} 
      glowColor={glowColor}
    >
      {children}
      
      {/* Magical corner accents */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 20,
          height: 20,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            background: alpha(theme.palette.secondary.main, 0.3),
            transition: 'all 0.3s ease',
          },
          '&::before': {
            top: 0,
            right: 0,
            width: 2,
            height: 12,
          },
          '&::after': {
            top: 0,
            right: 0,
            width: 12,
            height: 2,
          },
          '.MuiCard-root:hover &::before, .MuiCard-root:hover &::after': {
            background: alpha(theme.palette.secondary.main, 0.6),
          },
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          width: 20,
          height: 20,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            background: alpha(theme.palette.secondary.main, 0.3),
            transition: 'all 0.3s ease',
          },
          '&::before': {
            bottom: 0,
            left: 0,
            width: 2,
            height: 12,
          },
          '&::after': {
            bottom: 0,
            left: 0,
            width: 12,
            height: 2,
          },
          '.MuiCard-root:hover &::before, .MuiCard-root:hover &::after': {
            background: alpha(theme.palette.secondary.main, 0.6),
          },
        }}
      />
    </StyledCard>
  );
};

export default AinzMagicCard;