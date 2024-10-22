import React, { useState, useEffect } from "react";
import styles from "./Menu.module.css";

interface MenuItem {
    name: string;
    subItems: { name: string; url: string }[];
}

interface MenuProps {
    items: MenuItem[];
    selectedItemIndex: number | null;
    setSelectedItemIndex: (index: number) => void;
    onHover: (index: number) => void;
    onLeave: () => void;
}

const Menu: React.FC<MenuProps> = ({ items, selectedItemIndex, setSelectedItemIndex, onHover, onLeave }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const handleClick = (index: number) => {
        setSelectedItemIndex(index);
        // 'taste' 메뉴 항목 클릭 시 별도의 처리가 필요 없음
        // 스크롤 동작은 app/page.tsx의 handleMenuClick 함수에서 처리됨
    };

    return (
        <div className={styles.menu}>
            {items.map((item, index) => (
                <div
                    key={item.name}
                    className={`${styles.menuItem} ${index === selectedItemIndex ? styles.selectedMenuItem : ""}`}
                    style={{ display: isMobile && index !== selectedItemIndex ? "none" : "block" }}
                    onClick={() => handleClick(index)}
                    onMouseEnter={() => onHover(index)}
                    onMouseLeave={onLeave}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
};

export default Menu;
