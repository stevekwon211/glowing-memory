import { NextResponse } from 'next/server';
import { fetchWritingsFromRSS, mergeWritingsData } from '@/utils/rssParser';
import { writingLinks } from '@/data/writings';
import fs from 'fs';
import path from 'path';

// 글 데이터를 파일에 저장하는 함수
const saveWritingsToFile = async (writings: any[]) => {
  try {
    // 데이터 포맷팅
    const fileContent = `import { WritingItem } from '../types/writing';

export interface WritingLink {
  id: string;
  title: {
    en: string;
    ko: string;
  };
  url: {
    en: string;
    ko: string;
  };
  date: string;
  category: string[];
  hideInEnglish?: boolean;
}

// 원본 데이터 배열
const originalData = ${JSON.stringify(writings, null, 2)};

// date 기준으로 오름차순 정렬하고 id를 재할당
export const writingLinks: WritingLink[] = [...originalData]
  .sort((a, b) => {
    // date 문자열을 Date 객체로 변환하여 비교 (YYYY-MM-DD 형식)
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime(); // 오름차순 정렬 (과거 → 현재)
  })
  .map((writing, index) => ({
    ...writing,
    id: (index + 1).toString() // id를 1부터 순차적으로 재할당
  }));

export default writingLinks;
`;

    // 파일 경로
    const filePath = path.join(process.cwd(), 'data', 'writings.ts');

    // 파일 쓰기
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return true;
  } catch (error) {
    console.error('파일 저장 중 오류 발생:', error);
    return false;
  }
};

export async function GET() {
  try {
    console.log('GET 요청 처리 시작');

    // RSS 피드에서 글 가져오기
    console.log('RSS 피드에서 글 가져오기 시작');
    const rssWritings = await fetchWritingsFromRSS();
    console.log(`RSS 피드에서 ${rssWritings.length}개 글 가져옴`);

    if (rssWritings.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'RSS 피드에서 글을 가져오지 못했습니다.'
      });
    }

    // 기존 데이터와 병합
    console.log('기존 데이터와 병합 시작');
    const mergedWritings = mergeWritingsData(writingLinks, rssWritings);
    console.log(`병합 결과: 총 ${mergedWritings.length}개 글, 새 글 ${mergedWritings.length - writingLinks.length}개`);

    // 파일에 저장
    console.log('파일 저장 시작');
    const saved = await saveWritingsToFile(mergedWritings);
    console.log(`파일 저장 결과: ${saved ? '성공' : '실패'}`);

    if (!saved) {
      return NextResponse.json({
        success: false,
        message: '파일 저장 중 오류가 발생했습니다.'
      });
    }

    return NextResponse.json({
      success: true,
      message: '글 데이터가 성공적으로 동기화되었습니다.',
      count: {
        total: mergedWritings.length,
        new: mergedWritings.length - writingLinks.length
      }
    });
  } catch (error) {
    console.error('동기화 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        message: '동기화 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

// 보안을 위해 POST 요청에 인증 추가
export async function POST(request: Request) {
  try {
    const { authorization } = Object.fromEntries(request.headers);

    // 간단한 인증 체크 (실제 환경에서는 더 강력한 인증 필요)
    if (!authorization || authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
      return NextResponse.json(
        {
          success: false,
          message: '인증에 실패했습니다.'
        },
        { status: 401 }
      );
    }

    // RSS 피드에서 글 가져오기
    const rssWritings = await fetchWritingsFromRSS();

    if (rssWritings.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'RSS 피드에서 글을 가져오지 못했습니다.'
      });
    }

    // 기존 데이터와 병합
    const mergedWritings = mergeWritingsData(writingLinks, rssWritings);

    // 파일에 저장
    const saved = await saveWritingsToFile(mergedWritings);

    if (!saved) {
      return NextResponse.json({
        success: false,
        message: '파일 저장 중 오류가 발생했습니다.'
      });
    }

    return NextResponse.json({
      success: true,
      message: '글 데이터가 성공적으로 동기화되었습니다.',
      count: {
        total: mergedWritings.length,
        new: mergedWritings.length - writingLinks.length
      }
    });
  } catch (error) {
    console.error('동기화 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        message: '동기화 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}
