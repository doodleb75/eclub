const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:\\eclub\\tmp.json', 'utf8'));

function extractText(node) {
    if (node.characters) {
        console.log(node.name + ':', node.characters);
    }
    if (node.children) {
        node.children.forEach(extractText);
    }
}

if (data.nodes) {
    Object.values(data.nodes).forEach(n => {
        if (n.document) {
            extractText(n.document);
        }
    });
}
