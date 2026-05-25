const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Ищем сломанный кусок. Он начинается примерно после карточки услуги 03 (У нее <div class="service-num">03</div>)
// и заканчивается перед карточкой услуги 05.
// Мы можем просто заменить всё между 03 и 05 на правильный 04.

const regex = /(<div class="service-card reveal" data-delay="160">\s*<div class="service-num">03<\/div>[\s\S]*?<\/div>)\s*(<div class="service-card reveal" data-delay="0"|<\/section>[\s\S]*?СНиП\.<\/p>\s*<\/div>)\s*(<div class="service-card reveal" data-delay="80">\s*<div class="service-num">05<\/div>)/;

const match = content.match(regex);
if (match) {
    const fixed04 = `
        <div class="service-card reveal" data-delay="0">
          <div class="service-num">04</div>
          <div class="service-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <line x1="8" y1="11" x2="16" y2="11" />
              <line x1="8" y1="15" x2="16" y2="15" />
              <line x1="8" y1="18" x2="12" y2="18" />
            </svg>
          </div>
          <h3 class="service-title">Исполнительная документация</h3>
          <p class="service-desc">Ведение полного комплекта исполнительной и приёмосдаточной документации по ГОСТ и СНиП.</p>
        </div>
        `;
    
    content = content.replace(regex, match[1] + fixed04 + match[3]);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Сломанный кусок 04 исправлен!');
} else {
    console.log('Не удалось найти сломанный кусок.');
}
