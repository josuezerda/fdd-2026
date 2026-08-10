const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Use file protocol to open the local HTML file
  const path = require('path');
  const filePath = path.resolve(__dirname, 'presupuesto-auspicio-fdd2026.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
  
  // Print to PDF
  await page.pdf({
    path: 'presupuesto-auspicio-fdd2026.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  
  await browser.close();
  console.log('PDF generado exitosamente!');
})();
