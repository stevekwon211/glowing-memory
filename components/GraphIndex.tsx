import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ForceGraph3D from "3d-force-graph";
import Image from "next/image";
import { contentItems } from "@/data/content";
import { writingLinks } from "@/data/writings";
import { projects } from "@/data/projects";
import { OctahedronGeometry } from "three";
import Modal from "./Modal";

// Define types for the graph structure
interface GraphNode {
    id: string;
    name: string;
    group: string;
    level: "root" | "category" | "item" | "top";
    val: number;
    data?: any;
}

interface GraphLink {
    source: string;
    target: string;
}

interface Props {
    onItemSelect: (item: any) => void;
    selectedItem?: any;
    selectedCategory?: string | null;
    selectedYear?: string | null;
}

interface TooltipContent {
    title?: string;
    imageUrl?: string;
    date?: string;
    year?: string;
    description?: {
        en?: string;
        ko?: string;
    };
    type: "content" | "writing" | "project" | "root" | "category";
}

const GraphIndex = ({ onItemSelect, selectedItem, selectedCategory, selectedYear }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<any>(null);
    const hoveredNodeRef = useRef<GraphNode | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [tooltip, setTooltip] = useState<{
        show: boolean;
        content: TooltipContent | null;
        x: number;
        y: number;
    }>({
        show: false,
        content: null,
        x: 0,
        y: 0,
    });
    const [modalContent, setModalContent] = useState<{
        isOpen: boolean;
        content: any;
    }>({
        isOpen: false,
        content: null,
    });

    // 그래프 데이터를 저장할 ref 추가
    const graphDataRef = useRef<{ nodes: GraphNode[]; links: GraphLink[] }>({ nodes: [], links: [] });

    // 마우스 위치 추적을 위한 이벤트 리스너
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                });
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
            return () => {
                container.removeEventListener("mousemove", handleMouseMove);
            };
        }
    }, []);

    // 툴팁 위치 계산 함수 추가
    const calculateTooltipPosition = (x: number, y: number, tooltipWidth: number, tooltipHeight: number) => {
        if (!containerRef.current) return { x, y };

        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        const padding = 10;

        let newX = x + padding;
        let newY = y + padding;

        // 화면 우측에 가까워지면 왼쪽으로 표시
        if (x > containerWidth / 2) {
            newX = x - tooltipWidth - padding;
        }

        // 화면 하단에 가까워지면 위로 표시
        if (y > containerHeight / 2) {
            newY = y - tooltipHeight - padding;
        }

        // 최종 위치가 화면을 벗어나지 않도록 조정
        newX = Math.max(padding, Math.min(containerWidth - tooltipWidth - padding, newX));
        newY = Math.max(padding, Math.min(containerHeight - tooltipHeight - padding, newY));

        return { x: newX, y: newY };
    };

    // Create graph data structure
    const createGraphData = () => {
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];

        // Add the top-level 'About me' node
        nodes.push({
            id: "about-me",
            name: "About me",
            group: "root",
            level: "top",
            val: 100,
        });

        // Add root nodes and link them to 'About me'
        const rootNodes = [
            { id: "taste", name: "Taste", group: "taste", level: "root" as const, val: 50 },
            { id: "writing", name: "Writing", group: "writing", level: "root" as const, val: 50 },
            { id: "artifact", name: "Artifact", group: "artifact", level: "root" as const, val: 50 },
        ];
        nodes.push(...rootNodes);
        rootNodes.forEach((node) => {
            links.push({ source: "about-me", target: node.id });
        });

        // Process Taste (content.ts) data
        const tasteCategories = new Set(contentItems.map((item) => item.category).filter(Boolean));
        tasteCategories.forEach((category) => {
            const categoryId = `taste-category-${category}`;
            nodes.push({
                id: categoryId,
                name: category,
                group: "taste",
                level: "category",
                val: 30,
            });
            links.push({ source: "taste", target: categoryId });

            // Add items under this category
            contentItems
                .filter((item) => item.category === category)
                .forEach((item) => {
                    nodes.push({
                        id: `content-${item.id}`,
                        name: item.title || `Content ${item.id}`,
                        group: "taste",
                        level: "item",
                        val: 20,
                        data: item,
                    });
                    links.push({ source: categoryId, target: `content-${item.id}` });
                });
        });

        // Process Writing (writing.ts) data
        const writingCategories = new Set(writingLinks.flatMap((item) => item.category));
        writingCategories.forEach((category) => {
            const categoryId = `writing-category-${category}`;
            nodes.push({
                id: categoryId,
                name: category,
                group: "writing",
                level: "category",
                val: 30,
            });
            links.push({ source: "writing", target: categoryId });

            // Add items under this category
            writingLinks
                .filter((item) => item.category.includes(category))
                .forEach((item) => {
                    nodes.push({
                        id: `writing-${item.id}`,
                        name: item.title,
                        group: "writing",
                        level: "item",
                        val: 20,
                        data: item,
                    });
                    links.push({ source: categoryId, target: `writing-${item.id}` });
                });
        });

        // Process Artifact (projects.ts) data
        const projectCategories = new Set(projects.map((item) => item.category).filter(Boolean));
        projectCategories.forEach((category) => {
            const categoryId = `artifact-category-${category}`;
            nodes.push({
                id: categoryId,
                name: category,
                group: "artifact",
                level: "category",
                val: 30,
            });
            links.push({ source: "artifact", target: categoryId });

            // Add items under this category
            projects
                .filter((item) => item.category === category)
                .forEach((item) => {
                    nodes.push({
                        id: `project-${item.id}`,
                        name: item.title,
                        group: "artifact",
                        level: "item",
                        val: 20,
                        data: item,
                    });
                    links.push({ source: categoryId, target: `project-${item.id}` });
                });
        });

        return { nodes, links };
    };

    // 노드의 선택 상태를 확인하는 함수를 단순화
    const isNodeSelected = (node: any) => {
        // About me 노드는 메뉴나 연도가 선택된 경우에만 강조
        if (node.level === "top") {
            return selectedCategory || selectedYear;
        }

        const belongsToSelectedCategory = selectedCategory?.toLowerCase() === node.group?.toLowerCase();

        // 연도만 선택된 경우
        if (!selectedCategory && selectedYear) {
            if (node.level === "item") {
                const nodeYear = node.data?.date?.substring(0, 4) || node.data?.year;
                return nodeYear === selectedYear;
            }
            // 카테고리나 메인 노드의 경우, 하위 아이템 중 선택된 연도와 일치하는 것이 있는지 확인
            return graphDataRef.current.nodes.some((n: any) => {
                if (n.level === "item" && n.group === node.group) {
                    const itemYear = n.data?.date?.substring(0, 4) || n.data?.year;
                    return itemYear === selectedYear;
                }
                return false;
            });
        }

        // 카테고리만 선택된 경우
        if (selectedCategory && !selectedYear) {
            return belongsToSelectedCategory;
        }

        // 카테고리와 연도 모두 선택된 경우
        if (selectedCategory && selectedYear) {
            if (node.level === "item") {
                const nodeYear = node.data?.date?.substring(0, 4) || node.data?.year;
                return belongsToSelectedCategory && nodeYear === selectedYear;
            }
            if (node.level === "category") {
                // 카테고리 노드는 해당 연도의 아이템을 가지고 있을 때만 활성화
                return (
                    belongsToSelectedCategory &&
                    graphDataRef.current.nodes.some((n: any) => {
                        if (n.level === "item") {
                            const categoryId = `${node.group}-category-${node.name}`;
                            const isLinked = graphDataRef.current.links.some(
                                (l) => l.source === categoryId && l.target === n.id
                            );
                            if (isLinked) {
                                const itemYear = n.data?.date?.substring(0, 4) || n.data?.year;
                                return itemYear === selectedYear;
                            }
                        }
                        return false;
                    })
                );
            }
            return belongsToSelectedCategory;
        }

        return false;
    };

    // 노드가 현재 선택 상태에서 보여져야 하는지 확인하는 함수
    const shouldNodeBeVisible = (node: any) => {
        // 아무것도 선택되지 않았다면 모든 노드 표시
        if (!selectedCategory && !selectedYear) {
            return true;
        }

        // About me 노드는 항상 표시
        if (node.level === "top") {
            return true;
        }

        const isSelected = isNodeSelected(node);

        // 선택된 노드와 그 상위/하위 노드들만 표시
        if (isSelected) {
            return true;
        }

        // 선택된 노드의 부모나 자식 노드인 경우 표시
        const links = graphDataRef.current.links;
        const isConnectedToSelected = links.some((link) => {
            const otherNode = link.source === node.id ? link.target : link.source === node.id ? link.source : null;
            if (otherNode) {
                const connectedNode = graphDataRef.current.nodes.find((n) => n.id === otherNode);
                return connectedNode && isNodeSelected(connectedNode);
            }
            return false;
        });

        return isConnectedToSelected;
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const graphData = createGraphData();
        graphDataRef.current = graphData;

        const Graph = ForceGraph3D()(containerRef.current)
            .graphData(graphData)
            .linkColor(() => "#3C3C3C")
            .nodeLabel(() => "")
            // 노드 가시성 제어
            .nodeVisibility((node: any) => shouldNodeBeVisible(node))
            // 링크 가시성 제어
            .linkVisibility((link: any) => {
                const sourceNode = graphData.nodes.find((n) => n.id === link.source);
                const targetNode = graphData.nodes.find((n) => n.id === link.target);
                return sourceNode && targetNode && shouldNodeBeVisible(sourceNode) && shouldNodeBeVisible(targetNode);
            })
            .nodeThreeObject((node: any) => {
                let geometry;

                // Different shapes for different levels
                switch (node.level) {
                    case "top":
                        geometry = new THREE.IcosahedronGeometry(node.val / 5);
                        break;
                    case "root":
                        geometry = new THREE.OctahedronGeometry(node.val / 4);
                        break;
                    case "category":
                        geometry = new THREE.BoxGeometry(node.val / 4, node.val / 4, node.val / 4);
                        break;
                    default:
                        geometry = new THREE.TetrahedronGeometry(node.val / 6);
                }

                const isHovered = hoveredNodeRef.current?.id === node.id;
                const isSelected = isNodeSelected(node);

                // 노드의 색상 결정
                const getNodeColor = () => {
                    // 선택된 노드는 무조건 강조 색상 유지
                    if (isSelected) {
                        return {
                            color: "#F3ECC2",
                            emissive: "#793315",
                            emissiveIntensity: 0.5,
                        };
                    }

                    // 선택되지 않은 노드만 호버 효과 적용
                    if (isHovered) {
                        return {
                            color: "#F3ECC2",
                            emissive: "#793315",
                            emissiveIntensity: 0.5,
                        };
                    }

                    // 기본 상태
                    return {
                        color: "#3C3C3C",
                        emissive: "#3C3C3C",
                        emissiveIntensity: 0,
                    };
                };

                const nodeColor = getNodeColor();

                const material = new THREE.MeshStandardMaterial({
                    ...nodeColor,
                    metalness: 0.5,
                    roughness: 0.5,
                    transparent: true,
                    opacity: selectedItem?.id === node.id ? 0.8 : 1,
                });

                return new THREE.Mesh(geometry, material);
            })
            .onNodeClick((node: any) => {
                if (node.level === "item") {
                    switch (node.group) {
                        case "taste":
                            setModalContent({
                                isOpen: true,
                                content: {
                                    type: "taste",
                                    title: node.data.title,
                                    imageUrl: node.data.imageUrl,
                                    date: node.data.date,
                                },
                            });
                            break;
                        case "writing":
                            setModalContent({
                                isOpen: true,
                                content: {
                                    type: "writing",
                                    title: node.data.title,
                                    url: node.data.url,
                                    date: node.data.date,
                                },
                            });
                            break;
                        case "artifact":
                            setModalContent({
                                isOpen: true,
                                content: {
                                    type: "artifact",
                                    title: node.data.title,
                                    imageUrl: node.data.imageUrl,
                                    description: node.data.description,
                                    year: node.data.year,
                                },
                            });
                            break;
                    }
                }
            })
            .onNodeHover((node: any) => {
                hoveredNodeRef.current = node;

                if (containerRef.current) {
                    containerRef.current.style.cursor = node ? "pointer" : "default";
                }

                // 호버 상태가 변경될 때마다 그래프를 새로 그리지 않고,
                // 해당 노드의 material만 업데이트
                const allNodes = graphRef.current.scene().children.filter((obj: any) => obj.type === "Mesh");

                allNodes.forEach((obj: any) => {
                    const nodeData = obj.__data;
                    if (nodeData) {
                        const isHovered = node?.id === nodeData.id;
                        const isSelected = isNodeSelected(nodeData);

                        // 선택된 노드는 항상 강조 색상 유지
                        if (isSelected) {
                            obj.material.color.set("#F3ECC2");
                            obj.material.emissive.set("#793315");
                            obj.material.emissiveIntensity = 0.5;
                        }
                        // 선택되지 않은 노드만 호버 효과 적용
                        else {
                            obj.material.color.set(isHovered ? "#F3ECC2" : "#3C3C3C");
                            obj.material.emissive.set(isHovered ? "#793315" : "#3C3C3C");
                            obj.material.emissiveIntensity = isHovered ? 0.5 : 0;
                        }
                    }
                });

                // 툴팁 업데이트
                if (node) {
                    let tooltipContent: TooltipContent | null = null;

                    switch (node.level) {
                        case "top":
                        case "root":
                            tooltipContent = {
                                title: node.name,
                                type: "root",
                            };
                            break;
                        case "category":
                            tooltipContent = {
                                title: node.name,
                                type: "category",
                            };
                            break;
                        case "item":
                            switch (node.group) {
                                case "taste":
                                    tooltipContent = {
                                        title: node.data.title || "",
                                        imageUrl: node.data.imageUrl,
                                        date: node.data.date,
                                        type: "content",
                                    };
                                    break;
                                case "writing":
                                    tooltipContent = {
                                        title: node.data.title,
                                        date: node.data.date,
                                        type: "writing",
                                    };
                                    break;
                                case "artifact":
                                    tooltipContent = {
                                        title: node.data.title,
                                        imageUrl: node.data.imageUrl,
                                        year: node.data.year,
                                        description: node.data.description,
                                        type: "project",
                                    };
                                    break;
                            }
                            break;
                    }

                    setTooltip({
                        show: true,
                        content: tooltipContent,
                        x: mousePosition.x,
                        y: mousePosition.y,
                    });
                } else {
                    setTooltip((prev) => ({ ...prev, show: false }));
                }
            })
            .cameraPosition({ x: 0, y: 0, z: 600 });

        graphRef.current = Graph;

        // Set up scene
        const scene = Graph.scene();
        scene.add(new THREE.AmbientLight(0xbbbbbb));
        scene.add(new THREE.DirectionalLight(0xffffff, 0.6));
        Graph.backgroundColor("#EFEFEF");

        // Handle window resize
        const handleResize = () => {
            if (containerRef.current) {
                Graph.width(containerRef.current.clientWidth).height(containerRef.current.clientHeight);
            }
        };

        window.addEventListener("resize", handleResize);

        // 선택 상태가 변경될 때마다 그래프 업데이트
        const updateVisibility = () => {
            const { nodes, links } = Graph.graphData();
            Graph.graphData({
                nodes: nodes.map((node) => ({
                    ...node,
                    visible: shouldNodeBeVisible(node),
                })),
                links: links.map((link) => ({
                    ...link,
                    visible: shouldNodeBeVisible(link.source) && shouldNodeBeVisible(link.target),
                })),
            });
        };

        updateVisibility();

        return () => {
            window.removeEventListener("resize", handleResize);
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, [selectedCategory, selectedYear]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                background: "#EFEFEF",
                minHeight: "600px",
                position: "relative",
            }}
        >
            {tooltip.show && tooltip.content && (
                <div
                    ref={(el) => {
                        if (el) {
                            const { x, y } = calculateTooltipPosition(
                                mousePosition.x,
                                mousePosition.y,
                                el.offsetWidth,
                                el.offsetHeight
                            );
                            el.style.left = `${x}px`;
                            el.style.top = `${y}px`;
                        }
                    }}
                    style={{
                        position: "absolute",
                        background: "#EFEFEF",
                        padding: "4px",
                        border: "1px solid #DCDCDC",
                        borderRadius: "0",
                        zIndex: 1000,
                        width: "fit-content",
                        maxWidth: "300px",
                        overflow: "hidden",
                        fontFamily: "Manrope, sans-serif",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    {(tooltip.content.type === "root" || tooltip.content.type === "category") && (
                        <div
                            style={{
                                fontSize: "14px",
                                color: "#0C0C0C",
                                fontWeight: "500",
                                padding: "0 4px",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {tooltip.content.title}
                        </div>
                    )}

                    {tooltip.content.type !== "root" && tooltip.content.type !== "category" && (
                        <>
                            {tooltip.content.imageUrl && (
                                <div
                                    style={{
                                        marginBottom: "4px",
                                        position: "relative",
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        justifyContent: "flex-start",
                                    }}
                                >
                                    <Image
                                        src={tooltip.content.imageUrl}
                                        alt={tooltip.content.title || ""}
                                        width={292}
                                        height={292}
                                        priority
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            maxHeight: "292px",
                                            objectFit: "contain",
                                            objectPosition: "top left",
                                        }}
                                    />
                                </div>
                            )}
                            {tooltip.content.title && (
                                <div
                                    style={{
                                        fontSize: "14px",
                                        color: "#0C0C0C",
                                        fontWeight: "500",
                                        marginBottom: "4px",
                                        padding: "0 4px",

                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {tooltip.content.title}
                                </div>
                            )}
                            {tooltip.content.description?.ko && (
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#3C3C3C",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        padding: "0 4px",
                                        marginBottom: "4px",
                                    }}
                                >
                                    {tooltip.content.description.ko}
                                </div>
                            )}
                            {(tooltip.content.date || tooltip.content.year) && (
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#3C3C3C",
                                        marginBottom: "4px",
                                        padding: "0 4px",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {tooltip.content.date || tooltip.content.year}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
            <Modal
                isOpen={modalContent.isOpen}
                onClose={() => setModalContent({ isOpen: false, content: null })}
                content={modalContent.content}
            />
        </div>
    );
};

export default GraphIndex;
