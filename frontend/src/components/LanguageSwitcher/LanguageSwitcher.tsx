import React, { useState } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Tooltip,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '简体中文',
    flag: '🇨🇳',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    handleClose();
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

  const currentLanguage = getCurrentLanguage();

  return (
    <Box>
      <Tooltip title="切换语言 / Switch Language">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <span style={{ fontSize: '1.2rem' }}>{currentLanguage.flag}</span>
            <LanguageIcon fontSize="small" />
          </Box>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 160,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={language.code === i18n.language}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.secondary.main + '20',
                '&:hover': {
                  backgroundColor: theme.palette.secondary.main + '30',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <span style={{ fontSize: '1.2rem' }}>{language.flag}</span>
            </ListItemIcon>
            <ListItemText
              primary={language.nativeName}
              secondary={language.name}
              secondaryTypographyProps={{
                variant: 'caption',
                color: 'text.secondary',
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;