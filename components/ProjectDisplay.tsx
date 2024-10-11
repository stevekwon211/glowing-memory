import { useRef } from "react";
import styles from "../app/page.module.css";
import { Project } from "../types";

interface ProjectDisplayProps {
    project: Project;
}

const ProjectDisplay: React.FC<ProjectDisplayProps> = ({ project }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    return (
        <div className={styles.projectDisplay}>
            {project.url ? (
                <iframe
                    ref={iframeRef}
                    src={project.url}
                    title={project.name}
                    className={styles.projectIframe}
                    allowFullScreen
                />
            ) : (
                <div className={styles.comingSoon}>N/A</div>
            )}
        </div>
    );
};

export default ProjectDisplay;
