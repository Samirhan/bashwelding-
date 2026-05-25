const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Иконка 05
content = content.replace(
  /<div class="service-num">05<\/div>\s*<div class="service-icon-wrap">\s*<svg[^>]*>[\s\S]*?<\/svg>\s*<\/div>/,
  `<div class="service-num">05</div>
          <div class="service-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>`
);

// Иконка 06
content = content.replace(
  /<div class="service-num">06<\/div>\s*<div class="service-icon-wrap">\s*<svg[^>]*>[\s\S]*?<\/svg>\s*<\/div>/,
  `<div class="service-num">06</div>
          <div class="service-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Иконки 05 и 06 исправлены!');
