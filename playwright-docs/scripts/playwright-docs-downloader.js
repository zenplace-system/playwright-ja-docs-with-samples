// playwright-url-downloader.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const { JSDOM } = require('jsdom');
const TurndownService = require('turndown');
const turndownService = new TurndownService();

// URLを抽出する関数
function extractUrls(content) {
  const urlRegex = /\(https:\/\/playwright\.dev\/docs\/[^\)]+\)/g;
  const matches = content.match(urlRegex);
  
  if (!matches) return [];
  
  return matches
    .map(match => match.slice(1, -1)) // 括弧を削除
    .filter(url => url.startsWith('https://playwright.dev/docs/')) // プレイライトドキュメントのURLだけをフィルタリング
    .filter((url, index, self) => self.indexOf(url) === index); // 重複を除去
}

// テキストをファイルに保存する関数
function saveToFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    console.error(`Error saving file ${filePath}: ${error.message}`);
    return false;
  }
}

// HTTPSでコンテンツを取得する関数
function fetchContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// HTMLをMarkdownに変換する関数
function convertHtmlToMarkdown(html, url) {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Playwrightドキュメント内の主要コンテンツを含む要素を特定
    const mainContent = document.querySelector('article') || 
                       document.querySelector('main') || 
                       document.querySelector('.markdown');
    
    if (!mainContent) {
      return `# ページのコンテンツを抽出できませんでした\n\n${url}\n`;
    }
    
    // タイトルを取得
    const title = document.querySelector('title')?.textContent || 
                 document.querySelector('h1')?.textContent || 
                 'Playwright Documentation';
    
    // HTMLをMarkdownに変換
    const markdown = turndownService.turndown(mainContent.innerHTML);
    
    // メタデータを追加
    const header = `# ${title}\n\nSource: ${url}\n\nDownloaded: ${new Date().toISOString()}\n\n---\n\n`;
    
    return header + markdown;
  } catch (error) {
    console.error(`Error converting HTML to Markdown: ${error.message}`);
    return `# エラーが発生しました\n\n${url}\n\n${error.message}\n`;
  }
}

// ファイル名を生成する関数
function generateFilename(url) {
  const urlObj = new URL(url);
  const pathSegments = urlObj.pathname.split('/').filter(Boolean);
  const pageName = pathSegments[pathSegments.length - 1] || 'index';
  return `${pageName}.md`;
}

// URLのリストを保存する関数
function saveUrlList(urls, outputPath) {
  const content = urls.map(url => `- ${url}`).join('\n');
  const header = `# Playwright Documentation URLs\n\nTotal: ${urls.length}\n\n`;
  saveToFile(outputPath, header + content);
}

// メイン関数
async function main() {
  try {
    // ファイルからコンテンツを読み込む
    const inputContent = fs.readFileSync(path.join(__dirname, 'paste.txt'), 'utf-8');
    
    // URLを抽出
    const urls = extractUrls(inputContent);
    console.log(`Found ${urls.length} unique URLs`);
    
    // URLリストを保存
    const outputDir = './playwright-docs';
    saveUrlList(urls, path.join(outputDir, 'url-list.txt'));
    console.log(`URL list saved to: ${path.join(outputDir, 'url-list.txt')}`);
    
    // URLsをJSONファイルとしても保存
    saveToFile(path.join(outputDir, 'urls.json'), JSON.stringify(urls, null, 2));
    console.log(`URLs also saved as JSON to: ${path.join(outputDir, 'urls.json')}`);
    
    // 各URLからMarkdownコンテンツをダウンロード
    console.log('Starting to download and convert pages...');
    
    const results = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`[${i+1}/${urls.length}] Processing ${url}`);
      
      try {
        // HTMLを取得
        const html = await fetchContent(url);
        
        // HTMLをMarkdownに変換
        const markdown = convertHtmlToMarkdown(html, url);
        
        // ファイル名を生成
        const fileName = generateFilename(url);
        const filePath = path.join(outputDir, fileName);
        
        // Markdownをファイルに保存
        if (saveToFile(filePath, markdown)) {
          console.log(`  Saved to ${filePath}`);
          results.push({ url, fileName, success: true });
        } else {
          results.push({ url, success: false, reason: 'File write error' });
        }
        
        // サーバーに負荷をかけないために少し待機
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  Error processing ${url}: ${error.message}`);
        results.push({ url, success: false, reason: error.message });
      }
    }
    
    // 結果の概要を保存
    const summary = {
      total: urls.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
    
    saveToFile(path.join(outputDir, 'download-summary.json'), JSON.stringify(summary, null, 2));
    console.log('\nDownload Summary:');
    console.log(`Total URLs: ${summary.total}`);
    console.log(`Successfully downloaded: ${summary.successful}`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Files saved to: ${path.resolve(outputDir)}`);
    
    // インデックスファイルの作成
    const successfulDownloads = results.filter(r => r.success);
    const indexContent = `# Playwright Documentation Index\n\n${successfulDownloads.map(r => `- [${r.fileName.replace('.md', '')}](${r.fileName}): [Source](${r.url})`).join('\n')}`;
    saveToFile(path.join(outputDir, 'index.md'), indexContent);
    console.log('Index file created: index.md');
    
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

// プログラムを実行
main().catch(console.error);