"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import ProjectTitle from "../components/ProjectTitle";
import ProjectDescription from "../components/ProjectDescription";
import { Project } from "../types";
import Menu from "../components/Menu";
import SubMenu from "../components/SubMenu";
import { AnimatePresence } from "framer-motion";
import Masonry from "react-masonry-css";
import { contentItems } from "../data/content";
import { ContentItem } from "../types/content";

const projects: Project[] = [
    {
        name: "Verae",
        url: "https://verae.vercel.app/",
        title: "Verae",
        description: {
            en: "Space exploration. KL;' controls the camera, WASD are direction keys, click on red (planets) on the map for auto-navigation.",
            ko: "space 탐험. KL;'은 카메라 조종, WASD는 방향키, 지도의 빨간색(행성)을 클릭하면 자동 항해.",
        },
        date: new Date("2024-10-02"),
        year: 2024,
        category: "work",
    },
    {
        name: "Undistracted",
        url: "https://undistracted.vercel.app/",
        title: "Undistracted",
        description: {
            en: "Various tools and tips to help you focus. The sparkles in the background represent distracting elements.",
            ko: "몰입을 도와주는 각종 도구와 팁들. 배경에 반짝거리는 건 집중을 해치는 요소를 표현한 것.",
        },
        date: new Date("2024-10-09"),
        year: 2024,
        category: "product",
    },
];

const menuItems = [
    {
        name: "taste",
        subItems: [], // taste에는 빈 배열로 subItems 설정
    },
    {
        name: "work",
        subItems: [{ name: "Verae", url: "https://verae.vercel.app/" }],
    },
    {
        name: "music",
        subItems: [{ name: "coming soon..", url: "#comingsoon.." }],
    },
    {
        name: "product",
        subItems: [{ name: "Undistracted", url: "https://undistracted.vercel.app/" }],
    },
];

export default function Home() {
    const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
    const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);
    const [language] = useState<"en" | "ko">("en");
    const containerRef = useRef<HTMLDivElement>(null);
    const [isBlurred, setIsBlurred] = useState(false);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(null);
    const [hoveredSubMenuUrl, setHoveredSubMenuUrl] = useState<string | null>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;

            // Featured 섹션을 벗어나면 배경 이미지를 숨깁니다.
            const backgroundContainer = document.querySelector(`.${styles.backgroundContainer}`) as HTMLElement;
            if (backgroundContainer) {
                backgroundContainer.style.opacity = scrollPosition < windowHeight ? "1" : "0";
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleProjectHover = (index: number) => {
        setHoveredProjectIndex(index);
        setIsBlurred(true);
        setTimeout(() => {
            setIsBlurred(false);
        }, 1000); // 1초로 변경
    };

    const handleProjectLeave = () => {
        setHoveredProjectIndex(null);
    };

    const handleMenuHover = (index: number) => {
        // Menu hover 처리 로직
    };

    const handleMenuLeave = () => {
        // Menu leave 처리 로직
    };

    const handleMenuClick = (index: number) => {
        setSelectedMenuIndex(index);
        if (menuItems[index].name === "taste") {
            descriptionRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSubMenuSelect = (url: string) => {
        console.log("Selected sub-menu item:", url);
        setSelectedMenuIndex(null);
    };

    const handleSubMenuHover = (url: string) => {
        setHoveredSubMenuUrl(url);
        setIsBlurred(true);
        setTimeout(() => {
            setIsBlurred(false);
        }, 1000); // 1초로 변경
    };

    const handleSubMenuLeave = () => {
        setHoveredSubMenuUrl(null);
    };

    const renderCard = (item: ContentItem) => (
        <div key={item.id} className={styles.card}>
            {item.imageUrl && <img src={item.imageUrl} alt={item.title} className={styles.cardImage} />}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
        </div>
    );

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.container}
            layout
        >
            <div className={styles.featured}>
                <div className={styles.headerText}>211 project.</div>
                <div className={`${styles.backgroundContainer} ${isBlurred ? styles.blurred : ""}`}>
                    <div className={`${styles.backgroundItem} ${styles.active}`}>
                        <div className={styles.backgroundImage}></div>
                    </div>
                    {projects.map((project, index) => (
                        <div
                            key={project.name}
                            className={`${styles.backgroundItem} ${
                                hoveredProjectIndex === index ||
                                (hoveredProjectIndex === null && index === selectedProjectIndex) ||
                                project.url === hoveredSubMenuUrl
                                    ? styles.active
                                    : ""
                            }`}
                        >
                            {project.url ? (
                                <iframe
                                    src={project.url}
                                    title={project.name}
                                    className={styles.projectIframe}
                                    allowFullScreen
                                />
                            ) : (
                                <div className={styles.backgroundImage}></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.contentWrapper}>
                    <div className={styles.featuredColumn}>
                        <Menu
                            items={menuItems}
                            selectedItemIndex={selectedMenuIndex}
                            setSelectedItemIndex={handleMenuClick}
                            onHover={() => {}}
                            onLeave={() => {}}
                        />
                    </div>
                    <div className={styles.featuredColumn}>
                        <AnimatePresence>
                            {selectedMenuIndex !== null && (
                                <SubMenu
                                    items={menuItems[selectedMenuIndex].subItems}
                                    onSelect={handleSubMenuSelect}
                                    onHover={handleSubMenuHover}
                                    onLeave={handleSubMenuLeave}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                    <div className={styles.featuredColumn}></div>
                </div>
            </div>
            <div className={styles.description} ref={descriptionRef}>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className={styles.myMasonryGrid}
                    columnClassName={styles.myMasonryGridColumn}
                >
                    {contentItems.map(renderCard)}
                </Masonry>
            </div>
            <div className={styles.footer}>
                <div className={styles.footerColumn}>{/* Footer Column 1 content */}</div>
                <div className={styles.footerColumn}>{/* Footer Column 2 content */}</div>
                <div className={styles.footerColumn}>{/* Footer Column 3 content */}</div>
            </div>
        </motion.div>
    );
}
