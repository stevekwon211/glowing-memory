import * as THREE from "three";
import { ReactThreeFiber } from "@react-three/fiber";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            primitive: ReactThreeFiber.Object3DNode<THREE.Object3D, typeof THREE.Object3D>;
        }
    }
}
