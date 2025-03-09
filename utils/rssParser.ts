import Parser from 'rss-parser';
import { WritingLink } from '../data/writings';

// RSS 파서 인스턴스 생성
const parser = new Parser();

// 한국어 RSS 피드 URL
const koRssFeedUrl = 'https://kwondoeon.substack.com/feed';
// 영어 RSS 피드 URL
const enRssFeedUrl = 'https://doeon.substack.com/feed';

// 카테고리 매핑 함수 (태그 기반으로 카테고리 결정)
const getCategoryFromTags = (tags: string[] | undefined): string[] => {
  if (!tags || tags.length === 0) return ['essay'];

  const categoryMap: { [key: string]: string } = {
    reflection: 'reflection',
    inspired: 'inspired',
    essay: 'essay',
    travel: 'travel',
    translation: 'translation'
  };

  const categories = tags.map((tag) => categoryMap[tag.toLowerCase()] || null).filter((category) => category !== null);

  return categories.length > 0 ? categories : ['essay'];
};

// RSS 피드에서 글 가져오기
export const fetchWritingsFromRSS = async (): Promise<WritingLink[]> => {
  try {
    // 한국어 피드 가져오기
    const koFeed = await parser.parseURL(koRssFeedUrl);
    // 영어 피드 가져오기
    const enFeed = await parser.parseURL(enRssFeedUrl);

    // 한국어 글 매핑
    const koWritings = koFeed.items.map((item) => {
      const id = item.guid || '';
      const title = item.title || '';
      const url = item.link || '';
      const date = item.isoDate ? new Date(item.isoDate).toISOString().split('T')[0] : '';
      const category = getCategoryFromTags(item.categories);

      return {
        id,
        title: {
          en: title, // 임시로 동일하게 설정
          ko: title
        },
        url: {
          en: url, // 임시로 동일하게 설정
          ko: url
        },
        date,
        category
      };
    });

    // 영어 글 매핑 및 한국어 글과 매칭
    const writings: WritingLink[] = enFeed.items.map((enItem) => {
      const id = enItem.guid || '';
      const title = enItem.title || '';
      const url = enItem.link || '';
      const date = enItem.isoDate ? new Date(enItem.isoDate).toISOString().split('T')[0] : '';
      const category = getCategoryFromTags(enItem.categories);

      // 한국어 버전 찾기 (제목이나 날짜로 매칭)
      const koVersion = koWritings.find((koItem) => {
        // 날짜가 같고 제목이 비슷한 경우 매칭
        const sameDate = koItem.date === date;
        const titleSimilarity = koItem.title.ko.includes(title) || title.includes(koItem.title.ko);
        return sameDate && titleSimilarity;
      });

      return {
        id,
        title: {
          en: title,
          ko: koVersion?.title.ko || title
        },
        url: {
          en: url,
          ko: koVersion?.url.ko || url
        },
        date,
        category
      };
    });

    // 영어 버전이 없는 한국어 글 추가
    koWritings.forEach((koItem) => {
      const exists = writings.some(
        (item) => item.date === koItem.date && (item.title.ko === koItem.title.ko || item.url.ko === koItem.url.ko)
      );

      if (!exists) {
        writings.push({
          ...koItem,
          title: {
            en: koItem.title.ko,
            ko: koItem.title.ko
          },
          url: {
            en: koItem.url.ko,
            ko: koItem.url.ko
          },
          hideInEnglish: true // 영어 버전이 없는 글은 영어 모드에서 숨김
        });
      }
    });

    return writings;
  } catch (error) {
    console.error('RSS 피드를 가져오는 중 오류 발생:', error);
    return [];
  }
};

// 기존 데이터와 RSS 데이터를 병합
export const mergeWritingsData = (existingWritings: WritingLink[], rssWritings: WritingLink[]): WritingLink[] => {
  const merged: WritingLink[] = [...existingWritings];

  rssWritings.forEach((rssItem) => {
    // 이미 존재하는지 확인 (URL로 비교)
    const exists = merged.some((item) => item.url.en === rssItem.url.en || item.url.ko === rssItem.url.ko);

    if (!exists) {
      // 새 ID 할당 (기존 ID 중 가장 큰 값 + 1)
      const maxId = Math.max(...merged.map((item) => parseInt(item.id)));
      const newId = (maxId + 1).toString();

      merged.push({
        ...rssItem,
        id: newId
      });
    }
  });

  return merged;
};
