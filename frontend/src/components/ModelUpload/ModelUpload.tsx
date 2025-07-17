import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box as MuiBox,
  Paper,
  Typography,
  Button,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Alert,
  Grid
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Psychology as AIIcon
} from '@mui/icons-material';
import SimpleModelPreview from './SimpleModelPreview';
import modelService from '../../services/modelService';

const Box = MuiBox as any;

interface ModelUploadProps {
  onUploadComplete: (data: any) => void;
}

const ModelUpload: React.FC<ModelUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [promptWeight, setPromptWeight] = useState(0.5);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 预设模板
  const templates = [
    { id: 'humanoid_basic', name: '人形角色', category: 'character' },
    { id: 'animal_quadruped', name: '四足动物', category: 'animal' },
    { id: 'mechanical_robot', name: '机械物体', category: 'mechanical' },
    { id: 'flexible_character', name: '高灵活性角色', category: 'character' }
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/obj': ['.obj'],
      'model/ply': ['.ply'], 
      'model/stl': ['.stl'],
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
      'application/octet-stream': ['.fbx', '.obj', '.ply', '.stl', '.glb']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // 根据模板设置默认提示词
      const defaultPrompts = {
        'humanoid_basic': '人形角色，需要灵活的手指关节和腰部扭转能力',
        'animal_quadruped': '四足动物，注重腿部关节和脊椎的自然运动',
        'mechanical_robot': '机械物体，精确的关节连接和机械式运动',
        'flexible_character': '高灵活性角色，详细的手指和脊椎关节分割'
      };
      setUserPrompt(defaultPrompts[templateId as keyof typeof defaultPrompts] || '');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('请选择要上传的3D模型文件');
      return;
    }

    if (!userPrompt.trim()) {
      setError('请输入提示词描述');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 调用实际的上传服务
      const uploadData = {
        file,
        userPrompt,
        templateId: selectedTemplate || 'custom',
        promptWeight,
      };

      // 使用modelService进行真实上传
      const result = await modelService.uploadModel(uploadData);
      
      onUploadComplete(result);

    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        <AIIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        智能骨骼生成
      </Typography>

      <Grid container spacing={3}>
        {/* 左侧：文件上传和配置 */}
        <Grid item xs={12} md={6}>
          {/* 文件上传区域 */}
          <Paper
            {...getRootProps()}
            sx={{
              p: 4,
              mb: 3,
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.500',
              bgcolor: isDragActive ? 'action.hover' : 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <input {...getInputProps()} />
            {file ? (
              <Box>
                <FileIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6">{file.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              </Box>
            ) : (
              <Box>
                <UploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive ? '释放文件以上传' : '拖拽文件到此处或点击选择'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  支持格式: .obj, .ply, .stl, .glb, .fbx (最大50MB)
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 右侧：3D模型预览 */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              模型预览
            </Typography>
            <SimpleModelPreview 
              key={file?.name || 'no-file'}
              file={file} 
              width={400} 
              height={300}
            />
          </Box>
        </Grid>
      </Grid>

      {/* 提示词配置区域 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          描述你的模型关节需求
        </Typography>

        {/* 模板选择 */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>选择预设模板</InputLabel>
          <Select
            value={selectedTemplate}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            label="选择预设模板"
          >
            <MenuItem value="">自定义</MenuItem>
            {templates.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                <Chip 
                  label={template.category} 
                  size="small" 
                  sx={{ mr: 1 }} 
                />
                {template.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 自定义提示词 */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="自定义提示词"
          placeholder="例如：人形角色，需要灵活的手指关节和腰部扭转能力..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* 提示词权重调节 */}
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>
            提示词影响强度: {Math.round(promptWeight * 100)}%
          </Typography>
          <Slider
            value={promptWeight}
            onChange={(e, value) => setPromptWeight(value as number)}
            min={0}
            max={1}
            step={0.1}
            marks={[
              { value: 0, label: '几何驱动' },
              { value: 0.5, label: '平衡' },
              { value: 1, label: '提示词驱动' }
            ]}
          />
        </Box>
      </Paper>

      {/* 错误信息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 上传进度 */}
      {uploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            正在上传和处理模型...
          </Typography>
        </Box>
      )}

      {/* 上传按钮 */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleUpload}
        disabled={!file || uploading}
        sx={{ height: 56 }}
      >
        {uploading ? '处理中...' : '上传并生成骨骼'}
      </Button>
    </Box>
  );
};

export default ModelUpload;