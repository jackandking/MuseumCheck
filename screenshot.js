const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to mobile size first to see mobile layout
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:8000/', { waitUntil: 'networkidle' });
  
  // Wait for app to load
  await page.waitForTimeout(2000);
  
  // Take mobile screenshot
  await page.screenshot({ path: 'screenshot-mobile.png' });
  console.log('✅ Mobile screenshot saved: screenshot-mobile.png');
  
  // Desktop size
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:8000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Take desktop screenshot
  await page.screenshot({ path: 'screenshot-desktop.png' });
  console.log('✅ Desktop screenshot saved: screenshot-desktop.png');
  
  await browser.close();
})();
