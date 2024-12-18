"use client";
import Scene from "@/components/Scene";
import styles from "./page.module.css";
import writingLinks from "@/data/writings";
import { projects } from "@/data/projects";
import { useState } from "react";
import NowPlaying from "@/components/NowPlaying";

export default function Home() {
    const [showWritings, setShowWritings] = useState(false);
    const [showArtifacts, setShowArtifacts] = useState(false);

    const handleWritingsClick = () => {
        setShowWritings(!showWritings);
        setShowArtifacts(false);
    };

    const handleArtifactsClick = () => {
        setShowArtifacts(!showArtifacts);
        setShowWritings(false);
    };

    return (
        <main style={{ width: "100vw", height: "100vh" }}>
            <header className={styles.header}>
                <div className={styles.topSection}>
                    <div className={styles.leftMenu}>
                        <div className={styles.menuItems}>
                            <div className={styles.menuItem} onClick={handleWritingsClick}>
                                writings
                            </div>
                            <div className={styles.menuItem} onClick={handleArtifactsClick}>
                                artifacts
                            </div>
                        </div>
                    </div>
                    {showWritings && (
                        <div className={styles.dropdownContainer}>
                            {writingLinks
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((writing) => (
                                    <div key={writing.id} className={styles.writingItem}>
                                        <a
                                            href={writing.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.writingTitle}
                                        >
                                            {writing.title}
                                        </a>
                                        <div className={styles.writingMeta}>
                                            <span>{writing.category.join(", ")}</span>
                                            <span>{writing.date}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                    {showArtifacts && (
                        <div className={styles.dropdownContainer}>
                            {projects.map((project) => (
                                <div key={project.id} className={styles.writingItem}>
                                    <a
                                        href={project.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.writingTitle}
                                    >
                                        {project.title}
                                    </a>
                                    <div className={styles.writingMeta}>
                                        <span>{project.category}</span>
                                        <span>{project.year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.bottomSection}>
                    <div className={styles.tagline}>
                        create simple and aesthetic products that bring meaning and inspiration to people&apos;s lives
                    </div>
                    <div className={styles.rightContent}>
                        <div className={styles.name}>
                            <a
                                href="https://www.instagram.com/kwondoeon/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.nameLink}
                            >
                                kwondoeon
                            </a>
                        </div>
                        <NowPlaying />
                    </div>
                </div>
            </header>
            <Scene />
        </main>
    );
}
