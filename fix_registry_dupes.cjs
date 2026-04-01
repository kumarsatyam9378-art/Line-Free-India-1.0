const fs = require('fs');

const path = 'src/constants/businessRegistry.ts';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');
let modifiedLines = [];
let insideObject = false;
let objectLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.match(/^  {/)) {
    insideObject = true;
    objectLines = [line];
  } else if (line.match(/^  },?$/)) {
    objectLines.push(line);
    insideObject = false;

    // Process objectLines to remove duplicate categories
    let categorySeen = false;
    const finalObjectLines = [];

    for (const objLine of objectLines) {
      if (objLine.match(/^ {4}"category":/)) {
        if (!categorySeen) {
          categorySeen = true;
          finalObjectLines.push(objLine);
        } else {
          // Skip duplicate category
        }
      } else {
        finalObjectLines.push(objLine);
      }
    }

    modifiedLines.push(...finalObjectLines);
  } else if (insideObject) {
    objectLines.push(line);
  } else {
    modifiedLines.push(line);
  }
}

fs.writeFileSync(path, modifiedLines.join('\n'));
