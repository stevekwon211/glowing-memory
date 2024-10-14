import React from "react";
import styles from "../app/page.module.css";
import { Project } from "../types";

interface ProjectDescriptionProps {
    project: Project;
    language: "en" | "ko";
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ project, language }) => {
    return (
        <div className={styles.titleParent}>
            <p className={styles.description}>{project.description[language]}</p>
        </div>
    );
};

export default ProjectDescription;
