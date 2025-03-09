'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import NowPlaying from '@/components/NowPlaying';
import { projects } from '@/data/projects';
import writingLinks from '@/data/writings';
import { aboutContent } from '@/data/about';
import { contentItems } from '@/data/content';
import Overlay from '@/components/Overlay';
import ThreeDModel from '@/components/ThreeDModel';
import { interactivePoints } from '@/components/ThreeDModel';

export default function Home() {
  const [language, setLanguage] = useState('EN');
  const [openOverlays, setOpenOverlays] = useState<string[]>([]);
  const [isModelHovering, setIsModelHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [keyGuideText, setKeyGuideText] = useState('press alt'); // Default to non-Mac text
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 언어 설정 불러오기
  useEffect(() => {
    // 로컬 스토리지에서 언어 설정 불러오기
    const savedLanguage = localStorage.getItem('language');
    // Only use the saved language if it's 'EN', otherwise default to 'EN'
    if (savedLanguage === 'EN') {
      setLanguage(savedLanguage);
    } else {
      // Set to 'EN' and update localStorage
      setLanguage('EN');
      localStorage.setItem('language', 'EN');
    }
  }, []);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // OS detection for key guide
    if (typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
      setKeyGuideText('press ⌘');
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'EN' ? '한국어' : 'EN';
    setLanguage(newLanguage);
    // 로컬 스토리지에 언어 설정 저장
    localStorage.setItem('language', newLanguage);
  };

  const handlePointClick = (id: string) => {
    setOpenOverlays((prev) => {
      // If overlay is already open, move it to the end (top)
      if (prev.includes(id)) {
        const newOrder = prev.filter((item) => item !== id);
        return [...newOrder, id]; // Put the clicked overlay at the end (top)
      }
      // Otherwise, add it to the end (top)
      return [...prev, id];
    });
  };

  const closeOverlay = (id: string) => {
    setOpenOverlays((prev) => prev.filter((item) => item !== id));
  };

  const bringOverlayToFront = (id: string) => {
    setOpenOverlays((prev) => {
      // Move the overlay to the end of the array (rendered last = top)
      const newOrder = prev.filter((item) => item !== id);
      return [...newOrder, id];
    });
  };

  // Add cleanup effect for overlays
  useEffect(() => {
    return () => {
      setOpenOverlays([]);
    };
  }, []);

  const getOverlayTitle = (id: string) => {
    // Find the matching interactive point and return its title
    const point = interactivePoints.find((point) => point.id === id);
    return point ? point.title : id;
  };

  // 이미지 외부 클릭 시 상세 정보 닫기
  const handleOutsideClick = () => {
    setSelectedImage(null);
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.contentBox}>
        {/* Language selector at top right */}
        <div className={styles.languageSelectorTop} onClick={toggleLanguage}>
          <span className={language === '한국어' ? styles.activeLanguage : ''}>한국어</span>
          {' / '}
          <span className={language === 'EN' ? styles.activeLanguage : ''}>EN</span>
        </div>

        {/* 3D Model Container */}
        <div
          className={styles.modelContainer}
          ref={containerRef}
          onMouseEnter={() => setIsModelHovering(true)}
          onMouseLeave={() => setIsModelHovering(false)}
        >
          <ThreeDModel
            modelPath="/models/dog.glb"
            isHovering={isModelHovering}
            onPointClick={handlePointClick}
            isMobile={isMobile}
          />
        </div>

        {/* Spotify at bottom right */}
        <div className={styles.spotifyBottom}>
          <NowPlaying />
        </div>

        {/* Key guide at bottom left (모바일이 아닌 경우에만) */}
        {!isMobile && <div className={styles.keyGuide}>{keyGuideText}</div>}

        {/* Render overlays in order, with the last one on top */}
        {openOverlays.map((id) => (
          <Overlay
            key={id}
            id={id}
            title={getOverlayTitle(id)}
            isOpen={true}
            onClose={closeOverlay}
            isActive={id === openOverlays[openOverlays.length - 1]} // Last overlay is active
            onFocus={bringOverlayToFront}
          >
            {id === 'about' && (
              <div className={styles.aboutMeContent}>
                <h2 className={styles.aboutTitle}>
                  {language === 'EN' ? aboutContent.title.en : aboutContent.title.ko}
                </h2>
                <p className={styles.aboutDescription}>
                  {(language === 'EN' ? aboutContent.description.en : aboutContent.description.ko).map((item, index) =>
                    item.type === 'text' ? (
                      <span key={index}>{item.content}</span>
                    ) : (
                      <a
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.aboutLink}
                        style={{ textDecoration: 'underline', color: '#000000' }}
                      >
                        {item.content}
                      </a>
                    )
                  )}
                </p>
                <div className={styles.aboutLinks}>
                  {aboutContent.links.map((link) => (
                    <a
                      key={link.title}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.aboutLink}
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {id === 'logs' && (
              <div className={styles.mindLogsContent}>
                {writingLinks
                  .slice() // 원본 배열을 변경하지 않기 위해 복사
                  .filter((writing) => !(language === 'EN' && writing.hideInEnglish)) // Filter out entries with hideInEnglish when language is EN
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // 날짜 내림차순 정렬 (최신순)
                  .map((writing) => (
                    <div key={writing.id} className={styles.writingItem}>
                      <a
                        href={language === 'EN' ? writing.url.en : writing.url.ko}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.writingTitle}
                      >
                        {language === 'EN' ? writing.title.en : writing.title.ko}
                      </a>
                      <div className={styles.writingMeta}>
                        <span>{writing.category}</span>
                        <span>{writing.date}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {id === 'slides' && (
              <div className={styles.mindSlidesContent} onClick={handleOutsideClick}>
                <div className={styles.slidesGrid}>
                  {contentItems
                    .filter((item) => item.type === 'image')
                    .sort((a, b) => {
                      // 날짜 내림차순 정렬 (최신순)
                      const dateA = new Date(a.date);
                      const dateB = new Date(b.date);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className={styles.slideImageContainer}
                        onClick={(e) => {
                          e.stopPropagation(); // 이벤트 버블링 방지
                          setSelectedImage(selectedImage === item.id ? null : item.id);
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={language === 'EN' ? item.title.en : item.title.ko}
                          className={styles.slideImage}
                        />
                        {selectedImage === item.id && (
                          <div className={styles.imageDetails}>
                            <h3>{language === 'EN' ? item.title.en : item.title.ko}</h3>
                            <p>{language === 'EN' ? item.description.en : item.description.ko}</p>
                            <span>{item.date}</span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {id === 'prints' && (
              <div className={styles.mindPrintsContent}>
                <div className={styles.artifactsList}>
                  {projects.map((project) => (
                    <div key={project.id} className={styles.artifactItem}>
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.artifactTitle}
                      >
                        {project.title}
                      </a>
                      <div className={styles.artifactMeta}>
                        <span>{project.category}</span>
                        <span>{project.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {id === 'fuel' && (
              <div className={styles.brainFuelContent}>
                <div className={styles.comingSoonMessage}>{language === 'EN' ? 'Coming soon...' : '준비 중...'}</div>
              </div>
            )}
          </Overlay>
        ))}
      </div>
    </main>
  );
}
