"use client";
import styles from "./page.module.css";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  url: string;
  description: string;
  type: "three.js" | "shader" | "webgl";
  year: string;
  preview?: string; // Optional preview image
}

const projects: Project[] = [
  {
    id: "grass-doeon",
    title: "Grass Field",
    url: "https://grass-doeon.vercel.app/",
    description:
      "Interactive grass field simulation using Three.js with realistic wind physics",
    type: "three.js",
    year: "2024",
    preview: "/previews/grass-field.svg",
  },
  {
    id: "daisy-teal",
    title: "Daisy",
    url: "https://daisy-teal.vercel.app/",
    description:
      "Organic forms and natural movements with procedural animations",
    type: "shader",
    year: "2024",
    preview: "/previews/placeholder.svg",
  },
  {
    id: "zen-friend",
    title: "Zen Friend",
    url: "https://zen-friend.vercel.app/",
    description: "Meditative interactive experience with ambient soundscapes",
    type: "webgl",
    year: "2024",
    preview: "/previews/placeholder.svg",
  },
  {
    id: "undistracted",
    title: "Undistracted",
    url: "https://undistracted.vercel.app/",
    description: "Focus-enhancing visual environment for productivity",
    type: "three.js",
    year: "2024",
    preview: "/previews/placeholder.svg",
  },
  {
    id: "verae",
    title: "Verae",
    url: "https://verae.vercel.app/",
    description: "Truth in digital form through geometric abstractions",
    type: "shader",
    year: "2024",
    preview: "/previews/placeholder.svg",
  },
];

export default function ComputerArt() {
  const handleProjectClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className={styles.container}>
      {/* Back Button */}
      <Link href="/" className={styles.backButton}>
        ← Back
      </Link>

      {/* Grid Container */}
      <div className={styles.gridContainer}>
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={styles.gridItem}
            onClick={() => handleProjectClick(project.url)}
          >
            {/* Interactive Thumbnail with Transform Scale */}
            <div className={styles.thumbnailContainer}>
              <iframe
                src={project.url}
                className={styles.thumbnail}
                title={project.title}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
