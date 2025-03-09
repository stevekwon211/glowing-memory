'use client';
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, Box, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Physics, useBox, usePlane, useSphere, useCylinder } from '@react-three/cannon';

// Extend JSX elements with Three.js objects
extend({
  Mesh: THREE.Mesh,
  PlaneGeometry: THREE.PlaneGeometry,
  BoxGeometry: THREE.BoxGeometry,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  Group: THREE.Group,
  AmbientLight: THREE.AmbientLight,
  DirectionalLight: THREE.DirectionalLight,
  HemisphereLight: THREE.HemisphereLight,
  PointLight: THREE.PointLight
});

// Define JSX namespace for Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      planeGeometry: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      group: any;
      ambientLight: any;
      directionalLight: any;
      hemisphereLight: any;
      pointLight: any;
      primitive: any;
    }
  }
}

// Pre-load the models
useGLTF.preload('/models/dog.glb');
useGLTF.preload('/models/photo.glb');
useGLTF.preload('/models/about.glb');
useGLTF.preload('/models/fuel.glb');
useGLTF.preload('/models/log.glb');
useGLTF.preload('/models/artifact.glb');

// Define interactive points in 3D space with their respective models
export const interactivePoints = [
  { id: 'about', title: 'about', position: [3.0, 1.2, 2.0] as [number, number, number], model: '/models/about.glb' },
  { id: 'logs', title: 'log', position: [-2.5, 0.8, 2.2] as [number, number, number], model: '/models/log.glb' },
  { id: 'slides', title: 'photo', position: [2.2, 0.0, -2.0] as [number, number, number], model: '/models/photo.glb' },
  {
    id: 'prints',
    title: 'artifact',
    position: [-2.8, 1.2, -2.2] as [number, number, number],
    model: '/models/artifact.glb'
  },
  { id: 'fuel', title: 'fuel', position: [0.0, 1.0, -3.0] as [number, number, number], model: '/models/fuel.glb' }
];

// Floor component with physics
function Floor() {
  // Create a plane with physics
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0], // Rotate to be horizontal
    position: [0, -0.5, 0], // Position slightly below the model
    type: 'Static' // Static body that doesn't move
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#355e3b" transparent opacity={0} />
    </mesh>
  );
}

interface ModelProps {
  modelPath: string;
  isHovering: boolean;
  onPointClick: (id: string) => void;
  hoveredPoint: string | null;
  setHoveredPoint: (id: string | null) => void;
  clickedPoint: string | null;
  customPoints: typeof interactivePoints;
  showAllLabels: boolean;
  isMobile: boolean;
}

function FallbackModel({ isHovering }: { isHovering: boolean }) {
  const meshRef = useRef<Mesh>(null);

  // No automatic rotation
  useFrame(() => {
    // Static model, no rotation
  });

  return (
    <Box ref={meshRef} args={[1, 1, 1]} visible={false}>
      {/* @ts-ignore */}
      <meshStandardMaterial color="white" opacity={0} transparent />
    </Box>
  );
}

interface InteractivePointProps {
  position: [number, number, number];
  id: string;
  title: string;
  onClick: (id: string) => void;
  isHovered: boolean;
  isClicked: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  model: string | null;
  showAllLabels: boolean;
  isMobile: boolean;
}

