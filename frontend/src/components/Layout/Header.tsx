import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AnziMagicLogo from '../Logo/AnziMagicLogo';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
        >
          <AnziMagicLogo size="small" showText={true} />
        </Box>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LanguageSwitcher />
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={() => navigate('/project/new')}
              sx={{ mr: 2, ml: 1 }}
            >
              {t('nav.createProject')}
            </Button>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={user?.avatar}
              >
                {user?.username?.charAt(0).toUpperCase() || <PersonIcon />}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem sx={{ minWidth: 200 }}>
                <Avatar src={user?.avatar}>
                  {user?.username?.charAt(0).toUpperCase() || <PersonIcon />}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">{user?.username}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleDashboard}>
                <ListItemIcon>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('nav.dashboard')}</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('nav.profile')}</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('nav.settings')}</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('common.logout')}</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LanguageSwitcher />
            <Button color="inherit" onClick={() => navigate('/login')} sx={{ ml: 1 }}>
              {t('auth.login')}
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              {t('auth.register')}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;