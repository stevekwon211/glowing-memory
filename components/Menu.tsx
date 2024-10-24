import React from "react";
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
    const handleClick = (index: number) => {
        setSelectedItemIndex(index);
    };

    return (
        <div className={styles.menu}>
            {items.map((item, index) => (
                <div
                    key={item.name}
                    className={`${styles.menuItem} ${index === selectedItemIndex ? styles.selectedMenuItem : ""}`}
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
