import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const capture = async (url, outputPath) => {
    console.log(`Starting capture for ${url}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 3000));
    await page.screenshot({ path: outputPath, type: 'png' });
    await page.close();
    console.log(`Saved screenshot to ${outputPath}`);
  };

  try {
    await capture('https://vantavision.pl/', 'public/projects/vantavision.png');
    await capture('https://vantasignal.pl/', 'public/projects/vantasignal.png');
    console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

main();
