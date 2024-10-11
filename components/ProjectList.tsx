import styles from "../app/page.module.css";
import { Project } from "../types";

interface ProjectListProps {
    projects: Project[];
    selectedProjectIndex: number;
    setSelectedProjectIndex: (index: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, selectedProjectIndex, setSelectedProjectIndex }) => (
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
);

export default ProjectList;
