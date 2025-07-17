import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Grid,
  TextField,
  Collapse,
  IconButton,
  Slider,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import api from '../../services/api';

interface ImageUploadProps {
  projectId: number;
  onUploadComplete: (result: any) => void;
  onError?: (error: string) => void;
}

interface ProcessingSettings {
  seed: number;
  ssGuidanceStrength: number;
  ssSamplingSteps: number;
  slatGuidanceStrength: number;
  slatSamplingSteps: number;
  meshSimplify: number;
  textureSize: number;
}

const DEFAULT_SETTINGS: ProcessingSettings = {
  seed: 0,
  ssGuidanceStrength: 7.5,
  ssSamplingSteps: 12,
  slatGuidanceStrength: 3.0,
  slatSamplingSteps: 12,
  meshSimplify: 0.95,
  textureSize: 1024,
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  projectId,
  onUploadComplete,
  onError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ProcessingSettings>(DEFAULT_SETTINGS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('请选择 JPG、PNG 或 WEBP 格式的图片');
        return;
      }

      // 验证文件大小 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('图片大小不能超过 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
  });

  const handleProcess = async () => {
    if (!selectedFile) {
      setError('请先选择一张图片');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // 转换文件为base64
      const base64 = await fileToBase64(selectedFile);
      
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 2000);

      const response = await api.post('/api/projects/process-image', {
        projectId: projectId.toString(),
        imageName: selectedFile.name,
        imageContent: base64,
        seed: settings.seed,
        ssGuidanceStrength: settings.ssGuidanceStrength,
        ssSamplingSteps: settings.ssSamplingSteps,
        slatGuidanceStrength: settings.slatGuidanceStrength,
        slatSamplingSteps: settings.slatSamplingSteps,
        meshSimplify: settings.meshSimplify,
        textureSize: settings.textureSize,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.data.success) {
        // 图片处理已开始，跳转到结果页面等待
        onUploadComplete({
          success: true,
          projectId: response.data.projectId,
          status: response.data.status
        });
      } else {
        throw new Error(response.data.error || '处理失败');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '处理失败';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // 移除 data:image/xxx;base64, 前缀
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
    });
  };

  const handleSettingChange = (key: keyof ProcessingSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            图片上传
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!selectedFile ? (
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
            >
              <input {...getInputProps()} />
              <UploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {isDragActive ? '放开鼠标上传图片' : '拖拽图片到此处或点击上传'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                支持 JPG、PNG、WEBP 格式，最大 10MB
              </Typography>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ImageIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">
                          {selectedFile.name}
                        </Typography>
                      </Box>
                      {previewUrl && (
                        <Box
                          component="img"
                          src={previewUrl}
                          sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'contain',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    文件大小: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    文件类型: {selectedFile.type}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    重新选择
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 高级设置 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SettingsIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              处理设置
            </Typography>
            <IconButton
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ ml: 'auto' }}
            >
              {showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={showAdvanced}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel>随机种子 (Seed)</FormLabel>
                  <TextField
                    type="number"
                    value={settings.seed}
                    onChange={(e) => handleSettingChange('seed', parseInt(e.target.value) || 0)}
                    size="small"
                    inputProps={{ min: 0 }}
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel>纹理大小</FormLabel>
                  <TextField
                    select
                    value={settings.textureSize}
                    onChange={(e) => handleSettingChange('textureSize', parseInt(e.target.value))}
                    size="small"
                    SelectProps={{ native: true }}
                  >
                    <option value={512}>512x512</option>
                    <option value={1024}>1024x1024</option>
                    <option value={2048}>2048x2048</option>
                  </TextField>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel>SS 引导强度: {settings.ssGuidanceStrength}</FormLabel>
                  <Slider
                    value={settings.ssGuidanceStrength}
                    onChange={(_, value) => handleSettingChange('ssGuidanceStrength', value as number)}
                    min={1}
                    max={20}
                    step={0.5}
                    valueLabelDisplay="auto"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel>SS 采样步数: {settings.ssSamplingSteps}</FormLabel>
                  <Slider
                    value={settings.ssSamplingSteps}
                    onChange={(_, value) => handleSettingChange('ssSamplingSteps', value as number)}
                    min={1}
                    max={50}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel>SLAT 引导强度: {settings.slatGuidanceStrength}</FormLabel>
                  <Slider
                    value={settings.slatGuidanceStrength}
                    onChange={(_, value) => handleSettingChange('slatGuidanceStrength', value as number)}
                    min={1}
                    max={10}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel>网格简化率: {settings.meshSimplify}</FormLabel>
                  <Slider
                    value={settings.meshSimplify}
                    onChange={(_, value) => handleSettingChange('meshSimplify', value as number)}
                    min={0.1}
                    max={1}
                    step={0.05}
                    valueLabelDisplay="auto"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Collapse>
        </CardContent>
      </Card>

      {/* 处理按钮 */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleProcess}
          disabled={!selectedFile || processing}
          startIcon={processing ? undefined : <UploadIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          {processing ? '处理中...' : '开始生成3D模型'}
        </Button>
        
        {processing && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              处理进度: {progress}%
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ImageUpload;