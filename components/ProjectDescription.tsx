import React from "react";
import styles from "./ProjectDescription.module.css";
import { Project } from "../types/project";

interface ProjectDescriptionProps {
    project: Project;
    language: "en" | "ko";
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ project, language }) => {
    return (
        <div className={styles.projectDescription}>
            <div className={styles.projectDescriptionDetail}>
                <p>Year</p>
                <h2>{project.year}</h2>
            </div>
            <h2>{project.description[language]}</h2>
        </div>
    );
};

export default ProjectDescription;