// Interactive point component with physics
function InteractivePoint({
  position,
  id,
  title,
  onClick,
  isHovered,
  isClicked,
  onHover,
  onLeave,
  model,
  showAllLabels,
  isMobile
}: InteractivePointProps) {
  // Create a physics sphere for the interactive point with random initial rotation
  const randomRotation: [number, number, number] = [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  ];

  // 모델별로 다른 물리 형태 적용
  let physicsShape = 'sphere';
  let physicsArgs = [0.3]; // 기본 구체 크기

  if (model?.includes('about.glb')) {
    physicsShape = 'cylinder';
    physicsArgs = [0.3, 0.6, 8]; // 원통형 (반지름, 높이, 세그먼트)
  } else if (model?.includes('fuel.glb')) {
    physicsShape = 'box';
    physicsArgs = [0.4, 0.6, 0.4]; // 직육면체 (가로, 세로, 높이)
  } else if (model?.includes('log.glb')) {
    physicsShape = 'box';
    physicsArgs = [0.5, 0.3, 0.3]; // 직육면체 (가로, 세로, 높이) - 통나무 형태
  } else if (model?.includes('artifact.glb')) {
    physicsShape = 'box';
    physicsArgs = [0.4, 0.4, 0.4]; // 직육면체 (가로, 세로, 높이) - 유물 형태
  } else {
    physicsShape = 'sphere';
    physicsArgs = [0.3];
  }

  // 물리 객체 생성 (모델에 따라 다른 형태 사용)
  const [ref, api] = model?.includes('about.glb')
    ? useCylinder(() => ({
        mass: 2,
        position: [position[0], position[1] + 4, position[2]],
        rotation: randomRotation,
        args: [0.3, 0.3, 0.6, 8], // 원통형 (위 반지름, 아래 반지름, 높이, 세그먼트)
        linearDamping: 0.5,
        angularDamping: 0.2, // 회전 감쇠 감소로 더 많이 회전하게 함
        restitution: 0.6
      }))
    : model?.includes('fuel.glb')
    ? useBox(() => ({
        mass: 2,
        position: [position[0], position[1] + 4, position[2]],
        rotation: randomRotation,
        args: [0.4, 0.6, 0.4], // 직육면체 (가로, 세로, 높이)
        linearDamping: 0.5,
        angularDamping: 0.2,
        restitution: 0.6
      }))
    : model?.includes('log.glb')
    ? useBox(() => ({
        mass: 2,
        position: [position[0], position[1] + 4, position[2]],
        rotation: randomRotation,
        args: [0.5, 0.3, 0.3], // 직육면체 (가로, 세로, 높이) - 통나무 형태
        linearDamping: 0.5,
        angularDamping: 0.2,
        restitution: 0.6
      }))
    : model?.includes('artifact.glb')
    ? useBox(() => ({
        mass: 2,
        position: [position[0], position[1] + 4, position[2]],
        rotation: randomRotation,
        args: [0.4, 0.4, 0.4], // 직육면체 (가로, 세로, 높이) - 유물 형태
        linearDamping: 0.5,
        angularDamping: 0.2,
        restitution: 0.6
      }))
    : useSphere(() => ({
        mass: 2,
        position: [position[0], position[1] + 4, position[2]],
        rotation: randomRotation,
        args: [0.3],
        linearDamping: 0.5,
        angularDamping: 0.2,
        restitution: 0.6
      }));

  const [pointModel, setPointModel] = useState<THREE.Group | null>(null);

  // Load the model if specified
  useEffect(() => {
    if (model) {
      const loadModel = async () => {
        try {
          // Initialize the DRACO loader
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

          // Initialize the GLTF loader with DRACO support
          const gltfLoader = new GLTFLoader();
          gltfLoader.setDRACOLoader(dracoLoader);

          // Load the model
          gltfLoader.load(
            model,
            (gltf) => {
              const scene = gltf.scene;

              // 모델별 크기 및 위치 조정
              let scale = 0.2;
              let yOffset = 0;

              // dog.glb를 제외한 모든 모델의 크기를 2배로 키움
              if (model.includes('dog.glb')) {
                scale = 0.2; // 기존 크기 유지
              } else if (model.includes('about.glb')) {
                scale = 0.3; // 기존 0.15의 2배
                yOffset = 0.1; // 약간 위로 올림
              } else if (model.includes('fuel.glb')) {
                scale = 0.54; // 기존 0.36의 1.5배 더 키움 (0.36 * 1.5 = 0.54)
                yOffset = 0.05; // 약간 위로 올림
              } else if (model.includes('log.glb')) {
                scale = 0.4; // log 모델 크기
                yOffset = 0.05; // 약간 위로 올림
              } else if (model.includes('artifact.glb')) {
                scale = 0.4; // artifact 모델 크기
                yOffset = 0.05; // 약간 위로 올림
              } else if (model.includes('photo.glb')) {
                scale = 0.4; // 기존 0.2의 2배
              } else {
                // 기타 모든 모델도 2배로 키움
                scale = 0.4;
              }

              // Scale the model
              scene.scale.set(scale, scale, scale);

              // 모델 위치 조정 (필요한 경우)
              scene.position.y = yOffset;

              setPointModel(scene);
            },
            (xhr) => {
              console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
              console.error('Error loading model:', error);
            }
          );
        } catch (error) {
          console.error('Error in model loading:', error);
        }
      };

      loadModel();
    }
  }, [model]);

  // Create a ref for the HTML element
  const htmlRef = useRef<HTMLDivElement>(null);

  // Define keyframe animation for a dotted light that travels around the border
  const borderLightAnimation = `
    @keyframes borderTravel {
      /* Top border segments */
      0% {
        border-image: none;
        border-top: 1px solid white;
        border-right: none;
        border-bottom: none;
        border-left: none;
      }
      5% {
        border-image: none;
        border: none;
      }
      10% {
        border-image: none;
        border-top: 1px solid white;
        border-right: none;
        border-bottom: none;
        border-left: none;
      }
      15% {
        border-image: none;
        border: none;
      }
      20% {
        border-image: none;
        border-top: 1px solid white;
        border-right: none;
        border-bottom: none;
        border-left: none;
      }
      25% {
        border-image: none;
        border: none;
      }
      /* Right border segments */
      30% {
        border-image: none;
        border-top: none;
        border-right: 1px solid white;
        border-bottom: none;
        border-left: none;
      }
      35% {
        border-image: none;
        border: none;
      }
      40% {
        border-image: none;
        border-top: none;
        border-right: 1px solid white;
        border-bottom: none;
        border-left: none;
      }
      45% {
        border-image: none;
        border: none;
      }
      50% {
        border-image: none;
        border-top: none;
        border-right: 1px solid white;
        border-bottom: none;
        border-left: none;
      }
      55% {
        border-image: none;
        border: none;
      }
      /* Bottom border segments */
      60% {
        border-image: none;
        border-top: none;
        border-right: none;
        border-bottom: 1px solid white;
        border-left: none;
      }
      65% {
        border-image: none;
        border: none;
      }
      70% {
        border-image: none;
        border-top: none;
        border-right: none;
        border-bottom: 1px solid white;
        border-left: none;
      }
      75% {
        border-image: none;
        border: none;
      }
      /* Left border segments */
      80% {
        border-image: none;
        border-top: none;
        border-right: none;
        border-bottom: none;
        border-left: 1px solid white;
      }
      85% {
        border-image: none;
        border: none;
      }
      90% {
        border-image: none;
        border-top: none;
        border-right: none;
        border-bottom: none;
        border-left: 1px solid white;
      }
      95% {
        border-image: none;
        border: none;
      }
      100% {
        border-image: none;
        border-top: none;
        border-right: none;
        border-bottom: none;
        border-left: 1px solid white;
      }
    }
  `;

  // Add animation to document if it doesn't exist
  useEffect(() => {
    const styleId = 'border-travel-animation';
    if (!document.getElementById(styleId) && isHovered && !isClicked) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = borderLightAnimation;
      document.head.appendChild(styleElement);

      return () => {
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, [isHovered, isClicked, borderLightAnimation]);

  // Calculate the position for the text label
  // If there's a model, position it above the model
  // If no model, position it above the sphere
  const labelPosition = pointModel
    ? [
        0,
        model?.includes('about.glb') ? 0.9 : model?.includes('fuel.glb') ? 0.8 : model?.includes('log.glb') ? 0.7 : 0.7,
        0
      ]
    : [0, 0.7, 0];

  return (
    <group ref={ref}>
      {/* If we have a model, render it */}
      {pointModel && <primitive object={pointModel} />}

      {/* If no model, don't render anything */}
      {!pointModel && (
        <mesh visible={false}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={isHovered ? '#ffffff' : '#aaaaaa'}
            emissive={isHovered ? '#ffffff' : '#444444'}
            emissiveIntensity={isHovered ? 0.5 : 0.2}
            transparent
            opacity={0}
          />
        </mesh>
      )}

      {/* Always show text label */}
      {/* @ts-ignore - React Three Fiber types are incomplete */}
      <Html position={labelPosition} center zIndexRange={[1, 1500]} distanceFactor={1} sprite={false}>
        <div
          ref={htmlRef}
          style={{
            background: 'rgba(25, 25, 25, 0.5)', // #191919 with 50% opacity
            color: '#ffffff', // White text
            padding: '8px 16px', // 패딩 증가
            borderRadius: '0px', // No rounded corners
            fontSize: '360px', // 텍스트 크기 10배 증가 (12px -> 120px)
            whiteSpace: 'nowrap',
            transition: 'none',
            fontWeight: 'normal',
            textShadow: '0px 0px 3px #000000', // 텍스트 그림자 증가
            letterSpacing: '2px', // 자간 증가
            cursor: 'pointer',
            userSelect: 'none',
            display: 'inline-block',
            textAlign: 'center',
            position: 'relative',
            border: 'none', // 테두리 제거
            fontFamily: '"Courier New", monospace', // Digital/pixelated style font
            minWidth: '300px', // 최소 너비 증가 (60px -> 300px)
            textTransform: 'lowercase', // Ensure text is lowercase like in the 3D view
            opacity: isMobile ? 1 : showAllLabels || isHovered ? 1 : 0 // 모바일에서는 항상 표시, 그 외에는 키를 누르거나 호버 시에만 표시
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(id);
          }}
          onMouseEnter={() => onHover(id)}
          onMouseLeave={() => onLeave()}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>{title.toLowerCase()}</div>
          {isHovered && !isClicked && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                animation: 'borderTravel 0.5s linear infinite',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
          )}
        </div>
      </Html>

      {/* Add a subtle glow effect */}
      {/* @ts-ignore - React Three Fiber types are incomplete */}
      <pointLight position={[0, 0, 0]} intensity={isHovered ? 0.4 : 0.2} color="#ffffff" distance={0.8} />
    </group>
  );
}

function Model({
  modelPath,
  isHovering,
  onPointClick,
  hoveredPoint,
  setHoveredPoint,
  clickedPoint,
  customPoints = interactivePoints,
  showAllLabels,
  isMobile
}: ModelProps) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const modelRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const { camera } = useThree();

  // Physics body for the model with random initial rotation
  const randomRotation: [number, number, number] = [
    Math.random() * Math.PI * 0.2, // x축 회전 (약간만)
    Math.random() * Math.PI * 2, // y축 회전 (자유롭게)
    Math.random() * Math.PI * 0.2 // z축 회전 (약간만)
  ];

  const [physicsRef, api] = useBox(() => ({
    mass: 3,
    position: [0, 3, 0],
    rotation: randomRotation, // 랜덤 초기 회전 적용
    args: [0.8, 0.8, 0.8],
    allowSleep: false,
    linearDamping: 0.5,
    angularDamping: 0.2, // 각운동 감쇠 더 감소 (0.5 -> 0.2)
    restitution: 0.6
  }));

  // 모델이 로딩되면 물리 효과 활성화
  useEffect(() => {
    if (model) {
      // 모델이 로딩되면 물리 효과 활성화
      api.mass.set(3);
    } else {
      // 모델이 로딩되지 않았으면 물리 효과 비활성화 (질량을 0으로 설정)
      api.mass.set(0);
    }
  }, [model, api]);

  // Load the model with DRACO loader
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Initialize the DRACO loader
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

        // Initialize the GLTF loader with DRACO support
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        // Load the model
        gltfLoader.load(
          modelPath,
          (gltf) => {
            const scene = gltf.scene;
            // Scale down the model to make interactive points more visible
            scene.scale.set(0.5, 0.5, 0.5);
            setModel(scene);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          (error) => {
            console.error('Error loading model:', error);
          }
        );
      } catch (error) {
        console.error('Error in model loading:', error);
      }
    };

    loadModel();
  }, [modelPath]);

  // Set up camera and scene
  useEffect(() => {
    if (modelRef.current) {
      // Center the model
      modelRef.current.position.set(0, 0, 0);

      // 모델을 좌측 아래를 바라보도록 회전
      modelRef.current.rotation.set(
        THREE.MathUtils.degToRad(30), // x축 기준 30도 회전
        THREE.MathUtils.degToRad(-45), // y축 기준 -45도 회전
        0
      );

      // 카메라 위치는 변경하지 않고 모델만 회전시킴
      // 카메라 위치 변경 코드 제거
    }
  }, [modelRef.current]);

  // Sync the physics body with the visual model
  useFrame(() => {
    if (modelRef.current && physicsRef.current) {
      // Get the position from the physics body
      const position = physicsRef.current.position;
      const quaternion = physicsRef.current.quaternion;

      // Apply the physics position to the visual model
      modelRef.current.position.copy(position);

      // Apply the physics rotation to the visual model (자연스러운 회전을 위해)
      modelRef.current.quaternion.copy(quaternion);

      // 사용자 정의 회전은 제거 (물리 엔진의 회전을 우선시)
      // modelRef.current.rotation.x = rotation.x;
      // modelRef.current.rotation.y = rotation.y;
    }
  });

  // Handle point hover and click
  const handlePointHover = (id: string) => {
    setHoveredPoint(id);
  };

  const handlePointLeave = () => {
    setHoveredPoint(null);
  };

  if (!model) {
    // 모델이 로딩되지 않았을 때 아무것도 표시하지 않음
    return null;
  }

  return (
    <>
      {/* Physics body (invisible) - only render when model is loaded */}
      {model && (
        <mesh ref={physicsRef} visible={false}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
        </mesh>
      )}

      {/* Visual model - only render when model is loaded */}
      {model && (
        <group ref={modelRef} position={[0, 0, 0]}>
          {/* @ts-ignore - React Three Fiber types are incomplete */}
          <primitive object={model} scale={1.0} />

          {/* Add interactive points */}
          {customPoints.map((point) => (
            <InteractivePoint
              key={point.id}
              position={point.position}
              id={point.id}
              title={point.title}
              onClick={onPointClick}
              isHovered={hoveredPoint === point.id}
              isClicked={clickedPoint === point.id}
              onHover={handlePointHover}
              onLeave={handlePointLeave}
              model={point.model}
              showAllLabels={showAllLabels}
              isMobile={isMobile}
            />
          ))}
        </group>
      )}
    </>
  );
}

