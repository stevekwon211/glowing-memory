"use client";

import styles from "../page.module.css";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const translations = {
    about: "about",
    contact: "contact",
    modalContent: [
        "I believe that our hearts and souls sometimes seek ethical and philosophical values, while at other times, they chase joy and fun. As each moment inspires us, we embrace all these meanings, living by one guiding principle that reflects my essence:",
        '"For our souls! Let\'s create as our hearts guide us."',
        "I strive to live joyfully, with happiness and abundance, while leading an altruistic life devoted to the soul. My mission is to remove the constraints that hold people back, breaking down barriers to unleash their creativity. I exist to give everyone the confidence and inspiration to create freely, whatever their heart desires.",
        "By collaborating with AI, I bring my imagination to life, sharing my creations and the process behind them through various projects and content.",
        'I hope that through the work I share, you\'ll feel inspired and think, "Ah! I can create what I want like that, too."',
        "contact",
        "Doeon Kwon",
        "disquiet / instagram",
    ],
};

const AboutPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.ahLanding}
        >
            <div className={styles.ahParent}>
                <div className={styles.ah}>
                    <span>o</span>
                    <span className={styles.span}>.</span>
                </div>
                <div className={styles.projectsParent}>{/* Menu items can be added here */}</div>
                <div className={styles.frameParent}>
                    <Link href="/" prefetch className={styles.frameWrapper}>
                        <ArrowLeft className={styles.anvilIcon} strokeWidth={1} />
                    </Link>
                </div>
            </div>
            <div className={styles.aboutContent}>
                <h2>{translations.about}</h2>
                {translations.modalContent.map((paragraph, index) => {
                    if (index === translations.modalContent.length - 3) {
                        return <h3 key={index}>{paragraph}</h3>;
                    }
                    if (index === translations.modalContent.length - 2) {
                        return (
                            <p key={index} className={styles.contactInfo}>
                                {paragraph}
                            </p>
                        );
                    }
                    if (index === translations.modalContent.length - 1) {
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
