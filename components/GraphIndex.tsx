import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { writingLinks } from "../data/writings";
import { contentItems } from "../data/content";

// ForceGraph2D를 동적으로 임포트
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
    ssr: false,
    loading: () => <div>Loading...</div>,
});

// 타입 정의
type NodeType = {
    id: string;
    name: string;
    group: string;
    val: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number;
    fy?: number;
    __indexColor?: string;
    index?: number;
};

type LinkType = {
    source: string | NodeType;
    target: string | NodeType;
    value: number;
};

type GraphData = {
    nodes: NodeType[];
    links: LinkType[];
};

export default function GraphIndex() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // 모드와 링크 데이터 생성
    const nodes: NodeType[] = [
        // Writing 카테고리
        ...Array.from(new Set(writingLinks.flatMap((item) => item.category))).map((category) => ({
            id: `writing-category-${category}`,
            name: category,
            group: "category",
            val: 15,
        })),
        // Content 카테고리
        ...Array.from(new Set(contentItems.flatMap((item) => (item.category ? [item.category] : [])))).map(
            (category) => ({
                id: `content-category-${category}`,
                name: category,
                group: "category",
                val: 15,
            })
        ),
        // Writing 아이템
        ...writingLinks.map((item) => ({
            id: `writing-${item.id}`,
            name: item.title,
            group: "writing",
            val: 8,
        })),
        // Content 아이템
        ...contentItems.map((item) => ({
            id: `content-${item.id}`,
            name: item.title || item.description,
            group: "content",
            val: 8,
        })),
    ];

    const links: LinkType[] = [
        // Writing 링크
        ...writingLinks.flatMap((item) =>
            item.category.map((category) => ({
                source: `writing-category-${category}`,
                target: `writing-${item.id}`,
                value: 1,
            }))
        ),
        // Content 링크
        ...contentItems.flatMap((item) =>
            item.category
                ? [
                      {
                          source: `content-category-${item.category}`,
                          target: `content-${item.id}`,
                          value: 1,
                      },
                  ]
                : []
        ),
    ];

    const graphData: GraphData = { nodes, links };

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        window.addEventListener("resize", updateDimensions);
        updateDimensions();

        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
            {typeof window !== "undefined" && dimensions.width > 0 && dimensions.height > 0 && (
                <ForceGraph2D
                    graphData={graphData}
                    width={dimensions.width}
                    height={dimensions.height}
                    nodeAutoColorBy="group"
                    linkColor={() => "#e9ecef"}
                    nodeCanvasObjectMode={() => "after"}
                    nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D) => {
                        const { x, y, name, group, val } = node;
                        if (typeof x !== "number" || typeof y !== "number") return;

                        ctx.beginPath();
                        ctx.arc(x, y, val, 0, 2 * Math.PI);
                        ctx.fillStyle = group === "category" ? "#ff6b6b" : "#4dabf7";
                        ctx.fill();

                        ctx.strokeStyle = "#ffffff";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }}
                    cooldownTicks={100}
                    minZoom={0.5}
                    maxZoom={2}
                    enableZoomInteraction={true}
                    enablePanInteraction={true}
                />
            )}
        </div>
    );
}
