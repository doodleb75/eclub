import { Selection } from './selection.js';
import { ProductMore } from './product-more.js';

export const ProductSortAndCount = {
    init() {
        document.addEventListener('click', (e) => {
            const sortOption = e.target.closest('.sort-select .select-options li');
            const countOption = e.target.closest('.count-select .select-options li');

            if (sortOption || countOption) {
                // 상품 선택 초기화
                Selection.resetCategorySelection();

                // UI 갱신 대기 (Timeout)
                setTimeout(() => {
                    this.applyFilterAndSort();
                }, 0);
            }
        });

        // 메인 컨테이너 기준 초기화 탐색
        const container = document.querySelector('.category-main, .home-container, .container, main') || document;
        const productList = container.querySelector('.product-list');
        if (productList) {
            // 초기 정렬 적용
            this.applyFilterAndSort();
        }
    },

    applyFilterAndSort() {
        const activeSelect = document.querySelector('.sort-select, .count-select');
        let container = document;
        
        if (activeSelect) {
            container = activeSelect.closest('.category-main, .home-container, .container, main') || document;
        } else {
            container = document.querySelector('.category-main, .home-container, .container, main') || document;
        }

        const productList = container.querySelector('.product-list');
        if (!productList) return;

        const items = Array.from(productList.querySelectorAll('.product-item'));
        if (items.length === 0) return;

        const sortActive = container.querySelector('.sort-select .select-options li.active') || document.querySelector('.sort-select .select-options li.active');
        const countActive = container.querySelector('.count-select .select-options li.active') || document.querySelector('.count-select .select-options li.active');

        const sortType = sortActive ? sortActive.textContent.trim() : '판매순';
        let countLimit = 80;
        if (countActive) {
            const countText = countActive.textContent.trim();
            countLimit = parseInt(countText.replace(/[^0-9]/g, ''), 10) || 80;
        }

        // 배송 필터 상태 확인 추가
        const activeFilterBtn = document.querySelector('.btn-group[data-filter-group="delivery"] .type-btn.active');
        const activeDeliveryFilter = activeFilterBtn?.dataset.type;

        // 세금 필터 상태 확인 추가
        const activeTaxFilterBtn = document.querySelector('.btn-group[data-filter-group="tax"] .type-btn.active');
        const activeTaxFilter = activeTaxFilterBtn?.dataset.type;

        // 결제 상태 필터 (청구내역 조회 등)
        const activePaymentStatusFilterBtn = document.querySelector('.btn-group[data-filter-group="payment-status"] .type-btn.active');
        const activePaymentStatusFilter = activePaymentStatusFilterBtn?.dataset.type;

        // 기수 필터 (청구내역 조회 등)
        const activeTermFilterBtn = document.querySelector('.btn-group[data-filter-group="term"] .type-btn.active');
        const activeTermFilter = activeTermFilterBtn?.dataset.type;

        items.sort((a, b) => {
            if (sortType === '판매순') {
                // 판매량 기준 정렬
                return (parseInt(b.dataset.sales) || 0) - (parseInt(a.dataset.sales) || 0);
            } else if (sortType === '많은 구매횟수') {
                // 구매 횟수 정렬
                return (parseInt(b.dataset.purchase) || 0) - (parseInt(a.dataset.purchase) || 0);
            } else if (sortType === '신상품순') {
                // 신상품 정렬
                return (parseInt(b.dataset.new) || 0) - (parseInt(a.dataset.new) || 0);
            } else if (sortType === '낮은가격순') {
                // 최저가 정렬
                return (parseInt(a.dataset.price) || 0) - (parseInt(b.dataset.price) || 0);
            }
            return 0;
        });

        let visibleCount = 0;
        items.forEach((item) => {
            // 배송 필터 매치 여부
            let isDeliveryMatch = true;
            if (activeDeliveryFilter && activeDeliveryFilter !== 'all') {
                const itemDelivery = item.dataset.deliveryType;
                const itemCenter = item.dataset.deliveryCenter;
                isDeliveryMatch = (itemDelivery === activeDeliveryFilter || itemCenter === activeDeliveryFilter);
            }

            // 세금 필터 매치 여부
            let isTaxMatch = true;
            if (activeTaxFilter && activeTaxFilter !== 'all') {
                const itemTax = item.dataset.taxType;
                isTaxMatch = (itemTax === activeTaxFilter);
            }

            // 결제 상태 필터 매치 여부
            let isPaymentStatusMatch = true;
            if (activePaymentStatusFilter && activePaymentStatusFilter !== 'all') {
                isPaymentStatusMatch = (item.dataset.paymentStatus === activePaymentStatusFilter);
            }

            // 기수 필터 매치 여부
            let isTermMatch = true;
            if (activeTermFilter && activeTermFilter !== 'all') {
                isTermMatch = (item.dataset.term === activeTermFilter);
            }

            if (isDeliveryMatch && isTaxMatch && isPaymentStatusMatch && isTermMatch) {
                if (visibleCount < countLimit) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
            productList.appendChild(item); // 노드 재배치 (정렬 반영)
        });

        // is-more 페이징 재적용 (모바일 더보기 충돌 방지)
        if (productList.classList.contains('is-more')) {
            productList.classList.remove('is-open'); // 정렬 시 페이지 펼침 상태 초기화
            ProductMore.resetByCategory(productList);
        }
    }
};
