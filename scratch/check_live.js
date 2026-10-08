const http = require('http');

http.get('http://localhost:3000', (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Has adminModal:', html.includes('id="adminModal"'));
    console.log('Has adminModalBtn:', html.includes('id="adminModalBtn"'));
    console.log('Has footerAdminLink:', html.includes('id="footerAdminLink"'));
    console.log('Has qr.jpg:', html.includes('assets/qr.jpg'));
    console.log('Has Siddhartha UPI:', html.includes('siddharthakumar109-2@okhdfcbank'));
  });
});
