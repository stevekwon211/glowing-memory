// Grass.tsx

import { useRef, useMemo } from "react";
import { Instance, Instances } from "@react-three/drei";
import { Vector3, InstancedMesh, MeshStandardMaterial, DoubleSide } from "three";
import { useFrame } from "@react-three/fiber";
import { createGrassGeometry } from "./GrassBlade"; // geometry 생성 함수만 임포트

export default function Grass({ count = 10000, size = 50 }) {
    const CHUNK_SIZE = 1000;
    const instancesRef = useRef<(InstancedMesh | null)[]>([]);

    const settings = useMemo(
        () => ({
            count,
            size,
            numChunks: Math.ceil(count / CHUNK_SIZE),
        }),
        [count, size]
    );

    const chunks = useMemo(() => {
        const chunks = [];
        let remainingCount = settings.count;

        for (let chunk = 0; chunk < settings.numChunks; chunk++) {
            const positions: Vector3[] = [];
            const currentChunkSize = Math.min(CHUNK_SIZE, remainingCount);

            for (let i = 0; i < currentChunkSize; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.sqrt(Math.random()) * (settings.size / 2);
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = Math.random() * 0.2;
                positions.push(new Vector3(x, y, z));
            }

            remainingCount -= currentChunkSize;
            chunks.push(positions);
        }
        return chunks;
    }, [settings]);

    useFrame(({ clock: _clock }) => {
        instancesRef.current.forEach((instances) => {
            if (!instances) return;
            // 현재는 애니메이션이 구현되지 않아 clock을 사용하지 않음
            // 추후 애니메이션 구현 시 사용할 예정
        });
    });

    const setInstanceRef = (index: number) => (el: InstancedMesh | null) => {
        instancesRef.current[index] = el;
    };

    const bladeGeom = useMemo(() => createGrassGeometry(1), []);
    const material = useMemo(() => {
        return new MeshStandardMaterial({
            color: "#4a8505",
            side: DoubleSide,
            roughness: 0.8,
            metalness: 0.1,
        });
    }, []);

    return (
        <>
            {chunks.map((positions, chunkIndex) => (
                <Instances
                    key={chunkIndex}
                    frustumCulled
                    ref={setInstanceRef(chunkIndex)}
                    geometry={bladeGeom}
                    material={material}
                >
                    {positions.map((pos, i) => {
                        const baseScale = 0.3 + Math.random() * 0.4;
                        const heightScale = 1.5 + Math.random() * 1.5;
                        const rotationY = Math.random() * Math.PI;
                        const tiltX = (Math.random() - 0.5) * 0.2;
                        return (
                            <Instance
                                key={i}
                                position={pos}
                                scale={[baseScale, baseScale * heightScale, baseScale]}
                                rotation={[tiltX, rotationY, 0]}
                                userData={{
                                    initialRotation: {
                                        x: tiltX,
                                        y: rotationY,
                                        z: 0,
                                    },
                                }}
                            />
                        );
                    })}
                </Instances>
            ))}
        </>
    );
}
