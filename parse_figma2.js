const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:\\eclub\\tmp.json', 'utf8'));

function extractText(obj) {
    if (typeof obj === 'string') return;
    if (Array.isArray(obj)) {
        obj.forEach(extractText);
    } else if (obj && typeof obj === 'object') {
        if (obj.characters !== undefined) {
            console.log(obj.name ? obj.name + ': ' + obj.characters : 'text: ' + obj.characters);
        }
        Object.values(obj).forEach(extractText);
    }
}

extractText(data);
