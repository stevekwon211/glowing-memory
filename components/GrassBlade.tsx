import * as THREE from "three";

export function createGrassGeometry(height: number = 1) {
    const geometry = new THREE.BufferGeometry();

    // 두 개의 교차하는 평면을 위한 정점들
    const vertices = new Float32Array([
        // 첫 번째 평면
        -0.3,
        0,
        -0.3, // 왼쪽 아래
        0.3,
        0,
        0.3, // 오른쪽 아래
        0,
        height,
        0, // 꼭대기

        // 두 번째 평면
        -0.3,
        0,
        0.3, // 왼쪽 아래
        0.3,
        0,
        -0.3, // 오른쪽 아래
        0,
        height,
        0, // 꼭대기
    ]);

    // 법선 벡터 계산을 위한 인덱스
    const indices = new Uint16Array([
        0,
        1,
        2, // 첫 번째 삼각형
        3,
        4,
        5, // 두 번째 삼각형
    ]);

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    return geometry;
}
