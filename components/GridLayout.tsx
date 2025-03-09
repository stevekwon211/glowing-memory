'use client';
import { useState } from 'react';
import styles from './GridLayout.module.css';
import ThreeDModel from './ThreeDModel';

interface GridItemProps {
  id: string;
  title: string;
  onClick: (id: string) => void;
}

export function GridItem({ id, title, onClick }: GridItemProps) {
  const [isHovering, setIsHovering] = useState(false);

  // Use the same dog.glb model for all grid items
  const modelPath = '/models/dog.glb';

  return (
    <div
      className={styles.gridItem}
      onClick={() => onClick(id)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={styles.gridItemContent}>
        <div className={styles.gridItemModel}>
          <ThreeDModel modelPath={modelPath} isHovering={isHovering} onPointClick={() => onClick(id)} />
        </div>
        <div className={styles.gridItemTitle}>{title}</div>
      </div>
    </div>
  );
}

interface GridContainerProps {
  items: Array<{ id: string; title: string }>;
  onItemClick: (id: string) => void;
}

export function GridContainer({ items, onItemClick }: GridContainerProps) {
  return (
    <div className={styles.gridContainer}>
      {items.map((item) => (
        <GridItem key={item.id} id={item.id} title={item.title} onClick={onItemClick} />
      ))}
    </div>
  );
}
