"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";
import { contentItems } from "../data/content";
import { writingLinks } from "../data/writings";
import { projects } from "../data/projects";
import Image from "next/image";
import { aboutContent } from "../data/about";

interface ContentItem {
    id: string;
    title: string;
    imageUrl?: string;
    date: string;
    description?: string | { en: string; ko: string };
    category?: string;
    url?: string;
    projectUrl?: string;
    videoUrl?: string;
}

interface Project {
    id: number;
    title: string;
    imageUrl?: string;
    year: string;
    description: { en: string; ko: string };
    category?: string;
    projectUrl?: string;
}

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
    const [_isMobile, _setIsMobile] = useState(false);
    const [showAbout, setShowAbout] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 492, y: -60 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const [lastTime, setLastTime] = useState(0);
    const animationRef = useRef<number>();
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = undefined;
        }
        setIsDragging(true);
        const newDragStart = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        setDragStart(newDragStart);
        setLastPosition(position);
        setLastTime(Date.now());
        setVelocity({ x: 0, y: 0 });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();

        const currentTime = Date.now();
        const timeElapsed = currentTime - lastTime;
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        if (timeElapsed > 0) {
            setVelocity({
                x: ((newX - lastPosition.x) / timeElapsed) * 15,
                y: ((newY - lastPosition.y) / timeElapsed) * 15,
            });
        }

        setPosition({ x: newX, y: newY });
        setLastPosition({ x: newX, y: newY });
        setLastTime(currentTime);
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            applyInertia();
        }
    };

    const applyInertia = () => {
        let currentVelocity = { ...velocity };
        let currentPosition = { ...position };

        const animate = () => {
            const friction = 0.95;
            currentVelocity = {
                x: currentVelocity.x * friction,
                y: currentVelocity.y * friction,
            };

            currentPosition = {
                x: currentPosition.x + currentVelocity.x,
                y: currentPosition.y + currentVelocity.y,
            };

            setPosition(currentPosition);

            if (Math.abs(currentVelocity.x) > 0.1 || Math.abs(currentVelocity.y) > 0.1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                animationRef.current = undefined;
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            handleMouseUp();
        };

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const currentTime = Date.now();
            const timeElapsed = currentTime - lastTime;
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            if (timeElapsed > 0) {
                setVelocity({
                    x: ((newX - lastPosition.x) / timeElapsed) * 15,
                    y: ((newY - lastPosition.y) / timeElapsed) * 15,
                });
            }

            setPosition({ x: newX, y: newY });
            setLastPosition({ x: newX, y: newY });
            setLastTime(currentTime);
        };

        window.addEventListener("mousemove", handleGlobalMouseMove);
        window.addEventListener("mouseup", handleGlobalMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleGlobalMouseMove);
            window.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [isDragging, dragStart, lastTime, lastPosition, handleMouseUp]);

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = undefined;
        }
        setIsDragging(true);
        const touch = e.touches[0];
        const newDragStart = {
            x: touch.clientX - position.x,
            y: touch.clientY - position.y,
        };
        setDragStart(newDragStart);
        setLastPosition(position);
        setLastTime(Date.now());
        setVelocity({ x: 0, y: 0 });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const touch = e.touches[0];

        const currentTime = Date.now();
        const timeElapsed = currentTime - lastTime;
        const newX = touch.clientX - dragStart.x;
        const newY = touch.clientY - dragStart.y;

        if (timeElapsed > 0) {
            setVelocity({
                x: ((newX - lastPosition.x) / timeElapsed) * 15,
                y: ((newY - lastPosition.y) / timeElapsed) * 15,
            });
        }

        setPosition({ x: newX, y: newY });
        setLastPosition({ x: newX, y: newY });
        setLastTime(currentTime);
    };

    const handleTouchEnd = () => {
        if (isDragging) {
            setIsDragging(false);
            applyInertia();
        }
    };

    const handleImageTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleImageTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.touches[0].clientX);
    };

    const handleImageTouchEnd = () => {
        if (!selectedCategory) return;

        const items = getCategoryItems();
        const currentIndex = items.findIndex((item) => item.id === selectedItem?.id);
        const minSwipeDistance = 50;

        if (touchStart - touchEnd > minSwipeDistance && currentIndex < items.length - 1) {
            // 왼쪽으로 스와이프 - 다음 아이템
            setSelectedItem(items[currentIndex + 1]);
        }

        if (touchEnd - touchStart > minSwipeDistance && currentIndex > 0) {
            // 오른쪽으로 스와이프 - 이전 아이템
            setSelectedItem(items[currentIndex - 1]);
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    // 선택된 카테고리의 아이템들을 가져오는 함수
    const getCategoryItems = useCallback((): ContentItem[] => {
        if (selectedCategory === "Taste") {
            return contentItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (selectedCategory === "Artifact") {
            return projects
                .map((project: Project) => ({
                    id: project.id.toString(),
                    title: project.title,
                    imageUrl: project.imageUrl,
                    date: project.year,
                    description: project.description,
                    category: project.category,
                    projectUrl: project.projectUrl,
                }))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (selectedCategory === "Writing") {
            return writingLinks
                .map((writing) => ({
                    id: writing.id,
                    title: writing.title,
                    date: writing.date,
                    category: writing.category[0],
                    url: writing.url,
                }))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return [];
    }, [selectedCategory]);

    useEffect(() => {
        const items = getCategoryItems();
        if (items.length > 0) {
            setSelectedItem(items[0]);
        } else {
            setSelectedItem(null);
        }
    }, [selectedCategory, getCategoryItems]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        setShowAbout(false);
    };

    const handleItemClick = (item: ContentItem) => {
        setSelectedItem(item);
    };

    const handleAboutClick = () => {
        setShowAbout(true);
        setSelectedCategory(null);
        setSelectedItem(null);
    };

    const renderCategories = () => {
        return (
            <div className={styles.categoriesFrame}>
                <div
                    className={`${styles.category} ${selectedCategory === "Taste" ? styles.active : ""}`}
                    onClick={() => handleCategoryClick("Taste")}
                >
                    taste
                </div>
                <div
                    className={`${styles.category} ${selectedCategory === "Writing" ? styles.active : ""}`}
                    onClick={() => handleCategoryClick("Writing")}
                >
                    writing
                </div>
                <div
                    className={`${styles.category} ${selectedCategory === "Artifact" ? styles.active : ""}`}
                    onClick={() => handleCategoryClick("Artifact")}
                >
                    artifact
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={`${styles.mediaSection} ${selectedCategory === "Writing" ? styles.writing : ""}`}>
                    {showAbout ? (
                        <div className={styles.aboutContent}>
                            <div className={styles.aboutImageContainer}>
                                <Image
                                    src="/image/me.jpeg"
                                    alt="Profile"
                                    width={0}
                                    height={400}
                                    className={styles.aboutImage}
                                    priority
                                    quality={100}
                                    unoptimized
                                />
                                <div
                                    className={styles.overlayImageWrapper}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    style={{
                                        transform: `translate(${position.x}px, ${position.y}px)`,
                                        cursor: isDragging ? "grabbing" : "grab",
                                    }}
                                >
                                    <Image
                                        src="/image/babo-totti.jpeg"
                                        alt="Overlay"
                                        width={0}
                                        height={200}
                                        className={styles.overlayImage}
                                        priority
                                        quality={100}
                                        unoptimized
                                    />
                                </div>
                            </div>
                            <div className={styles.aboutTextContent}>
                                <div className={styles.aboutTitle}>{aboutContent.title}</div>
                                <div className={styles.aboutDescription}>{aboutContent.description.ko}</div>
                                <div className={styles.aboutLinks}>
                                    {aboutContent.links.map((link) => (
                                        <a
                                            key={link.title}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.aboutLink}
                                        >
                                            {link.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : selectedCategory === "Writing" ? (
                        <div className={styles.writingList}>
                            {getCategoryItems().map((item) => (
                                <div key={item.id} className={styles.writingItem}>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.writingTitle}
                                    >
                                        {item.title}
                                    </a>
                                    <div className={styles.writingInfo}>
                                        <span>{item.category}</span>
                                        <span className={styles.writingDate}>{item.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div
                                className={styles.mediaFrame}
                                onTouchStart={handleImageTouchStart}
                                onTouchMove={handleImageTouchMove}
                                onTouchEnd={handleImageTouchEnd}
                            >
                                {selectedItem?.imageUrl && (
                                    <Image
                                        src={selectedItem.imageUrl}
                                        alt={selectedItem.title}
                                        width={0}
                                        height={0}
                                        sizes="100vh"
                                        style={{
                                            maxWidth: "100%",
                                            width: "auto",
                                            objectFit: "contain",
                                        }}
                                        priority
                                        loading="eager"
                                        quality={75}
                                    />
                                )}
                                {!selectedItem?.imageUrl && selectedItem?.videoUrl && (
                                    <video
                                        src={selectedItem.videoUrl}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        width={0}
                                        height={0}
                                        style={{
                                            maxWidth: "100%",
                                            height: "100%",
                                            width: "auto",
                                            objectFit: "contain",
                                        }}
                                    />
                                )}
                            </div>
                            {(selectedCategory === "Taste" || selectedCategory === "Artifact") && (
                                <div className={styles.sidebar}>
                                    {getCategoryItems().map((item) => (
                                        <div
                                            key={item.id}
                                            className={`${styles.thumbnail} ${
                                                selectedItem?.id === item.id ? styles.active : ""
                                            }`}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            {item.imageUrl && (
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    width={80}
                                                    height={80}
                                                    loading="eager"
                                                    quality={50}
                                                />
                                            )}
                                            {!item.imageUrl && item.videoUrl && (
                                                <video
                                                    src={item.videoUrl}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
                {selectedCategory !== "Writing" && !showAbout && (
                    <div className={styles.descriptionFrame}>
                        {selectedItem && (
                            <>
                                <div className={styles.descriptionHeader}>
                                    <div className={styles.itemTitle}>{selectedItem.title}</div>
                                    <div className={styles.itemCategory}>{selectedItem.category}</div>
                                    <div className={styles.itemDate}>{selectedItem.date}</div>
                                    {((selectedCategory === "Taste" && selectedItem.url) ||
                                        (selectedCategory === "Artifact" && selectedItem.projectUrl)) && (
                                        <a
                                            href={
                                                selectedCategory === "Artifact"
                                                    ? selectedItem.projectUrl
                                                    : selectedItem.url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.itemLink}
                                        >
                                            link
                                        </a>
                                    )}
                                </div>
                                <div className={styles.itemDescription}>
                                    {typeof selectedItem.description === "string"
                                        ? selectedItem.description
                                        : selectedItem.description?.ko}
                                </div>
                            </>
                        )}
                    </div>
                )}
                <div className={styles.centerSection}>
                    <div className={styles.menuRow}>
                        {renderCategories()}
                        <div className={styles.infoFrame}>
                            <div
                                className={`${styles.info} ${showAbout ? styles.active : ""}`}
                                onClick={handleAboutClick}
                            >
                                about me
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
