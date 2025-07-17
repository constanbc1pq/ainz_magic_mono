import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ModelUpload from '../components/ModelUpload/ModelUpload';
import EnhancedModelUpload from '../components/ModelUpload/EnhancedModelUpload';
import ImageUpload from '../components/ImageUpload/ImageUpload';
import ProjectTypeSelector, { ProjectType } from '../components/ProjectTypeSelector/ProjectTypeSelector';
import api from '../services/api';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentProject, setCurrentProject] = useState<{ id: number; type: ProjectType } | null>(null);

  // 判断是否是新建项目
  const isNewProject = location.pathname === '/project/new';


  const handleUploadComplete = (data: any) => {
    // 处理完成后跳转到结果页面（无论是立即完成还是需要轮询）
    navigate(`/result/${data.projectId || data.id || currentProject?.id}`);
  };

  const handleTypeSelect = async (type: ProjectType, projectData: { name: string; description?: string }) => {
    try {
      const response = await api.post('/api/projects', {
        name: projectData.name,
        description: projectData.description,
        type: type
      });

      setCurrentProject({
        id: response.data.id,
        type: type
      });
    } catch (error) {
      console.error('创建项目失败:', error);
      // TODO: 显示错误提示
    }
  };

  const isNewWithoutProject = isNewProject && !currentProject;
  const isNewWithProject = isNewProject && currentProject;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* 如果是新建项目且没有选择类型，显示项目类型选择器 */}
        {isNewWithoutProject ? (
          <>
            <ProjectTypeSelector onTypeSelect={handleTypeSelect} />
          </>
        ) : isNewWithProject ? (
          /* 新建项目，已选择类型，显示上传组件 */
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              新项目 - {currentProject.type === ProjectType.IMAGE_TO_3D ? '图片生成3D模型' : '3D模型生成骨骼'}
            </Typography>
            
            {/* 显示相应的上传组件 */}
            {currentProject.type === ProjectType.IMAGE_TO_3D ? (
              <ImageUpload 
                projectId={currentProject.id}
                onUploadComplete={handleUploadComplete}
                onError={(error) => console.error('Image upload error:', error)}
              />
            ) : (
              <EnhancedModelUpload 
                projectId={currentProject.id}
                onUploadComplete={handleUploadComplete}
              />
            )}
          </>
        ) : (
          /* 编辑现有项目 */
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              项目 {id}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              正在加载项目...
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ProjectPage;