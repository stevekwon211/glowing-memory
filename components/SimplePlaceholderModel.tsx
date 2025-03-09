'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Cylinder } from '@react-three/drei';
import { Mesh } from 'three';

interface RotatingShapeProps {
  shape: 'box' | 'sphere' | 'torus' | 'cylinder';
  isHovering: boolean;
}

function RotatingShape({ shape, isHovering }: RotatingShapeProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current && isHovering) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  switch (shape) {
    case 'box':
      return <Box ref={meshRef} args={[1, 1, 1]} />;
    case 'sphere':
      return <Sphere ref={meshRef} args={[0.7, 32, 32]} />;
    case 'torus':
      return <Torus ref={meshRef} args={[0.6, 0.2, 16, 32]} />;
    case 'cylinder':
      return <Cylinder ref={meshRef} args={[0.5, 0.5, 1, 32]} />;
    default:
      return <Box ref={meshRef} args={[1, 1, 1]} />;
  }
}

interface SimplePlaceholderModelProps {
  shape?: 'box' | 'sphere' | 'torus' | 'cylinder';
  isHovering?: boolean;
}

export default function SimplePlaceholderModel({ shape = 'box', isHovering = false }: SimplePlaceholderModelProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <RotatingShape shape={shape} isHovering={isHovering} />
      </Canvas>
    </div>
  );
}
