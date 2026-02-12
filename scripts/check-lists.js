// product-list 별 product-item 수 정밀 카운트
const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/eclub/mobile/index.html');
let buf = fs.readFileSync(filePath);
let encoding = 'utf8';
if (buf[0] === 0xFF && buf[1] === 0xFE) encoding = 'utf16le';
let content = buf.toString(encoding);
let lines = content.split(/\r?\n/);

// 각 product-list 찾기
let results = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('product-list') && (lines[i].includes('class="product-list') || lines[i].includes("class='product-list"))) {
        let listLine = i + 1;
        let listClass = lines[i].trim().substring(0, 100);

        // product-list의 닫는 div 찾기 + product-item 수 카운트
        let depth = 0;
        let itemCount = 0;
        let listEnd = i;
        for (let j = i; j < lines.length; j++) {
            const l = lines[j];
            const opens = (l.match(/<div[\s>]/g) || []).length;
            const closes = (l.match(/<\/div>/g) || []).length;
            depth += opens - closes;

            if (l.includes('class="product-item"') || l.includes("class='product-item'")) {
                itemCount++;
            }

            if (depth <= 0) {
                listEnd = j + 1;
                break;
            }
        }

        // product-more 확인
        let hasProductMore = false;
        for (let j = listEnd; j < Math.min(listEnd + 10, lines.length); j++) {
            if (lines[j].includes('product-more')) {
                hasProductMore = true;
                break;
            }
            if (lines[j].includes('</section>')) break;
        }

        // 이전 section 이름 찾기
        let sectionName = '';
        for (let k = i - 1; k >= Math.max(0, i - 30); k--) {
            if (lines[k].includes('<section') || lines[k].includes('<!-- ')) {
                sectionName = lines[k].trim().substring(0, 80);
                break;
            }
        }

        results.push({
            line: listLine,
            class: listClass,
            items: itemCount,
            hasMore: hasProductMore,
            section: sectionName,
            isSlider: lines[i].includes('list-slider')
        });
    }
}

console.log('=== product-list 현황 ===\n');
results.forEach(r => {
    console.log(`L${r.line}: ${r.items}개 items | more: ${r.hasMore ? '✅' : '❌'} | slider: ${r.isSlider ? '✅' : '❌'}`);
    console.log(`  class: ${r.class}`);
    console.log(`  section: ${r.section}`);
    console.log('');
});
