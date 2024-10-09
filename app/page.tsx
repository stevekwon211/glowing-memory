"use client";

import { useState, useEffect, useRef } from "react";
import type { NextPage } from "next";
import styles from "./page.module.css";
import {
    LightbulbOff,
    Lightbulb,
    SquareArrowOutUpRight,
    Anvil,
    ArrowLeft,
    ArrowRight,
    X,
    Languages,
} from "lucide-react";

interface Project {
    name: string;
    url: string;
    title: string;
    description: {
        en: string;
        ko: string;
    };
    date: Date;
}

const projects: Project[] = [
    {
        name: "Undistracted (WIP)",
        url: "https://do-you-feel-this.vercel.app/",
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
            en: "Space exploration. JKL; controls the camera, WASD are direction keys, click on red (planets) on the map for auto-navigation.",
            ko: "space 탐험. JKL;은 카메라 조종, WASD는 방향키, 지도의 빨간색(행성)을 클릭하면 자동 항해.",
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

const translations = {
    about: {
        en: "about",
        ko: "소개",
    },
    contact: {
        en: "contact",
        ko: "연락처",
    },
    modalContent: {
        en: [
            "I believe that our hearts and souls sometimes seek ethical and philosophical values, while at other times, they chase joy and fun. As each moment inspires us, we embrace all these meanings, living by one guiding principle that reflects my essence:",
            '"For our souls! Let\'s create as our hearts guide us."',
            "I strive to live joyfully, with happiness and abundance, while leading an altruistic life devoted to the soul. My mission is to remove the constraints that hold people back, breaking down barriers to unleash their creativity. I exist to give everyone the confidence and inspiration to create freely, whatever their heart desires.",
            "By collaborating with AI, I bring my imagination to life, sharing my creations and the process behind them through various projects and content.",
            'I hope that through the work I share, you\'ll feel inspired and think, "Ah! I can create what I want like that, too."',
            "contact",
            "Doeon Kwon",
            "disquiet / instagram",
        ],
        ko: [
            "저는 우리의 마음과 영혼이 윤리적이고 철학적인 가치를 추구하지만, 또 어떨 때에는 기쁨과 즐거움을 쫓는다고 믿습니다. 순간순간의 영감에 따라 우리는 그 모든 의미를 받아들이며, 저는 본질을 담고 있는 하나의 메시지를 따라 살아갑니다:",
            '"우리 자신을 위해! 마음이 이끄는 대로 만들어보자."',
            "저는 기쁨과 행복, 풍요로움을 누릴 수 있는 더 나은 세상을 위해 헌신하는 이타적인 삶을 살고자 합니다. 저의 미션은 사람들을 억누르는 제약을 없애고, 창의력을 발휘할 수 있도록 장벽을 허무는 것입니다. 모든 이들에게 자신감과 영감을 주어, 사람들이 원하는 것을 자유롭게 창조할 수 있게 돕고 싶습니다.",
            "AI와의 협업을 통해 제 상상을 현실로 구현하고, 다양한 프로젝트와 콘텐츠를 통해 그 과정과 결과를 공유하고 있습니다.",
            '제가 나누는 결과물을 통해 여러분도 "아! 나도 저렇게 내가 원하는 걸 창조할 수 있겠구나"라고 느끼셨으면 좋겠습니다.',
            "연락처",
            "권도언",
            "disquiet / instagram",
        ],
    },
};

const AHLanding: NextPage = () => {
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [iframeError, setIframeError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [language, setLanguage] = useState<"en" | "ko">("en");

    useEffect(() => {
        // Detect system color scheme
        const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(darkModeMediaQuery.matches);

        // Listen for changes in system color scheme
        const handleColorSchemeChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };
        darkModeMediaQuery.addEventListener("change", handleColorSchemeChange);

        // Cleanup listener on component unmount
        return () => {
            darkModeMediaQuery.removeEventListener("change", handleColorSchemeChange);
        };
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleIframeLoad = () => {
        setIframeError(false);
    };

    const handleIframeError = () => {
        setIframeError(true);
        console.error("Failed to load iframe");
    };

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handlePrevProject = () => {
        setSelectedProjectIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : projects.length - 1));
    };

    const handleNextProject = () => {
        setSelectedProjectIndex((prevIndex) => (prevIndex < projects.length - 1 ? prevIndex + 1 : 0));
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "ko" : "en"));
    };

    return (
        <div className={`${styles.ahLanding} ${isDarkMode ? styles.darkMode : ""}`}>
            <div className={styles.ahParent}>
                <div className={styles.ah}>
                    <span>DE</span>
                    <span className={styles.span}>導彦</span>
                </div>
                <div className={styles.projectsParent}>
                    {projects.map((project, index) => (
                        <div
                            key={project.name}
                            className={`${styles.project} ${
                                selectedProjectIndex === index ? styles.selectedProject : ""
                            }`}
                            onClick={() => setSelectedProjectIndex(index)}
                        >
                            {project.name}
                        </div>
                    ))}
                </div>
                <div className={styles.frameParent}>
                    <div className={styles.frameWrapper} onClick={toggleModal}>
                        <Anvil className={styles.anvilIcon} strokeWidth={1} />
                    </div>
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
            <div className={styles.projectDisplay}>
                {projects[selectedProjectIndex].url ? (
                    <iframe
                        ref={iframeRef}
                        src={projects[selectedProjectIndex].url}
                        title={projects[selectedProjectIndex].name}
                        className={styles.projectIframe}
                        allowFullScreen
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                    />
                ) : (
                    <div className={styles.comingSoon}>N/A</div>
                )}
            </div>
            <div className={styles.titleParent}>
                <div className={styles.description}>
                    {projects[selectedProjectIndex]?.description[language] || "description"}
                </div>
                <div className={styles.iconGroup}>
                    <div className={styles.frame}>
                        <a href={projects[selectedProjectIndex]?.url} target="_blank" rel="noopener noreferrer">
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

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={toggleModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={toggleModal}>
                            <X strokeWidth={1} />
                        </button>
                        <h2>{translations.about[language]}</h2>
                        {translations.modalContent[language].map((paragraph, index) => {
                            if (index === translations.modalContent[language].length - 3) {
                                return <h3 key={index}>{paragraph}</h3>;
                            }
                            if (index === translations.modalContent[language].length - 2) {
                                return (
                                    <p key={index} className={styles.contactInfo}>
                                        {paragraph}
                                    </p>
                                );
                            }
                            if (index === translations.modalContent[language].length - 1) {
                                return (
                                    <p key={index} className={styles.contactInfo}>
                                        <a
                                            href="https://disquiet.io/@kwondoeon"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            disquiet
                                        </a>
                                        {" / "}
                                        <a
                                            href="https://www.instagram.com/kwondoeon/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            instagram
                                        </a>
                                    </p>
                                );
                            }
                            return <p key={index}>{paragraph}</p>;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AHLanding;
