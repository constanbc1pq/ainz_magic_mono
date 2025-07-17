import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  ViewInAr as ModelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'CREATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  type: 'IMAGE_TO_3D' | 'MODEL_TO_SKELETON';
  createdAt: string;
  updatedAt: string;
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/projects');
      setProjects(response.data);
    } catch (error: any) {
      setError('加载项目列表失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    navigate('/project/new');
  };

  const handleViewProject = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  const handleViewResult = (projectId: number) => {
    navigate(`/result/${projectId}`);
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      await api.delete(`/api/projects/${project.id}`);
      await loadProjects(); // 重新加载项目列表
      setDeleteDialog({ open: false, project: null });
    } catch (error: any) {
      setError('删除项目失败: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PROCESSING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CREATED':
        return '已创建';
      case 'PROCESSING':
        return '处理中';
      case 'COMPLETED':
        return '已完成';
      case 'FAILED':
        return '失败';
      default:
        return status;
    }
  };

  const getProjectTypeIcon = (type: string) => {
    return type === 'IMAGE_TO_3D' ? <span>🐤</span> : <span>🦴</span>;
  };

  const getProjectTypeText = (type: string) => {
    return type === 'IMAGE_TO_3D' ? '图片生成3D模型' : '3D模型生成骨骼';
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            项目列表
          </Typography>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            我的项目
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
            size="large"
          >
            创建新项目
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {projects.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              暂无项目
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              创建您的第一个项目开始体验AI 3D建模功能
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateProject}
            >
              创建项目
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getProjectTypeIcon(project.type)}
                      <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                        {project.name}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {getProjectTypeText(project.type)}
                    </Typography>

                    {project.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {project.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Chip
                        label={getStatusText(project.status)}
                        color={getStatusColor(project.status) as any}
                        size="small"
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      创建时间: {new Date(project.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    {project.status === 'COMPLETED' ? (
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewResult(project.id)}
                      >
                        查看结果
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleViewProject(project.id)}
                      >
                        {project.status === 'PROCESSING' ? '查看进度' : '继续编辑'}
                      </Button>
                    )}
                    
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, project })}
                    >
                      删除
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* 悬浮创建按钮 */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleCreateProject}
        >
          <AddIcon />
        </Fab>

        {/* 删除确认对话框 */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, project: null })}>
          <DialogTitle>确认删除</DialogTitle>
          <DialogContent>
            <Typography>
              确定要删除项目 "{deleteDialog.project?.name}" 吗？此操作无法撤销。
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, project: null })}>
              取消
            </Button>
            <Button
              onClick={() => deleteDialog.project && handleDeleteProject(deleteDialog.project)}
              color="error"
              variant="contained"
            >
              删除
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ProjectsPage;