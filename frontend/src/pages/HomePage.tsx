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
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AnziMagicLogo from '../components/Logo/AnziMagicLogo';
import { useTranslation } from 'react-i18next';

const Box = MuiBox as any;

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.primary.main, 0.1)} 0%, 
    ${alpha(theme.palette.secondary.main, 0.1)} 50%, 
    ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(8, 4),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d4af37" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
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

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
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

  const workflowSteps = [
    {
      step: 1,
      title: t('home.workflow.step1'),
      description: t('home.workflow.step1Desc'),
      icon: <UploadIcon />,
    },
    {
      step: 2,
      title: t('home.workflow.step2'),
      description: t('home.workflow.step2Desc'),
      icon: <MagicIcon />,
    },
    {
      step: 3,
      title: t('home.workflow.step3'),
      description: t('home.workflow.step3Desc'),
      icon: <ViewIcon />,
    },
    {
      step: 4,
      title: t('home.workflow.step4'),
      description: t('home.workflow.step4Desc'),
      icon: <DownloadIcon />,
    },
  ];

  const stats = [
    { label: t('home.stats.modelsProcessed'), value: '10,000+' },
    { label: t('home.stats.satisfaction'), value: '98%' },
    { label: t('home.stats.avgProcessTime'), value: t('home.stats.avgProcessTimeValue') },
    { label: t('home.stats.formatsSupported'), value: '8+' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <HeroSection>
        <AnziMagicLogo size="large" showText={true} />
        <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 3, mb: 2 }}>
          {t('home.title')}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary" sx={{ mb: 3 }}>
          {t('home.subtitle')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          {t('home.description')}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Chip label={t('home.chips.imageToModel')} variant="filled" />
          <Chip label={t('home.chips.modelToSkeleton')} variant="filled" />
          <Chip label={t('home.chips.realtimeAI')} variant="filled" />
        </Stack>

        {isAuthenticated ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.welcome', { username: user?.username })}
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              {t('nav.dashboard')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/project/new')}
            >
              {t('nav.createProject')}
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
                {t('home.getStarted')}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
              >
                {t('home.learnMore')}
              </Button>
            </Grid>
          </Grid>
        )}
      </HeroSection>

      {/* Stats Section */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          {t('home.stats.title')}
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatsCard elevation={2}>
                <Typography variant="h3" component="div" color="secondary.main" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </StatsCard>
            </Grid>
          ))}
        </Grid>
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

      {/* Workflow Section */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          {t('home.workflow.title')}
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
          {t('home.workflow.subtitle')}
        </Typography>
        <Grid container spacing={3}>
          {workflowSteps.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  position: 'relative',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.2)}`,
                  },
                }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  color="secondary.main"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: 20,
                    background: theme.palette.background.paper,
                    px: 2,
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${theme.palette.secondary.main}`,
                  }}
                >
                  {step.step}
                </Typography>
                <Box sx={{ mt: 2, mb: 2 }}>
                  {React.cloneElement(step.icon, { 
                    sx: { fontSize: 48, color: theme.palette.secondary.main } 
                  })}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Paper>
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
              <AnziMagicLogo size="small" showText={true} />
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