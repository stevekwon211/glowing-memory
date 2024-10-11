import Link from "next/link";
import { Anvil, Lightbulb, LightbulbOff, Languages } from "lucide-react";
import styles from "../app/page.module.css";
import { Project } from "../types";

interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    toggleLanguage: () => void;
    projects: Project[];
    selectedProjectIndex: number;
    setSelectedProjectIndex: (index: number) => void;
}

const Header: React.FC<HeaderProps> = ({
    isDarkMode,
    toggleDarkMode,
    toggleLanguage,
    projects,
    selectedProjectIndex,
    setSelectedProjectIndex,
}) => (
    <div className={styles.ahParent}>
        <div className={styles.ah}>
            <span>DE</span>
            <span className={styles.span}>導彦</span>
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
            <div className={styles.frameWrapper} onClick={toggleDarkMode}>
                {isDarkMode ? (
                    <Lightbulb className={styles.lightBulbIcon} strokeWidth={1} />
                ) : (
                    <LightbulbOff className={styles.lightBulbOffIcon} strokeWidth={1} />
                )}
            </div>
            <div className={styles.frameWrapper} onClick={toggleLanguage}>
                <Languages className={styles.languagesIcon} strokeWidth={1} />
            </div>
        </div>
    </div>
);

export default Header;
