export const MypageInquiry = {
    init() {
        const listWrap = document.querySelector('.inquiry-list');
        const writeWrap = document.querySelector('.inquiry-write');
        const btnInquiry = document.querySelector('.btn-inquiry');
        const btnCancel = document.querySelector('.btn-cancel-write');

        if (!listWrap || !writeWrap) return;

        // 질문하기 버튼 클릭 시
        btnInquiry?.addEventListener('click', () => {
            listWrap.style.display = 'none';
            writeWrap.style.display = 'block';
        });

        // 취소 버튼 클릭 시
        btnCancel?.addEventListener('click', () => {
            writeWrap.style.display = 'none';
            listWrap.style.display = 'block';
        });

        // 글자수 제한 체크 로직 (필요 시)
        const textarea = writeWrap.querySelector('.textarea');
        const charCount = writeWrap.querySelector('.char-count');
        
        textarea?.addEventListener('input', (e) => {
            const length = e.target.value.length;
            if (charCount) {
                charCount.textContent = `${length} / 800 byte`;
            }
        });
    }
};
