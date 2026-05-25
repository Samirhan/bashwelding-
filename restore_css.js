const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = 'C:\\Users\\samir\\.gemini\\antigravity-ide\\brain\\192c8ea0-64f2-4e59-9665-6552843c2ade\\.system_generated\\logs\\transcript.jsonl';

async function restoreCss() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lines = new Map();

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      // Ищем ответы от инструмента view_file
      if (parsed.tool_calls && Array.isArray(parsed.tool_calls)) {
         // tool calls are in MODEL step, responses are in SYSTEM step, but wait, transcript format:
         // responses are usually in a separate step or inside tool_calls?
         // Let's just regex search the raw JSON string for the pattern "123: ...."
      }
    } catch (e) {}
    
    // Simple regex approach over the raw text:
    // look for "\n1: /* ======================================\n2: "
    // Because in JSON, newlines are \n
    // Let's extract lines that match `\d+: `
    const matches = line.match(/(\d+): (.*?)(?=\\n\d+: |$)/g);
    // Actually, view_file output is in the JSON string, where newlines are literal '\n'.
    // Let's parse JSON and then process text.
    try {
      const parsed = JSON.parse(line);
      if (parsed.type === 'TOOL_RESPONSE' || parsed.content || parsed.output) {
        let text = typeof parsed.content === 'string' ? parsed.content : '';
        if (parsed.output) text += '\n' + parsed.output;
        
        // Find if it mentions style.css
        if (text.includes('style.css')) {
            const rawLines = text.split('\n');
            for (let raw of rawLines) {
                // If it contains "\n" inside JSON string, it will be split.
                const m = raw.match(/^(\d+): (.*)$/);
                if (m) {
                    const lineNum = parseInt(m[1], 10);
                    // only take if not already present or if we want to overwrite
                    if (!lines.has(lineNum)) {
                        lines.set(lineNum, m[2]);
                    }
                }
            }
        }
      }
    } catch(e) {}
  }

  // Also check if any step contains "TOOL_RESPONSE" in a nested way
  const allLines = fs.readFileSync(logPath, 'utf8').split('\n');
  for (let l of allLines) {
      if (!l) continue;
      try {
          const parsed = JSON.parse(l);
          if (parsed.responses) {
              for (let res of parsed.responses) {
                  if (res.output && res.output.includes('style.css')) {
                      const rawLines = res.output.split('\n');
                      for (let raw of rawLines) {
                          const m = raw.match(/^(\d+): (.*)$/);
                          if (m) {
                              const lineNum = parseInt(m[1], 10);
                              if (!lines.has(lineNum)) {
                                  lines.set(lineNum, m[2]);
                              }
                          }
                      }
                  }
              }
          }
          if (parsed.tool_responses) { // another possible format
              for (let res of parsed.tool_responses) {
                  if (res.output && res.output.includes('style.css')) {
                      const rawLines = res.output.split('\n');
                      for (let raw of rawLines) {
                          const m = raw.match(/^(\d+): (.*)$/);
                          if (m) {
                              const lineNum = parseInt(m[1], 10);
                              if (!lines.has(lineNum)) {
                                  lines.set(lineNum, m[2]);
                              }
                          }
                      }
                  }
              }
          }
      } catch (e) {}
  }

  // sort and build file
  let maxLine = 0;
  for (let k of lines.keys()) {
      if (k > maxLine) maxLine = k;
  }
  
  console.log(`Found ${lines.size} lines, max line is ${maxLine}`);
  
  if (lines.size > 0) {
      let finalCss = '';
      for (let i = 1; i <= maxLine; i++) {
          finalCss += (lines.get(i) !== undefined ? lines.get(i) : '') + '\n';
      }
      fs.writeFileSync(path.join(__dirname, 'style.css.bak'), finalCss, 'utf8');
      console.log('Restored to style.css.bak');
  } else {
      console.log('Could not find original lines.');
  }
}

restoreCss();
