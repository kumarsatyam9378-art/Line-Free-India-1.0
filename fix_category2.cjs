const fs = require('fs');
let content = fs.readFileSync('src/constants/businessRegistry.ts', 'utf8');

// The file had no categories to start with, but after our script it has duplicates?
// Let's reset to git HEAD again.
