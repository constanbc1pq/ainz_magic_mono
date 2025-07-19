import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 翻译资源
const resources = {
  en: {
    translation: {
      "common": {
        "loading": "Loading...",
        "error": "Error",
        "success": "Success",
        "cancel": "Cancel",
        "confirm": "Confirm",
        "save": "Save",
        "delete": "Delete",
        "edit": "Edit",
        "view": "View",
        "upload": "Upload",
        "download": "Download",
        "back": "Back",
        "next": "Next",
        "submit": "Submit",
        "login": "Login",
        "register": "Register",
        "logout": "Logout"
      },
      "nav": {
        "home": "Home",
        "dashboard": "Dashboard",
        "projects": "Projects",
        "createProject": "Create Project",
        "profile": "Profile",
        "settings": "Settings"
      },
      "auth": {
        "login": "Login",
        "register": "Register",
        "loginTitle": "Login to AinzMagic",
        "registerTitle": "Register for AinzMagic",
        "subtitle": "AI-powered 3D Model Skeleton Generation Platform",
        "email": "Email",
        "password": "Password",
        "confirmPassword": "Confirm Password",
        "username": "Username",
        "forgotPassword": "Forgot Password?",
        "resetPassword": "Reset Password",
        "newPassword": "New Password",
        "loginError": "Login failed, please check your email and password",
        "registerError": "Registration failed, please try again",
        "passwordMismatch": "Passwords do not match",
        "passwordTooShort": "Password must be at least 8 characters",
        "resetSuccess": "Password reset successfully!",
        "resetError": "Password reset failed, please check if the email is correct",
        "noAccount": "Don't have an account?",
        "hasAccount": "Already have an account?",
        "registerNow": "Register Now",
        "loginNow": "Login Now",
        "createAccount": "Create account to start using AI model skeleton generation service",
        "usernameHelper": "3-20 characters, supports letters, numbers, underscores and Chinese",
        "passwordHelper": "At least 8 characters, contains letters and numbers",
        "passwordMustContain": "Password must contain at least one letter and one number",
        "resetDialog": {
          "title": "Reset Password",
          "step1": "Enter Information",
          "step2": "Reset Success",
          "emailLabel": "Registered Email",
          "emailHelper": "Please enter your registered email",
          "newPasswordLabel": "New Password",
          "newPasswordHelper": "At least 8 characters",
          "confirmPasswordLabel": "Confirm New Password",
          "successTitle": "Password reset successful!",
          "successMessage": "Your password has been successfully reset, returning to login page...",
          "resetButton": "Reset Password",
          "cancelButton": "Cancel",
          "confirmButton": "Confirm"
        }
      },
      "home": {
        "title": "AI-Powered 3D Model Skeleton Generation Platform",
        "subtitle": "Bring static 3D models to life with AI-driven intelligent skeleton generation technology",
        "description": "AinzMagic is a revolutionary AI platform that can automatically generate professional-grade skeleton structures for your 3D models. Whether you're a game developer, animator, or 3D artist, you can find the perfect solution here.",
        "getStarted": "Get Started",
        "learnMore": "Learn More",
        "features": {
          "title": "Core Features",
          "subtitle": "Advanced AI-powered intelligent skeleton generation system that brings unlimited possibilities to your 3D creations",
          "aiSkeleton": "AI-Driven Skeleton Generation",
          "aiSkeletonDesc": "Using advanced artificial intelligence technology to automatically generate perfect skeleton structures for your 3D models, with text-guided generation support.",
          "multiFormat": "Multi-Format Model Support",
          "multiFormatDesc": "Supports various 3D model formats including OBJ, GLB, PLY, STL, etc., compatible with files exported from mainstream modeling software.",
          "realtime": "Real-time Processing & Preview",
          "realtimeDesc": "High-performance computing based on ZeroGPU, providing real-time 3D preview and fast skeleton generation processing.",
          "secure": "Secure & Reliable",
          "secureDesc": "Enterprise-grade security assurance, your model data is fully protected, with private deployment support."
        },
        "workflow": {
          "title": "Workflow",
          "subtitle": "Four simple steps to bring your 3D models to life",
          "step1": "Upload 3D Model",
          "step1Desc": "Support drag-and-drop upload or file selection, automatic validation of model format and integrity",
          "step2": "AI Intelligent Analysis",
          "step2Desc": "Deep learning algorithms analyze model structure and generate the most suitable skeleton configuration",
          "step3": "Real-time Preview",
          "step3Desc": "3D visualization displays the generated skeleton structure with interactive adjustment support",
          "step4": "Export & Use",
          "step4Desc": "Multi-format export compatible with mainstream game engines and animation software"
        },
        "stats": {
          "title": "Platform Statistics",
          "modelsProcessed": "Models Processed",
          "satisfaction": "User Satisfaction",
          "avgProcessTime": "Average Processing Time",
          "avgProcessTimeValue": "< 2 minutes",
          "formatsSupported": "Supported Formats"
        },
        "chips": {
          "imageToModel": "🐤 Image to 3D Model",
          "modelToSkeleton": "🦴 3D Model to Skeleton",
          "realtimeAI": "⚡ Real-time AI Processing"
        },
        "cta": {
          "title": "Ready to Start?",
          "subtitle": "Join thousands of developers and creators who are already using AinzMagic",
          "start": "Start Now"
        },
        "footer": {
          "description": "AinzMagic is a revolutionary AI platform that can automatically generate professional-grade skeleton structures for your 3D models.",
          "products": "Products",
          "imageToModel": "Image to 3D Model",
          "modelToSkeleton": "Model to Skeleton",
          "aiOptimization": "AI Optimization",
          "batchProcessing": "Batch Processing",
          "support": "Support",
          "documentation": "Documentation",
          "apiReference": "API Reference",
          "faq": "FAQ",
          "contact": "Contact",
          "community": "Community",
          "forum": "Forum",
          "blog": "Blog",
          "company": "Company",
          "about": "About",
          "privacy": "Privacy Policy",
          "terms": "Terms of Service",
          "security": "Security",
          "copyright": "© 2024 AinzMagic. All rights reserved.",
          "beta": "Beta",
          "aiPowered": "AI Powered"
        }
      },
      "dashboard": {
        "welcome": "Welcome back, {{username}}!",
        "subtitle": "Use AI technology to convert your 3D models into animatable skeleton structures",
        "totalProjects": "Total Projects",
        "processRecords": "Process Records",
        "accountStatus": "Account Status",
        "active": "Active",
        "quickActions": "Quick Actions",
        "createProject": "Create New Project",
        "createProjectDesc": "Start a new 3D model skeleton generation project",
        "projectManagement": "Project Management",
        "projectManagementDesc": "View and manage all your projects",
        "viewProjects": "View Projects",
        "recentActivity": "Recent Activity",
        "noActivity": "No recent activity",
        "createFirstProject": "Create your first project to start using AinzMagic",
        "registerTime": "Register Time",
        "profileDesc": "View and edit your profile settings",
        "quickUpload": "Quick Upload",
        "quickUploadDesc": "Upload 3D models quickly and start processing",
        "uploadModel": "Upload Model"
      },
      "project": {
        "createNew": "Create New Project",
        "typeSelector": {
          "title": "Create New Project",
          "subtitle": "Choose a project type to start your AI-powered 3D creation journey",
          "projectType": "Project Type",
          "projectDetails": "Project Details",
          "projectName": "Project Name",
          "projectNamePlaceholder": "Give your project a name",
          "projectDescription": "Project Description",
          "projectDescriptionPlaceholder": "Briefly describe your project (optional)",
          "createProject": "Create Project",
          "pleaseSelectType": "Please select a project type",
          "pleaseEnterName": "Please enter project name",
          "imageToModel": "Image to 3D Model",
          "imageToModelDesc": "Convert 2D images to complete 3D models using TRELLIS AI technology",
          "modelToSkeleton": "3D Model to Skeleton",
          "modelToSkeletonDesc": "Generate animation skeleton structures for 3D models using MagicArticulate AI",
          "features": "Key Features:",
          "imageFeatures": {
            "formats": "Supports JPG, PNG, WEBP formats",
            "quality": "High-quality 3D model generation",
            "texture": "Adjustable texture quality",
            "preview": "Includes preview video",
            "export": "Export GLB format"
          },
          "skeletonFeatures": {
            "formats": "Supports multiple 3D formats",
            "generation": "Smart skeleton generation",
            "guidance": "Text description guidance",
            "preview": "Skeleton structure preview",
            "export": "Export multiple formats"
          }
        },
        "newProject": "New Project",
        "loadingProject": "Loading project...",
        "createFailed": "Failed to create project"
      },
      "projects": {
        "title": "My Projects",
        "list": "Project List",
        "createNew": "Create New Project",
        "noProjects": "No projects yet",
        "noProjectsDesc": "Create your first project to experience AI 3D modeling features",
        "createProject": "Create Project",
        "loadFailed": "Failed to load project list: ",
        "deleteFailed": "Failed to delete project: ",
        "status": {
          "created": "Created",
          "processing": "Processing",
          "completed": "Completed",
          "failed": "Failed"
        },
        "actions": {
          "viewResult": "View Result",
          "viewProgress": "View Progress",
          "continue": "Continue Editing",
          "delete": "Delete"
        },
        "deleteDialog": {
          "title": "Confirm Delete",
          "message": 'Are you sure you want to delete project "{{name}}"? This action cannot be undone.',
          "cancel": "Cancel",
          "confirm": "Delete"
        },
        "createdAt": "Created: "
      },
      "result": {
        "title": "Processing Result",
        "project": "Project",
        "loadingProject": "Loading project info...",
        "status": {
          "created": "Task created",
          "uploaded": "File upload completed",
          "processing": "Processing...",
          "completed": "Processing completed!",
          "failed": "Processing failed",
          "unknown": "Unknown status",
          "gettingStatus": "Getting status...",
          "gettingProjectInfo": "Getting project info..."
        },
        "processing": {
          "imageToModel": "Generating 3D model...",
          "modelToSkeleton": "Generating skeleton structure...",
          "aiProcessing": "AI is processing your request...",
          "patientWait": "This process may take a few minutes, please wait patiently"
        },
        "completed": {
          "imageSuccess": "🎉 3D model generation completed! Your image has been successfully converted to a 3D model.",
          "skeletonSuccess": "🎉 Skeleton generation completed! Your 3D model has been successfully generated with joint structure.",
          "originalImage": "Original Input Image",
          "originalImageDesc": "Original image used to generate the 3D model",
          "downloadOriginalImage": "Download Original Image",
          "modelPreview": "3D Model Preview",
          "modelPreviewDesc": "GLB format 3D model file, can be used in various 3D applications",
          "downloadGLB": "Download GLB Model",
          "previewVideo": "360° Preview Video",
          "previewVideoDesc": "360° rotation preview video of the 3D model",
          "downloadPreviewVideo": "Download Preview Video",
          "originalModel": "Original Input Model",
          "originalModelDesc": "Original 3D model used for skeleton generation",
          "downloadOriginalModel": "Download Original Model",
          "skeletonPreview": "Skeleton Structure Preview",
          "skeletonPreviewDesc": "Visualization preview of the generated skeleton structure",
          "downloadOBJ": "Download OBJ File",
          "downloadZip": "Download Complete Package"
        },
        "failed": {
          "message": "Processing failed: ",
          "unknownError": "Unknown error",
          "recheck": "Recheck"
        },
        "progress": {
          "completed": "completed",
          "processing": "Processing",
          "failed": "Failed",
          "unknown": "Unknown"
        },
        "actions": {
          "backToHome": "Back to Home",
          "backToProjects": "Back to Project List",
          "createNew": "Create New Project"
        },
        "download": {
          "failed": "Download failed, please try again later",
          "imageLoadFailed": "Image loading failed",
          "videoLoadFailed": "Video loading failed",
          "modelLoadFailed": "Model loading failed",
          "browserNotSupported": "Your browser does not support video playback."
        },
        "registerTime": "Register Time",
        "profileDesc": "View and edit your profile settings",
        "quickUpload": "Quick Upload",
        "quickUploadDesc": "Upload 3D model files directly for processing",
        "uploadModel": "Upload Model"
      },
      "architecture": {
        "title": "AinzMagic Architecture Flow",
        "dataFlow": "Data Flow: Upload → Process → AI Magic → Download",
        "features": "Zero Storage in Proxy | Real-time Processing | Secure & Fast",
        "frontend": {
          "name": "Frontend",
          "desc": "React + TypeScript 3D Visualization",
          "detail1": "• Three.js 3D Model Viewer",
          "detail2": "• Real-time Status Updates",
          "detail3": "• Multi-language Support",
          "detail4": "• Gothic/Magic UI Theme"
        },
        "backend": {
          "name": "NestJS Backend",
          "desc": "API Server & Business Logic",
          "detail1": "• JWT Authentication",
          "detail2": "• File Management System",
          "detail3": "• MySQL + Redis Storage",
          "detail4": "• RESTful API Design"
        },
        "proxy": {
          "name": "Magic Proxy",
          "desc": "Python FastAPI Bridge",
          "detail1": "• HF Space Connection",
          "detail2": "• Stream Processing",
          "detail3": "• No File Storage",
          "detail4": "• Error Recovery"
        },
        "hfspace": {
          "name": "Hugging Face Space",
          "desc": "AI Model Hosting Platform",
          "overview": "Hugging Face Spaces is the leading platform for hosting and deploying machine learning models and applications. It provides a seamless environment where developers can showcase their AI creations, from simple demos to complex applications, all powered by cutting-edge infrastructure including free GPU access through ZeroGPU.",
          "detail1": "• ZeroGPU - Free NVIDIA A100 Access",
          "detail2": "• Gradio/Streamlit Web Interface",
          "detail3": "• Auto-scaling & Load Balancing",
          "detail4": "• Docker Container Deployment",
          "detail5": "• Community Hub for AI Models",
          "detail6": "• Supports 50+ ML Frameworks",
          "detail7": "• Private/Public Space Options"
        },
        "trellis": {
          "desc": "Microsoft Image-to-3D Model",
          "short": "Image to 3D",
          "overview": "TRELLIS represents a breakthrough in image-to-3D generation technology developed by Microsoft Research. This advanced neural network model can transform a single 2D image into a fully-realized 3D model with remarkable accuracy and detail. By leveraging Structured LATent (SLAT) representation and sophisticated deep learning algorithms, TRELLIS delivers professional-quality 3D assets suitable for games, animation, and virtual reality applications.",
          "detail1": "• Model: microsoft/TRELLIS-image-large",
          "detail2": "• Structured LATent (SLAT) Representation",
          "detail3": "• Single Image → High-quality 3D Model",
          "detail4": "• GLB Format with PBR Materials",
          "detail5": "• Text-prompt Guided Generation",
          "detail6": "• Photorealistic Texture Synthesis",
          "detail7": "• 360° View Consistency",
          "detail8": "• State-of-the-art Reconstruction",
          "detail9": "• Supports Complex Geometries"
        },
        "magic": {
          "desc": "Seed3D Skeleton Generation",
          "short": "3D to Skeleton",
          "overview": "MagicArticulate is a cutting-edge AI model developed by Seed3D that revolutionizes the process of 3D model rigging and skeletal animation. This sophisticated system automatically analyzes 3D geometry and generates anatomically correct bone structures that are ready for animation. By understanding the underlying mesh topology and responding to natural language descriptions, MagicArticulate eliminates the tedious manual work traditionally required for character rigging.",
          "detail1": "• Model: Seed3D/MagicArticulate",
          "detail2": "• Automatic Rigging for 3D Models",
          "detail3": "• Text-guided Skeleton Structure",
          "detail4": "• Supports OBJ, GLB, PLY, STL Formats",
          "detail5": "• Hierarchical Bone Generation",
          "detail6": "• Animation-ready Joint Placement",
          "detail7": "• Industry-standard Skeleton Export",
          "detail8": "• Compatible with Maya/Blender",
          "detail9": "• Real-time Preview Support"
        }
      },
      "magicBook": {
        "title": "Grimoire of System Architecture",
        "quote": "In the realm of digital alchemy, where pixels transform into polygons and meshes gain the gift of motion, our architecture stands as a testament to the marriage of ancient wisdom and modern sorcery.",
        "process": {
          "title": "The Enchantment Process",
          "image": {
            "title": "1. Image Transformation Journey (TRELLIS):",
            "step1": "① Click \"Create New Project\" and select \"Image to 3D Model\"",
            "step2": "② Upload your image (JPG, PNG, or WebP format)",
            "step3": "③ Add optional text prompt to guide the generation",
            "step4": "④ TRELLIS processes your image and generates a 3D model",
            "step5": "⑤ Download your GLB file and preview video"
          },
          "skeleton": {
            "title": "2. Skeleton Articulation Ritual (MagicArticulate):",
            "step1": "① Start a new project with \"3D Model to Skeleton\"",
            "step2": "② Choose your source:",
            "option1": "   • Upload a new 3D model file (OBJ, GLB, PLY, STL)",
            "option2": "   • Select from your existing models in the account",
            "option3": "   • Use output from a previous TRELLIS project",
            "step3": "③ Enter text prompt describing desired skeleton structure",
            "step4": "④ MagicArticulate analyzes and generates animation-ready bones",
            "step5": "⑤ Download skeleton files (JSON, OBJ, TXT, or ZIP bundle)"
          },
          "workflow": {
            "title": "3. Complete Transformation Workflow:",
            "desc": "Image → TRELLIS → 3D Model → MagicArticulate → Skeletal Structure → Animated Character"
          },
          "tips": {
            "title": "4. Mystical Tips:",
            "tip1": "• Your models are saved in your account for future use",
            "tip2": "• Text prompts enhance AI understanding of your intent",
            "tip3": "• Multiple output formats ensure compatibility with various tools",
            "tip4": "• Real-time status updates keep you informed during processing"
          }
        }
      }
    },
  },
  zh: {
    translation: {
      "common": {
        "loading": "加载中...",
        "error": "错误",
        "success": "成功",
        "cancel": "取消",
        "confirm": "确认",
        "save": "保存",
        "delete": "删除",
        "edit": "编辑",
        "view": "查看",
        "upload": "上传",
        "download": "下载",
        "back": "返回",
        "next": "下一步",
        "submit": "提交",
        "login": "登录",
        "register": "注册",
        "logout": "退出登录"
      },
      "nav": {
        "home": "首页",
        "dashboard": "仪表盘",
        "projects": "项目",
        "createProject": "创建项目",
        "profile": "个人资料",
        "settings": "设置"
      },
      "auth": {
        "login": "登录",
        "register": "注册",
        "loginTitle": "登录 AinzMagic",
        "registerTitle": "注册 AinzMagic",
        "subtitle": "AI驱动的3D模型骨骼生成平台",
        "email": "邮箱",
        "password": "密码",
        "confirmPassword": "确认密码",
        "username": "用户名",
        "forgotPassword": "忘记密码？",
        "resetPassword": "重置密码",
        "newPassword": "新密码",
        "loginError": "登录失败，请检查邮箱和密码",
        "registerError": "注册失败，请重试",
        "passwordMismatch": "两次输入的密码不一致",
        "passwordTooShort": "密码至少需要8个字符",
        "resetSuccess": "密码重置成功！",
        "resetError": "重置密码失败，请检查邮箱是否正确",
        "noAccount": "还没有账户？",
        "hasAccount": "已有账户？",
        "registerNow": "立即注册",
        "loginNow": "立即登录",
        "createAccount": "创建账户，开始使用AI模型骨骼生成服务",
        "usernameHelper": "3-20个字符，支持字母、数字、下划线和中文",
        "passwordHelper": "至少8个字符，包含字母和数字",
        "passwordMustContain": "密码必须包含至少一个字母和一个数字",
        "resetDialog": {
          "title": "重置密码",
          "step1": "输入信息",
          "step2": "重置成功",
          "emailLabel": "注册邮箱",
          "emailHelper": "请输入您的注册邮箱",
          "newPasswordLabel": "新密码",
          "newPasswordHelper": "至少8个字符",
          "confirmPasswordLabel": "确认新密码",
          "successTitle": "密码重置成功！",
          "successMessage": "您的密码已经成功重置，即将返回登录页面...",
          "resetButton": "重置密码",
          "cancelButton": "取消",
          "confirmButton": "确定"
        }
      },
      "home": {
        "title": "AI驱动的3D模型骨骼生成平台",
        "subtitle": "让静态3D模型拥有生命力，AI驱动的智能骨骼生成技术",
        "description": "AinzMagic是一个革命性的AI平台，能够自动为您的3D模型生成专业级的骨骼结构。无论您是游戏开发者、动画师还是3D艺术家，都能在这里找到完美的解决方案。",
        "getStarted": "开始使用",
        "learnMore": "了解更多",
        "features": {
          "title": "核心功能特性",
          "subtitle": "基于先进AI技术的智能骨骼生成系统，为您的3D创作赋予无限可能",
          "aiSkeleton": "AI驱动的骨骼生成",
          "aiSkeletonDesc": "使用先进的人工智能技术，自动为您的3D模型生成完美的骨骼结构，支持文本描述引导生成。",
          "multiFormat": "多格式模型支持",
          "multiFormatDesc": "支持OBJ、GLB、PLY、STL等多种3D模型格式，兼容主流建模软件导出的文件。",
          "realtime": "实时处理与预览",
          "realtimeDesc": "基于ZeroGPU的高性能计算，提供实时的3D预览和快速的骨骼生成处理。",
          "secure": "安全可靠",
          "secureDesc": "企业级安全保障，您的模型数据得到完全保护，支持私有化部署。"
        },
        "workflow": {
          "title": "使用流程",
          "subtitle": "简单四步，让您的3D模型获得生命力",
          "step1": "上传3D模型",
          "step1Desc": "支持拖拽上传或选择文件，自动验证模型格式和完整性",
          "step2": "AI智能分析",
          "step2Desc": "深度学习算法分析模型结构，生成最适合的骨骼配置",
          "step3": "实时预览",
          "step3Desc": "3D可视化展示生成的骨骼结构，支持交互式调整",
          "step4": "导出使用",
          "step4Desc": "多格式导出，兼容主流游戏引擎和动画软件"
        },
        "stats": {
          "title": "平台数据统计",
          "modelsProcessed": "处理模型数量",
          "satisfaction": "用户满意度",
          "avgProcessTime": "平均处理时间",
          "avgProcessTimeValue": "< 2分钟",
          "formatsSupported": "支持格式"
        },
        "chips": {
          "imageToModel": "🐤 图片生成3D模型",
          "modelToSkeleton": "🦴 3D模型生成骨骼",
          "realtimeAI": "⚡ 实时AI处理"
        },
        "cta": {
          "title": "准备开始了吗？",
          "subtitle": "加入成千上万已在使用AinzMagic的开发者和创作者",
          "start": "立即开始"
        },
        "footer": {
          "description": "AinzMagic是一个革命性的AI平台，能够自动为您的3D模型生成专业级的骨骼结构。",
          "products": "产品",
          "imageToModel": "图片生成3D模型",
          "modelToSkeleton": "模型生成骨骼",
          "aiOptimization": "AI优化",
          "batchProcessing": "批量处理",
          "support": "支持",
          "documentation": "文档",
          "apiReference": "API参考",
          "faq": "常见问题",
          "contact": "联系我们",
          "community": "社区",
          "forum": "论坛",
          "blog": "博客",
          "company": "公司",
          "about": "关于我们",
          "privacy": "隐私政策",
          "terms": "服务条款",
          "security": "安全",
          "copyright": "© 2024 AinzMagic. 版权所有。",
          "beta": "测试版",
          "aiPowered": "AI驱动"
        }
      },
      "dashboard": {
        "welcome": "欢迎回来，{{username}}！",
        "subtitle": "使用AI技术将您的3D模型转换为可动画的骨骼结构",
        "totalProjects": "项目总数",
        "processRecords": "处理记录",
        "accountStatus": "账户状态",
        "active": "活跃",
        "quickActions": "快速操作",
        "createProject": "创建新项目",
        "createProjectDesc": "开始一个新的3D模型骨骼生成项目",
        "projectManagement": "项目管理",
        "projectManagementDesc": "查看和管理您的所有项目",
        "viewProjects": "查看项目",
        "recentActivity": "最近活动",
        "noActivity": "暂无最近活动记录",
        "createFirstProject": "创建您的第一个项目来开始使用AinzMagic",
        "registerTime": "注册时间",
        "profileDesc": "查看和编辑您的个人资料设置",
        "quickUpload": "快速上传",
        "quickUploadDesc": "快速上传3D模型并开始处理",
        "uploadModel": "上传模型"
      },
      "project": {
        "createNew": "创建新项目",
        "typeSelector": {
          "title": "创建新项目",
          "subtitle": "选择项目类型开始您的AI驱动的3D创作之旅",
          "projectType": "项目类型",
          "projectDetails": "项目详情",
          "projectName": "项目名称",
          "projectNamePlaceholder": "为您的项目起个名字",
          "projectDescription": "项目描述",
          "projectDescriptionPlaceholder": "简要描述您的项目（可选）",
          "createProject": "创建项目",
          "pleaseSelectType": "请选择项目类型",
          "pleaseEnterName": "请输入项目名称",
          "imageToModel": "图片生成3D模型",
          "imageToModelDesc": "使用TRELLIS AI技术，将2D图片转换为完整的3D模型",
          "modelToSkeleton": "3D模型生成骨骼",
          "modelToSkeletonDesc": "使用MagicArticulate AI，为3D模型生成动画骨骼结构",
          "features": "主要特性：",
          "imageFeatures": {
            "formats": "支持JPG、PNG、WEBP格式",
            "quality": "高质量3D模型生成",
            "texture": "可调节纹理质量",
            "preview": "包含预览视频",
            "export": "导出GLB格式"
          },
          "skeletonFeatures": {
            "formats": "支持多种3D格式",
            "generation": "智能骨骼生成",
            "guidance": "文本描述指导",
            "preview": "可预览骨骼结构",
            "export": "导出多种格式"
          }
        },
        "newProject": "新项目",
        "loadingProject": "正在加载项目...",
        "createFailed": "创建项目失败"
      },
      "projects": {
        "title": "我的项目",
        "list": "项目列表",
        "createNew": "创建新项目",
        "noProjects": "暂无项目",
        "noProjectsDesc": "创建您的第一个项目开始体验AI 3D建模功能",
        "createProject": "创建项目",
        "loadFailed": "加载项目列表失败: ",
        "deleteFailed": "删除项目失败: ",
        "status": {
          "created": "已创建",
          "processing": "处理中",
          "completed": "已完成",
          "failed": "失败"
        },
        "actions": {
          "viewResult": "查看结果",
          "viewProgress": "查看进度",
          "continue": "继续编辑",
          "delete": "删除"
        },
        "deleteDialog": {
          "title": "确认删除",
          "message": '确定要删除项目 "{{name}}" 吗？此操作无法撤销。',
          "cancel": "取消",
          "confirm": "删除"
        },
        "createdAt": "创建时间: "
      },
      "result": {
        "title": "处理结果",
        "project": "项目",
        "loadingProject": "正在加载项目信息...",
        "status": {
          "created": "任务已创建",
          "uploaded": "文件上传完成",
          "processing": "处理中",
          "completed": "处理完成！",
          "failed": "处理失败",
          "unknown": "未知状态",
          "gettingStatus": "正在获取状态...",
          "gettingProjectInfo": "正在获取项目信息..."
        },
        "processing": {
          "imageToModel": "正在生成3D模型...",
          "modelToSkeleton": "正在生成骨骼结构...",
          "aiProcessing": "AI正在处理您的请求...",
          "patientWait": "这个过程可能需要几分钟时间，请耐心等待"
        },
        "completed": {
          "imageSuccess": "🎉 3D模型生成完成！您的图片已成功转换为3D模型。",
          "skeletonSuccess": "🎉 骨骼生成完成！您的3D模型已成功生成关节结构。",
          "originalImage": "原始输入图片",
          "originalImageDesc": "用于生成3D模型的原始图片",
          "downloadOriginalImage": "下载原始图片",
          "modelPreview": "3D模型预览",
          "modelPreviewDesc": "GLB格式的3D模型文件，可用于各种3D应用",
          "downloadGLB": "下载GLB模型",
          "previewVideo": "360度预览视频",
          "previewVideoDesc": "3D模型的360度旋转预览视频",
          "downloadPreviewVideo": "下载预览视频",
          "originalModel": "原始输入模型",
          "originalModelDesc": "用于生成骨骼的原始3D模型",
          "downloadOriginalModel": "下载原始模型",
          "skeletonPreview": "骨骼结构预览",
          "skeletonPreviewDesc": "生成的骨骼结构可视化预览",
          "downloadOBJ": "下载OBJ文件",
          "downloadZip": "下载完整包"
        },
        "failed": {
          "message": "处理失败：",
          "unknownError": "未知错误",
          "recheck": "重新检查"
        },
        "progress": {
          "completed": "完成",
          "processing": "处理中",
          "failed": "失败",
          "unknown": "未知"
        },
        "actions": {
          "backToHome": "返回首页",
          "backToProjects": "返回项目列表",
          "createNew": "创建新项目"
        },
        "download": {
          "failed": "下载失败，请稍后重试",
          "imageLoadFailed": "图片加载失败",
          "videoLoadFailed": "视频加载失败",
          "modelLoadFailed": "模型加载失败",
          "browserNotSupported": "您的浏览器不支持视频播放。"
        },
        "registerTime": "注册时间",
        "profileDesc": "查看和编辑您的个人资料设置",
        "quickUpload": "快速上传",
        "quickUploadDesc": "直接上传3D模型文件进行处理",
        "uploadModel": "上传模型"
      },
      "architecture": {
        "title": "AinzMagic 架构流程",
        "dataFlow": "数据流: 上传 → 处理 → AI魔法 → 下载",
        "features": "代理零存储 | 实时处理 | 安全快速",
        "frontend": {
          "name": "前端",
          "desc": "React + TypeScript 3D可视化",
          "detail1": "• Three.js 3D模型查看器",
          "detail2": "• 实时状态更新",
          "detail3": "• 多语言支持",
          "detail4": "• 哥特/魔法UI主题"
        },
        "backend": {
          "name": "NestJS 后端",
          "desc": "API服务器与业务逻辑",
          "detail1": "• JWT身份验证",
          "detail2": "• 文件管理系统",
          "detail3": "• MySQL + Redis存储",
          "detail4": "• RESTful API设计"
        },
        "proxy": {
          "name": "魔法代理",
          "desc": "Python FastAPI桥接",
          "detail1": "• HF Space连接",
          "detail2": "• 流式处理",
          "detail3": "• 无文件存储",
          "detail4": "• 错误恢复"
        },
        "hfspace": {
          "name": "Hugging Face Space",
          "desc": "AI模型托管平台",
          "overview": "Hugging Face Spaces是全球领先的机器学习模型托管和部署平台。它为开发者提供了一个无缝的环境来展示他们的AI创作，从简单的演示到复杂的应用程序，全部由包括ZeroGPU免费GPU访问在内的尖端基础设施提供支持。该平台已成为AI社区的核心枢纽。",
          "detail1": "• ZeroGPU - 免费NVIDIA A100访问",
          "detail2": "• Gradio/Streamlit Web界面",
          "detail3": "• 自动扩展和负载均衡",
          "detail4": "• Docker容器部署",
          "detail5": "• AI模型社区中心",
          "detail6": "• 支持50+机器学习框架",
          "detail7": "• 私有/公共空间选项"
        },
        "trellis": {
          "desc": "微软图像转3D模型",
          "short": "图像转3D",
          "overview": "TRELLIS代表了微软研究院在图像转3D生成技术方面的重大突破。这个先进的神经网络模型能够将单张2D图像转换为完全实现的3D模型，具有卓越的准确性和细节表现。通过利用结构化潜在(SLAT)表示和先进的深度学习算法，TRELLIS能够生成适用于游戏、动画和虚拟现实应用的专业级3D资产。",
          "detail1": "• 模型: microsoft/TRELLIS-image-large",
          "detail2": "• 结构化潜在(SLAT)表示",
          "detail3": "• 单张图像 → 高质量3D模型",
          "detail4": "• GLB格式含PBR材质",
          "detail5": "• 文本提示引导生成",
          "detail6": "• 照片级真实纹理合成",
          "detail7": "• 360°视角一致性",
          "detail8": "• 最先进的重建技术",
          "detail9": "• 支持复杂几何结构"
        },
        "magic": {
          "desc": "Seed3D骨骼生成",
          "short": "3D转骨骼",
          "overview": "MagicArticulate是由Seed3D开发的前沿AI模型，它彻底革新了3D模型绑定和骨骼动画的制作流程。这个先进的系统能够自动分析3D几何结构并生成解剖学上正确的、可用于动画的骨骼结构。通过理解底层网格拓扑并响应自然语言描述，MagicArticulate消除了传统角色绑定工作中繁琐的手动操作。",
          "detail1": "• 模型: Seed3D/MagicArticulate",
          "detail2": "• 3D模型自动绑定",
          "detail3": "• 文本引导骨骼结构",
          "detail4": "• 支持OBJ、GLB、PLY、STL格式",
          "detail5": "• 分层骨骼生成",
          "detail6": "• 动画就绪关节定位",
          "detail7": "• 行业标准骨骼导出",
          "detail8": "• 兼容Maya/Blender",
          "detail9": "• 实时预览支持"
        }
      },
      "magicBook": {
        "title": "系统架构魔法书",
        "quote": "在数字炼金术的领域里，像素转化为多边形，网格获得运动天赋，我们的架构见证了古老智慧与现代魔法的结合。",
        "process": {
          "title": "魔法变换过程",
          "image": {
            "title": "1. 图像变换之旅 (TRELLIS):",
            "step1": "① 点击\"创建新项目\"并选择\"图像生成3D模型\"",
            "step2": "② 上传您的图像(JPG、PNG或WebP格式)",
            "step3": "③ 添加可选文本提示以引导生成",
            "step4": "④ TRELLIS处理您的图像并生成3D模型",
            "step5": "⑤ 下载您的GLB文件和预览视频"
          },
          "skeleton": {
            "title": "2. 骨骼构建仪式 (MagicArticulate):",
            "step1": "① 使用\"3D模型生成骨骼\"开始新项目",
            "step2": "② 选择您的源:",
            "option1": "   • 上传新的3D模型文件(OBJ、GLB、PLY、STL)",
            "option2": "   • 从账户中的现有模型中选择",
            "option3": "   • 使用之前TRELLIS项目的输出",
            "step3": "③ 输入描述所需骨骼结构的文本提示",
            "step4": "④ MagicArticulate分析并生成动画就绪的骨骼",
            "step5": "⑤ 下载骨骼文件(JSON、OBJ、TXT或ZIP包)"
          },
          "workflow": {
            "title": "3. 完整变换工作流:",
            "desc": "图像 → TRELLIS → 3D模型 → MagicArticulate → 骨骼结构 → 动画角色"
          },
          "tips": {
            "title": "4. 神秘技巧:",
            "tip1": "• 您的模型保存在账户中供将来使用",
            "tip2": "• 文本提示增强AI对您意图的理解",
            "tip3": "• 多种输出格式确保与各种工具的兼容性",
            "tip4": "• 实时状态更新让您了解处理进度"
          }
        }
      }
    },
  },
};

i18n
  .use(initReactI18next) // 传递 i18n 实例给 react-i18next
  .init({
    resources,
    lng: localStorage.getItem('language') || 'zh', // 默认语言，从localStorage获取或使用中文
    fallbackLng: 'en', // 回退语言

    interpolation: {
      escapeValue: false, // React已经默认转义了
    },

    react: {
      useSuspense: false, // 禁用Suspense
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;