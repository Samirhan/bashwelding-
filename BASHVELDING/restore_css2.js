const fs = require('fs');

const logPath = 'C:\\Users\\samir\\.gemini\\antigravity-ide\\brain\\192c8ea0-64f2-4e59-9665-6552843c2ade\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

let css1 = '';
let css2 = '';

for (const line of lines) {
  if (!line) continue;
  try {
    const parsed = JSON.parse(line);
    // Проверяем все возможные места, где может быть ответ (иногда это просто output в TOOL_RESPONSE)
    let text = '';
    if (parsed.content) text += typeof parsed.content === 'string' ? parsed.content : JSON.stringify(parsed.content);
    if (parsed.output) text += typeof parsed.output === 'string' ? parsed.output : JSON.stringify(parsed.output);
    
    // Если это ответ view_file
    if (text.includes('File Path: `file:///c:/Users/samir/OneDrive') && text.includes('style.css')) {
       // Извлекаем строки
       const match = text.match(/(\d+): (.*)/g);
       if (match) {
           let extracted = match.map(m => m.replace(/^\d+: /, '')).join('\n');
           if (text.includes('Showing lines 1 to 800')) {
               css1 = extracted;
           }
           if (text.includes('Showing lines 800 to 910')) {
               // Заменим первые 800, если вдруг есть дубликат
               css2 = extracted;
           }
       }
    }
    
    // Но возможно инструмент отдал не TOOL_RESPONSE, а что-то в другом формате.
    if (parsed.responses) {
        for (let res of parsed.responses) {
            let t = res.output || '';
            if (t.includes('File Path: `file:///c:/Users/samir/OneDrive') && t.includes('style.css')) {
                const match = t.match(/(\d+): (.*)/g);
                if (match) {
                    let extracted = match.map(m => m.replace(/^\d+: /, '')).join('\n');
                    if (t.includes('Showing lines 1 to 800')) {
                        css1 = extracted;
                    }
                    if (t.includes('Showing lines 800 to 910') || t.includes('Showing lines 800 to ')) {
                        css2 = extracted;
                    }
                }
            }
        }
    }
  } catch (e) {}
}

if (css1) {
    let finalCss = css1 + '\n';
    if (css2) {
        // Убираем первую строку из css2, так как 800 строка дублируется
        const css2Lines = css2.split('\n');
        css2Lines.shift();
        finalCss += css2Lines.join('\n');
    }
    fs.writeFileSync('style.css.bak', finalCss, 'utf8');
    console.log('Успешно восстановлено в style.css.bak! Строк: ' + finalCss.split('\n').length);
} else {
    console.log('Не удалось найти оригинальный CSS в логах.');
}
