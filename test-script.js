const fs = require('fs');
let html = fs.readFileSync('c:/eclub/mobile/pages/product-detail.html', 'utf8');
const searchSectionStart = html.indexOf('<!-- 저온상품의 핫딜 -->');
const searchSectionEnd = html.indexOf('</section>', searchSectionStart) + '</section>'.length;

const modalContent = fs.readFileSync('c:/eclub/common/components/modal/modal-product-detail.html', 'utf8');
const modalStart = modalContent.indexOf('<div class="product-detail-area">');
const modalEnd = modalContent.indexOf('</div>\r\n            <!-- // 우측 상품 정보 -->') + '</div>\r\n            <!-- // 우측 상품 정보 -->'.length;
const detailContent = modalContent.substring(modalStart, modalEnd);

const replaceContent = '<!-- 상품상세 정보 -->\n' + detailContent + '\n<!-- //상품상세 정보 -->';
if (searchSectionStart !== -1) {
    fs.writeFileSync('c:/eclub/mobile/pages/product-detail.html', html.substring(0, searchSectionStart) + replaceContent + html.substring(searchSectionEnd));
}
