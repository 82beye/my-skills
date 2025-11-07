const { chromium } = require('playwright');

(async () => {
  console.log('⏳ Playwright 브라우저 시작 중...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('⏳ 페이지 로딩 중...');
  await page.goto('https://www.codedeck.kr/card-news/13775a2d-799d-43a1-b3f7-1738079bfaf6', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  console.log('⏳ JavaScript 렌더링 대기 중...');
  await page.waitForTimeout(3000);

  console.log('⏳ 콘텐츠 추출 중...');
  const content = await page.content();

  console.log('✅ HTML 콘텐츠 가져오기 완료');
  console.log(content);

  await browser.close();
})();
