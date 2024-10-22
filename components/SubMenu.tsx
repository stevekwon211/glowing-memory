import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./SubMenu.module.css";

interface SubMenuItem {
    name: string;
    url: string;
}

interface SubMenuProps {
    items: SubMenuItem[];
    onSelect: (url: string) => void;
    onHover: (url: string) => void;
    onLeave: () => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ items, onSelect, onHover, onLeave }) => {
    return (
        <AnimatePresence>
            <motion.div
                className={styles.subMenu}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {items.map((item, index) => (
                    <motion.div
                        key={item.name}
                        className={styles.subMenuItem}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => {
                            onSelect(item.url);
                            if (item.url) {
                                window.open(item.url, "_blank");
                            }
                        }}
                        onMouseEnter={() => onHover(item.url)}
                        onMouseLeave={onLeave}
                    >
                        {item.name}
                    </motion.div>
                ))}
            </motion.div>
        </AnimatePresence>
    );
};

export default SubMenu;
