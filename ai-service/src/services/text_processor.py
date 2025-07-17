"""
文本提示词处理器
将自然语言描述转换为几何约束和采样策略
"""

import re
import logging
from typing import Dict, List, Any, Optional
from models.requests import PromptTemplate

logger = logging.getLogger(__name__)

class TextProcessor:
    """文本提示词处理器"""
    
    def __init__(self):
        self.geometry_keywords = self._load_geometry_keywords()
        self.templates = self._load_templates()
    
    def health_check(self) -> bool:
        """健康检查"""
        return True
    
    def extract_geometry_hints(self, user_prompt: str) -> Dict[str, Any]:
        """
        从用户提示词中提取几何约束信息
        
        Args:
            user_prompt: 用户输入的文本提示词
            
        Returns:
            几何约束字典
        """
        hints = {
            'joint_regions': [],
            'movement_types': [],
            'articulation_style': None,
            'emphasis_areas': [],
            'joint_flexibility': {}
        }
        
        try:
            prompt_lower = user_prompt.lower()
            
            # 1. 识别关节区域
            joint_regions = self._extract_joint_regions(prompt_lower)
            hints['joint_regions'] = joint_regions
            
            # 2. 识别运动类型
            movement_types = self._extract_movement_types(prompt_lower)
            hints['movement_types'] = movement_types
            
            # 3. 识别关节灵活性要求
            flexibility = self._extract_flexibility_requirements(prompt_lower)
            hints['joint_flexibility'] = flexibility
            
            # 4. 识别重点区域
            emphasis_areas = self._extract_emphasis_areas(prompt_lower)
            hints['emphasis_areas'] = emphasis_areas
            
            # 5. 识别骨骼风格
            style = self._extract_articulation_style(prompt_lower)
            hints['articulation_style'] = style
            
            logger.info(f"Extracted hints from prompt: {hints}")
            return hints
            
        except Exception as e:
            logger.error(f"Failed to extract geometry hints: {str(e)}")
            return hints
    
    def _extract_joint_regions(self, prompt: str) -> List[str]:
        """提取关节区域"""
        regions = []
        
        # 身体部位关键词
        body_parts = {
            'hand': ['hand', 'finger', 'wrist', 'palm'],
            'arm': ['arm', 'elbow', 'shoulder'],
            'leg': ['leg', 'knee', 'ankle', 'foot'],
            'spine': ['spine', 'back', 'waist', 'torso'],
            'head': ['head', 'neck', 'jaw'],
            'tail': ['tail'],
            'wing': ['wing']
        }
        
        for region, keywords in body_parts.items():
            if any(keyword in prompt for keyword in keywords):
                regions.append(region)
        
        return regions
    
    def _extract_movement_types(self, prompt: str) -> List[str]:
        """提取运动类型"""
        movements = []
        
        movement_keywords = {
            'walking': ['walk', 'step', 'stride'],
            'running': ['run', 'sprint', 'jog'],
            'jumping': ['jump', 'leap', 'hop'],
            'flying': ['fly', 'flap', 'soar'],
            'swimming': ['swim', 'dive'],
            'climbing': ['climb', 'grasp'],
            'dancing': ['dance', 'graceful'],
            'fighting': ['fight', 'combat', 'martial'],
            'flexible': ['flexible', 'bendy', 'elastic']
        }
        
        for movement, keywords in movement_keywords.items():
            if any(keyword in prompt for keyword in keywords):
                movements.append(movement)
        
        return movements
    
    def _extract_flexibility_requirements(self, prompt: str) -> Dict[str, float]:
        """提取关节灵活性要求"""
        flexibility = {}
        
        # 灵活性关键词和权重
        flexibility_patterns = {
            r'very flexible|extremely flexible': 0.9,
            r'flexible|bendy': 0.7,
            r'moderate|normal': 0.5,
            r'stiff|rigid': 0.3,
            r'very stiff|extremely rigid': 0.1
        }
        
        for pattern, weight in flexibility_patterns.items():
            if re.search(pattern, prompt):
                flexibility['overall'] = weight
                break
        
        # 特定关节的灵活性
        specific_joints = {
            'fingers': r'flexible fingers|finger articulation',
            'spine': r'flexible spine|bendy back',
            'neck': r'flexible neck|head movement'
        }
        
        for joint, pattern in specific_joints.items():
            if re.search(pattern, prompt):
                flexibility[joint] = 0.8
        
        return flexibility
    
    def _extract_emphasis_areas(self, prompt: str) -> List[str]:
        """提取需要重点关注的区域"""
        areas = []
        
        emphasis_keywords = {
            'detailed': ['detailed', 'precise', 'accurate'],
            'smooth': ['smooth', 'fluid', 'seamless'],
            'complex': ['complex', 'intricate', 'advanced']
        }
        
        for area, keywords in emphasis_keywords.items():
            if any(keyword in prompt for keyword in keywords):
                areas.append(area)
        
        return areas
    
    def _extract_articulation_style(self, prompt: str) -> Optional[str]:
        """提取骨骼风格"""
        styles = {
            'humanoid': ['human', 'person', 'character', 'humanoid'],
            'animal': ['animal', 'creature', 'beast'],
            'mechanical': ['robot', 'mechanical', 'machine'],
            'fantasy': ['dragon', 'monster', 'mythical']
        }
        
        for style, keywords in styles.items():
            if any(keyword in prompt for keyword in keywords):
                return style
        
        return None
    
    def _load_geometry_keywords(self) -> Dict[str, List[str]]:
        """加载几何关键词库"""
        return {
            'joints': ['joint', 'articulation', 'hinge', 'pivot'],
            'bones': ['bone', 'limb', 'segment'],
            'movement': ['move', 'bend', 'rotate', 'twist'],
            'anatomy': ['anatomy', 'skeletal', 'structure']
        }
    
    def _load_templates(self) -> List[PromptTemplate]:
        """加载提示词模板"""
        return [
            PromptTemplate(
                id="humanoid_basic",
                category="character",
                template="humanoid character with {joint_type} joints, suitable for {movement_type}",
                description="基础人形角色模板",
                variables=["joint_type", "movement_type"]
            ),
            PromptTemplate(
                id="animal_quadruped",
                category="animal",
                template="{animal_type} with natural {movement_style} movement capabilities",
                description="四足动物模板",
                variables=["animal_type", "movement_style"]
            ),
            PromptTemplate(
                id="mechanical_robot",
                category="mechanical",
                template="mechanical object with {mechanism_type} articulation",
                description="机械物体模板",
                variables=["mechanism_type"]
            ),
            PromptTemplate(
                id="flexible_character",
                category="character",
                template="flexible character with detailed finger and spine articulation",
                description="高灵活性角色模板",
                variables=[]
            )
        ]
    
    def get_templates(self) -> List[PromptTemplate]:
        """获取所有模板"""
        return self.templates
    
    def get_templates_by_category(self, category: str) -> List[PromptTemplate]:
        """根据分类获取模板"""
        return [t for t in self.templates if t.category == category]