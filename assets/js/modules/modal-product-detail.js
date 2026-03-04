export const ModalProductDetail = {
    initialized: false,
    init() {
        if (this.initialized) return;
        this.initialized = true;

        // 상품 상세 모달 썸네일 클릭 이벤트 (이벤트 위임)
        document.addEventListener('click', (e) => {
            const thumbItem = e.target.closest('.modal-product-detail .thumb-item');
            if (thumbItem && !thumbItem.classList.contains('placeholder')) {
                const thumbList = thumbItem.closest('.thumb-list');
                const img = thumbItem.querySelector('img');
                const modalBody = thumbItem.closest('.modal-body');
                
                if (!thumbList || !img || !modalBody) return;

                const mainImg = modalBody.querySelector('.main-image img');
                if (mainImg) {
                    // 메인 이미지 src 변경
                    mainImg.src = img.src;

                    // 썸네일 active 상태 업데이트
                    thumbList.querySelectorAll('.thumb-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    thumbItem.classList.add('active');
                }
            }
        });
    }
};
