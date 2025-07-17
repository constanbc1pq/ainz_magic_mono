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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      setError(t('projects.loadFailed') + (error.response?.data?.message || error.message));
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
      setError(t('projects.deleteFailed') + (error.response?.data?.message || error.message));
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
        return t('projects.status.created');
      case 'PROCESSING':
        return t('projects.status.processing');
      case 'COMPLETED':
        return t('projects.status.completed');
      case 'FAILED':
        return t('projects.status.failed');
      default:
        return status;
    }
  };

  const getProjectTypeIcon = (type: string) => {
    return type === 'IMAGE_TO_3D' ? <span>🐤</span> : <span>🦴</span>;
  };

  const getProjectTypeText = (type: string) => {
    return type === 'IMAGE_TO_3D' ? t('project.typeSelector.imageToModel') : t('project.typeSelector.modelToSkeleton');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t('projects.list')}
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
            {t('projects.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
            size="large"
          >
            {t('projects.createNew')}
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
              {t('projects.noProjects')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('projects.noProjectsDesc')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateProject}
            >
              {t('projects.createProject')}
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
                      {t('projects.createdAt')}{new Date(project.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    {project.status === 'COMPLETED' ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewResult(project.id)}
                      >
                        {t('projects.actions.viewResult')}
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleViewProject(project.id)}
                      >
                        {project.status === 'PROCESSING' ? t('projects.actions.viewProgress') : t('projects.actions.continue')}
                      </Button>
                    )}
                    
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, project })}
                    >
                      {t('projects.actions.delete')}
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
          <DialogTitle>{t('projects.deleteDialog.title')}</DialogTitle>
          <DialogContent>
            <Typography>
              {t('projects.deleteDialog.message', { name: deleteDialog.project?.name })}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, project: null })}>
              {t('projects.deleteDialog.cancel')}
            </Button>
            <Button
              onClick={() => deleteDialog.project && handleDeleteProject(deleteDialog.project)}
              color="error"
              variant="contained"
            >
              {t('projects.deleteDialog.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ProjectsPage;