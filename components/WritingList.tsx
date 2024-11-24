import { useState } from "react";
import styles from "./WritingList.module.css";

interface WritingLink {
    id: string;
    title: string;
    url: string;
    date: string;
    category: string[];
}

interface WritingListProps {
    items: WritingLink[];
}

export default function WritingList({ items }: WritingListProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredItems = selectedCategory ? items.filter((item) => item.category.includes(selectedCategory)) : items;

    const sortedItems = [...filteredItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const categories = Array.from(new Set(items.flatMap((item) => item.category)));

    return (
        <div className={styles.writingListContainer}>
            <div className={styles.categoryFilter}>
                <span
                    className={`${styles.categoryItem} ${!selectedCategory ? styles.active : ""}`}
                    onClick={() => setSelectedCategory(null)}
                >
                    all
                </span>
                {categories.map((category) => (
                    <span
                        key={category}
                        className={`${styles.categoryItem} ${selectedCategory === category ? styles.active : ""}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </span>
                ))}
            </div>
            <div className={styles.writingList}>
                {sortedItems.map((item) => (
                    <div key={item.id} className={styles.writingItem}>
                        <a href={item.url} className={styles.writingLink} target="_blank" rel="noopener noreferrer">
                            <span className={styles.writingDate}>
                                {new Date(item.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })}
                            </span>
                            <span className={styles.writingTitle}>{item.title}</span>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
