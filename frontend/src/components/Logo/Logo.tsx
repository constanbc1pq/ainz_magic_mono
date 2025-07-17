import React from 'react';
import { Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  size?: number;
  clickable?: boolean;
  sx?: any;
}

const Logo: React.FC<LogoProps> = ({ size = 40, clickable = true, sx = {} }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) {
      navigate('/');
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: clickable ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': clickable ? {
          transform: 'scale(1.05)',
        } : {},
        ...sx
      }}
    >
      <Avatar
        src="/AINZ-Logo.png"
        alt="Ainz Logo"
        sx={{
          width: size,
          height: size,
          border: '2px solid',
          borderColor: 'primary.main',
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': clickable ? {
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            borderColor: 'secondary.main',
          } : {},
        }}
      />
    </Box>
  );
};

export default Logo;