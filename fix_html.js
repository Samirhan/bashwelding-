const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Восстанавливаем конец секции about и начало services
const brokenAbout = `              +7 (922) 839-29-07
          <!-- ============ УСЛУГИ ============ -->`;

const fixedAbout = `              +7 (922) 839-29-07
            </a>
            <a href="mailto:byran.185@mail.ru" class="about-contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              byran.185@mail.ru
            </a>
          </div>
        </div>
        <div class="about-visual reveal reveal-right">
          <div class="about-img-primary">
            <img src="images/image1.png" alt="Строительство и сварка">
          </div>
          <div class="about-img-secondary">
            <img src="images/image2.png" alt="Монтаж трубопроводов">
          </div>
          <div class="about-badge-card">
            <span class="badge-year">2025</span>
            <span class="badge-desc">С 2025 года<br>на рынке</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ УСЛУГИ ============ -->`;

content = content.replace(brokenAbout, fixedAbout);

// 2. Восстанавливаем карточку услуги 04
// У нас в файле есть:
// </section> полного комплекта исполнительной и приёмосдаточной документации по ГОСТ и СНиП.</p>
//         </div>
const brokenServiceRegex = /<\/section> полного комплекта исполнительной и приёмосдаточной документации по ГОСТ и СНиП\.<\/p>\s*<\/div>/;

const fixedService = `<div class="service-card reveal" data-delay="0">
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
        </div>`;

content = content.replace(brokenServiceRegex, fixedService);

// На случай, если регулярка не сработает из-за странного символа 
const brokenServiceAlternativeRegex = /<\/section>.*?полного комплекта исполнительной и приёмосдаточной документации по ГОСТ и СНиП\.<\/p>\s*<\/div>/s;
if (!content.includes('Исполнительная документация')) {
    content = content.replace(brokenServiceAlternativeRegex, fixedService);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('HTML исправлен!');
