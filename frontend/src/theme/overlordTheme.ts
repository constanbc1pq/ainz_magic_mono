import { createTheme } from '@mui/material/styles';

// OVERLORD-inspired color palette
const overlordColors = {
  // Primary dark fantasy colors
  primary: {
    main: '#1a1a1a',       // Deep black
    light: '#2d2d2d',      // Dark gray
    dark: '#0d0d0d',       // Almost black
    contrastText: '#ffffff',
  },
  // Accent colors (gold/royal)
  secondary: {
    main: '#d4af37',       // Royal gold
    light: '#ffd700',      // Light gold
    dark: '#b8860b',       // Dark goldenrod
    contrastText: '#ffffff', // White text for better contrast on gold background
  },
  // Background colors
  background: {
    default: '#121212',    // Very dark background
    paper: '#1e1e1e',      // Dark paper
  },
  // Text colors
  text: {
    primary: '#ffffff',    // White text
    secondary: '#cccccc',  // Light gray text
    disabled: '#777777',   // Disabled text
  },
  // Gothic accent colors
  accent: {
    purple: '#6a4c93',     // Royal purple
    crimson: '#8b0000',    // Dark red
    silver: '#c0c0c0',     // Silver
    shadow: '#000000',     // Pure black for shadows
  },
  // Status colors
  error: {
    main: '#cc0000',       // Dark red
    light: '#ff3333',      // Light red
    dark: '#990000',       // Darker red
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ff8c00',       // Dark orange
    light: '#ffa500',      // Orange
    dark: '#e67700',       // Darker orange
    contrastText: '#ffffff', // White text for better contrast
  },
  info: {
    main: '#4a90e2',       // Blue
    light: '#6ba3f0',      // Light blue
    dark: '#357abd',       // Dark blue
    contrastText: '#ffffff',
  },
  success: {
    main: '#2e7d32',       // Dark green
    light: '#4caf50',      // Green
    dark: '#1b5e20',       // Darker green
    contrastText: '#ffffff',
  },
};

// Custom typography for OVERLORD theme
const overlordTypography = {
  fontFamily: '"Crimson Text", "Times New Roman", serif',
  h1: {
    fontSize: '3rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
  },
  h2: {
    fontSize: '2.5rem',
    fontWeight: 600,
    letterSpacing: '0.015em',
    textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
  },
  h3: {
    fontSize: '2rem',
    fontWeight: 600,
    letterSpacing: '0.01em',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    letterSpacing: '0.005em',
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    letterSpacing: '0.005em',
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
    letterSpacing: '0.00938em',
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
    letterSpacing: '0.01071em',
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    letterSpacing: '0.02857em',
    textTransform: 'uppercase' as const,
  },
};

// Create the OVERLORD theme
export const overlordTheme = createTheme({
  palette: {
    mode: 'dark',
    ...overlordColors,
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.12)',
      disabled: 'rgba(255, 255, 255, 0.26)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  typography: overlordTypography,
  shape: {
    borderRadius: 8,
  },
  components: {
    // Custom button styles
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '12px 24px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.02857em',
          boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0,0,0,0.6)',
            border: '1px solid rgba(212, 175, 55, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2d2d2d 0%, #404040 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #d4af37 0%, #ffd700 100%)',
          color: '#000000', // Keep black for good contrast on gold background
          fontWeight: 700,  // Make it bolder for better readability
          '&:hover': {
            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)',
          },
        },
        outlined: {
          borderColor: overlordColors.secondary.main,
          color: overlordColors.secondary.main,
          '&:hover': {
            borderColor: overlordColors.secondary.light,
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
          },
        },
      },
    },
    // Custom card styles
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          overflow: 'hidden',
          '&:hover': {
            border: '1px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.8)',
            transform: 'translateY(-4px)',
          },
          transition: 'all 0.3s ease',
        },
      },
    },
    // Custom chip styles
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          fontWeight: 500,
          letterSpacing: '0.01em',
          '&.MuiChip-colorSuccess.MuiChip-filled': {
            background: 'linear-gradient(135deg, #2d4a2f 0%, #3d5a3f 50%, #4d6a4f 100%)',
            border: '1px solid rgba(77, 106, 79, 0.4)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px rgba(77, 106, 79, 0.2)',
            color: '#e8f5e8',
          },
          '&.MuiChip-colorError.MuiChip-filled': {
            background: 'linear-gradient(135deg, #4a2d2d 0%, #5a3d3d 50%, #6a4d4d 100%)',
            border: '1px solid rgba(106, 77, 77, 0.4)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px rgba(106, 77, 77, 0.2)',
            color: '#f5e8e8',
          },
          '&.MuiChip-colorWarning.MuiChip-filled': {
            background: 'linear-gradient(135deg, #4a3d2d 0%, #5a4d3d 50%, #6a5d4d 100%)',
            border: '1px solid rgba(106, 93, 77, 0.4)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px rgba(106, 93, 77, 0.2)',
            color: '#f5f2e8',
          },
          '&.MuiChip-colorInfo.MuiChip-filled': {
            background: 'linear-gradient(135deg, #2d3d4a 0%, #3d4d5a 50%, #4d5d6a 100%)',
            border: '1px solid rgba(77, 93, 106, 0.4)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px rgba(77, 93, 106, 0.2)',
            color: '#e8f2f5',
          },
          '&.MuiChip-colorDefault.MuiChip-filled': {
            background: 'linear-gradient(135deg, #6a4c93 0%, #8b5a96 100%)',
            border: '1px solid rgba(106, 76, 147, 0.3)',
            color: '#ffffff',
          },
        },
      },
    },
    // Custom paper styles
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    // Custom app bar styles
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.6)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
        },
      },
    },
    // Custom text field styles
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '& fieldset': {
              borderColor: 'rgba(212, 175, 55, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(212, 175, 55, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: overlordColors.secondary.main,
            },
          },
        },
      },
    },
    // Custom progress styles
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: '8px',
          borderRadius: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        bar: {
          background: 'linear-gradient(90deg, #d4af37 0%, #ffd700 100%)',
          borderRadius: '4px',
        },
      },
    },
  },
});

// Export additional theme utilities
export const overlordAnimations = {
  fadeIn: {
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.6s ease',
  },
  fadeInActive: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  bounce: {
    animation: 'bounce 1s ease-in-out',
  },
  glow: {
    animation: 'glow 2s ease-in-out infinite alternate',
  },
};

// CSS-in-JS keyframes for animations
export const overlordKeyframes = `
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      transform: translate3d(0, -10px, 0);
    }
    70% {
      transform: translate3d(0, -5px, 0);
    }
    90% {
      transform: translate3d(0, -2px, 0);
    }
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
    }
    to {
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.8), 0 0 30px rgba(212, 175, 55, 0.6);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export default overlordTheme;