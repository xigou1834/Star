const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const folderPath = path.resolve(__dirname);
const outputFile = path.join(folderPath, 'data.json');

async function extractDataFromFile(filePath) {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const dom = new JSDOM(content);
  const document = dom.window.document;

  let title = document.querySelector('title')?.textContent?.trim() || '';
  if (!title) {
    title = document.querySelector('h1')?.textContent?.trim() || '无标题';
  }

  let bodyText = '';
  const body = document.querySelector('body');
  if (body) {
    body.querySelectorAll('script, style, noscript').forEach(el => el.remove());
    bodyText = body.textContent.replace(/\s+/g, ' ').trim();
  }

  return {
    title,
    url: path.basename(filePath),
    content: bodyText,
  };
}

async function generateData() {
  try {
    const files = await fs.promises.readdir(folderPath);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    const results = [];
    for (const file of htmlFiles) {
      const filePath = path.join(folderPath, file);
      const data = await extractDataFromFile(filePath);
      results.push(data);
    }

    await fs.promises.writeFile(outputFile, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`成功生成 ${outputFile}，共 ${results.length} 条数据`);
  } catch (err) {
    console.error('生成数据出错:', err);
  }
}

generateData();
