import { useMemo } from "react";
import { Shape, ExtrudeGeometry } from "three";

interface _RoundedPlaneProps {
    width: number;
    height: number;
    radius: number;
    children?: React.ReactNode;
}

export default function RoundedPlane({ width, height, radius, children, ...props }) {
    const geometry = useMemo(() => {
        const shape = new Shape();
        const x = -width / 2;
        const y = -height / 2;

        shape.moveTo(x + radius, y);
        shape.lineTo(x + width - radius, y);
        shape.quadraticCurveTo(x + width, y, x + width, y + radius);
        shape.lineTo(x + width, y + height - radius);
        shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        shape.lineTo(x + radius, y + height);
        shape.quadraticCurveTo(x, y + height, x, y + height - radius);
        shape.lineTo(x, y + radius);
        shape.quadraticCurveTo(x, y, x + radius, y);

        const geometry = new ExtrudeGeometry(shape, {
            depth: 0.001,
            bevelEnabled: false,
        });

        return geometry;
    }, [width, height, radius]);

    return (
        <mesh geometry={geometry} {...props}>
            {children}
        </mesh>
    );
}
