import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 107, 53, 0.6); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const magicBookAnimation = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

const ChartContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3, 4),
  background: `linear-gradient(135deg, 
    ${alpha('#1a1a1a', 0.95)} 0%, 
    ${alpha('#2d1810', 0.9)} 50%, 
    ${alpha('#1a1a1a', 0.95)} 100%)`,
  borderRadius: theme.shape.borderRadius * 2,
  border: `2px solid ${alpha('#ffd700', 0.3)}`,
  overflow: 'hidden',
  minHeight: '450px',
  width: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffd700" fill-opacity="0.03"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.5,
  },
}));

const FlowRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const ModuleCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  minHeight: '140px',
  minWidth: '220px',
  maxWidth: '280px',
  background: `linear-gradient(135deg, ${alpha('#2d1810', 0.95)} 0%, ${alpha('#1a1a1a', 0.95)} 100%)`,
  border: `2px solid ${alpha('#ffd700', 0.4)}`,
  borderRadius: theme.shape.borderRadius * 2,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.05)',
    border: `2px solid ${alpha('#ffd700', 0.8)}`,
    animation: `${glowAnimation} 1.5s ease-in-out infinite`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at center, ${alpha('#ffd700', 0.1)} 0%, transparent 70%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

const Tooltip = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  padding: theme.spacing(2),
  maxWidth: '350px',
  background: `linear-gradient(135deg, ${alpha('#2d1810', 0.98)} 0%, ${alpha('#1a1a1a', 0.98)} 100%)`,
  border: `1px solid ${alpha('#ffd700', 0.5)}`,
  boxShadow: `0 8px 32px ${alpha('#000', 0.8)}`,
  zIndex: 9999,
  pointerEvents: 'none',
  borderRadius: theme.shape.borderRadius,
}));


const MagicBook = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(6, 0),
  padding: theme.spacing(4),
  background: `linear-gradient(135deg, 
    ${alpha('#4a148c', 0.9)} 0%, 
    ${alpha('#1a0033', 0.95)} 50%,
    ${alpha('#4a148c', 0.9)} 100%)`,
  border: `3px solid ${alpha('#9c27b0', 0.5)}`,
  borderRadius: theme.shape.borderRadius * 2,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    background: 'radial-gradient(circle, rgba(156, 39, 176, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 80,
    height: 80,
    background: 'radial-gradient(circle, rgba(156, 39, 176, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
  },
}));

interface Module {
  id: string;
  name: string;
  description: string;
  overview?: string;
  details: string[];
}

