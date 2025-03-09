'use client';
import { useEffect, useState, useRef } from 'react';
import styles from './Overlay.module.css';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface OverlayProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: (id: string) => void;
  children: React.ReactNode;
  initialPosition?: Position;
  isActive: boolean;
  onFocus: (id: string) => void;
}

// 리사이즈 방향 타입 정의
type ResizeDirection = '' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export default function Overlay({
  id,
  title,
  isOpen,
  onClose,
  children,
  initialPosition,
  isActive,
  onFocus
}: OverlayProps) {
  // Generate random position when overlay opens
  const getRandomPosition = () => {
    // Get window dimensions
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    // For mobile devices, use fixed position
    if (windowWidth <= 768) {
      return { x: 0, y: 0 };
    }

    // For desktop, calculate random position
    // Limit the random area to avoid positioning offscreen
    const maxX = Math.max(windowWidth - 300, 0);
    const maxY = Math.max(windowHeight - 300, 0);

    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY)
    };
  };

  // 기본 크기 설정 함수
  const getDefaultSize = (): Size => {
    // 모바일인 경우 전체 화면
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }

    // ID에 따라 다른 기본 크기 설정
    switch (id) {
      case 'logs':
        return { width: 750, height: 300 };
      case 'slides':
        return { width: 900, height: 300 };
      case 'about':
        return { width: 500, height: 750 };
      case 'prints':
        return { width: 333, height: 300 };
      default:
        return { width: 500, height: 300 }; // 기본 크기
    }
  };

  const [position, setPosition] = useState<Position>(initialPosition || getRandomPosition());
  const [size, setSize] = useState<Size>(getDefaultSize());
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>('');
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // If window size changes to mobile, reset position to 0,0 and size to full screen
      if (mobile) {
        setPosition({ x: 0, y: 0 });
        setSize({ width: window.innerWidth, height: window.innerHeight });
      } else if (position.x === 0 && position.y === 0) {
        // If changing from mobile to desktop, set a new random position and default size
        setPosition(getRandomPosition());
        setSize(getDefaultSize());
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Focus this overlay when it mounts
  useEffect(() => {
    if (isOpen) {
      onFocus(id);
    }
  }, [id, isOpen, onFocus]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose(id);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose, id]);

  const handleClick = () => {
    // Bring to front when clicked
    onFocus(id);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Always bring to front
    onFocus(id);

    // 리사이즈 핸들에서 발생한 이벤트는 무시 (리사이즈 핸들은 별도 처리)
    if (
      (e.target as HTMLElement).closest(`.${styles.resizeHandle}`) ||
      (e.target as HTMLElement).closest(`.${styles.resizeHandleEdge}`)
    ) {
      return;
    }

    // Only start dragging from the header and if not mobile
    if (!isMobile && (e.target as HTMLElement).closest(`.${styles.overlayHeader}`)) {
      // 헤더의 테두리 영역인지 확인 (테두리는 8px 정도로 가정)
      const headerElement = (e.target as HTMLElement).closest(`.${styles.overlayHeader}`);
      const rect = headerElement?.getBoundingClientRect();

      if (rect) {
        const isTopEdge = e.clientY - rect.top < 8;

        // 헤더의 상단 테두리를 클릭한 경우 드래그 시작하지 않음
        if (isTopEdge) {
          return;
        }
      }

      setIsDragging(true);

      const overlayRect = overlayRef.current?.getBoundingClientRect();
      if (overlayRect) {
        setDragOffset({
          x: e.clientX - overlayRect.left,
          y: e.clientY - overlayRect.top
        });
      }

      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMobile) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (isResizing && !isMobile) {
      e.preventDefault();

      const rect = overlayRef.current?.getBoundingClientRect();
      if (!rect) return;

      let newWidth = size.width;
      let newHeight = size.height;
      let newX = position.x;
      let newY = position.y;

      // 리사이즈 방향에 따라 크기 조정 (최소 크기 제한 적용)
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(200, e.clientX - position.x);
      }
      if (resizeDirection.includes('w')) {
        const deltaX = position.x - e.clientX;
        newWidth = Math.max(200, size.width + deltaX);
        newX = e.clientX;
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(150, e.clientY - position.y);
      }
      if (resizeDirection.includes('n')) {
        const deltaY = position.y - e.clientY;
        newHeight = Math.max(150, size.height + deltaY);
        newY = e.clientY;
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // 리사이즈 시작 핸들러
  const startResize = (direction: ResizeDirection) => (e: React.MouseEvent) => {
    if (!isMobile) {
      e.preventDefault();
      e.stopPropagation(); // 이벤트 버블링 방지
      setIsResizing(true);
      setResizeDirection(direction);
      onFocus(id);
    }
  };

  // 마우스 커서 스타일 결정
  const getCursorStyle = (direction: ResizeDirection): string => {
    switch (direction) {
      case 'n':
      case 's':
        return 'ns-resize';
      case 'e':
      case 'w':
        return 'ew-resize';
      case 'ne':
      case 'sw':
        return 'nesw-resize';
      case 'nw':
      case 'se':
        return 'nwse-resize';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDirection]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} style={{ zIndex: isActive ? 1001 : 1000 }}>
      <div
        ref={overlayRef}
        className={`${styles.overlayContent} ${isActive ? styles.activeOverlay : ''} ${
          isMobile ? styles.mobileOverlay : ''
        }`}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          cursor: isDragging ? 'grabbing' : 'default',
          backgroundColor: 'rgba(25, 25, 25, 0.5)',
          opacity: 1
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div className={styles.overlayHeader} style={{ backgroundColor: 'rgba(25, 25, 25, 0.8)', opacity: 1 }}>
          <div className={styles.overlayTitle}>{title}</div>
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
          >
            ×
          </button>
        </div>
        <div className={styles.overlayBody} style={{ backgroundColor: 'rgba(25, 25, 25, 0.5)', opacity: 1 }}>
          {children}
        </div>

        {/* 리사이즈 핸들 - 모바일이 아닐 때만 표시 */}
        {!isMobile && (
          <>
            {/* 모서리 핸들 */}
            <div
              className={styles.resizeHandle}
              style={{ top: 0, left: 0, cursor: getCursorStyle('nw') }}
              onMouseDown={startResize('nw')}
            />
            <div
              className={styles.resizeHandle}
              style={{ top: 0, right: 0, cursor: getCursorStyle('ne') }}
              onMouseDown={startResize('ne')}
            />
            <div
              className={styles.resizeHandle}
              style={{ bottom: 0, left: 0, cursor: getCursorStyle('sw') }}
              onMouseDown={startResize('sw')}
            />
            <div
              className={styles.resizeHandle}
              style={{ bottom: 0, right: 0, cursor: getCursorStyle('se') }}
              onMouseDown={startResize('se')}
            />

            {/* 가장자리 핸들 */}
            <div
              className={styles.resizeHandleEdge}
              style={{ top: 0, left: '8px', right: '8px', cursor: getCursorStyle('n') }}
              onMouseDown={startResize('n')}
            />
            <div
              className={styles.resizeHandleEdge}
              style={{ bottom: 0, left: '8px', right: '8px', cursor: getCursorStyle('s') }}
              onMouseDown={startResize('s')}
            />
            <div
              className={styles.resizeHandleEdge}
              style={{ left: 0, top: '8px', bottom: '8px', cursor: getCursorStyle('w') }}
              onMouseDown={startResize('w')}
            />
            <div
              className={styles.resizeHandleEdge}
              style={{ right: 0, top: '8px', bottom: '8px', cursor: getCursorStyle('e') }}
              onMouseDown={startResize('e')}
            />
          </>
        )}
      </div>
    </div>
  );
}
