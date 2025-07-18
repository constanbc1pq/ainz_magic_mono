import React from 'react';
import { 
  Container, 
  Typography, 
  Box as MuiBox, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Paper,
  Stack,
  Chip,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Login as LoginIcon, 
  PersonAdd as RegisterIcon, 
  Dashboard as DashboardIcon,
  AutoAwesome as MagicIcon,
  Architecture as ModelIcon,
  Speed as FastIcon,
  Security as SecureIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Logo from '../components/Logo/Logo';
import { useTranslation } from 'react-i18next';
import ArchitectureFlowChart from '../components/ArchitectureFlowChart/ArchitectureFlowChart';

const Box = MuiBox as any;

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${alpha('#1a1a1a', 0.8)} 0%, 
    ${alpha('#2d1810', 0.85)} 50%, 
    ${alpha('#1a1a1a', 0.8)} 100%),
    url('/bg1.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(10, 4),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '70vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, 
      ${alpha('#ff6b35', 0.1)} 0%, 
      ${alpha('#f7931e', 0.15)} 25%,
      ${alpha('#ffcc02', 0.1)} 50%,
      ${alpha('#ff6b35', 0.1)} 100%)`,
    opacity: 0.7,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffd700" fill-opacity="0.08"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 12px 24px ${alpha(theme.palette.secondary.main, 0.3)}`,
  },
}));


const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: <MagicIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: t('home.features.aiSkeleton'),
      description: t('home.features.aiSkeletonDesc'),
      emoji: '🤖',
    },
    {
      icon: <ModelIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: t('home.features.multiFormat'),
      description: t('home.features.multiFormatDesc'),
      emoji: '🎨',
    },
    {
      icon: <FastIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: t('home.features.realtime'),
      description: t('home.features.realtimeDesc'),
      emoji: '⚡',
    },
    {
      icon: <SecureIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: t('home.features.secure'),
      description: t('home.features.secureDesc'),
      emoji: '🔒',
    },
  ];


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <HeroSection>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 3,
          position: 'relative',
          zIndex: 2
        }}>
          <Logo size={80} clickable={false} />
          <Typography 
            variant="h3" 
            component="div"
            sx={{ 
              mt: 2,
              fontWeight: 'bold',
              color: '#ffd700',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)',
              letterSpacing: '0.5px'
            }}
          >
            AinzMagic
          </Typography>
        </Box>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            mt: 3, 
            mb: 2,
            position: 'relative',
            zIndex: 2,
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.3)',
            fontWeight: 'bold'
          }}
        >
          {t('home.title')}
        </Typography>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            mb: 3,
            position: 'relative',
            zIndex: 2,
            color: '#f5f5f5',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
            fontWeight: 500
          }}
        >
          {t('home.subtitle')}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            maxWidth: '800px', 
            mx: 'auto',
            position: 'relative',
            zIndex: 2,
            color: '#e0e0e0',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.9)',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}
        >
          {t('home.description')}
        </Typography>

        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center" 
          sx={{ 
            mb: 4,
            position: 'relative',
            zIndex: 2
          }}
        >
          <Chip 
            label={t('home.chips.imageToModel')} 
            variant="filled" 
            sx={{ 
              backgroundColor: alpha('#ff6b35', 0.9),
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
              '&:hover': {
                backgroundColor: '#ff6b35',
                boxShadow: '0 6px 16px rgba(255, 107, 53, 0.5)',
              }
            }}
          />
          <Chip 
            label={t('home.chips.modelToSkeleton')} 
            variant="filled" 
            sx={{ 
              backgroundColor: alpha('#ffcc02', 0.9),
              color: 'black',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(255, 204, 2, 0.3)',
              '&:hover': {
                backgroundColor: '#ffcc02',
                boxShadow: '0 6px 16px rgba(255, 204, 2, 0.5)',
              }
            }}
          />
          <Chip 
            label={t('home.chips.realtimeAI')} 
            variant="filled" 
            sx={{ 
              backgroundColor: alpha('#f7931e', 0.9),
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(247, 147, 30, 0.3)',
              '&:hover': {
                backgroundColor: '#f7931e',
                boxShadow: '0 6px 16px rgba(247, 147, 30, 0.5)',
              }
            }}
          />
        </Stack>

        {isAuthenticated ? (
          <Box sx={{ mt: 2, position: 'relative', zIndex: 2 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: '#ffd700',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                fontWeight: 'bold'
              }}
            >
              {t('dashboard.welcome', { username: user?.username })}
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ 
                mr: 2,
                backgroundColor: '#ff6b35',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                '&:hover': {
                  backgroundColor: '#e55a2e',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.6)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              {t('nav.dashboard')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/project/new')}
              sx={{
                borderColor: '#ffd700',
                color: '#ffd700',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                '&:hover': {
                  borderColor: '#ffcc02',
                  backgroundColor: alpha('#ffd700', 0.1),
                  boxShadow: '0 6px 20px rgba(255, 215, 0, 0.5)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              {t('nav.createProject')}
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center', position: 'relative', zIndex: 2 }}>
            <Grid item>
              <Button
                variant="contained"
                size="large"
                startIcon={<RegisterIcon />}
                onClick={handleGetStarted}
                sx={{
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '12px 32px',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)',
                  '&:hover': {
                    backgroundColor: '#e55a2e',
                    boxShadow: '0 12px 35px rgba(255, 107, 53, 0.6)',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                {t('home.getStarted')}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: '#ffd700',
                  color: '#ffd700',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '12px 32px',
                  boxShadow: '0 6px 20px rgba(255, 215, 0, 0.3)',
                  '&:hover': {
                    borderColor: '#ffcc02',
                    backgroundColor: alpha('#ffd700', 0.1),
                    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.5)',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                {t('home.learnMore')}
              </Button>
            </Grid>
          </Grid>
        )}
      </HeroSection>

      {/* Architecture Flow Chart */}
      <Box sx={{ my: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{
            color: 'secondary.main',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
            fontWeight: 'bold',
          }}
        >
          System Architecture
        </Typography>
        <Typography 
          variant="body1" 
          textAlign="center" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          Interactive flow visualization of our AI-powered 3D processing pipeline
        </Typography>
        <ArchitectureFlowChart />
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          {t('home.features.title')}
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
          {t('home.features.subtitle')}
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FeatureCard elevation={3}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {feature.icon}
                    <Typography variant="h2" sx={{ ml: 2 }}>
                      {feature.emoji}
                    </Typography>
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box sx={{ my: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            {t('home.cta.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('home.cta.subtitle')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            startIcon={<StarIcon />}
            sx={{ mr: 2 }}
          >
            {t('home.cta.start')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
          >
            {t('home.learnMore')}
          </Button>
        </Paper>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 4,
          borderTop: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Logo size={40} clickable={true} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    ml: 2,
                    fontWeight: 'bold',
                    color: 'secondary.main',
                    textShadow: '0 0 8px rgba(255, 215, 0, 0.3)'
                  }}
                >
                  AinzMagic
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {t('home.footer.description')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                {t('home.footer.products')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.imageToModel')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.modelToSkeleton')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.aiOptimization')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.batchProcessing')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                {t('home.footer.support')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.documentation')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.apiReference')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.faq')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.contact')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                {t('home.footer.community')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.forum')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  GitHub
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Discord
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.blog')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                {t('home.footer.company')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.about')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.privacy')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.terms')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.footer.security')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('home.footer.copyright')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip
                label={t('home.footer.beta')}
                size="small"
                variant="outlined"
                color="secondary"
              />
              <Chip
                label={t('home.footer.aiPowered')}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Container>
  );
};

export default HomePage;