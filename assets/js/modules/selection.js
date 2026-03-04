export const Selection = {
    init() {
        // 1. 장바구니 페이지
        const cartContainer = document.querySelector('.cart-container');
        const cartMaster = document.querySelector('.cart-select-bar .checkbox-container input[type="checkbox"]');

        if (cartContainer && cartMaster) {
            this.initCart(cartContainer, cartMaster);
        }

        // 2. 카테고리 페이지
        const categoryBar = document.querySelector('.category-filter-bar');
        // 필터 바가 속한 메인 영역의 리스트를 참조하도록 수정
        const productList = categoryBar?.closest('.category-main')?.querySelector('.product-list');
        const categoryMaster = categoryBar?.querySelector('.filter-left .checkbox-container input[type="checkbox"]');

        if (productList && categoryMaster) {
            this.initCategory(productList, categoryMaster);
        }
    },

    bindMasterCheckbox(masterCb, itemCbs, onUpdate) {
        masterCb.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            itemCbs.forEach(cb => cb.checked = isChecked);
            if (onUpdate) onUpdate();
        });

        itemCbs.forEach(item => {
            item.addEventListener('change', () => {
                masterCb.checked = Array.from(itemCbs).every(cb => cb.checked);
                if (onUpdate) onUpdate();
            });
        });
    },

    // 장바구니 로직 (그룹 존재)
    initCart(container, master) {
        const groups = container.querySelectorAll('.cart-group');

        master.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            groups.forEach(group => {
                const groupHeader = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
                const items = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');
                if (groupHeader) groupHeader.checked = isChecked;
                items.forEach(cb => cb.checked = isChecked);
            });
            this.updateDeleteButtonState();
        });

        groups.forEach(group => {
            const groupHeader = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
            const items = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');

            if (groupHeader) {
                this.bindMasterCheckbox(groupHeader, items, () => {
                    this.updateMasterState(master, '.cart-item .item-check input[type="checkbox"]');
                    this.updateDeleteButtonState();
                });
            } else {
                items.forEach(item => {
                    item.addEventListener('change', () => {
                        this.updateMasterState(master, '.cart-item .item-check input[type="checkbox"]');
                        this.updateDeleteButtonState();
                    });
                });
            }
        });

        // 선택 삭제 버튼 핸들러 추가 (PC/모바일 공통)
        const deleteButtons = document.querySelectorAll('.btn-delete-selected, .btn-select-action');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const checkedItems = document.querySelectorAll('.cart-item .item-check input[type="checkbox"]:checked');

                if (checkedItems.length === 0) {
                    e.preventDefault();
                    e.stopImmediatePropagation(); // Modal.js의 전역 클릭 이벤트를 중단시킴

                    // 모바일인 경우 너비 조절 (필요시)
                    const modalWidth = window.innerWidth < 768 ? '80%' : '320px';

                    // Modal 모듈이 전역에 있다고 가정
                    if (window.Modal) {
                        window.Modal.open('/common/components/modal/modal-alert.html', {
                            width: modalWidth
                        });
                    }
                }
            });
        });

        // 초기 상태 업데이트
        this.updateDeleteButtonState();
    },

    // 카테고리 로직 (평면 리스트)
    initCategory(container, master) {
        master.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            const items = Array.from(container.querySelectorAll('.product-item:not(.sold-out):not(.order-soon)'))
                               .filter(item => item.style.display !== 'none')
                               .map(item => item.querySelector('.item-check input[type="checkbox"]'))
                               .filter(cb => cb);
            items.forEach(cb => cb.checked = isChecked);
            this.updateAddCartButtonState();
        });

        container.addEventListener('change', (e) => {
            if (e.target.matches('.product-item .item-check input[type="checkbox"]')) {
                const items = Array.from(container.querySelectorAll('.product-item:not(.sold-out):not(.order-soon)'))
                                   .filter(item => item.style.display !== 'none')
                                   .map(item => item.querySelector('.item-check input[type="checkbox"]'))
                                   .filter(cb => cb);
                if (items.length > 0) {
                    master.checked = items.every(cb => cb.checked);
                } else {
                    master.checked = false;
                }
                this.updateAddCartButtonState();
            }
        });

        // 초기 상태 업데이트
        this.updateAddCartButtonState();
    },

    updateMasterState(master, itemSelector) {
        const allItems = document.querySelectorAll(itemSelector);
        if (allItems.length === 0) {
            master.checked = false;
            return;
        }
        master.checked = Array.from(allItems).every(cb => cb.checked);
    },

    updateDeleteButtonState() {
        const pcBtn = document.querySelector('.btn-delete-selected');
        const moBtn = document.querySelector('.btn-select-action');
        const checkedCount = document.querySelectorAll('.cart-item .item-check input[type="checkbox"]:checked').length;

        // PC: 버튼을 비활성화하지 않고 클릭 시 알림 로직으로 처리하기 위해 disabled 제거 유지
        if (pcBtn) {
            pcBtn.removeAttribute('disabled');
        }

        // Mobile: 선택된 상품이 없으면 버튼 비활성화
        if (moBtn) {
            if (checkedCount > 0) {
                moBtn.removeAttribute('disabled');
            } else {
                moBtn.setAttribute('disabled', '');
            }
        }
    },
    // 상품 선택 초기화
    resetCategorySelection() {
        // 메인 영역의 리스트를 명확히 지칭
        const productList = document.querySelector('.category-main .product-list');
        if (!productList) return;

        const items = productList.querySelectorAll('.product-item .item-check input[type="checkbox"]');
        const master = document.querySelector('.category-filter-bar .filter-left .checkbox-container input[type="checkbox"]');

        items.forEach(cb => {
            cb.checked = false;
        });

        if (master) {
            master.checked = false;
        }

        this.updateAddCartButtonState();
    },

    updateAddCartButtonState() {
        const btn = document.querySelector('.category-filter-bar .btn-add-cart');
        if (btn) {
            const checkedCount = Array.from(document.querySelectorAll('.product-item:not(.sold-out):not(.order-soon)'))
                                      .filter(item => item.style.display !== 'none' && item.querySelector('.item-check input[type="checkbox"]:checked'))
                                      .length;
            if (checkedCount > 0) {
                btn.classList.add('active'); // active 상태 표시
                btn.removeAttribute('disabled');
            } else {
                btn.classList.add('active'); // 아무것도 선택 안 되어도 모달을 띄울 수 있도록 active 유지
                btn.removeAttribute('disabled');
            }
        }
    }
};
