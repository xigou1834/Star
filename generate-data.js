// generate-data.js
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 排除以下页面不参与搜索索引
const excludedFiles = ['header.html', 'footer.html', 'search-results.html'];

const data = [];

const htmlFiles = fs.readdirSync(__dirname).filter(file => {
  return file.endsWith('.html') && !excludedFiles.includes(file);
});

for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
  const dom = new JSDOM(content);
  const doc = dom.window.document;

  const title = doc.querySelector('title')?.textContent.trim() || file;
  const text = doc.body?.textContent?.replace(/\s+/g, ' ').trim() || '';

  data.push({
    title,
    content: text,
    url: file
  });
}

fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
console.log(`✅ 已生成 data.json，共 ${data.length} 条记录`);