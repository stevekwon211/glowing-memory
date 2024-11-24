import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { writingLinks } from "../data/writings";
import { contentItems } from "../data/content";
import type { ForceGraphMethods } from "react-force-graph-2d";

// ForceGraph2D를 구체적인 타입으로 임포트
const ForceGraph2D = dynamic(() => import("react-force-graph-2d").then((mod) => mod.default), {
    ssr: false,
    loading: () => <div>Loading...</div>,
});

interface Node {
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
}

interface Link {
    source: string;
    target: string;
    value: number;
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

export default function GraphIndex() {
    const fgRef = useRef<ForceGraphMethods<Node, Link>>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // 모든 데이터 소스의 카테고리와 아이템을 통합
    const nodes: Node[] = [
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

    // 모든 데이터 소스의 링크를 통합
    const links: Link[] = [
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

                if (fgRef.current) {
                    fgRef.current.d3Force("charge")?.strength(-200);
                    fgRef.current.d3Force("link")?.distance(100);
                    fgRef.current.zoomToFit(400);
                }
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
                    ref={fgRef}
                    graphData={graphData}
                    width={dimensions.width}
                    height={dimensions.height}
                    nodeColor={(node: Node) => {
                        if (node.group === "category") return "#ff6b6b";
                        if (node.group === "writing") return "#4dabf7";
                        if (node.group === "content") return "#51cf66";
                        if (node.group === "project") return "#ffd43b";
                        return "#868e96";
                    }}
                    nodeLabel={(node: Node) => node.name}
                    linkColor={() => "#e9ecef"}
                    nodeCanvasObject={(node: Node, ctx: CanvasRenderingContext2D) => {
                        if (!node.x || !node.y) return;

                        ctx.beginPath();
                        ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI);
                        ctx.fillStyle = node.group === "category" ? "#ff6b6b" : "#4dabf7";
                        ctx.fill();

                        ctx.strokeStyle = "#ffffff";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }}
                    nodePointerAreaPaint={(node: Node, color: string, ctx: CanvasRenderingContext2D) => {
                        if (!node.x || !node.y) return;
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, node.val * 1.5, 0, 2 * Math.PI);
                        ctx.fillStyle = color;
                        ctx.fill();
                    }}
                    cooldownTicks={100}
                    onEngineStop={() => {
                        if (fgRef.current) {
                            fgRef.current.zoomToFit(400);
                        }
                    }}
                    linkWidth={1}
                    minZoom={0.5}
                    maxZoom={2}
                    enableZoomInteraction={true}
                    enablePanInteraction={true}
                />
            )}
        </div>
    );
}
