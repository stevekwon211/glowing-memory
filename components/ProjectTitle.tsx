import React, { useState, useEffect } from "react";
import styles from "./ProjectTitle.module.css";
import { Project } from "../types";

interface ProjectTitleProps {
    projects: Project[];
    selectedProjectIndex: number | null;
    setSelectedProjectIndex: (index: number | null) => void;
    onHover: (index: number) => void;
    onLeave: () => void;
}

const ProjectTitle: React.FC<ProjectTitleProps> = ({
    projects,
    selectedProjectIndex,
    setSelectedProjectIndex,
    onHover,
    onLeave,
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const handleClick = (index: number) => {
        setSelectedProjectIndex(index);
        if (projects[index].url) {
            window.open(projects[index].url, "_blank");
        }
    };

    return (
        <div className={styles.projectTitle}>
            {projects.map((project, index) => (
                <div
                    key={project.name}
                    className={`${styles.project} ${index === selectedProjectIndex ? styles.selectedProject : ""}`}
                    style={{ display: isMobile && index !== selectedProjectIndex ? "none" : "block" }}
                    onClick={() => handleClick(index)}
                    onMouseEnter={() => onHover(index)}
                    onMouseLeave={onLeave}
                >
                    {project.name}
                </div>
            ))}
        </div>
    );
};

export default ProjectTitle;