const ArchitectureFlowChart: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const modules: Module[] = [
    {
      id: 'frontend',
      name: '🎨 ' + t('architecture.frontend.name', 'Frontend'),
      description: t('architecture.frontend.desc', 'React + TypeScript 3D Visualization'),
      details: [
        t('architecture.frontend.detail1', '• Three.js 3D Model Viewer'),
        t('architecture.frontend.detail2', '• Real-time Status Updates'),
        t('architecture.frontend.detail3', '• Multi-language Support'),
        t('architecture.frontend.detail4', '• Gothic/Magic UI Theme')
      ]
    },
    {
      id: 'backend',
      name: '⚡ ' + t('architecture.backend.name', 'NestJS Backend'),
      description: t('architecture.backend.desc', 'API Server & Business Logic'),
      details: [
        t('architecture.backend.detail1', '• JWT Authentication'),
        t('architecture.backend.detail2', '• File Management System'),
        t('architecture.backend.detail3', '• MySQL + Redis Storage'),
        t('architecture.backend.detail4', '• RESTful API Design')
      ]
    },
    {
      id: 'proxy',
      name: '🔮 ' + t('architecture.proxy.name', 'Magic Proxy'),
      description: t('architecture.proxy.desc', 'Python FastAPI Bridge'),
      details: [
        t('architecture.proxy.detail1', '• HF Space Connection'),
        t('architecture.proxy.detail2', '• Stream Processing'),
        t('architecture.proxy.detail3', '• No File Storage'),
        t('architecture.proxy.detail4', '• Error Recovery')
      ]
    },
    {
      id: 'hfspace',
      name: '🤗 ' + t('architecture.hfspace.name', 'Hugging Face Space'),
      description: t('architecture.hfspace.desc', 'AI Model Hosting Platform'),
      overview: t('architecture.hfspace.overview', 'Hugging Face Spaces is the leading platform for hosting and deploying machine learning models and applications.'),
      details: [
        t('architecture.hfspace.detail1', '• ZeroGPU - Free NVIDIA A100 Access'),
        t('architecture.hfspace.detail2', '• Gradio/Streamlit Web Interface'),
        t('architecture.hfspace.detail3', '• Auto-scaling & Load Balancing'),
        t('architecture.hfspace.detail4', '• Docker Container Deployment'),
        t('architecture.hfspace.detail5', '• Community Hub for AI Models'),
        t('architecture.hfspace.detail6', '• Supports 50+ ML Frameworks'),
        t('architecture.hfspace.detail7', '• Private/Public Space Options')
      ]
    },
    {
      id: 'trellis',
      name: '🖼️ TRELLIS 🐤',
      description: t('architecture.trellis.desc', 'Microsoft Image-to-3D Model'),
      overview: t('architecture.trellis.overview', 'TRELLIS represents a breakthrough in image-to-3D generation technology developed by Microsoft Research.'),
      details: [
        t('architecture.trellis.detail1', '• Model: microsoft/TRELLIS-image-large'),
        t('architecture.trellis.detail2', '• Structured LATent (SLAT) Representation'),
        t('architecture.trellis.detail3', '• Single Image → High-quality 3D Model'),
        t('architecture.trellis.detail4', '• GLB Format with PBR Materials'),
        t('architecture.trellis.detail5', '• Text-prompt Guided Generation'),
        t('architecture.trellis.detail6', '• Photorealistic Texture Synthesis'),
        t('architecture.trellis.detail7', '• 360° View Consistency'),
        t('architecture.trellis.detail8', '• State-of-the-art Reconstruction'),
        t('architecture.trellis.detail9', '• Supports Complex Geometries')
      ]
    },
    {
      id: 'magicarticulate',
      name: '🐤 MagicArticulate 🦴',
      description: t('architecture.magic.desc', 'Seed3D Skeleton Generation'),
      overview: t('architecture.magic.overview', 'MagicArticulate is a cutting-edge AI model developed by Seed3D that revolutionizes the process of 3D model rigging and skeletal animation.'),
      details: [
        t('architecture.magic.detail1', '• Model: Seed3D/MagicArticulate'),
        t('architecture.magic.detail2', '• Automatic Rigging for 3D Models'),
        t('architecture.magic.detail3', '• Text-guided Skeleton Structure'),
        t('architecture.magic.detail4', '• Supports OBJ, GLB, PLY, STL Formats'),
        t('architecture.magic.detail5', '• Hierarchical Bone Generation'),
        t('architecture.magic.detail6', '• Animation-ready Joint Placement'),
        t('architecture.magic.detail7', '• Industry-standard Skeleton Export'),
        t('architecture.magic.detail8', '• Compatible with Maya/Blender'),
        t('architecture.magic.detail9', '• Real-time Preview Support')
      ]
    }
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <Box>
      <ChartContainer onMouseMove={handleMouseMove}>
        <Typography
          variant="h5"
          sx={{
            color: '#ffd700',
            textAlign: 'center',
            marginBottom: 4,
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            fontWeight: 'bold',
            letterSpacing: '2px',
          }}
        >
          🔮 {t('architecture.title', 'AinzMagic Architecture Flow')} 🔮
        </Typography>

        {/* Row 4: AI Models */}
        <FlowRow>
          {modules.slice(4).map((module) => (
            <ModuleCard
              key={module.id}
              elevation={4}
              onMouseEnter={() => setHoveredModule(module.id)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#ffd700',
                  fontWeight: 'bold',
                  textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
                  marginBottom: 1,
                }}
              >
                {module.name}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#ffcc02',
                  marginTop: 1,
                }}
              >
                {module.id === 'trellis' ? t('architecture.trellis.short', 'Image to 3D') : t('architecture.magic.short', '3D to Skeleton')}
              </Typography>
            </ModuleCard>
          ))}
        </FlowRow>

        {/* Row 3: Hugging Face Space */}
        <FlowRow>
          <ModuleCard
            elevation={4}
            onMouseEnter={() => setHoveredModule('hfspace')}
            onMouseLeave={() => setHoveredModule(null)}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#ffd700',
                fontWeight: 'bold',
                textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
                marginBottom: 1,
              }}
            >
              {modules[3].name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#ffcc02',
                marginTop: 1,
              }}
            >
              {modules[3].description}
            </Typography>
          </ModuleCard>
        </FlowRow>

        {/* Row 2: Backend + Magic Proxy */}
        <FlowRow>
          {modules.slice(1, 3).map((module) => (
            <ModuleCard
              key={module.id}
              elevation={4}
              onMouseEnter={() => setHoveredModule(module.id)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#ffd700',
                  fontWeight: 'bold',
                  textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
                  marginBottom: 1,
                }}
              >
                {module.name}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#ffcc02',
                  marginTop: 1,
                }}
              >
                {module.description}
              </Typography>
            </ModuleCard>
          ))}
        </FlowRow>
        
        {/* Row 1: Frontend */}
        <FlowRow>
          <ModuleCard
            elevation={4}
            onMouseEnter={() => setHoveredModule('frontend')}
            onMouseLeave={() => setHoveredModule(null)}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#ffd700',
                fontWeight: 'bold',
                textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
                marginBottom: 1,
              }}
            >
              {modules[0].name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#ffcc02',
                marginTop: 1,
              }}
            >
              {modules[0].description}
            </Typography>
          </ModuleCard>
        </FlowRow>

        {/* Data Flow Indicators */}
        <Box sx={{ 
          marginTop: 6, 
          textAlign: 'center',
          padding: theme.spacing(3),
          background: alpha('#000', 0.5),
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${alpha('#ffd700', 0.2)}`,
        }}>
          <Typography
            variant="body1"
            sx={{
              color: '#ff6b35',
              textShadow: '0 0 5px rgba(255, 107, 53, 0.5)',
            }}
          >
            {t('architecture.dataFlow', 'Data Flow: Upload → Process → AI Magic → Download')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#ffcc02',
              marginTop: 1,
            }}
          >
            {t('architecture.features', 'Zero Storage in Proxy | Real-time Processing | Secure & Fast')}
          </Typography>
        </Box>

        {/* Tooltip */}
        {hoveredModule && (
          <Fade in={true} timeout={200}>
            <Tooltip
              sx={{
                left: mousePosition.x + 20,
                top: mousePosition.y + 20,
              }}
            >
              {(() => {
                const module = modules.find(m => m.id === hoveredModule);
                return module && (
                  <>
                    <Typography variant="h6" sx={{ color: '#ffd700', marginBottom: 1 }}>
                      {module.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ffcc02', marginBottom: 1 }}>
                      {module.description}
                    </Typography>
                    {module.overview && (
                      <Typography variant="body2" sx={{ 
                        color: '#f0f0f0', 
                        marginBottom: 2, 
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                        borderLeft: '2px solid #ffd700',
                        paddingLeft: 1,
                        marginLeft: 0.5
                      }}>
                        {module.overview}
                      </Typography>
                    )}
                    {module.details.map((detail, idx) => (
                      <Typography key={idx} variant="caption" sx={{ display: 'block', color: '#e0e0e0' }}>
                        {detail}
                      </Typography>
                    ))}
                  </>
                );
              })()}
            </Tooltip>
          </Fade>
        )}
      </ChartContainer>

      {/* Magic Book Section */}
      <MagicBook elevation={6}>
        <Typography
          variant="h5"
          sx={{
            color: '#e1bee7',
            textAlign: 'center',
            marginBottom: 3,
            textShadow: '0 0 15px rgba(156, 39, 176, 0.8)',
            fontWeight: 'bold',
          }}
        >
          {t('magicBook.title', 'Grimoire of System Architecture')}
        </Typography>

        <Box>
          <Typography variant="h6" sx={{ color: '#ce93d8', marginBottom: 2 }}>
            🌟 {t('magicBook.process.title', 'The Enchantment Process')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#e1bee7', lineHeight: 1.8 }}>
            <strong>{t('magicBook.process.image.title', '1. Image Transformation Journey (TRELLIS):')}</strong><br/>
            {t('magicBook.process.image.step1', '① Click "Create New Project" and select "Image to 3D Model"')}<br/>
            {t('magicBook.process.image.step2', '② Upload your image (JPG, PNG, or WebP format)')}<br/>
            {t('magicBook.process.image.step3', '③ Add optional text prompt to guide the generation')}<br/>
            {t('magicBook.process.image.step4', '④ TRELLIS processes your image and generates a 3D model')}<br/>
            {t('magicBook.process.image.step5', '⑤ Download your GLB file and preview video')}<br/>
            <br/>
            
            <strong>{t('magicBook.process.skeleton.title', '2. Skeleton Articulation Ritual (MagicArticulate):')}</strong><br/>
            {t('magicBook.process.skeleton.step1', '① Start a new project with "3D Model to Skeleton"')}<br/>
            {t('magicBook.process.skeleton.step2', '② Choose your source:')}<br/>
            {t('magicBook.process.skeleton.option1', '   • Upload a new 3D model file (OBJ, GLB, PLY, STL)')}<br/>
            {t('magicBook.process.skeleton.option2', '   • Select from your existing models in the account')}<br/>
            {t('magicBook.process.skeleton.option3', '   • Use output from a previous TRELLIS project')}<br/>
            {t('magicBook.process.skeleton.step3', '③ Enter text prompt describing desired skeleton structure')}<br/>
            {t('magicBook.process.skeleton.step4', '④ MagicArticulate analyzes and generates animation-ready bones')}<br/>
            {t('magicBook.process.skeleton.step5', '⑤ Download skeleton files (JSON, OBJ, TXT, or ZIP bundle)')}<br/>
            <br/>
            
            <strong>{t('magicBook.process.workflow.title', '3. Complete Transformation Workflow:')}</strong><br/>
            {t('magicBook.process.workflow.desc', 'Image → TRELLIS → 3D Model → MagicArticulate → Skeletal Structure → Animated Character')}<br/>
            <br/>
            
            <strong>{t('magicBook.process.tips.title', '4. Mystical Tips:')}</strong><br/>
            {t('magicBook.process.tips.tip1', '• Your models are saved in your account for future use')}<br/>
            {t('magicBook.process.tips.tip2', '• Text prompts enhance AI understanding of your intent')}<br/>
            {t('magicBook.process.tips.tip3', '• Multiple output formats ensure compatibility with various tools')}<br/>
            {t('magicBook.process.tips.tip4', '• Real-time status updates keep you informed during processing')}
          </Typography>
        </Box>

        <Box sx={{ 
          marginTop: 3, 
          padding: 2,
          background: alpha('#000', 0.3),
          borderRadius: 1,
          border: `1px solid ${alpha('#ce93d8', 0.3)}`,
        }}>
          <Typography variant="caption" sx={{ color: '#ce93d8', fontStyle: 'italic' }}>
            {t('magicBook.quote', '"In the realm of digital alchemy, where pixels transform into polygons and meshes gain the gift of motion, our architecture stands as a testament to the marriage of ancient wisdom and modern sorcery."')}
          </Typography>
        </Box>
      </MagicBook>
    </Box>
  );
};

export default ArchitectureFlowChart;