"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import Header from "../components/Header";
import ProjectDisplay from "../components/ProjectDisplay";
import ProjectDescription from "../components/ProjectDescription";
import { Project } from "../types";

const projects: Project[] = [
    {
        name: "Undistracted (WIP)",
        url: "https://undistracted.vercel.app/",
        title: "Undistracted (WIP)",
        description: {
            en: "Various tools and tips to help you focus. The sparkles in the background represent distracting elements.",
            ko: "몰입을 도와주는 각종 도구와 팁들. 배경에 반짝거리는 건 집중을 해치는 요소를 표현한 것.",
        },
        date: new Date("2024-10-09"),
    },
    {
        name: "Verae (WIP)",
        url: "https://verae.vercel.app/",
        title: "Verae (WIP)",
        description: {
            en: "Space exploration. KL;' controls the camera, WASD are direction keys, click on red (planets) on the map for auto-navigation.",
            ko: "space 탐험. KL;'은 카메라 조종, WASD는 방향키, 지도의 빨간색(행성)을 클릭하면 자동 항해.",
        },
        date: new Date("2024-10-02"),
    },
    {
        name: "coming soon..",
        url: "",
        title: "coming soon..",
        description: {
            en: "?!",
            ko: "?!",
        },
        date: new Date("2023-06-01"),
    },
];

export default function Home() {
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
    const [language] = useState<"en" | "ko">("en");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.ahLanding}
        >
            <Header
                projects={projects}
                selectedProjectIndex={selectedProjectIndex}
                setSelectedProjectIndex={setSelectedProjectIndex}
            />
            <ProjectDisplay project={projects[selectedProjectIndex]} />
            <ProjectDescription project={projects[selectedProjectIndex]} language={language} />
        </motion.div>
    );
}
