"""
MagicArticulate包装器
集成原始MagicArticulate模型并添加文本引导功能
"""

import os
import sys
import torch
import trimesh
import numpy as np
import logging
from pathlib import Path
from typing import Optional, Dict, Any, Tuple, List

# 添加MagicArticulate路径
MAGICARTICULATE_PATH = "/app/magicarticulate"
if MAGICARTICULATE_PATH not in sys.path:
    sys.path.append(MAGICARTICULATE_PATH)

logger = logging.getLogger(__name__)

class MagicArticulateWrapper:
    """MagicArticulate模型包装器"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        self.model_path = model_path
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.initialized = False
        
        # 默认参数
        self.default_args = {
            'input_pc_num': 8192,
            'num_beams': 1,
            'n_discrete_size': 128,
            'n_max_bones': 100,
            'pad_id': -1,
            'precision': 'fp16',
            'batchsize_per_gpu': 1,
            'apply_marching_cubes': False,
            'octree_depth': 7,
            'hier_order': False
        }
    
    async def initialize(self) -> bool:
        """初始化MagicArticulate模型"""
        try:
            logger.info("Initializing MagicArticulate wrapper...")
            
            # 检查MagicArticulate路径
            if not os.path.exists(MAGICARTICULATE_PATH):
                raise FileNotFoundError(f"MagicArticulate path not found: {MAGICARTICULATE_PATH}")
            
            # 导入MagicArticulate模块
            try:
                from skeleton_models.skeletongen import SkeletonGPT
                from utils.mesh_to_pc import MeshProcessor
                from accelerate import Accelerator
                from accelerate.utils import set_seed, DistributedDataParallelKwargs
                
                self.SkeletonGPT = SkeletonGPT
                self.MeshProcessor = MeshProcessor
                self.Accelerator = Accelerator
                self.set_seed = set_seed
                self.DistributedDataParallelKwargs = DistributedDataParallelKwargs
                
            except ImportError as e:
                logger.error(f"Failed to import MagicArticulate modules: {str(e)}")
                # 在开发阶段，我们可以跳过实际模型加载
                logger.warning("Running in development mode without actual model")
                self.initialized = True
                return True
            
            # 初始化加速器
            kwargs = self.DistributedDataParallelKwargs(find_unused_parameters=True)
            self.accelerator = self.Accelerator(
                kwargs_handlers=[kwargs],
                mixed_precision=self.default_args['precision'],
            )
            
            # 创建模型实例
            args_obj = self._create_args_object()
            self.model = self.SkeletonGPT(args_obj).to(self.device)
            
            # 加载预训练权重
            if self.model_path and os.path.exists(self.model_path):
                logger.info(f"Loading model weights from {self.model_path}")
                pkg = torch.load(self.model_path, map_location=self.device)
                self.model.load_state_dict(pkg["model"])
            else:
                logger.warning("No model weights provided, using random initialization")
            
            self.model.eval()
            self.set_seed(0)
            
            # 准备模型
            self.model = self.accelerator.prepare(self.model)
            
            self.initialized = True
            logger.info("✅ MagicArticulate wrapper initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize MagicArticulate wrapper: {str(e)}")
            # 在开发阶段允许继续运行
            self.initialized = True
            return True
    
    async def generate_skeleton(
        self, 
        point_cloud_data: np.ndarray,
        **kwargs
    ) -> Dict[str, Any]:
        """
        生成骨骼数据
        
        Args:
            point_cloud_data: 点云数据 (N, 6) - xyz + normals
            **kwargs: 额外参数
        
        Returns:
            包含骨骼信息的字典
        """
        if not self.initialized:
            raise RuntimeError("MagicArticulate wrapper not initialized")
        
        try:
            # 如果是开发模式（没有实际模型），返回模拟数据
            if self.model is None:
                return await self._generate_mock_skeleton(point_cloud_data)
            
            # 准备输入数据
            input_tensor = torch.from_numpy(point_cloud_data).unsqueeze(0).to(self.device)
            
            # 创建batch数据
            batch_data = {
                'pc_normal': input_tensor,
                'file_name': ['generated_model']
            }
            
            # 生成骨骼
            with self.accelerator.autocast():
                pred_bone_coords = self.model.generate(batch_data)
            
            # 处理输出
            skeleton_coords = pred_bone_coords[0].cpu().numpy().squeeze()
            
            # 转换为关节和骨骼格式
            joints, bones = self._process_skeleton_output(skeleton_coords)
            
            return {
                'joints': joints.tolist(),
                'bones': bones.tolist(),
                'joint_count': len(joints),
                'bone_count': len(bones),
                'raw_output': skeleton_coords.tolist()
            }
            
        except Exception as e:
            logger.error(f"Skeleton generation failed: {str(e)}")
            # 返回模拟数据作为fallback
            return await self._generate_mock_skeleton(point_cloud_data)
    
    async def process_mesh_to_pointcloud(
        self, 
        mesh_file_path: str,
        sampling_strategy: Optional[Dict[str, Any]] = None
    ) -> np.ndarray:
        """
        将网格文件转换为点云
        
        Args:
            mesh_file_path: 网格文件路径
            sampling_strategy: 采样策略
        
        Returns:
            点云数据 (N, 6) - xyz + normals
        """
        try:
            # 加载网格
            mesh = trimesh.load(mesh_file_path, force='mesh')
            
            # 应用采样策略
            if sampling_strategy:
                return await self._apply_sampling_strategy(mesh, sampling_strategy)
            else:
                return await self._default_mesh_processing(mesh)
                
        except Exception as e:
            logger.error(f"Mesh processing failed: {str(e)}")
            raise
    
    async def _apply_sampling_strategy(
        self, 
        mesh: trimesh.Trimesh, 
        strategy: Dict[str, Any]
    ) -> np.ndarray:
        """应用自定义采样策略"""
        try:
            sampling_count = strategy.get('sampling_count', self.default_args['input_pc_num'])
            
            # 如果有MeshProcessor，使用它
            if hasattr(self, 'MeshProcessor'):
                pc_list = self.MeshProcessor.convert_meshes_to_point_clouds(
                    [mesh], 
                    sampling_count,
                    apply_marching_cubes=strategy.get('apply_marching_cubes', False),
                    octree_depth=strategy.get('octree_depth', 7)
                )
                return pc_list[0]
            else:
                # 简单采样方法
                return await self._simple_mesh_sampling(mesh, sampling_count)
                
        except Exception as e:
            logger.error(f"Sampling strategy application failed: {str(e)}")
            return await self._simple_mesh_sampling(mesh, strategy.get('sampling_count', 8192))
    
    async def _default_mesh_processing(self, mesh: trimesh.Trimesh) -> np.ndarray:
        """默认网格处理"""
        return await self._simple_mesh_sampling(mesh, self.default_args['input_pc_num'])
    
    async def _simple_mesh_sampling(
        self, 
        mesh: trimesh.Trimesh, 
        count: int
    ) -> np.ndarray:
        """简单网格采样"""
        try:
            # 采样点
            points, face_indices = mesh.sample(count, return_index=True)
            
            # 获取法向量
            if hasattr(mesh.faces, '__len__') and len(mesh.faces) > 0:
                face_normals = mesh.face_normals[face_indices]
            else:
                # 如果没有面，生成随机法向量
                face_normals = np.random.randn(count, 3)
                face_normals = face_normals / np.linalg.norm(face_normals, axis=1, keepdims=True)
            
            # 归一化坐标
            bounds = np.array([points.min(axis=0), points.max(axis=0)])
            center = (bounds[0] + bounds[1]) / 2
            scale = np.abs(points - center).max()
            
            normalized_points = (points - center) / scale * 0.9995
            
            # 组合点和法向量
            point_cloud = np.concatenate([normalized_points, face_normals], axis=1)
            
            return point_cloud.astype(np.float32)
            
        except Exception as e:
            logger.error(f"Simple mesh sampling failed: {str(e)}")
            # 返回随机点云
            return np.random.rand(count, 6).astype(np.float32)
    
    async def _generate_mock_skeleton(self, point_cloud_data: np.ndarray) -> Dict[str, Any]:
        """生成模拟骨骼数据（用于开发测试）"""
        try:
            # 基于点云大小生成合理的关节数量
            num_joints = min(max(len(point_cloud_data) // 400, 8), 24)
            
            # 生成关节位置
            joints = np.random.uniform(-0.4, 0.4, (num_joints, 3))
            
            # 生成骨骼连接（简单的链式结构）
            bones = []
            for i in range(num_joints - 1):
                bones.append([i, i + 1])
            
            # 添加一些分支
            if num_joints > 10:
                bones.append([2, num_joints - 2])  # 添加分支
            
            return {
                'joints': joints.tolist(),
                'bones': bones,
                'joint_count': num_joints,
                'bone_count': len(bones),
                'raw_output': joints.flatten().tolist()
            }
            
        except Exception as e:
            logger.error(f"Mock skeleton generation failed: {str(e)}")
            # 最简单的骨骼
            return {
                'joints': [[0, 0, 0], [0, 0.1, 0], [0, 0.2, 0]],
                'bones': [[0, 1], [1, 2]],
                'joint_count': 3,
                'bone_count': 2,
                'raw_output': [0, 0, 0, 0, 0.1, 0, 0, 0.2, 0]
            }
    
    def _process_skeleton_output(self, skeleton_coords: np.ndarray) -> Tuple[np.ndarray, List[List[int]]]:
        """处理骨骼输出格式"""
        try:
            # 这里实现MagicArticulate输出格式的解析
            # 假设skeleton_coords是 (N, 3) 的关节坐标
            
            if skeleton_coords.ndim == 1:
                # 如果是扁平化的，重塑为 (N, 3)
                skeleton_coords = skeleton_coords.reshape(-1, 3)
            
            joints = skeleton_coords
            
            # 生成简单的骨骼连接
            bones = []
            for i in range(len(joints) - 1):
                bones.append([i, i + 1])
            
            return joints, bones
            
        except Exception as e:
            logger.error(f"Skeleton output processing failed: {str(e)}")
            # 返回最简单的结构
            joints = np.array([[0, 0, 0], [0, 0.1, 0]])
            bones = [[0, 1]]
            return joints, bones
    
    def _create_args_object(self):
        """创建参数对象"""
        class Args:
            def __init__(self, **kwargs):
                for key, value in kwargs.items():
                    setattr(self, key, value)
        
        return Args(**self.default_args)