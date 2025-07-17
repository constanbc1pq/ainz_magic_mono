import React, { useEffect, useState, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  LinearProgress, 
  Alert,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider
} from '@mui/material';
import { 
  Download as DownloadIcon, 
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Psychology as ProcessingIcon,
  ViewInAr as ModelIcon,
  Image as ImageIcon,
  PlayArrow as PlayIcon,
  Article as FileIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStatus } from '../hooks/useProjectStatus';
import SimpleModelPreview from '../components/ModelUpload/SimpleModelPreview';
import api from '../services/api';

enum ProjectType {
  IMAGE_TO_3D = 'IMAGE_TO_3D',
  MODEL_TO_SKELETON = 'MODEL_TO_SKELETON'
}

interface ProjectInfo {
  id: number;
  name: string;
  type: ProjectType;
  status: string;
  createdAt: string;
  parentProjectId?: number;
  files?: any[];
}

const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // 使用ref来确保每个文件类型只创建一次blob URL
  const previewUrlsRef = useRef<Record<string, string>>({});
  const loadingRef = useRef<Record<string, boolean>>({});

  const createPreviewUrl = async (fileType: string): Promise<string> => {
    // 如果已经有URL，直接返回
    if (previewUrlsRef.current[fileType]) {
      console.log(`✅ 使用缓存的blob URL: ${fileType}`, previewUrlsRef.current[fileType]);
      return previewUrlsRef.current[fileType];
    }

    // 如果正在加载，等待加载完成
    if (loadingRef.current[fileType]) {
      console.log(`⏳ ${fileType} 正在加载中，等待完成...`);
      // 等待加载完成
      while (loadingRef.current[fileType]) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (previewUrlsRef.current[fileType]) {
        return previewUrlsRef.current[fileType];
      }
    }

    try {
      loadingRef.current[fileType] = true;
      console.log(`🔄 开始加载 ${fileType} 文件...`);
      
      const response = await api.get(`/api/projects/${id}/download/${fileType}`, {
        responseType: 'blob',
      });
      
      console.log(`✅ ${fileType} 文件加载成功`, {
        size: response.data.size,
        type: response.data.type,
        status: response.status
      });
      
      // 确保正确的MIME类型
      let mimeType: string;
      switch (fileType) {
        case 'glb':
          mimeType = 'model/gltf-binary';
          break;
        case 'preview_video':
          mimeType = 'video/mp4';
          break;
        case 'obj':
          mimeType = 'text/plain';
          break;
        default:
          mimeType = response.data.type || 'application/octet-stream';
      }
      
      // 创建具有正确MIME类型的Blob
      const blob = new Blob([response.data], { type: mimeType });
      const blobUrl = window.URL.createObjectURL(blob);
      
      // 保存到ref中
      previewUrlsRef.current[fileType] = blobUrl;
      
      console.log(`✅ 创建blob URL成功: ${fileType}`, {
        url: blobUrl,
        blobSize: blob.size,
        blobType: blob.type
      });
      
      return blobUrl;
    } catch (error) {
      console.error(`❌ 获取${fileType}预览失败:`, error);
      throw error;
    } finally {
      loadingRef.current[fileType] = false;
    }
  };

  // 清理blob URLs
  useEffect(() => {
    return () => {
      Object.values(previewUrlsRef.current).forEach((url: string) => {
        if (url.startsWith('blob:')) {
          window.URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // 动画处理函数
  const handlePollingEvent = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600); // 600ms动画时长
  };

  // 使用真实的处理状态
  const { status, loading, error, refetch, waitingSeconds } = useProjectStatus(
    id || null, 
    2000, 
    handlePollingEvent
  );

  // 获取项目信息
  useEffect(() => {
    const fetchProjectInfo = async () => {
      if (!id) return;
      
      try {
        setLoadingProject(true);
        const response = await api.get(`/api/projects/${id}`);
        setProjectInfo(response.data);
      } catch (error) {
        console.error('获取项目信息失败:', error);
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProjectInfo();
  }, [id]);

  // 计算进度百分比
  const getProgressPercentage = () => {
    if (!status) return 0;
    switch (status.status) {
      case 'created': return 10;
      case 'uploaded': return 30;
      case 'processing': return 65;
      case 'completed': return 100;
      case 'failed': return 0;
      default: return 0;
    }
  };

  // 获取状态消息
  const getStatusMessage = () => {
    if (!status) return '正在获取状态...';
    if (!projectInfo) return '正在获取项目信息...';
    
    const isImageTo3D = projectInfo.type === ProjectType.IMAGE_TO_3D;
    
    switch (status.status) {
      case 'created': return '任务已创建';
      case 'uploaded': return '文件上传完成';
      case 'processing': return isImageTo3D ? '正在生成3D模型...' : '正在生成骨骼结构...';
      case 'completed': return isImageTo3D ? '3D模型生成完成！' : '骨骼生成完成！';
      case 'failed': return '处理失败';
      default: return '未知状态';
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  const handleCreateNew = () => {
    navigate('/project/new');
  };

  const handleDownload = async (fileType: string, fileName: string) => {
    try {
      const response = await api.get(`/api/projects/${id}/download/${fileType}`, {
        responseType: 'blob',
      });
      
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请稍后重试');
    }
  };

  const getStatusIcon = () => {
    if (!status) return <ProcessingIcon color="primary" />;
    switch (status.status) {
      case 'processing':
        return <ProcessingIcon color="primary" />;
      case 'completed':
        return <SuccessIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return <ProcessingIcon color="primary" />;
    }
  };

  const getStatusColor = () => {
    if (!status) return 'primary';
    switch (status.status) {
      case 'processing':
        return 'primary';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'primary';
    }
  };

  // 图片预览组件
  const ImagePreview: React.FC<{ fileType: string }> = ({ fileType }) => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
      const loadImage = async () => {
        try {
          setLoading(true);
          setError('');
          const url = await createPreviewUrl(fileType);
          setImageUrl(url);
        } catch (err) {
          console.error(`❌ 图片加载失败:`, err);
          setError('图片加载失败');
        } finally {
          setLoading(false);
        }
      };

      loadImage();
    }, [fileType]);

    if (loading) {
      return (
        <Box sx={{ 
          width: '100%', 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          backgroundColor: 'background.default'
        }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ 
          width: '100%', 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'error.main',
          borderRadius: 1,
          backgroundColor: 'background.default'
        }}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ 
        width: '100%', 
        height: 300, 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: 'background.default',
        overflow: 'hidden'
      }}>
        <img
          src={imageUrl}
          alt="原始输入图片"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block'
          }}
          onLoad={() => console.log('图片加载成功')}
          onError={(e) => {
            console.error('图片显示错误:', e);
            setError('图片显示失败');
          }}
        />
      </Box>
    );
  };

  // 视频预览组件
  const VideoPreview: React.FC<{ fileType: string }> = ({ fileType }) => {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
      const loadVideo = async () => {
        try {
          setLoading(true);
          setError('');
          const url = await createPreviewUrl(fileType);
          setVideoUrl(url);
        } catch (err) {
          console.error(`❌ 视频加载失败:`, err);
          setError('视频加载失败');
        } finally {
          setLoading(false);
        }
      };

      loadVideo();
    }, [fileType]); // 移除videoUrl依赖，避免重复加载

    if (loading) {
      return (
        <Box sx={{ 
          width: '100%', 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          backgroundColor: 'background.default'
        }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ 
          width: '100%', 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'error.main',
          borderRadius: 1,
          backgroundColor: 'background.default'
        }}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ 
        width: '100%', 
        height: 300, 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: 'background.default',
        overflow: 'hidden'
      }}>
        <video
          width="100%"
          height="100%"
          controls
          style={{ 
            objectFit: 'contain',
            display: 'block'
          }}
          src={videoUrl}
          onLoadedData={(e) => console.log('视频数据加载成功', e)}
          onError={(e) => {
            console.error('视频加载错误:', e);
            const video = e.target as HTMLVideoElement;
            console.error('视频错误详情:', {
              error: video.error,
              src: video.src,
              readyState: video.readyState,
              networkState: video.networkState
            });
          }}
        >
          您的浏览器不支持视频播放。
        </video>
      </Box>
    );
  };

  // 3D模型预览组件
  const ModelPreview: React.FC<{ fileType: string }> = ({ fileType }) => {
    const [modelUrl, setModelUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
      const loadModel = async () => {
        try {
          setLoading(true);
          setError('');
          const url = await createPreviewUrl(fileType);
          setModelUrl(url);
        } catch (err) {
          console.error(`❌ 模型加载失败:`, err);
          setError('模型加载失败');
        } finally {
          setLoading(false);
        }
      };

      loadModel();
    }, [fileType]); // 移除modelUrl依赖，避免重复加载

    if (loading) {
      return (
        <Box sx={{ 
          width: '100%', 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          backgroundColor: 'background.default'
        }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ 
          width: '100%', 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'error.main',
          borderRadius: 1,
          backgroundColor: 'background.default'
        }}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    // 根据文件类型确定模型格式
    let modelFormat: 'glb' | 'obj' | 'stl' = 'obj';
    if (fileType === 'glb') {
      modelFormat = 'glb';
    } else if (fileType === 'input_model') {
      // 对于输入模型，默认使用glb，但可以根据文件名扩展名确定
      modelFormat = 'glb';
    }

    return (
      <SimpleModelPreview 
        file={null} 
        modelUrl={modelUrl}
        width={300}
        height={300}
        modelFormat={modelFormat}
      />
    );
  };

  // 渲染完成结果内容
  const renderCompletedContent = () => {
    if (!projectInfo) return null;
    
    const isImageTo3D = projectInfo.type === ProjectType.IMAGE_TO_3D;
    
    return (
      <>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body1">
            🎉 {isImageTo3D ? '3D模型生成完成！您的图片已成功转换为3D模型。' : '骨骼生成完成！您的3D模型已成功生成关节结构。'}
          </Typography>
        </Alert>
        
        {/* 结果预览 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {isImageTo3D ? (
            <>
              {/* 图片生成3D模型的结果 */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <ImageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      原始输入图片
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      用于生成3D模型的原始图片
                    </Typography>
                    
                    {/* 原始图片内嵌预览 */}
                    <Box sx={{ mb: 2 }}>
                      <ImagePreview fileType="input_image" />
                    </Box>
                    
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      fullWidth
                      onClick={() => handleDownload('input_image', 'original_image.jpg')}
                    >
                      下载原始图片
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <ModelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      3D模型预览
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      GLB格式的3D模型文件，可用于各种3D应用
                    </Typography>
                    
                    {/* 3D模型内嵌预览 */}
                    <Box sx={{ mb: 2 }}>
                      <ModelPreview fileType="glb" />
                    </Box>
                    
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      fullWidth
                      onClick={() => handleDownload('glb', 'model.glb')}
                    >
                      下载GLB模型
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <PlayIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      360度预览视频
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      3D模型的360度旋转预览视频
                    </Typography>
                    
                    {/* 视频内嵌预览 */}
                    <Box sx={{ mb: 2 }}>
                      <VideoPreview fileType="preview_video" />
                    </Box>
                    
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      fullWidth
                      onClick={() => handleDownload('preview_video', 'preview.mp4')}
                    >
                      下载预览视频
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </>
          ) : (
            <>
              {/* 3D模型生成骨骼的结果 */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <ModelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      原始输入模型
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      用于生成骨骼的原始3D模型
                    </Typography>
                    
                    {/* 原始模型内嵌预览 */}
                    <Box sx={{ mb: 2 }}>
                      <ModelPreview fileType="input_model" />
                    </Box>
                    
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      fullWidth
                      onClick={() => handleDownload('input_model', 'original_model.glb')}
                    >
                      下载原始模型
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      骨骼结构预览
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      生成的骨骼结构可视化预览
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <ModelPreview fileType="obj" />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload('obj', 'skeleton.obj')}
                      >
                        下载OBJ文件
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload('zip', 'skeleton.zip')}
                      >
                        下载完整包
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </>
    );
  };

  // 渲染处理中的内容
  const renderProcessingContent = () => {
    if (!projectInfo) return null;
    
    const isImageTo3D = projectInfo.type === ProjectType.IMAGE_TO_3D;
    
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          {isImageTo3D ? 'AI正在将您的图片转换为3D模型...' : 'AI正在分析您的3D模型结构...'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          这个过程可能需要几分钟时间，请耐心等待
        </Typography>
      </Box>
    );
  };

  if (loadingProject) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            正在加载项目信息...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      {/* CSS动画定义 */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
      
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          处理结果 - {projectInfo?.name || `项目 ${id}`}
        </Typography>
        
        {/* 项目类型指示器 */}
        {projectInfo && (
          <Box sx={{ mb: 3 }}>
            <Chip 
              icon={projectInfo.type === ProjectType.IMAGE_TO_3D ? <span>🐤</span> : <span>🦴</span>}
              label={projectInfo.type === ProjectType.IMAGE_TO_3D ? '图片生成3D模型' : '3D模型生成骨骼'}
              color={projectInfo.type === ProjectType.IMAGE_TO_3D ? 'secondary' : 'primary'}
              variant="outlined"
            />
          </Box>
        )}
        
        {/* 状态卡片 */}
        <Paper sx={{ p: 4, mt: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {getStatusIcon()}
            <Typography variant="h6" sx={{ ml: 2 }}>
              {error || getStatusMessage()}
            </Typography>
            <Chip 
              label={
                (!status || status.status === 'processing') ? '处理中' : 
                status.status === 'completed' ? '已完成' : 
                status.status === 'failed' ? '失败' : '未知'
              } 
              color={getStatusColor() as any}
              sx={{ ml: 'auto' }}
            />
          </Box>

          {/* 进度条 */}
          {(!status || status.status === 'processing') && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={getProgressPercentage()} 
                  sx={{ height: 8, borderRadius: 4, flexGrow: 1 }}
                />
                <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', minWidth: 100 }}>
                  <span 
                    style={{
                      fontSize: '20px',
                      marginRight: '8px',
                      display: 'inline-block',
                      animation: isAnimating ? 'bounce 0.6s ease-in-out' : 'none',
                      transformOrigin: 'center bottom'
                    }}
                  >
                    {projectInfo?.type === ProjectType.IMAGE_TO_3D ? '🐤' : '🦴'}
                  </span>
                  <Typography variant="body2" color="text.secondary">
                    {Math.floor(waitingSeconds / 60)}:{(waitingSeconds % 60).toString().padStart(2, '0')}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {Math.round(getProgressPercentage())}% 完成
              </Typography>
            </Box>
          )}

          {/* 处理完成的结果 */}
          {status?.status === 'completed' && renderCompletedContent()}

          {/* 处理失败 */}
          {status?.status === 'failed' && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body1">
                处理失败：{error || '未知错误'}
              </Typography>
            </Alert>
          )}

          {/* 处理中的详细信息 */}
          {(!status || status.status === 'processing') && renderProcessingContent()}
        </Paper>

        {/* 操作按钮 */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={handleBackToHome}>
            返回首页
          </Button>
          
          <Button variant="outlined" onClick={handleBackToProjects}>
            返回项目列表
          </Button>
          
          {status?.status === 'failed' && (
            <Button 
              variant="contained" 
              color="error"
              onClick={refetch}
            >
              重新检查
            </Button>
          )}
          
          <Button 
            variant="contained" 
            onClick={handleCreateNew}
            color="secondary"
          >
            创建新项目
          </Button>
        </Box>
      </Box>
    </Container>
    </>
  );
};

export default ResultPage;