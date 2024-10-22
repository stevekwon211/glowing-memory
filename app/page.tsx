"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { contentItems, ContentItem } from "@/data/content";
// import ProjectTitle from '@/components/ProjectTitle';
// import ProjectDescription from '@/components/ProjectDescription';
// import { Project } from '@/types/content';
import Link from "next/link";
import { useRouter } from "next/navigation";
// import Masonry from 'react-masonry-css';

// Remove or comment out unused functions like shimmer and toBase64

export default function Home() {
    const router = useRouter();
    // const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
    // const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);
    // const [language, setLanguage] = useState<'ko' | 'en'>('ko');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // const shuffledContentItems = [...contentItems].sort(() => Math.random() - 0.5);
    // const [visibleItems, setVisibleItems] = useState<ContentItem[]>(shuffledContentItems.slice(0, 10));

    // Remove or comment out unused functions like handleProjectHover and handleProjectLeave

    // Remove or comment out unused variables like breakpointColumnsObj

    if (!isMounted) {
        return null;
    }

    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <p>
                    Get started by editing&nbsp;
                    <code className={styles.code}>app/page.tsx</code>
                </p>
                <div>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        By{" "}
                        <Image
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            className={styles.vercelLogo}
                            width={100}
                            height={24}
                            priority
                        />
                    </a>
                </div>
            </div>

            <div className={styles.center}>
                <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
            </div>

            <div className={styles.grid}>
                {contentItems.map((item) => (
                    <Link key={item.id} href={`/project/${item.id}`} className={styles.card}>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
