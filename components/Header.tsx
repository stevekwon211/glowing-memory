import React from "react";
import Link from "next/link";
import { Anvil, SquareArrowOutUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import styles from "../app/page.module.css";
import { Project } from "../types";

interface HeaderProps {
    projects: Project[];
    selectedProjectIndex: number;
    setSelectedProjectIndex: React.Dispatch<React.SetStateAction<number>>;
}

const Header: React.FC<HeaderProps> = ({ projects, selectedProjectIndex, setSelectedProjectIndex }) => {
    const handlePrevProject = () => {
        setSelectedProjectIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : projects.length - 1));
    };

    const handleNextProject = () => {
        setSelectedProjectIndex((prevIndex) => (prevIndex < projects.length - 1 ? prevIndex + 1 : 0));
    };

    const currentProject = projects[selectedProjectIndex];

    return (
        <div className={styles.ahParent}>
            <div className={styles.ah}>
                <span>odeon</span>
                <span className={styles.span}>.</span>
            </div>
            <div className={styles.projectsParent}>
                {projects.map((project, index) => (
                    <div
                        key={project.name}
                        className={`${styles.project} ${selectedProjectIndex === index ? styles.selectedProject : ""}`}
                        onClick={() => setSelectedProjectIndex(index)}
                    >
                        {project.name}
                    </div>
                ))}
            </div>
            <div className={styles.frameParent}>
                <Link href="/about" prefetch className={styles.frameWrapper}>
                    <Anvil className={styles.anvilIcon} strokeWidth={1} />
                </Link>
                <div className={styles.frameWrapper}>
                    <a href={currentProject.url} target="_blank" rel="noopener noreferrer">
                        <SquareArrowOutUpRight className={styles.playIcon} strokeWidth={1} fill="none" />
                    </a>
                </div>
                <div className={styles.frameWrapper} onClick={handlePrevProject}>
                    <ArrowLeft className={styles.playIcon} strokeWidth={1} />
                </div>
                <div className={styles.frameWrapper} onClick={handleNextProject}>
                    <ArrowRight className={styles.playIcon} strokeWidth={1} />
                </div>
            </div>
        </div>
    );
};

export default Header;
