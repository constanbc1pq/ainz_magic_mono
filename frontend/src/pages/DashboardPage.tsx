import React from 'react';
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
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  CloudUpload as UploadIcon,
  History as HistoryIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
                欢迎回来，{user?.username}！
              </Typography>
              <Typography variant="body1" color="text.secondary">
                使用AI技术将您的3D模型转换为可动画的关节结构
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={`邮箱: ${user?.email}`}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`注册时间: ${new Date(user?.createdAt || '').toLocaleDateString()}`}
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
                  项目总数
                </Typography>
                <Typography variant="h3" color="primary">
                  {user?._count?.projects || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  处理记录
                </Typography>
                <Typography variant="h3" color="secondary">
                  {user?._count?.modelProcesses || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  账户状态
                </Typography>
                <Chip
                  label="活跃"
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
          快速操作
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AddIcon sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
                  <Typography variant="h6">
                    创建新项目
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  开始一个新的3D模型关节生成项目
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
                  创建项目
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
                    项目管理
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  查看和管理您的所有项目
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
                  查看项目
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
                    个人资料
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  查看和编辑您的个人资料设置
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
                  个人资料
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
                    快速上传
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  直接上传3D模型文件进行处理
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
                  上传模型
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* 最近活动 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            最近活动
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                暂无最近活动记录
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                创建您的第一个项目来开始使用ArticulateHub
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;