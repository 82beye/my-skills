const fs = require('fs');
const cheerio = require('cheerio');

// HTML 파일 읽기
const html = fs.readFileSync('codedeck-flutter-animation.html', 'utf-8');
const $ = cheerio.load(html);

// 메타데이터 추출
const title = $('h1[id*="flutter"]').first().text().trim() || 'Flutter 애니메이션 구현 완벽 가이드';
const description = $('meta[name="description"]').attr('content');
const author = $('meta[name="author"]').attr('content');
const datePublished = $('script[type="application/ld+json"]').first().text();

let markdown = `# ${title}\n\n`;
markdown += `> ${description}\n\n`;
markdown += `**작성자:** ${author}\n`;
markdown += `**출처:** CodeDeck - https://www.codedeck.kr/card-news/13775a2d-799d-43a1-b3f7-1738079bfaf6\n\n`;
markdown += `---\n\n`;

// 본문 콘텐츠 추출
const content = $('.markdown-content');

content.find('h1, h2, h3, h4, p, pre, ul, ol, hr').each((i, elem) => {
  const $elem = $(elem);
  const tagName = elem.tagName.toLowerCase();

  if (tagName === 'h1') {
    markdown += `# ${$elem.text().trim()}\n\n`;
  } else if (tagName === 'h2') {
    markdown += `## ${$elem.text().trim()}\n\n`;
  } else if (tagName === 'h3') {
    markdown += `### ${$elem.text().trim()}\n\n`;
  } else if (tagName === 'h4') {
    markdown += `#### ${$elem.text().trim()}\n\n`;
  } else if (tagName === 'p') {
    markdown += `${$elem.text().trim()}\n\n`;
  } else if (tagName === 'pre') {
    const code = $elem.find('code').text();
    const lang = $elem.find('code').attr('class')?.match(/language-(\w+)/)?.[1] || '';
    markdown += `\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
  } else if (tagName === 'ul') {
    $elem.find('li').each((j, li) => {
      markdown += `- ${$(li).text().trim()}\n`;
    });
    markdown += `\n`;
  } else if (tagName === 'ol') {
    $elem.find('li').each((j, li) => {
      markdown += `${j + 1}. ${$(li).text().trim()}\n`;
    });
    markdown += `\n`;
  } else if (tagName === 'hr') {
    markdown += `---\n\n`;
  }
});

// 파일 저장
console.log(markdown);