interface ThreeDModelProps {
  modelPath: string;
  isHovering: boolean;
  onPointClick: (id: string) => void;
  onError?: () => void;
  isMobile?: boolean;
}

export default function ThreeDModel({
  modelPath,
  isHovering,
  onPointClick,
  onError,
  isMobile = false
}: ThreeDModelProps) {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [clickedPoint, setClickedPoint] = useState<string | null>(null);
  const [customPoints, setCustomPoints] = useState(interactivePoints);
  const controlsRef = useRef<any>(null);
  const [showAllLabels, setShowAllLabels] = useState(false);
  const [isMac, setIsMac] = useState(false);

  // 모바일 및 OS 감지
  useEffect(() => {
    // OS 감지 (Mac 여부)
    const checkOS = () => {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    };

    checkOS();
  }, []);

  // 모바일에서는 항상 라벨 표시
  useEffect(() => {
    if (isMobile) {
      setShowAllLabels(true);
    }
  }, [isMobile]);

  // Function to update point position
  const updatePointPosition = (id: string, axis: 'x' | 'y' | 'z', value: number) => {
    setCustomPoints((prevPoints) =>
      prevPoints.map((point) => {
        if (point.id === id) {
          const newPosition = [...point.position] as [number, number, number];
          if (axis === 'x') newPosition[0] = value;
          if (axis === 'y') newPosition[1] = value;
          if (axis === 'z') newPosition[2] = value;
          return { ...point, position: newPosition };
        }
        return point;
      })
    );
  };

  // Function to save point positions to console (for development)
  const logPositions = () => {
    console.log(JSON.stringify(customPoints));
  };

  // Handle point click with tracking
  const handlePointClick = (id: string) => {
    setClickedPoint(id);
    onPointClick(id);
  };

  // Set initial camera distance when component mounts
  useEffect(() => {
    if (controlsRef.current) {
      // Set initial distance
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);

  // Add keyboard event listener for Alt key or Command key (Mac)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt 키 또는 Command(⌘) 키가 눌렸을 때
      if (e.altKey || e.metaKey) {
        setShowAllLabels(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // 키가 떼어졌을 때 Alt와 Command 키가 모두 눌려있지 않으면 라벨 숨김
      if (!e.altKey && !e.metaKey) {
        setShowAllLabels(false);
      }
    };

    // 전역 키보드 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
      {/* @ts-ignore - React Three Fiber types */}
      <ambientLight intensity={1.2} />
      {/* @ts-ignore - React Three Fiber types */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Add a hemisphere light for better ambient lighting */}
      {/* @ts-ignore - React Three Fiber types */}
      <hemisphereLight skyColor="#ffffff" groundColor="#bbbbff" intensity={0.7} />

      <Physics
        gravity={[0, -15, 0]} // 중력 강화 (-9.81 -> -15)
        defaultContactMaterial={{
          friction: 0.6, // 마찰 감소로 더 많이 미끄러지게 함 (0.8 -> 0.6)
          restitution: 0.4 // 탄성 증가로 더 많이 튀게 함 (0.2 -> 0.4)
        }}
      >
        <Floor />
        <Suspense fallback={<FallbackModel isHovering={isHovering} />}>
          <Model
            modelPath={modelPath}
            isHovering={isHovering}
            onPointClick={handlePointClick}
            hoveredPoint={hoveredPoint}
            setHoveredPoint={setHoveredPoint}
            clickedPoint={clickedPoint}
            customPoints={customPoints}
            showAllLabels={showAllLabels}
            isMobile={isMobile}
          />
        </Suspense>
      </Physics>

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={30}
        target={[0, 0, 0]} // 초기 타겟 설정
        makeDefault // 기본 컨트롤로 설정
      />
    </Canvas>
  );
}
