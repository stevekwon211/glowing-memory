"use client";

import { useState, useEffect } from "react";
import styles from "../page.module.css";
import { ArrowLeft, Languages, Lightbulb, LightbulbOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
            "저는 사람들이 마음과 영혼이 윤리적이고 철학적인 가치를 찾고자 하지만, 또 어떨 때에는 기쁨과 즐거움을 쫓는다고 믿습니다. 순간순간의 영감에 따라 우리는 그 모든 의미를 받아들이며, 저는 본질을 담고 있는 하나의 메시지를 따라 살아갑니다:",
            '"마음이 이끄는 대로 만들어보자!"',
            "저는 기쁨과 행복, 풍요로움을 누릴 수 있는 더 나은 세상을 위해 헌신하는 이타적인 삶을 살고자 합니다. 저의 미션은 사람들을 억누르는 제약을 없애고, 창의력을 발휘할 수 있도록 장벽을 허무는 것입니다. 모든 이들에게 자신감과 영감을 주어, 사람들이 원하는 것을 자유롭게 만들 수 있게 돕고 싶습니다.",
            "이를 위해 AI를 활용하며 제 상상을 현실로 구현하고, 다양한 프로젝트와 콘텐츠를 통해 그 과정과 결과를 공유하고 있습니다.",
            '제가 나누는 결과물을 통해 여러분도 "아! 나도 저렇게 내가 원하는 걸 만들 수 있겠구나"라고 느끼셨으면 좋겠습니다.',
            "연락처",
            "권도언",
            "disquiet / instagram",
        ],
    },
};

const AboutPage = () => {
    const [language, setLanguage] = useState<"en" | "ko">("en");
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode) {
            setIsDarkMode(JSON.parse(savedMode));
        } else {
            const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            setIsDarkMode(darkModeMediaQuery.matches);
        }
    }, []);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "ko" : "en"));
    };

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("darkMode", JSON.stringify(newMode));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`${styles.ahLanding} ${isDarkMode ? styles.darkMode : ""}`}
        >
            <div className={styles.ahParent}>
                <div className={styles.ah}>
                    <span>DE</span>
                    <span className={styles.span}>導彦</span>
                </div>
                <div className={styles.projectsParent}>{/* 메뉴 항목들을 여기에 추가할 수 있습니다 */}</div>
                <div className={styles.frameParent}>
                    <Link href="/" prefetch className={styles.frameWrapper}>
                        <ArrowLeft className={styles.anvilIcon} strokeWidth={1} />
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
            <div className={styles.aboutContent}>
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
                                <a href="https://disquiet.io/@kwondoeon" target="_blank" rel="noopener noreferrer">
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
        </motion.div>
    );
};

export default AboutPage;
