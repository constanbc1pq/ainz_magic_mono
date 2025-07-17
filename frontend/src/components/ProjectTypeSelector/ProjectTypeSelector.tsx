import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Alert,
} from '@mui/material';
import {
  PhotoCamera as ImageIcon,
  ViewInAr as ModelIcon,
  Create as CreateIcon,
} from '@mui/icons-material';

export enum ProjectType {
  IMAGE_TO_3D = 'IMAGE_TO_3D',
  MODEL_TO_SKELETON = 'MODEL_TO_SKELETON'
}

interface ProjectTypeOption {
  type: ProjectType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary';
  features: string[];
}

const PROJECT_TYPES: ProjectTypeOption[] = [
  {
    type: ProjectType.IMAGE_TO_3D,
    title: '图片生成3D模型',
    description: '使用TRELLIS AI技术，将2D图片转换为完整的3D模型',
    icon: <span style={{ fontSize: 48 }}>🐤</span>,
    color: 'primary',
    features: [
      '支持JPG、PNG、WEBP格式',
      '高质量3D模型生成',
      '可调节纹理质量',
      '包含预览视频',
      '导出GLB格式'
    ]
  },
  {
    type: ProjectType.MODEL_TO_SKELETON,
    title: '3D模型生成骨骼',
    description: '使用MagicArticulate AI，为3D模型生成动画骨骼结构',
    icon: <span style={{ fontSize: 48 }}>🦴</span>,
    color: 'secondary',
    features: [
      '支持多种3D格式',
      '智能骨骼生成',
      '文本描述指导',
      '可预览骨骼结构',
      '导出多种格式'
    ]
  }
];

interface ProjectTypeSelectorProps {
  onTypeSelect: (type: ProjectType, projectData: { name: string; description?: string }) => void;
}

const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({ onTypeSelect }) => {
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [error, setError] = useState('');

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value as ProjectType);
    setError('');
  };

  const handleSubmit = () => {
    if (!selectedType) {
      setError('请选择项目类型');
      return;
    }

    if (!projectName.trim()) {
      setError('请输入项目名称');
      return;
    }

    onTypeSelect(selectedType, {
      name: projectName.trim(),
      description: projectDescription.trim() || undefined
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        创建新项目
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        选择项目类型开始您的AI驱动的3D创作之旅
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
        <FormLabel component="legend">
          <Typography variant="h6" gutterBottom>
            项目类型
          </Typography>
        </FormLabel>
        
        <RadioGroup value={selectedType || ''} onChange={handleTypeChange}>
          <Grid container spacing={3}>
            {PROJECT_TYPES.map((option) => (
              <Grid item xs={12} md={6} key={option.type}>
                <Card 
                  variant="outlined" 
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: selectedType === option.type ? 2 : 1,
                    borderColor: selectedType === option.type ? `${option.color}.main` : 'divider',
                    '&:hover': {
                      boxShadow: 3,
                      borderColor: `${option.color}.main`
                    }
                  }}
                  onClick={() => setSelectedType(option.type)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          color: `${option.color}.main`,
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {option.icon}
                      </Box>
                      <FormControlLabel
                        value={option.type}
                        control={<Radio />}
                        label={
                          <Typography variant="h6" component="h3">
                            {option.title}
                          </Typography>
                        }
                        sx={{ flexGrow: 1 }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {option.description}
                    </Typography>
                    
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        主要特性：
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {option.features.map((feature, index) => (
                          <li key={index}>
                            <Typography variant="body2" color="text.secondary">
                              {feature}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>

      {selectedType && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              项目详情
            </Typography>
            
            <TextField
              fullWidth
              label="项目名称"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="为您的项目起个名字"
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label="项目描述"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="简要描述您的项目（可选）"
              multiline
              rows={3}
            />
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={!selectedType || !projectName.trim()}
          startIcon={<CreateIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          创建项目
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectTypeSelector;