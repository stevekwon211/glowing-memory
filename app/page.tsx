"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { contentItems } from "../data/content";
import Image from "next/image";
import WritingList from "../components/WritingList";
import { writingLinks } from "../data/writings";
import GraphIndex from "../components/GraphIndex";

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>("Taste");
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [currentContentIndex, setCurrentContentIndex] = useState(0);
    const selectedItemFrameRef = useRef<HTMLDivElement>(null);

    const handleCategoryClick = (category: string) => {
        if (category === "Taste" || category === "Writing") {
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

    const renderSelectedItem = () => {
        if (selectedCategory === "Taste" || (!selectedCategory && selectedYear)) {
            return (
                <div className={styles.selectedItemFrame} ref={selectedItemFrameRef}>
                    {filteredItems.map((item, index) => (
                        <div key={index} className={styles.selectedItemContent}>
                            <div className={styles.imageWrapper}>
                                {item.type === "video" && item.videoUrl ? (
                                    <video className={styles.mediaContent} autoPlay loop muted playsInline>
                                        <source src={item.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.description}
                                        width={0}
                                        height={0}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        style={{
                                            width: "auto",
                                            height: "auto",
                                            maxWidth: "100%",
                                            maxHeight: "calc(100vh - 4rem)",
                                            objectFit: "contain",
                                            margin: 0,
                                        }}
                                        quality={75}
                                    />
                                )}
                            </div>
                            <p className={styles.itemDescription}>{item.description}</p>
                        </div>
                    ))}
                </div>
            );
        } else if (selectedCategory === "Writing") {
            const filteredWritings = writingLinks.filter((item) =>
                selectedYear ? item.date.startsWith(selectedYear) : true
            );
            return (
                <div className={styles.selectedItemFrame}>
                    <WritingList items={filteredWritings} />
                </div>
            );
        } else if (selectedCategory === "Artifact") {
            return null;
        }
        return null;
    };

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
            <div className={styles.topSection}>
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
                    <div className={styles.category}>Artifact</div>
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
                <div className={styles.emptyFrame} />
                <div className={styles.infoFrame}>
                    <div className={styles.info}>Info</div>
                </div>
            </div>
            <div className={styles.bottomSection}>
                {renderSelectedItem()}
                <div className={styles.contentFrame}>
                    <div className={styles.graphIndex}>
                        <GraphIndex />
                    </div>
                </div>
            </div>
        </div>
    );
}
