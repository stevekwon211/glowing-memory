#!/usr/bin/env node

/**
 * 블로그 글 자동 동기화 스크립트
 *
 * 이 스크립트는 Substack RSS 피드에서 새 글을 가져와 writings.ts 파일을 업데이트합니다.
 *
 * 사용법:
 * 1. npm run sync-writings
 * 2. 또는 cron job으로 설정하여 자동 실행
 */

const https = require('https');
const http = require('http');
const url = require('url');
const dotenv = require('dotenv');

// 환경 변수 로드
dotenv.config({ path: '.env.local' });

// 환경 변수 디버깅
console.log('환경 변수 로드 결과:');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('API_SECRET_KEY 설정 여부:', process.env.API_SECRET_KEY ? '설정됨' : '설정되지 않음');

// API 엔드포인트 URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_SECRET_KEY = process.env.API_SECRET_KEY;

if (!API_SECRET_KEY) {
  console.error('API_SECRET_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.');
  process.exit(1);
}

// API 호출 함수
const syncWritings = () => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_SECRET_KEY}`
      }
    };

    // URL 파싱하여 http 또는 https 모듈 선택
    const apiUrl = `${API_URL}/api/sync-writings`;
    const parsedUrl = url.parse(apiUrl);
    const httpModule = parsedUrl.protocol === 'https:' ? https : http;

    console.log(`API 요청: ${apiUrl} (${parsedUrl.protocol})`);

    const req = httpModule.request(apiUrl, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error('응답 파싱 중 오류 발생: ' + error.message));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error('API 요청 중 오류 발생: ' + error.message));
    });

    req.end();
  });
};

// 메인 함수
const main = async () => {
  try {
    console.log('블로그 글 동기화 시작...');
    const result = await syncWritings();

    if (result.success) {
      console.log(`동기화 완료: 총 ${result.count.total}개 글, ${result.count.new}개 새 글 추가됨`);
    } else {
      console.error(`동기화 실패: ${result.message}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('동기화 중 오류 발생:', error.message);
    process.exit(1);
  }
};

// 스크립트 실행
main();
