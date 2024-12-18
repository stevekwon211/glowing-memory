/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

type GLTFResult = GLTF & {
    nodes: {
        ["tree-lime"]: THREE.Mesh;
    };
    materials: {
        color_main: THREE.MeshStandardMaterial;
    };
};

export default function Model(props: JSX.IntrinsicElements["group"]) {
    const group = useRef<THREE.Group>();
    const { nodes, materials } = useGLTF(
        "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-lime/model.gltf"
    ) as GLTFResult;
    return (
        <group ref={group} {...props} dispose={null}>
            <mesh geometry={nodes["tree-lime"].geometry} material={materials.color_main} />
        </group>
    );
}

useGLTF.preload("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-lime/model.gltf");
