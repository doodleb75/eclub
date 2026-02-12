// product-item 수를 12개 이상으로 맞춤 + list-slider도 is-more로 변환
const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/eclub/mobile/index.html');
let buf = fs.readFileSync(filePath);
let encoding = 'utf8';
if (buf[0] === 0xFF && buf[1] === 0xFE) encoding = 'utf16le';
let content = buf.toString(encoding);
let lines = content.split(/\r?\n/);

const MIN_ITEMS = 12; // 10개 limit 초과를 위해 12개

// product-list 위치 찾기
let productLists = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('class="product-list') || lines[i].includes("class='product-list")) {
        productLists.push(i);
    }
}

console.log(`총 ${productLists.length}개 product-list 발견`);

// 뒤에서부터 처리
productLists.reverse();

for (const listIdx of productLists) {
    let line = lines[listIdx];
    console.log(`\n=== L${listIdx + 1} 처리: ${line.trim().substring(0, 80)}`);

    // list-slider를 is-more로 변환
    if (line.includes('list-slider')) {
        lines[listIdx] = line.replace('list-slider', 'is-more');
        line = lines[listIdx];
        console.log('  list-slider → is-more 변환');
    }

    // is-more 확인 및 추가
    if (!line.includes('is-more')) {
        lines[listIdx] = line.replace(/class="product-list/, 'class="product-list is-more');
        line = lines[listIdx];
    }

    // data-more-limit 확인 및 추가/업데이트
    if (line.includes('data-more-limit')) {
        lines[listIdx] = lines[listIdx].replace(/data-more-limit="\d+"/, 'data-more-limit="10"');
    } else {
        // 여러 줄에 걸친 div 태그 처리
        let found = false;
        for (let j = listIdx; j < Math.min(listIdx + 5, lines.length); j++) {
            if (lines[j].includes('>') && !found) {
                lines[j] = lines[j].replace(/>/, ' data-more-limit="10">');
                found = true;
                break;
            }
        }
    }

    // product-list 범위 및 아이템 파악
    let depth = 0;
    let listEndIdx = -1;
    let itemPositions = [];

    for (let j = listIdx; j < lines.length; j++) {
        const l = lines[j];
        const opens = (l.match(/<div[\s>]/g) || []).length;
        const closes = (l.match(/<\/div>/g) || []).length;
        depth += opens - closes;

        if (l.includes('class="product-item"') || l.includes("class='product-item'")) {
            let itemStart = j;
            let itemDepth = 0;
            for (let k = j; k < lines.length; k++) {
                const kl = lines[k];
                const ko = (kl.match(/<div[\s>]/g) || []).length;
                const kc = (kl.match(/<\/div>/g) || []).length;
                itemDepth += ko - kc;
                if (itemDepth <= 0) {
                    itemPositions.push({ start: itemStart, end: k });
                    break;
                }
            }
        }

        if (depth <= 0) {
            listEndIdx = j;
            break;
        }
    }

    console.log(`  현재 product-item 수: ${itemPositions.length}개`);

    // 아이템 복제 (MIN_ITEMS 미만이면)
    if (itemPositions.length < MIN_ITEMS && itemPositions.length > 0) {
        const needed = MIN_ITEMS - itemPositions.length;
        console.log(`  ${needed}개 아이템 복제 필요`);

        let insertPoint = itemPositions[itemPositions.length - 1].end + 1;
        let newLines = [];

        for (let n = 0; n < needed; n++) {
            const srcItem = itemPositions[n % itemPositions.length];
            const srcLines = lines.slice(srcItem.start, srcItem.end + 1);
            newLines.push('');
            const itemNum = itemPositions.length + n + 1;
            // 첫 줄에 주석이 있으면 교체, 없으면 그대로
            let firstLine = srcLines[0];
            if (firstLine.includes('<!--')) {
                newLines.push(firstLine.replace(/<!--.*?-->/, `<!-- Product Item ${itemNum} -->`));
            } else {
                newLines.push(`                        <!-- Product Item ${itemNum} -->`);
                newLines.push(firstLine);
            }
            for (let s = 1; s < srcLines.length; s++) {
                newLines.push(srcLines[s]);
            }
        }

        lines.splice(insertPoint, 0, ...newLines);
        listEndIdx += newLines.length;
        console.log(`  ${newLines.length}줄 삽입, 최종 아이템: ${MIN_ITEMS}개`);
    }

    // product-more 확인 및 삽입
    let hasProductMore = false;
    for (let j = listEndIdx + 1; j < Math.min(listEndIdx + 10, lines.length); j++) {
        if (lines[j].includes('product-more')) {
            hasProductMore = true;
            break;
        }
        if (lines[j].includes('</div>') || lines[j].includes('</section>')) {
            break;
        }
    }

    if (!hasProductMore) {
        const indent = lines[listIdx].match(/^(\s*)/)[1];
        const moreBlock = [
            '',
            indent + '<!-- 상품 더보기 -->',
            indent + '<div class="product-more">',
            indent + '    <button type="button" class="btn-more">',
            indent + '        <span>상품 더보기</span>',
            indent + '        <i class="icon-chevron-down"></i>',
            indent + '    </button>',
            indent + '</div>'
        ];
        lines.splice(listEndIdx + 1, 0, ...moreBlock);
        console.log(`  product-more 블럭 삽입됨`);
    } else {
        console.log(`  product-more 이미 존재함`);
    }
}

// 파일 저장
let output;
if (encoding === 'utf16le') {
    output = Buffer.from('\uFEFF' + lines.join('\r\n'), 'utf16le');
} else {
    output = lines.join('\r\n');
}
fs.writeFileSync(filePath, output, encoding === 'utf16le' ? undefined : 'utf8');

console.log(`\n=== 완료! 총 라인 수: ${lines.length} ===`);
