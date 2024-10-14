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
    </div>
);

export default ProjectDescription;
