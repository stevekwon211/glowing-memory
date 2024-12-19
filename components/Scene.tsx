"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, OrbitControls, Circle, MeshDistortMaterial, Environment } from "@react-three/drei";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import Grass from "./Grass";

function SceneComponent() {
    const cameraPosition: [number, number, number] = [0, 5, 20];
    const maxDistance = Math.sqrt(cameraPosition[0] ** 2 + cameraPosition[1] ** 2 + cameraPosition[2] ** 2);

    return (
        <Canvas camera={{ position: cameraPosition }} dpr={[1, 2]} performance={{ min: 0.5 }}>
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />

            <Environment preset="night" />

            <Sky
                turbidity={10}
                rayleigh={6}
                mieCoefficient={0.005}
                mieDirectionalG={0.005}
                distance={450000}
                sunPosition={[180, 4, -480]}
                inclination={0.02}
            />
            <OrbitControls minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.5} maxDistance={maxDistance} />

            <Circle args={[25.5]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <MeshDistortMaterial color="#355e3b" />
            </Circle>

            <Suspense fallback={null}>
                <Grass count={50000} size={50} />
            </Suspense>
        </Canvas>
    );
}

export default React.memo(SceneComponent);
