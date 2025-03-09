'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';

interface GrassProps {
  count?: number;
  size?: number;
}

export default function Grass({ count = 10000, size = 20 }: GrassProps) {
  const instancesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const grassBlades = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const position = [(Math.random() - 0.5) * size, 0, (Math.random() - 0.5) * size];
      const scale = 0.3 + Math.random() * 0.7;
      const rotation = Math.random() * Math.PI;
      return { position, scale, rotation };
    });
  }, [count, size]);

  useFrame((state) => {
    if (!instancesRef.current) return;

    // Animate grass with wind effect
    const time = state.clock.getElapsedTime();
    grassBlades.forEach((blade, i) => {
      const { position, scale, rotation } = blade;
      dummy.position.set(position[0], position[1], position[2]);
      dummy.rotation.set(0, rotation, 0);
      dummy.scale.set(scale, scale + Math.sin(time + position[0] * 0.1) * 0.1, scale);
      dummy.updateMatrix();
      instancesRef.current.setMatrixAt(i, dummy.matrix);
    });
    instancesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <Instances limit={count} ref={instancesRef}>
      <planeGeometry args={[0.1, 1, 1]} />
      <meshStandardMaterial color="#4c9f70" side={THREE.DoubleSide} roughness={0.8} metalness={0.1} />
      {grassBlades.map((blade, i) => (
        <Instance
          key={i}
          position={blade.position as [number, number, number]}
          rotation={[0, blade.rotation, 0]}
          scale={[blade.scale, blade.scale, blade.scale]}
        />
      ))}
    </Instances>
  );
}
