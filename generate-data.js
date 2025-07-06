const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const directory = __dirname;
const excludeFiles = ['header.html', 'footer.html', 'search-results.html'];
const outputFile = path.join(directory, 'data.json');

function extractContent(html, filePath) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const title = document.querySelector('title')?.textContent.trim() || '无标题';
  const body = document.body?.textContent.replace(/\s+/g, ' ').trim().slice(0, 1000) || '';

  return {
    title,
    content: body,
    url: path.basename(filePath),
  };
}

const files = fs.readdirSync(directory)
  .filter(file => file.endsWith('.html') && !excludeFiles.includes(file));

const results = files.map(file => {
  const fullPath = path.join(directory, file);
  const html = fs.readFileSync(fullPath, 'utf-8');
  return extractContent(html, file);
});

fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf-8');
console.log(`已生成 ${outputFile} 共 ${results.length} 条数据`);