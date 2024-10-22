"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import ProjectTitle from "../components/ProjectTitle";
import ProjectDescription from "../components/ProjectDescription";
import { Project } from "../types/project";
import Menu from "../components/Menu";
import SubMenu from "../components/SubMenu";
import { AnimatePresence } from "framer-motion";
import Masonry from "react-masonry-css";
import { contentItems } from "../data/content";
import { ContentItem } from "../types/content";
import footerStyles from "../components/Footer.module.css";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

const Card = ({ item }: { item: ContentItem }) => {
    const [videoError, setVideoError] = useState(false);
    const [ref, inView] = useInView({
        triggerOnce: true,
        rootMargin: "200px 0px",
    });

    const handleVideoError = () => {
        console.error(`Error loading video: ${item.videoUrl}`);
        setVideoError(true);
    };

    return (
        <div ref={ref} className={styles.card}>
            {inView &&
                (item.type === "video" && item.videoUrl ? (
                    videoError ? (
                        <div className={styles.videoError}>Video failed to load</div>
                    ) : (
                        <video className={styles.cardVideo} autoPlay loop muted playsInline onError={handleVideoError}>
                            <source src={item.videoUrl.replace(".mov", ".mp4")} type="video/mp4" />
                            <source src={item.videoUrl.replace(".mov", ".webm")} type="video/webm" />
                            <source src={item.videoUrl} type="video/quicktime" />
                            Your browser does not support the video tag.
                        </video>
                    )
                ) : (
                    <Image
                        src={item.imageUrl}
                        alt={item.description}
                        width={300}
                        height={200}
                        className={styles.cardImage}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ))}
            <p>{item.description}</p>
        </div>
    );
};

// 블러 플레이스홀더를 위한 함수들
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
    typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

const menuItems = [
    {
        name: "taste",
        subItems: [],
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
    const [shuffledContentItems, setShuffledContentItems] = useState<ContentItem[]>([]);
    const [visibleItems, setVisibleItems] = useState<ContentItem[]>([]);
    const [columns, setColumns] = useState<ContentItem[][]>([]);

    const shuffleArray = useCallback((array: ContentItem[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }, []);

    useEffect(() => {
        const shuffledItems = shuffleArray(contentItems);
        setShuffledContentItems(shuffledItems);

        // 모든 아이템을 3개씩 그룹화하여 컬럼 생성
        const newColumns: ContentItem[][] = [];
        for (let i = 0; i < shuffledItems.length; i += 3) {
            newColumns.push(shuffledItems.slice(i, i + 3));
        }
        setColumns(newColumns);
    }, [shuffleArray]);

    const handleProjectHover = (index: number) => {
        setHoveredProjectIndex(index);
        setIsBlurred(true);
        setTimeout(() => {
            setIsBlurred(false);
        }, 1000);
    };

    const handleProjectLeave = () => {
        setHoveredProjectIndex(null);
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
        }, 1000);
    };

    const handleSubMenuLeave = () => {
        setHoveredSubMenuUrl(null);
    };

    const renderCard = (item: ContentItem) => <Card key={item.id} item={item} />;

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    useEffect(() => {
        // 배경 이미지 프리로딩
        if (typeof window !== "undefined") {
            const preloadBackgroundImage = new window.Image();
            preloadBackgroundImage.src = "/image/img-11.JPG";
        }
    }, []);

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
                <div className={styles.headerText}>NRU PROJECT 211.</div>
                <div className={`${styles.backgroundContainer} ${isBlurred ? styles.blurred : ""}`}>
                    <div className={`${styles.backgroundItem} ${styles.active}`}>
                        <Image src="/image/img-11.JPG" alt="Background" layout="fill" objectFit="cover" priority />
                    </div>

                    {menuItems
                        .flatMap((item) => item.subItems)
                        .map((subItem, index) => (
                            <div
                                key={subItem.name}
                                className={`${styles.backgroundItem} ${
                                    subItem.url === hoveredSubMenuUrl ? styles.active : ""
                                }`}
                            >
                                {subItem.url && (
                                    <iframe
                                        src={subItem.url}
                                        title={subItem.name}
                                        className={styles.projectIframe}
                                        allowFullScreen
                                    />
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
                <div className={styles.horizontalScrollContainer}>
                    {columns.map((column, columnIndex) => (
                        <div key={columnIndex} className={styles.column}>
                            {column.map(renderCard)}
                        </div>
                    ))}
                </div>
            </div>
            <div className={footerStyles.footer}>
                <div className={footerStyles.footerColumn}>
                    <b>NRU PROJECT 211.</b>
                    <br />
                    <br />
                    NRU(느루): it means “not rushing everything at once but taking a longer, slower approach.” in Korean
                    <br />
                    211: just my birthday, wanna complete 211 projects before dying
                    <br />
                    <br />
                    taste: photos and videos I took
                    <br />
                    work: doing works to spread a message
                    <br />
                    music: making music I want to listen to
                    <br />
                    product: building products I want to use
                    <br />
                    <br />
                </div>
                <div className={footerStyles.footerColumn}>
                    <a href="https://disquiet.io/@kwondoeon" target="_blank" rel="noopener noreferrer">
                        disquiet
                    </a>
                    <span className={footerStyles.footerSeparator}> / </span>
                    <a href="https://kwondoeon.substack.com/" target="_blank" rel="noopener noreferrer">
                        substack
                    </a>
                    <span className={footerStyles.footerSeparator}> / </span>
                    <a href="https://www.instagram.com/kwondoeon/" target="_blank" rel="noopener noreferrer">
                        instagram
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
