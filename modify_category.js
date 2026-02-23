const fs = require('fs');
const path = require('path');

const filepath = path.join('c:', 'eclub', 'pc', 'pages', 'category.html');
const content = fs.readFileSync(filepath, 'utf-8');

// The file might be broken right now. Let's fix it manually.
// First, find <div class="product-list">
// Then find <!-- 하단 페이지네이션 구조 --> (if exists) or <div class="pagination">

const listRegex = /(<div\s+class="product-list">)([\s\S]*?)(<div\s+class="pagination">)/;
const match = listRegex.exec(content);

if (!match) {
    console.error("Could not find product-list block");
    process.exit(1);
}

const prefix = content.slice(0, match.index + match[1].length);
const itemsHtml = match[2];
const suffix = content.slice(match.index + match[1].length + match[2].length);

const itemRegex = /(<!--\s*Product Item.*?\n)?(\s*<div class="product-item"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/gs;
let itemMatches = [...itemsHtml.matchAll(itemRegex)];

if (itemMatches.length < 4) {
    console.error(`Found only ${itemMatches.length} items. Expected at least 4.`);
    process.exit(1);
}

let newItemsHtml = "";

for (let i = 0; i < 30; i++) {
    const templateMatch = itemMatches[i % 4];
    let templateBody = templateMatch[2];
    
    // Generate random sort variables
    const sales = Math.floor(Math.random() * 990) + 10;
    const purchases = Math.floor(Math.random() * 495) + 5;
    const isNew = Math.floor(Math.random() * 100);
    const priceBase = (Math.floor(Math.random() * 490) + 10) * 100;
    
    // Replace ranking number
    const rankNum = (i + 1).toString().padStart(2, '0');
    templateBody = templateBody.replace(/(<span class="badge-ranking">)\d+위(<\/span>)/g, `$1${rankNum}위$2`);
    
    // Replace price display
    const formattedPrice = priceBase.toLocaleString('ko-KR');
    templateBody = templateBody.replace(/(<div class="main-price">[\s\S]*?<span class="price">)[0-9,]+원(<\/span>)/g, `$1${formattedPrice}원$2`);
    
    // Add sorting attributes
    const dataAttrs = ` data-sales="${sales}" data-purchase="${purchases}" data-new="${isNew}" data-price="${priceBase}"`;
    if (templateBody.includes('data-delivery-type')) {
        templateBody = templateBody.replace(/data-sales="\d+"\s+data-purchase="\d+"\s+data-new="\d+"\s+data-price="\d+"\s+/, '');
        templateBody = templateBody.replace('data-delivery-type', dataAttrs.trim() + ' data-delivery-type');
    } else {
        templateBody = templateBody.replace('class="product-item"', `class="product-item"${dataAttrs}`);
    }
    
    newItemsHtml += `\n                        <!-- Product Item ${i+1} -->${templateBody}`;
}

const fixedEnd = `
                    </div>

                    <!-- 하단 페이지네이션 구조 -->
                    `;

const paginationStart = `<div class="pagination">
                        <button type="button" class="btn-page-first">«</button>
                        <button type="button" class="btn-page-prev">‹</button>
                        <button type="button" class="active">1</button>
                        <button type="button">2</button>
                        <button type="button">3</button>
`;

let finalSuffix = suffix;
// If the suffix from the current file misses the buttons because of the bad replace:
if (!finalSuffix.includes('btn-page-first')) {
    finalSuffix = finalSuffix.replace('<div class="pagination">', paginationStart);
}

const newContent = prefix + newItemsHtml + fixedEnd + finalSuffix;
fs.writeFileSync(filepath, newContent, 'utf-8');
console.log("Successfully generated 30 product items with fixed layout via Node.");
