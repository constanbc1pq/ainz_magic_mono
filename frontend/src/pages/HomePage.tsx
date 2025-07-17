import React from 'react';
import { Container, Typography, Box as MuiBox, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Login as LoginIcon, 
  PersonAdd as RegisterIcon, 
  Dashboard as DashboardIcon 
} from '@mui/icons-material';

const Box = MuiBox as any;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to ArticulateHub
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          AI-powered 3D Model Articulation Platform
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px' }}>
          Transform your static 3D models into articulated characters with our AI-powered 
          bone generation system. Upload your model, describe your vision, and let our AI 
          create the perfect skeletal structure.
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              欢迎回来，{user?.username}！
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              进入仪表盘
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/project/new')}
            >
              创建新项目
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
            <Grid item>
              <Button
                variant="contained"
                size="large"
                startIcon={<RegisterIcon />}
                onClick={handleGetStarted}
              >
                开始使用
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
              >
                立即登录
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;