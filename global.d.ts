import * as THREE from "three";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            bufferGeometry: JSX.IntrinsicElements["object"];
            bufferAttribute: JSX.IntrinsicElements["object"];
            primitive: JSX.IntrinsicElements["object"];
            instancedMesh: JSX.IntrinsicElements["object"];
            meshStandardMaterial: JSX.IntrinsicElements["object"];
        }
    }
}

declare module "@react-three/fiber" {
    interface ThreeElements {
        bufferGeometry: THREE.BufferGeometry;
        bufferAttribute: THREE.BufferAttribute;
        primitive: { object: THREE.Object3D | THREE.BufferGeometry };
        instancedMesh: THREE.InstancedMesh;
        meshStandardMaterial: THREE.MeshStandardMaterial;
    }
}
