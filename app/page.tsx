"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";
import { contentItems } from "../data/content";
import { writingLinks } from "../data/writings";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import Modal from "../components/Modal";

// 노드 타입 정의
interface Node {
    id: string;
    title: string;
    description?: string | { en?: string; ko?: string };
    url?: string;
    imageUrl?: string;
    date?: string;
    year?: string;
    category?: string | string[];
    group?: string;
    projectUrl?: string;
}

// GraphIndex 컴포넌트의 Props 타입 정의
interface GraphIndexProps {
    onItemSelect: () => void;
    selectedItem: null;
    selectedCategory: string | null;
    selectedYear: string | null;
    onNodeClick: (node: Node) => void;
    isMobile: boolean;
}

const GraphIndex = dynamic(() => import("../components/GraphIndex"), {
    ssr: false,
    loading: () => <div style={{ width: "100%", height: "100%", background: "#EFEFEF", minHeight: "600px" }}></div>,
}) as React.ComponentType<GraphIndexProps>; // 타입 지정

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [currentContentIndex, setCurrentContentIndex] = useState(0);
    const selectedItemFrameRef = useRef<HTMLDivElement>(null);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCategoryClick = useCallback((category: string) => {
        if (category === "Taste" || category === "Writing" || category === "Artifact") {
            setSelectedCategory(category);
            setSelectedYear(null);
            setCurrentContentIndex(0);
        } else {
            setSelectedCategory(null);
        }
        setIsCategoryDropdownOpen(false);
    }, []);

    const handleYearClick = useCallback((year: string) => {
        setSelectedYear(year);
        setCurrentContentIndex(0);
        setIsYearDropdownOpen(false);
    }, []);

    const filteredItems = contentItems
        .filter((item) => {
            const yearMatch = selectedYear ? item.date.startsWith(selectedYear) : true;
            const categoryMatch = selectedCategory === "Taste" ? true : false;
            return yearMatch && categoryMatch;
        })
        .sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

    useEffect(() => {
        const frameElement = selectedItemFrameRef.current;
        if (!frameElement || (!selectedCategory && !selectedYear)) return;

        const handleScroll = () => {
            const scrollPosition = frameElement.scrollTop;
            const itemHeight = frameElement.clientHeight;
            const newIndex = Math.round(scrollPosition / itemHeight);

            if (newIndex !== currentContentIndex && newIndex >= 0 && newIndex < filteredItems.length) {
                setCurrentContentIndex(newIndex);
            }
        };

        frameElement.addEventListener("scroll", handleScroll);
        return () => frameElement.removeEventListener("scroll", handleScroll);
    }, [selectedCategory, selectedYear, currentContentIndex, filteredItems.length]);

    // const renderSelectedItem = () => { ... };

    const getAvailableYears = () => {
        if (selectedCategory === "Taste") {
            return Array.from(new Set(contentItems.map((item) => item.date.substring(0, 4)))).sort((a, b) =>
                b.localeCompare(a)
            );
        } else if (selectedCategory === "Writing") {
            return Array.from(new Set(writingLinks.map((item) => item.date.substring(0, 4)))).sort((a, b) =>
                b.localeCompare(a)
            );
        } else if (selectedCategory === "Artifact") {
            return [];
        }
        return ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
    };

    const renderCategories = () => {
        if (isMobile) {
            return (
                <div className={styles.categoriesFrame}>
                    <button
                        className={styles.dropdownButton}
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    >
                        {selectedCategory || "Category"}
                    </button>
                    {isCategoryDropdownOpen && (
                        <div className={styles.dropdownContent}>
                            {["Taste", "Writing", "Artifact"].map((category) => (
                                <div
                                    key={category}
                                    className={`${styles.category} ${
                                        selectedCategory === category ? styles.active : ""
                                    }`}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className={styles.categoriesFrame}>
                <div
                    className={`${styles.category} ${selectedCategory === "Taste" ? styles.active : ""}`}
                    onClick={() => handleCategoryClick("Taste")}
                >
                    Taste
                </div>
                <div
                    className={`${styles.category} ${selectedCategory === "Writing" ? styles.active : ""}`}
                    onClick={() => handleCategoryClick("Writing")}
                >
                    Writing
                </div>
                <div
                    className={`${styles.category} ${selectedCategory === "Artifact" ? styles.active : ""}`}
                    onClick={() => handleCategoryClick("Artifact")}
                >
                    Artifact
                </div>
            </div>
        );
    };

    const renderYears = () => {
        const years = getAvailableYears();

        if (isMobile) {
            return (
                <div className={styles.yearsFrame}>
                    <button
                        className={styles.dropdownButton}
                        onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                    >
                        {selectedYear || "Year"}
                    </button>
                    {isYearDropdownOpen && (
                        <div className={styles.dropdownContent}>
                            {years.map((year) => (
                                <div
                                    key={year}
                                    className={`${styles.year} ${selectedYear === year ? styles.active : ""}`}
                                    onClick={() => handleYearClick(year)}
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className={styles.yearsFrame}>
                {getAvailableYears().map((year) => (
                    <div
                        key={year}
                        className={`${styles.year} ${selectedYear === year ? styles.active : ""}`}
                        onClick={() => handleYearClick(year)}
                    >
                        {year}
                    </div>
                ))}
            </div>
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(`.${styles.categoriesFrame}`)) {
                setIsCategoryDropdownOpen(false);
            }
            if (!target.closest(`.${styles.yearsFrame}`)) {
                setIsYearDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.topSection}>
                <div className={styles.nameFrame}>
                    <div className={styles.name}>Kwon Doeon</div>
                </div>
                {renderCategories()}
                {renderYears()}
                <div className={styles.infoFrame}>
                    <div className={styles.info}>Info</div>
                </div>
            </div>
            <div className={styles.bottomSection}>
                <div className={styles.contentFrame}>
                    <div className={styles.graphIndex}>
                        <GraphIndex
                            onItemSelect={() => {}}
                            selectedItem={null}
                            selectedCategory={selectedCategory}
                            selectedYear={selectedYear}
                            isMobile={isMobile}
                            onNodeClick={(node: Node) => {
                                setSelectedNode(node);
                            }}
                        />
                    </div>
                </div>
            </div>
            {mounted &&
                createPortal(
                    <Modal
                        isOpen={!!selectedNode}
                        onClose={() => setSelectedNode(null)}
                        content={{
                            type:
                                selectedNode?.group === "artifact"
                                    ? "artifact"
                                    : selectedNode?.group === "writing"
                                    ? "writing"
                                    : "content",
                            title: selectedNode?.title,
                            imageUrl: selectedNode?.imageUrl,
                            description: selectedNode?.description,
                            date: selectedNode?.date,
                            year: selectedNode?.year,
                            url: selectedNode?.url,
                            category: selectedNode?.category,
                            projectUrl: selectedNode?.projectUrl,
                        }}
                    />,
                    document.body
                )}
        </div>
    );
}
