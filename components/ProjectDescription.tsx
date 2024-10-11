import styles from "../app/page.module.css";
import { SquareArrowOutUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Project } from "../types";

interface ProjectDescriptionProps {
    project: Project;
    language: "en" | "ko";
    handlePrevProject: () => void;
    handleNextProject: () => void;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
    project,
    language,
    handlePrevProject,
    handleNextProject,
}) => (
    <div className={styles.titleParent}>
        <div className={styles.description}>{project.description[language] || "description"}</div>
        <div className={styles.iconGroup}>
            <div className={styles.frame}>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                    <SquareArrowOutUpRight className={styles.playIcon} strokeWidth={1} fill="none" />
                </a>
            </div>
            <div className={styles.frame} onClick={handlePrevProject}>
                <ArrowLeft className={styles.playIcon} strokeWidth={1} />
            </div>
            <div className={styles.frame} onClick={handleNextProject}>
                <ArrowRight className={styles.playIcon} strokeWidth={1} />
            </div>
        </div>
    </div>
);

export default ProjectDescription;
