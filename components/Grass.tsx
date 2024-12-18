"use client";

import { useRef, useMemo } from "react";
import { Instance, Instances } from "@react-three/drei";
import { Vector3, Object3D, InstancedMesh, MeshStandardMaterial, DoubleSide } from "three";
import { useFrame } from "@react-three/fiber";
import GrassBlade from "./GrassBlade";

interface GrassProps {
    count?: number;
    size?: number;
}

export default function Grass({ count = 10000, size = 50 }: GrassProps) {
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

    useFrame(({ clock }) => {
        instancesRef.current.forEach((instances) => {
            if (!instances) return;

            const time = clock.getElapsedTime();
            (instances as unknown as { children: Object3D[] }).children.forEach((instance, _i) => {
                if (instance) {
                    const offset = instance.position.x * 0.5 + instance.position.z * 0.5;
                    const swayAmount = instance.scale.y * 0.1;

                    instance.rotation.x = Math.sin(time + offset) * 0.1 + instance.userData.initialRotation.x;
                    instance.rotation.z = Math.cos(time * 0.5 + offset) * swayAmount;
                }
            });
        });
    });

    const setInstanceRef = (index: number) => (el: InstancedMesh | null) => {
        instancesRef.current[index] = el;
    };

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
                <Instances key={chunkIndex} frustumCulled ref={setInstanceRef(chunkIndex)} material={material}>
                    <GrassBlade />
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
