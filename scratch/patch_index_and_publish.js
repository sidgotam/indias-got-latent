const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove adminModalBtn from header
html = html.replace(/<!-- Video Stream Settings Button -->[\s\S]*?<\/button>/, '');

// 2. Remove footerAdminLink from footer
html = html.replace(/<li><a href="#" id="footerAdminLink"[\s\S]*?<\/a><\/li>/, '');

// 3. Update QR picture block
const oldQrBlock = `<picture>
                            <source srcset="assets/developer_qr.webp" type="image/webp">
                            <img 
                                src="assets/developer_qr.png" 
                                alt="Scan QR to Support Developer" 
                                id="developerQrImg" 
                                class="developer-qr-img"
                                width="200"
                                height="200"
                                loading="lazy"
                                decoding="async">
                        </picture>`;

const newQrBlock = `<img 
                            src="assets/qr.jpg" 
                            alt="Scan QR to Support Siddhartha Gautam" 
                            id="developerQrImg" 
                            class="developer-qr-img"
                            width="210"
                            height="290"
                            loading="eager"
                            decoding="async">`;

html = html.replace(/<picture>[\s\S]*?<\/picture>/, newQrBlock);

// 4. Update UPI Links and IDs
html = html.replace(/developer@upi/g, 'siddharthakumar109-2@okhdfcbank');
html = html.replace(/pn=IGL%20Developer/g, 'pn=Siddhartha%20Gautam');
html = html.replace('<span class="upi-label">UPI ID (For Manual Transfer)</span>', '<span class="upi-label">UPI ID: Siddhartha Gautam</span>');

// 5. Remove admin-modal block completely
html = html.replace(/<!-- =+ -->\s*<!-- STREAM VAULT & STORAGE SETTINGS MODAL[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

// 6. Bump script versions to v9
html = html.replace(/data\.js\?v=\d+/g, 'data.js?v=9');
html = html.replace(/app\.js\?v=\d+/g, 'app.js?v=9');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html for publication!');
