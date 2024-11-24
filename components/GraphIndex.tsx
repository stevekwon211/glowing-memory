import { useEffect, useRef, useState } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { writingLinks } from "../data/writings";
import { contentItems } from "../data/content";
// import { projectItems } from "../data/projects"; // projects.ts 생성 후 import

interface Node {
    id: string;
    name: string;
    group: string;
    val: number;
    x?: number;
    y?: number;
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
    const fgRef = useRef<ForceGraphMethods>();
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
        // Project 카테고리 (추후 추가)
        // ...Array.from(new Set(projectItems.flatMap((item) => item.category))).map((category) => ({
        //     id: `project-category-${category}`,
        //     name: category,
        //     group: "category",
        //     val: 15,
        // })),

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
        // Project 아이템 (추후 추가)
        // ...projectItems.map((item) => ({
        //     id: `project-${item.id}`,
        //     name: item.title,
        //     group: "project",
        //     val: 8,
        // })),
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
        // Project 링크 (추후 추가)
        // ...projectItems.flatMap((item) =>
        //     item.category.map((category) => ({
        //         source: `project-category-${category}`,
        //         target: `project-${item.id}`,
        //         value: 1,
        //     }))
        // ),
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
            {dimensions.width > 0 && dimensions.height > 0 && (
                <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    width={dimensions.width}
                    height={dimensions.height}
                    nodeColor={(node: any) => {
                        if (node.group === "category") return "#ff6b6b";
                        if (node.group === "writing") return "#4dabf7";
                        if (node.group === "content") return "#51cf66";
                        if (node.group === "project") return "#ffd43b";
                        return "#868e96";
                    }}
                    nodeLabel={(node: any) => node.name}
                    linkColor={() => "#e9ecef"}
                    nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                        if (!node.x || !node.y) return;

                        ctx.beginPath();
                        ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI);
                        ctx.fillStyle = node.group === "category" ? "#ff6b6b" : "#4dabf7";
                        ctx.fill();

                        ctx.strokeStyle = "#ffffff";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }}
                    nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
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
