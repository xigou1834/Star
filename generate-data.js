const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const pages = [
  { file: 'index.html', url: 'index.html' },
  { file: 'search-results.html', url: 'search-results.html' },
  // 如有更多页面，继续添加...
];

const data = [];

pages.forEach(page => {
  const filePath = path.join(__dirname, page.file);
  const html = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const title = document.querySelector('title')?.textContent || '';
  const bodyText = document.body?.textContent?.replace(/\s+/g, ' ').trim() || '';

  data.push({
    title,
    url: page.url,
    content: bodyText.slice(0, 1000), // 可适当裁剪或提取段落
  });
});

fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
console.log('✅ 已生成 data.json');
