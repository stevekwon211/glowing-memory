'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import NowPlaying from '@/components/NowPlaying';
import { projects } from '@/data/projects';
import writingLinks from '@/data/writings';
import { aboutContent } from '@/data/about';
import { GridContainer } from '@/components/GridLayout';
import Overlay from '@/components/Overlay';

export default function Home() {
  const [activeTab, setActiveTab] = useState('😌');
  const [language, setLanguage] = useState('EN');
  const [openOverlays, setOpenOverlays] = useState<string[]>([]);

  const tabs = ['😌', '💜'];

  const gridItems = [
    { id: 'logs', title: 'mind logs', modelPath: '/models/dog.usdz' },
    { id: 'slides', title: 'mind slides', modelPath: '/models/dog.usdz' },
    { id: 'prints', title: 'mind prints', modelPath: '/models/dog.usdz' },
    { id: 'fuel', title: 'brain fuel', modelPath: '/models/dog.usdz' }
  ];

  // Load language setting from localStorage
  useEffect(() => {
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

  const toggleLanguage = () => {
    const newLanguage = language === 'EN' ? '한국어' : 'EN';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleGridClick = (id: string) => {
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
    const item = gridItems.find((item) => item.id === id);
    return item ? item.title : '';
  };

  // Sort overlays to render from back to front
  // This uses DOM rendering order instead of z-index

  return (
    <main className={styles.mainContainer}>
      <div className={styles.contentBox}>
        <div className={styles.tabsContainer}>
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === '😌' && (
            <div className={styles.aboutMeContent}>
              <h2 className={styles.aboutTitle}>{language === 'EN' ? aboutContent.title.en : aboutContent.title.ko}</h2>
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

          {activeTab === '💜' && <GridContainer items={gridItems} onItemClick={handleGridClick} />}
        </div>

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
            {id === 'logs' && (
              <div className={styles.mindLogsContent}>
                {writingLinks.map((writing) => (
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
                      <span>{writing.category.join(', ')}</span>
                      <span>{writing.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {id === 'slides' && (
              <div className={styles.mindSlidesContent}>
                <div className={styles.slidesGrid}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className={styles.slideImageContainer}>
                      <img src={`/image/img-3${num + 3}.jpeg`} alt="Slide" className={styles.slideImage} />
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

        <div className={styles.footer}>
          <div className={styles.languageSelector} onClick={toggleLanguage}>
            <span className={language === '한국어' ? styles.activeLanguage : ''}>한국어</span>
            {' / '}
            <span className={language === 'EN' ? styles.activeLanguage : ''}>EN</span>
          </div>
          <NowPlaying />
        </div>
      </div>
    </main>
  );
}
