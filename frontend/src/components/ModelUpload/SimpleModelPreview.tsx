import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface SimpleModelPreviewProps {
  file: File | null;
  modelUrl?: string;
  width?: number;
  height?: number;
  modelFormat?: 'glb' | 'obj' | 'stl';
}

const SimpleModelPreview: React.FC<SimpleModelPreviewProps> = ({ 
  file, 
  modelUrl,
  width = 400, 
  height = 300,
  modelFormat
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current || (!file && !modelUrl)) {
      console.log('No mount ref or file/modelUrl:', { mountRef: mountRef.current, file, modelUrl });
      return;
    }

    console.log('Starting to load:', file ? `file: ${file.name}` : `URL: ${modelUrl}`);
    setLoading(true);
    setError(null);

    // 清理之前的渲染器
    if (rendererRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // 创建相机 - 调整初始位置
    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10); // 初始位置更远
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    
    // 确保挂载点存在并附加渲染器
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
      console.log('Renderer attached to DOM');
    }

    // 添加光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // 添加地面
    const planeGeometry = new THREE.PlaneGeometry(40, 40);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0; // 地面在y=0位置
    plane.receiveShadow = true;
    scene.add(plane);

    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
    gridHelper.position.y = 0; // 网格也在y=0位置
    scene.add(gridHelper);
    
    // 移除测试立方体
    // const testGeometry = new THREE.BoxGeometry(1, 1, 1);
    // const testMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    // const testCube = new THREE.Mesh(testGeometry, testMaterial);
    // testCube.position.y = 0.5;
    // scene.add(testCube);
    // console.log('Test cube added to scene');

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    // 加载模型
    const fileUrl = file ? URL.createObjectURL(file) : modelUrl!;
    
    // 根据文件、modelFormat prop或URL判断扩展名
    let fileExtension: string;
    if (file) {
      fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    } else if (modelFormat) {
      // 如果提供了modelFormat prop，优先使用
      fileExtension = `.${modelFormat}`;
    } else if (modelUrl) {
      // 对于blob URL，尝试从URL参数中获取格式
      if (modelUrl.includes('glb')) {
        fileExtension = '.glb';
      } else if (modelUrl.includes('obj')) {
        fileExtension = '.obj';
      } else if (modelUrl.includes('stl')) {
        fileExtension = '.stl';
      } else {
        // 默认为GLB格式（因为大多数3D模型预览使用GLB）
        fileExtension = '.glb';
      }
    } else {
      fileExtension = '.obj'; // 最后的默认值
    }

    const loadModel = async () => {
      try {
        let loader;
        let object: THREE.Object3D | null = null;

        switch (fileExtension) {
          case '.obj':
            loader = new OBJLoader();
            object = await loader.loadAsync(fileUrl);
            break;
          case '.stl':
            loader = new STLLoader();
            const geometry = await loader.loadAsync(fileUrl);
            const material = new THREE.MeshPhongMaterial({ 
              color: 0x888888,
              specular: 0x111111,
              shininess: 200
            });
            object = new THREE.Mesh(geometry, material);
            break;
          case '.ply':
            loader = new PLYLoader();
            const plyGeometry = await loader.loadAsync(fileUrl);
            const plyMaterial = new THREE.MeshPhongMaterial({ 
              color: 0x888888,
              specular: 0x111111,
              shininess: 200,
              vertexColors: true // PLY 文件可能包含顶点颜色
            });
            object = new THREE.Mesh(plyGeometry, plyMaterial);
            break;
          case '.glb':
          case '.gltf':
            loader = new GLTFLoader();
            const gltf = await loader.loadAsync(fileUrl);
            object = gltf.scene;
            break;
          case '.fbx':
            loader = new FBXLoader();
            object = await loader.loadAsync(fileUrl);
            break;
          default:
            throw new Error(`不支持的文件格式: ${fileExtension}`);
        }

        if (object) {
          console.log('Model loaded successfully:', object);
          
          // 计算边界框和居中
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          console.log('Model bounds:', { center, size });

          // 居中模型 - 先缩放再调整位置
          object.position.set(0, 0, 0); // 先重置位置

          // 缩放模型以适应视图 - 大幅增加缩放比例
          const maxDim = Math.max(size.x, size.y, size.z);
          // 如果模型很大（可能是厘米单位），使用更激进的缩放
          let targetSize = 4; // 目标大小为4个单位
          if (maxDim > 100) {
            // 可能是厘米单位的模型
            targetSize = 8; // 让它更大一些
          }
          const scale = maxDim > 0 ? targetSize / maxDim : 1;
          object.scale.set(scale, scale, scale);
          
          // 缩放后重新计算边界框并居中
          const scaledBox = new THREE.Box3().setFromObject(object);
          const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
          
          // 调整位置使模型底部在y=0处
          object.position.x = -scaledCenter.x;
          object.position.y = -scaledBox.min.y; // 让模型底部接触地面
          object.position.z = -scaledCenter.z;
          
          console.log('Model scaling:', { maxDim, scale });
          console.log('Scaled center:', scaledCenter);
          console.log('Model position:', object.position);

          // 设置阴影并检查材质
          let meshCount = 0;
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              meshCount++;
              child.castShadow = true;
              child.receiveShadow = true;
              
              // 确保有材质
              if (!child.material) {
                console.log('Mesh without material found, adding default');
                child.material = new THREE.MeshPhongMaterial({
                  color: 0x888888,
                  side: THREE.DoubleSide
                });
              } else {
                // 确保材质是双面的
                if (child.material instanceof THREE.Material) {
                  child.material.side = THREE.DoubleSide;
                }
              }
              
              // 打印网格信息
              if (child.geometry) {
                const positionAttribute = child.geometry.attributes.position;
                if (positionAttribute) {
                  console.log(`Mesh ${meshCount}: vertices=${positionAttribute.count}`);
                }
              }
            }
          });
          
          console.log(`Total meshes in model: ${meshCount}`);

          scene.add(object);
          console.log('Model added to scene');
          
          // 添加边界框辅助工具
          const boxHelper = new THREE.BoxHelper(object, 0xff0000);
          scene.add(boxHelper);
          console.log('Box helper added');
          
          // 重新计算模型的实际边界和中心
          const finalBox = new THREE.Box3().setFromObject(object);
          const finalCenter = finalBox.getCenter(new THREE.Vector3());
          const finalSize = finalBox.getSize(new THREE.Vector3());
          
          // 调整相机位置以确保能看到模型
          const maxFinalDim = Math.max(finalSize.x, finalSize.y, finalSize.z);
          const distance = maxFinalDim * 2;
          
          // 相机看向模型中心，而不是原点
          camera.position.set(
            finalCenter.x + distance,
            finalCenter.y + distance * 0.8,
            finalCenter.z + distance
          );
          camera.lookAt(finalCenter);
          
          if (controlsRef.current) {
            controlsRef.current.target.copy(finalCenter);
            controlsRef.current.minDistance = maxFinalDim * 0.5;
            controlsRef.current.maxDistance = distance * 5;
            controlsRef.current.update();
          }
          
          console.log('Final model bounds:', { center: finalCenter, size: finalSize });
          console.log('Camera setup:', { distance, position: camera.position });
          
          // 立即渲染一次
          renderer.render(scene, camera);
        }

        setLoading(false);
      } catch (err) {
        console.error('加载模型失败:', err);
        setError(err instanceof Error ? err.message : '加载失败');
        setLoading(false);
      } finally {
        // 只有通过File创建的URL才需要释放
        if (file) {
          URL.revokeObjectURL(fileUrl);
        }
      }
    };

    loadModel();

    // 动画循环
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // 清理函数
    return () => {
      cancelAnimationFrame(animationId);
      if (rendererRef.current && mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      // 只有通过File创建的URL才需要释放
      if (file && fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file, modelUrl, width, height]);

  if (!file && !modelUrl) {
    return (
      <Paper
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          border: '1px dashed',
          borderColor: 'grey.400'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          选择文件后将显示3D预览
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.300'
      }}
    >
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            正在加载模型...
          </Typography>
        </Box>
      )}
      
      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default SimpleModelPreview;