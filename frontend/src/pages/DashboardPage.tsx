import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  CloudUpload as UploadIcon,
  History as HistoryIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 获取完整的用户数据包括项目统计
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const userData = await authService.getProfile();
          setDashboardData(userData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const handleCreateProject = () => {
    navigate('/project/new');
  };

  const handleViewProjects = () => {
    navigate('/projects');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* 欢迎区域 */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
                src={user?.avatar}
              >
                {user?.username?.charAt(0).toUpperCase() || <PersonIcon />}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" component="h1" gutterBottom>
                {t('dashboard.welcome', { username: user?.username })}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('dashboard.subtitle')}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={`${t('auth.email')}: ${user?.email}`}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`${t('dashboard.registerTime')}: ${new Date(user?.createdAt || '').toLocaleDateString()}`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* 统计卡片 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('dashboard.totalProjects')}
                </Typography>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: '#ffd700', // 明亮的金色
                    fontWeight: 'bold',
                    textShadow: '0 0 8px rgba(255, 215, 0, 0.3)' // 添加发光效果
                  }}
                >
                  {loading ? '...' : (dashboardData?._count?.projects || user?._count?.projects || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('dashboard.processRecords')}
                </Typography>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: '#ffd700', // 统一使用明亮的金色
                    fontWeight: 'bold',
                    textShadow: '0 0 8px rgba(255, 215, 0, 0.3)' // 添加发光效果
                  }}
                >
                  {loading ? '...' : (dashboardData?._count?.modelProcesses || user?._count?.modelProcesses || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('dashboard.accountStatus')}
                </Typography>
                <Chip
                  label={t('dashboard.active')}
                  color="success"
                  variant="filled"
                  sx={{ fontSize: '1.1rem', px: 2, py: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 快速操作 */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
          {t('dashboard.quickActions')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AddIcon sx={{ 
                    mr: 1, 
                    fontSize: 32, 
                    color: '#ffd700', // 明亮的金色
                    filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))' // 添加发光效果
                  }} />
                  <Typography variant="h6">
                    {t('dashboard.createProject')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('dashboard.createProjectDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="large"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateProject}
                  fullWidth
                >
                  {t('dashboard.createProject')}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HistoryIcon sx={{ mr: 1, fontSize: 32, color: 'secondary.main' }} />
                  <Typography variant="h6">
                    {t('dashboard.projectManagement')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('dashboard.projectManagementDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="large"
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  onClick={handleViewProjects}
                  fullWidth
                >
                  {t('dashboard.viewProjects')}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, fontSize: 32, color: 'info.main' }} />
                  <Typography variant="h6">
                    {t('nav.profile')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('dashboard.profileDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="large"
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={handleViewProfile}
                  fullWidth
                >
                  {t('nav.profile')}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <UploadIcon sx={{ mr: 1, fontSize: 32, color: 'warning.main' }} />
                  <Typography variant="h6">
                    {t('dashboard.quickUpload')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('dashboard.quickUploadDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="large"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => navigate('/upload')}
                  fullWidth
                >
                  {t('dashboard.uploadModel')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* 最近活动 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {t('dashboard.recentActivity')}
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                {t('dashboard.noActivity')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('dashboard.createFirstProject')}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;