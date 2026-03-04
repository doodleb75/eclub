export const CategorySort = {
    init() {
        const triggers = document.querySelectorAll('.type-sort input[type="radio"]');

        triggers.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const isCheck = e.target.value === 'check';
                const mainArea = document.querySelector('.category-main');

                if (mainArea) {
                    if (isCheck) {
                        mainArea.classList.add('is-check-mode');
                    } else {
                        mainArea.classList.remove('is-check-mode');
                        // 선택 모드 해제 시, 선택 목록 초기화
                        this.resetSelection();
                    }
                }
            });
        });
    },

    resetSelection() {
        // 메인 영역의 리스트 참조
        const productList = document.querySelector('.category-main .product-list');
        if (!productList) return;

        const checkboxes = productList.querySelectorAll('.product-item .item-check input[type="checkbox"]');
        const masterCb = document.querySelector('.category-filter-bar .filter-left .checkbox-container input[type="checkbox"]');
        const addCartBtn = document.querySelector('.category-filter-bar .btn-add-cart');

        checkboxes.forEach(cb => { cb.checked = false; });
        if (masterCb) masterCb.checked = false;
        if (addCartBtn) {
            addCartBtn.classList.remove('active');
            addCartBtn.setAttribute('disabled', '');
        }
    }
};
