// 대체상품 바텀시트 동작
export const ReplaceProductSheet = {
    init() {
        if(this.initialized) return; 
        this.initialized = true;

        // 트리거 이벤트 위임
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.btn-replace');
            if (trigger) {
                e.preventDefault();
                this.openSheet();
            }
        });
        
        // 닫기버튼 위임
        document.addEventListener('click', (e) => {
            const btnClose = e.target.closest('#replace-product-sheet .btn-sheet-close');
            if (btnClose) {
                e.preventDefault();
                this.closeSheet();
            }
        });
        
        // 오버레이 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (e.target.id === 'replace-product-sheet-overlay') {
                this.closeSheet();
            }
        });
    },

    openSheet() {
        this.sheet = document.getElementById('replace-product-sheet');
        this.overlay = document.getElementById('replace-product-sheet-overlay');
        
        // null 체크
        if(!this.sheet || !this.overlay) return;
        this.sheet.classList.add('is-open');
        this.overlay.classList.add('is-visible');
        document.body.classList.add('no-scroll');
    },

    closeSheet() {
        this.sheet = document.getElementById('replace-product-sheet');
        this.overlay = document.getElementById('replace-product-sheet-overlay');

        if(!this.sheet || !this.overlay) return;
        this.sheet.classList.remove('is-open');
        this.overlay.classList.remove('is-visible');
        document.body.classList.remove('no-scroll');
    }
};
