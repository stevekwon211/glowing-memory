"use client";

import { useState, useEffect, useRef } from "react";
import type { NextPage } from "next";
import styles from "./page.module.css";
import { LightbulbOff, Lightbulb, SquareArrowOutUpRight, Anvil } from "lucide-react";

interface Project {
    name: string;
    url: string;
    title: string;
    description: string;
    date: Date;
}

const projects: Project[] = [
    {
        name: "Undistracted",
        url: "https://do-you-feel-this.vercel.app/",
        title: "Undistracted",
        description: "An app to help you focus",
        date: new Date("2024-10-09"),
    },
    {
        name: "coming soon..",
        url: "",
        title: "coming soon..",
        description: "?!",
        date: new Date("2023-06-01"),
    },
];

const AHLanding: NextPage = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [iframeError, setIframeError] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        // Detect system color scheme
        const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(darkModeMediaQuery.matches);

        // Listen for changes in system color scheme
        const handleColorSchemeChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };
        darkModeMediaQuery.addEventListener("change", handleColorSchemeChange);

        // Sort projects by date (latest first) and select the first one
        const sortedProjects = [...projects].sort((a, b) => b.date.getTime() - a.date.getTime());
        setSelectedProject(sortedProjects[0]);

        // Cleanup listener on component unmount
        return () => {
            darkModeMediaQuery.removeEventListener("change", handleColorSchemeChange);
        };
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleIframeLoad = () => {
        setIframeError(false);
    };

    const handleIframeError = () => {
        setIframeError(true);
        console.error("Failed to load iframe");
    };

    return (
        <div className={`${styles.ahLanding} ${isDarkMode ? styles.darkMode : ""}`}>
            <div className={styles.ahParent}>
                <div className={styles.ah}>
                    <span>ah</span>
                    <span className={styles.span}>?</span>
                </div>
                <div className={styles.projectsParent}>
                    {projects.map((project) => (
                        <div
                            key={project.name}
                            className={`${styles.project} ${
                                selectedProject?.name === project.name ? styles.selectedProject : ""
                            }`}
                            onClick={() => setSelectedProject(project)}
                        >
                            {project.name}
                        </div>
                    ))}
                </div>
                <div className={styles.frameParent}>
                    <div className={styles.frameWrapper}>
                        <Anvil className={styles.anvilIcon} strokeWidth={1} />
                    </div>
                    <div className={styles.frameWrapper} onClick={toggleDarkMode}>
                        {isDarkMode ? (
                            <Lightbulb className={styles.lightBulbIcon} strokeWidth={1} />
                        ) : (
                            <LightbulbOff className={styles.lightBulbOffIcon} strokeWidth={1} />
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.projectDisplay}>
                {selectedProject &&
                    (iframeError ? (
                        <div className={styles.iframeError}>
                            <p>Failed to load project. Please try again later.</p>
                            <a href={selectedProject.url} target="_blank" rel="noopener noreferrer">
                                Open project in new tab
                            </a>
                        </div>
                    ) : (
                        <iframe
                            ref={iframeRef}
                            src={selectedProject.url}
                            title={selectedProject.name}
                            className={styles.projectIframe}
                            allowFullScreen
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                        />
                    ))}
            </div>
            <div className={styles.titleParent}>
                <div className={styles.description}>{selectedProject?.description || "description"}</div>
                <div className={styles.frame}>
                    <a href={selectedProject?.url} target="_blank" rel="noopener noreferrer">
                        <SquareArrowOutUpRight className={styles.playIcon} strokeWidth={1} fill="none" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AHLanding;
