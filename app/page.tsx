"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import { ContentItem } from "../types/content";
import footerStyles from "../components/Footer.module.css";
import Menu from "../components/Menu";
import SubMenu from "../components/SubMenu";
import { AnimatePresence } from "framer-motion";
import { contentItems } from "../data/content";
import Image from "next/image";

const backgroundImage = "/image/img-11.jpeg";

const Card = ({ item }: { item: ContentItem }) => {
    const [videoError, setVideoError] = useState(false);

    const handleVideoError = () => {
        console.error(`Error loading video: ${item.videoUrl}`);
        setVideoError(true);
    };

    return (
        <div className={styles.card}>
            {item.type === "video" && item.videoUrl ? (
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
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "300px",
                        aspectRatio: "auto",
                        objectFit: "cover",
                    }}
                    quality={60}
                    className={styles.cardImage}
                />
            )}
            <p>{item.description}</p>
        </div>
    );
};

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
    const [isBlurred, setIsBlurred] = useState(false);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(null);
    const [hoveredSubMenuUrl, setHoveredSubMenuUrl] = useState<string | null>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);
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

        const newColumns: ContentItem[][] = [];
        for (let i = 0; i < shuffledItems.length; i += 3) {
            newColumns.push(shuffledItems.slice(i, i + 3));
        }
        setColumns(newColumns);
    }, [shuffleArray]);

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

    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = contentItems
                .filter((item) => item.type === "image")
                .map((item) => {
                    return new Promise((resolve, reject) => {
                        const img = document.createElement("img");
                        img.src = item.imageUrl;
                        img.onload = resolve;
                        img.onerror = reject;
                    });
                });

            try {
                await Promise.all(imagePromises);
                console.log("All images preloaded successfully");
            } catch (error) {
                console.error("Error preloading images:", error);
            }
        };

        preloadImages();
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.container}
                layout
            >
                <div className={styles.scrollContainer}>
                    <div className={styles.featured}>
                        <div className={styles.headerText}>NRU PROJECT 211.</div>
                        <div className={`${styles.backgroundContainer} ${isBlurred ? styles.blurred : ""}`}>
                            <div className={`${styles.backgroundItem} ${styles.active}`}>
                                <Image
                                    src={backgroundImage}
                                    alt="Background"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    priority
                                    quality={60}
                                />
                            </div>

                            {menuItems
                                .flatMap((item) => item.subItems)
                                .map((subItem) => (
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
                                    {column.map((item) => (
                                        <Card key={item.id} item={item} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={footerStyles.footer}>
                        <div className={footerStyles.footerColumn}>
                            <b>NRU PROJECT 211.</b>
                            <br />
                            <br />
                            NRU(느루): it means &quot;not rushing everything at once but taking a longer, slower
                            approach.&quot; in Korean
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
                </div>
            </motion.div>
        </div>
    );
}
