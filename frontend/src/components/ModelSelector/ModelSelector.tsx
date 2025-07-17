import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  Chip,
  Avatar,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import {
  ViewInAr as ModelIcon,
  DateRange as DateIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import api from '../../services/api';

interface UserModelFile {
  id: number;
  projectId: number;
  projectName: string;
  fileName: string;
  fileType: string;
  createdAt: string;
}

interface ModelSelectorProps {
  onModelSelect: (modelFile: UserModelFile | null) => void;
  selectedModel?: UserModelFile | null;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  onModelSelect,
  selectedModel,
}) => {
  const [modelFiles, setModelFiles] = useState<UserModelFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserModelFiles();
  }, []);

  const fetchUserModelFiles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/projects/user/model-files');
      setModelFiles(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || '获取模型文件失败');
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const modelId = parseInt(event.target.value);
    const selectedModel = modelFiles.find(model => model.id === modelId);
    onModelSelect(selectedModel || null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'glb':
        return 'primary';
      case 'obj':
        return 'secondary';
      case 'ply':
        return 'success';
      default:
        return 'default';
    }
  };

  // PreviewVideo组件 - 显示模型预览视频
  const PreviewVideo: React.FC<{ projectId: number }> = ({ projectId }) => {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
      const loadVideo = async () => {
        try {
          setLoading(true);
          setError('');
          const response = await api.get(`/api/projects/${projectId}/download/preview_video`, {
            responseType: 'blob',
          });
          
          // 创建具有正确MIME类型的Blob
          const blob = new Blob([response.data], { type: 'video/mp4' });
          const blobUrl = window.URL.createObjectURL(blob);
          setVideoUrl(blobUrl);
        } catch (err) {
          console.error('预览视频加载失败:', err);
          setError('预览视频不可用');
        } finally {
          setLoading(false);
        }
      };

      loadVideo();

      // 清理函数
      return () => {
        if (videoUrl && videoUrl.startsWith('blob:')) {
          window.URL.revokeObjectURL(videoUrl);
        }
      };
    }, [projectId]);

    if (loading) {
      return (
        <Box sx={{ 
          height: 120, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          backgroundColor: 'background.default'
        }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ 
          height: 120, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          backgroundColor: 'background.default'
        }}>
          <Typography variant="caption" color="text.secondary">{error}</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ 
        height: 120, 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: 'background.default'
      }}>
        <video
          width="100%"
          height="100%"
          controls
          muted
          loop
          style={{ 
            objectFit: 'cover',
            display: 'block'
          }}
          src={videoUrl}
          onError={() => setError('视频播放失败')}
        >
          您的浏览器不支持视频播放。
        </video>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          选择已有3D模型
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={6} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="rectangular" height={60} />
                  <Skeleton variant="text" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (modelFiles.length === 0) {
    return (
      <Card sx={{ textAlign: 'center', py: 4 }}>
        <CardContent>
          <ModelIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            暂无可用的3D模型
          </Typography>
          <Typography variant="body2" color="text.secondary">
            请先创建"图片生成3D模型"项目来生成3D模型文件
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        选择已有3D模型
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        从您之前生成的3D模型中选择一个作为骨骼生成的输入
      </Typography>

      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend" sx={{ mb: 2 }}>
          可用模型 ({modelFiles.length}个)
        </FormLabel>
        
        <RadioGroup
          value={selectedModel?.id?.toString() || ''}
          onChange={handleModelChange}
        >
          <Grid container spacing={2}>
            {modelFiles.map((modelFile) => (
              <Grid item xs={12} md={6} key={modelFile.id}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: selectedModel?.id === modelFile.id ? 2 : 1,
                    borderColor: selectedModel?.id === modelFile.id ? 'primary.main' : 'divider',
                    '&:hover': {
                      boxShadow: 3,
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => onModelSelect(modelFile)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <FormControlLabel
                        value={modelFile.id.toString()}
                        control={<Radio />}
                        label=""
                        sx={{ mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.main',
                              width: 32,
                              height: 32,
                              mr: 1,
                            }}
                          >
                            <ModelIcon fontSize="small" />
                          </Avatar>
                          <Typography variant="subtitle1" noWrap>
                            {modelFile.fileName}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <FolderIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {modelFile.projectName}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DateIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(modelFile.createdAt)}
                            </Typography>
                          </Box>
                          
                          <Chip
                            label={modelFile.fileType.toUpperCase()}
                            color={getFileTypeColor(modelFile.fileType) as any}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* 预览视频区域 */}
                    <Box sx={{ mt: 2 }}>
                      <PreviewVideo projectId={modelFile.projectId} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default ModelSelector;