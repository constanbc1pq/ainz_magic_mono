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
        "loginTitle": "Login to AnziMagic",
        "registerTitle": "Register for AnziMagic",
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
        "description": "AnziMagic is a revolutionary AI platform that can automatically generate professional-grade skeleton structures for your 3D models. Whether you're a game developer, animator, or 3D artist, you can find the perfect solution here.",
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
          "subtitle": "Join thousands of developers and creators who are already using AnziMagic",
          "start": "Start Now"
        },
        "footer": {
          "description": "AnziMagic is a revolutionary AI platform that can automatically generate professional-grade skeleton structures for your 3D models.",
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
          "copyright": "© 2024 AnziMagic. All rights reserved.",
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
        "createFirstProject": "Create your first project to start using AnziMagic",
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
          "message": 'Are you sure you want to delete project "{name}"? This action cannot be undone.',
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
        "loginTitle": "登录 AnziMagic",
        "registerTitle": "注册 AnziMagic",
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
        "description": "AnziMagic是一个革命性的AI平台，能够自动为您的3D模型生成专业级的骨骼结构。无论您是游戏开发者、动画师还是3D艺术家，都能在这里找到完美的解决方案。",
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
          "subtitle": "加入成千上万已在使用AnziMagic的开发者和创作者",
          "start": "立即开始"
        },
        "footer": {
          "description": "AnziMagic是一个革命性的AI平台，能够自动为您的3D模型生成专业级的骨骼结构。",
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
          "copyright": "© 2024 AnziMagic. 版权所有。",
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
        "createFirstProject": "创建您的第一个项目来开始使用AnziMagic",
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
          "message": '确定要删除项目 "{name}" 吗？此操作无法撤销。',
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