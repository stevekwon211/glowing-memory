import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const GrassMaterialImpl = shaderMaterial(
    {
        time: 0,
        color: new THREE.Color("#4a8505"),
        windStrength: 0.2,
        windSpeed: 0.5,
    },
    // vertex shader
    /*glsl*/ `
    uniform float time;
    uniform float windStrength;
    uniform float windSpeed;
    
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        
        // 바람 효과 계산
        float wind = sin(time * windSpeed + position.x * 0.5) * windStrength;
        
        // 높이에 따라 바람 영향 증가 (위로 갈수록 더 많이 움직임)
        vec3 pos = position;
        float windEffect = pow(position.y, 2.0);
        pos.x += wind * windEffect;
        pos.z += wind * windEffect * 0.5;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,
    // fragment shader
    /*glsl*/ `
    uniform vec3 color;
    varying vec2 vUv;
    
    void main() {
        gl_FragColor = vec4(color, 1.0);
    }
    `
);

extend({ GrassMaterialImpl });

// Three.js 스타일의 material 선언 추가
declare global {
    namespace JSX {
        interface IntrinsicElements {
            grassMaterialImpl: any;
        }
    }
}

// namespace 대신 export interface 사용
export interface GrassMaterialUniforms {
    time: { value: number };
    // any 대신 구체적인 타입 지정
    map: { value: THREE.Texture | null };
}
