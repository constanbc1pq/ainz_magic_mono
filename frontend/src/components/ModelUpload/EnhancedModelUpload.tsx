import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
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
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Psychology as AIIcon,
  FolderOpen as FolderIcon,
} from '@mui/icons-material';
import SimpleModelPreview from './SimpleModelPreview';
import ModelSelector from '../ModelSelector/ModelSelector';
import modelService from '../../services/modelService';
import api from '../../services/api';

interface ModelUploadProps {
  projectId: number;
  onUploadComplete: (data: any) => void;
}

interface UserModelFile {
  id: number;
  projectId: number;
  projectName: string;
  fileName: string;
  fileType: string;
  createdAt: string;
}

enum ModelSource {
  UPLOAD = 'UPLOAD',
  EXISTING = 'EXISTING'
}

const EnhancedModelUpload: React.FC<ModelUploadProps> = ({ 
  projectId, 
  onUploadComplete 
}) => {
  const [modelSource, setModelSource] = useState<ModelSource>(ModelSource.UPLOAD);
  const [file, setFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<UserModelFile | null>(null);
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
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/obj': ['.obj'],
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
      'model/stl': ['.stl'],
      'model/ply': ['.ply'],
      'model/fbx': ['.fbx'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (modelSource === ModelSource.UPLOAD && !file) {
      setError('请选择要上传的3D模型文件');
      return;
    }

    if (modelSource === ModelSource.EXISTING && !selectedModel) {
      setError('请选择一个已有的3D模型');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      let requestData: any = {
        projectId: projectId.toString(),
        textPrompt: userPrompt,
        confidence: promptWeight,
        preview: true,
      };

      if (modelSource === ModelSource.UPLOAD) {
        // 上传新文件模式
        const base64Content = await fileToBase64(file!);
        requestData = {
          ...requestData,
          modelSource: 'UPLOAD',
          modelName: file!.name,
          modelContent: base64Content,
        };
      } else {
        // 选择已有模型模式
        requestData = {
          ...requestData,
          modelSource: 'EXISTING_PROJECT',
          parentProjectId: selectedModel!.projectId,
        };
      }

      const response = await api.post('/api/projects/process-model', requestData);
      
      if (response.data.success) {
        onUploadComplete(response.data);
      } else {
        throw new Error(response.data.error || '处理失败');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '处理失败';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // 移除 data:xxx;base64, 前缀
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: ModelSource) => {
    setModelSource(newValue);
    setFile(null);
    setSelectedModel(null);
    setError(null);
  };

  const renderModelInput = () => {
    if (modelSource === ModelSource.UPLOAD) {
      return (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              上传3D模型
            </Typography>
            
            {!file ? (
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
                  {isDragActive ? '放开鼠标上传模型' : '拖拽模型文件到此处或点击上传'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  支持 OBJ、GLB、GLTF、STL、PLY、FBX 格式
                </Typography>
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'primary.main' }}>
                  <FileIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{file.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setFile(null)}
                  >
                    重新选择
                  </Button>
                </Box>
                
                {file && (
                  <Box sx={{ mt: 2 }}>
                    <SimpleModelPreview file={file} />
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <ModelSelector
              onModelSelect={setSelectedModel}
              selectedModel={selectedModel}
            />
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 模型来源选择 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            选择模型来源
          </Typography>
          <Tabs value={modelSource} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab 
              label="上传新模型" 
              value={ModelSource.UPLOAD}
              icon={<UploadIcon />}
            />
            <Tab 
              label="选择已有模型" 
              value={ModelSource.EXISTING}
              icon={<FolderIcon />}
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* 模型输入区域 */}
      {renderModelInput()}

      {/* 骨骼生成设置 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <AIIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            骨骼生成设置
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="骨骼描述"
                multiline
                rows={3}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="描述您希望生成的骨骼结构，例如：人形角色的标准骨骼，适合行走和跳跃动作（可选）"
                helperText="详细的描述有助于AI生成更准确的骨骼结构，留空则使用默认设置"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>预设模板</InputLabel>
                <Select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  label="预设模板"
                >
                  <MenuItem value="">
                    <em>无模板</em>
                  </MenuItem>
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>
                置信度: {promptWeight.toFixed(1)}
              </Typography>
              <Slider
                value={promptWeight}
                onChange={(_, value) => setPromptWeight(value as number)}
                min={0.1}
                max={1.0}
                step={0.1}
                valueLabelDisplay="auto"
                marks={[
                  { value: 0.1, label: '低' },
                  { value: 0.5, label: '中' },
                  { value: 1.0, label: '高' }
                ]}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 提交按钮 */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={
            uploading || 
            (modelSource === ModelSource.UPLOAD && !file) ||
            (modelSource === ModelSource.EXISTING && !selectedModel)
          }
          startIcon={uploading ? undefined : <AIIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          {uploading ? '生成中...' : '开始生成骨骼'}
        </Button>
      </Box>

      {uploading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            正在生成骨骼结构，请耐心等待...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EnhancedModelUpload;