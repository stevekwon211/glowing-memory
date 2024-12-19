// Grass.tsx

import { useRef, useMemo } from "react";
import { Instance, Instances } from "@react-three/drei";
import { Vector3, InstancedMesh, MeshStandardMaterial, DoubleSide, Euler, Matrix4 } from "three";
import { useFrame } from "@react-three/fiber";
import { createGrassGeometry } from "./GrassBlade";

export default function Grass({ count = 10000, size = 50 }) {
    const CHUNK_SIZE = 1000;
    const instancesRef = useRef<(InstancedMesh | null)[]>([]);
    const initialRotations = useRef<{ x: number; y: number; z: number }[]>([]);
    const instanceMatrix = useMemo(() => new Matrix4(), []);

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
        initialRotations.current = [];

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

                initialRotations.current.push({
                    x: (Math.random() - 0.5) * 0.2,
                    y: Math.random() * Math.PI,
                    z: 0,
                });
            }

            remainingCount -= currentChunkSize;
            chunks.push(positions);
        }
        return chunks;
    }, [settings]);

    const bladeGeom = useMemo(() => createGrassGeometry(1), []);
    const material = useMemo(() => {
        return new MeshStandardMaterial({
            color: "#4a8505",
            side: DoubleSide,
            roughness: 0.8,
            metalness: 0.1,
        });
    }, []);

    const instanceRefs = useRef<(Instance | null)[]>([]);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        instanceRefs.current.forEach((instance, index) => {
            if (!instance) return;

            const initialRotation = initialRotations.current[index];
            if (!initialRotation) return;

            const windStrength = 0.1;
            const windFrequency = 1;
            const xOffset = Math.sin(time * windFrequency + index * 0.1) * windStrength;
            const zOffset = Math.cos(time * windFrequency + index * 0.1) * windStrength * 0.5;

            instance.rotation.set(initialRotation.x + xOffset, initialRotation.y, initialRotation.z + zOffset);
        });
    });

    let globalInstanceIndex = 0;

    return (
        <>
            {chunks.map((positions, chunkIndex) => (
                <Instances
                    key={chunkIndex}
                    frustumCulled
                    ref={(el) => (instancesRef.current[chunkIndex] = el)}
                    geometry={bladeGeom}
                    material={material}
                >
                    {positions.map((pos, i) => {
                        const baseScale = 0.3 + Math.random() * 0.4;
                        const heightScale = 1.5 + Math.random() * 1.5;
                        const rotationY = Math.random() * Math.PI;
                        const tiltX = (Math.random() - 0.5) * 0.2;
                        const currentIndex = globalInstanceIndex++;

                        return (
                            <Instance
                                key={i}
                                ref={(el) => (instanceRefs.current[currentIndex] = el)}
                                position={pos}
                                scale={[baseScale, baseScale * heightScale, baseScale]}
                                rotation={[tiltX, rotationY, 0]}
                            />
                        );
                    })}
                </Instances>
            ))}
        </>
    );
}
