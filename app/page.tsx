"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { contentItems } from "../data/content";
import { writingLinks } from "../data/writings";
import GraphIndex from "../components/GraphIndex";

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [currentContentIndex, setCurrentContentIndex] = useState(0);
    const selectedItemFrameRef = useRef<HTMLDivElement>(null);

    const handleCategoryClick = (category: string) => {
        if (category === "Taste" || category === "Writing" || category === "Artifact") {
            setSelectedCategory(category);
            setSelectedYear(null);
            setCurrentContentIndex(0);
        } else {
            setSelectedCategory(null);
        }
    };

    const handleYearClick = (year: string) => {
        setSelectedYear(year);
        setCurrentContentIndex(0);
    };

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

    return (
        <div className={styles.container}>
            <div
                className={styles.topSection}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "fit-content",
                    height: "100%",
                }}
            >
                <div className={styles.nameFrame}>
                    <div className={styles.name}>Kwon Doeon</div>
                </div>
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
                <div
                    className={styles.infoFrame}
                    style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                    }}
                >
                    <div className={styles.info}>Info</div>
                </div>
            </div>
            <div className={styles.bottomSection}>
                {/* {renderSelectedItem()} */}
                <div className={styles.contentFrame}>
                    <div className={styles.graphIndex}>
                        <GraphIndex
                            onItemSelect={() => {}}
                            selectedItem={null}
                            selectedCategory={selectedCategory}
                            selectedYear={selectedYear}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
