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
import { useTranslation } from 'react-i18next';

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

// PROJECT_TYPES will be defined inside the component to access translations

interface ProjectTypeSelectorProps {
  onTypeSelect: (type: ProjectType, projectData: { name: string; description?: string }) => void;
}

const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({ onTypeSelect }) => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [error, setError] = useState('');

  const PROJECT_TYPES: ProjectTypeOption[] = [
    {
      type: ProjectType.IMAGE_TO_3D,
      title: t('project.typeSelector.imageToModel'),
      description: t('project.typeSelector.imageToModelDesc'),
      icon: <span style={{ fontSize: 48 }}>🐤</span>,
      color: 'primary',
      features: [
        t('project.typeSelector.imageFeatures.formats'),
        t('project.typeSelector.imageFeatures.quality'),
        t('project.typeSelector.imageFeatures.texture'),
        t('project.typeSelector.imageFeatures.preview'),
        t('project.typeSelector.imageFeatures.export')
      ]
    },
    {
      type: ProjectType.MODEL_TO_SKELETON,
      title: t('project.typeSelector.modelToSkeleton'),
      description: t('project.typeSelector.modelToSkeletonDesc'),
      icon: <span style={{ fontSize: 48 }}>🦴</span>,
      color: 'secondary',
      features: [
        t('project.typeSelector.skeletonFeatures.formats'),
        t('project.typeSelector.skeletonFeatures.generation'),
        t('project.typeSelector.skeletonFeatures.guidance'),
        t('project.typeSelector.skeletonFeatures.preview'),
        t('project.typeSelector.skeletonFeatures.export')
      ]
    }
  ];

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value as ProjectType);
    setError('');
  };

  const handleSubmit = () => {
    if (!selectedType) {
      setError(t('project.typeSelector.pleaseSelectType'));
      return;
    }

    if (!projectName.trim()) {
      setError(t('project.typeSelector.pleaseEnterName'));
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
        {t('project.typeSelector.title')}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        {t('project.typeSelector.subtitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
        <FormLabel component="legend">
          <Typography variant="h6" gutterBottom>
            {t('project.typeSelector.projectType')}
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
                        {t('project.typeSelector.features')}
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
              {t('project.typeSelector.projectDetails')}
            </Typography>
            
            <TextField
              fullWidth
              label={t('project.typeSelector.projectName')}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder={t('project.typeSelector.projectNamePlaceholder')}
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label={t('project.typeSelector.projectDescription')}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder={t('project.typeSelector.projectDescriptionPlaceholder')}
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
          {t('project.typeSelector.createProject')}
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectTypeSelector;