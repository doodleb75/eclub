import { Selection } from './selection.js';

export const DeliverySort = {
    init() {
        // 1. 배송 필터링 (카테고리/기획전/검색결과 등 상품 리스트 필터)
        this.initProductFilter();

        // 2. 장바구니/체크아웃 배송 모드 (기존 라디오 버튼 로직)
        this.initCartDeliveryMode();
    },

    // 상품 리스트 배송 필터링 (상온, 저온, 직납 등)
    initProductFilter() {
        const triggers = document.querySelectorAll('.delivery-types .type-btn, .tax-types .type-btn, .payment-status-filter .type-btn, .term-filter .type-btn');
        if (!triggers.length) return;

        // 초기 상태 동기화 (HTML에 미리 체크된 경우)
        triggers.forEach(btn => {
            const input = btn.querySelector('input');
            if (input && input.checked) {
                btn.classList.add('active');
            }
        });

        // 이벤트 위임 대신 직접 바인딩 또는 공용 위임 사용 (여기서는 직접 바인딩 선호)
        // 하지만 버튼이 많을 수 있으므로 위임 방식 유지 (ui.js 로직 참고)
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.delivery-types .type-btn, .tax-types .type-btn, .payment-status-filter .type-btn, .term-filter .type-btn');
            if (!btn) return;

            // 라벨 안의 인풋 클릭은 기본 동작 허용
            if (e.target.tagName === 'INPUT') return;
            
            e.preventDefault();

            const group = btn.closest('.btn-group');
            const input = btn.querySelector('input');
            const wasActive = btn.classList.contains('active');

            // 그룹 내 상호 배타 선택 처리
            if (group) {
                group.querySelectorAll('.type-btn').forEach(b => {
                    b.classList.remove('active');
                    const cb = b.querySelector('input');
                    if (cb) cb.checked = false;
                });
            }

            // 현재 항목 토글 활성화
            if (!wasActive) {
                btn.classList.add('active');
                if (input) input.checked = true;
            } else {
                // 토글 해제 시 (모든 필터 해제 상태)
                if (input) input.checked = false;
            }

            // 상품 선택 초기화 (필터 변경 시 선택 꼬임 방지)
            if (Selection && Selection.resetCategorySelection) {
                Selection.resetCategorySelection();
            }

            // 필터 적용
            this.applyFilter();
        });

        // 초기 필터 적용
        this.applyFilter();
    },

    // 장바구니/체크아웃 배송 모드 (기존 logic)
    initCartDeliveryMode() {
        const triggers = document.querySelectorAll('.type-sort-delivery input[type="radio"]');
        const filterArea = document.querySelector('.sticky-filter-area');
        if (!filterArea || !triggers.length) return;

        triggers.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const isCheck = e.target.value === 'check';
                if (isCheck) {
                    filterArea.classList.add('is-delivery-mode');
                } else {
                    filterArea.classList.remove('is-delivery-mode');
                    this.resetCartSelection();
                }
            });
        });
    },

    // 상품 리스트 필터링 실행
    applyFilter() {
        // 정렬 및 페이징이 통합된 ProductSortAndCount 호출 (모듈 임포트 대신 글로벌 접근 활용하거나 직접 호출)
        if (window.Eclub && window.Eclub.ProductSortAndCount) {
            window.Eclub.ProductSortAndCount.applyFilterAndSort();
            return;
        }

        const activeDeliveryFilterBtn = document.querySelector('.btn-group[data-filter-group="delivery"] .type-btn.active');
        const activeDeliveryFilter = activeDeliveryFilterBtn?.dataset.type;

        const activeTaxFilterBtn = document.querySelector('.btn-group[data-filter-group="tax"] .type-btn.active');
        const activeTaxFilter = activeTaxFilterBtn?.dataset.type;

        // 추가된 필터 그룹
        const activePaymentStatusFilterBtn = document.querySelector('.btn-group[data-filter-group="payment-status"] .type-btn.active');
        const activePaymentStatusFilter = activePaymentStatusFilterBtn?.dataset.type;

        const activeTermFilterBtn = document.querySelector('.btn-group[data-filter-group="term"] .type-btn.active');
        const activeTermFilter = activeTermFilterBtn?.dataset.type;

        // 필터링 대상 범위 (우선순위: .category-main -> #container -> body)
        const scope = document.querySelector('.category-main') || 
                      document.querySelector('#container') || 
                      document.body;

        const productItems = scope.querySelectorAll('.product-list .product-item');

        productItems.forEach(item => {
            let isMatch = true;

            // 1. 배송 필터
            if (activeDeliveryFilter && activeDeliveryFilter !== 'all') {
                const itemDelivery = item.dataset.deliveryType;
                const itemCenter = item.dataset.deliveryCenter;
                isMatch = isMatch && (itemDelivery === activeDeliveryFilter || itemCenter === activeDeliveryFilter);
            }
            
            // 2. 세금 필터
            if (activeTaxFilter && activeTaxFilter !== 'all') {
                const itemTax = item.dataset.taxType;
                isMatch = isMatch && (itemTax === activeTaxFilter);
            }

            // 3. 결제 상태 필터
            if (activePaymentStatusFilter && activePaymentStatusFilter !== 'all') {
                const itemStatus = item.dataset.paymentStatus;
                isMatch = isMatch && (itemStatus === activePaymentStatusFilter);
            }

            // 4. 기수 필터
            if (activeTermFilter && activeTermFilter !== 'all') {
                const itemTerm = item.dataset.term;
                isMatch = isMatch && (itemTerm === activeTermFilter);
            }

            // Display 제어
            item.style.display = isMatch ? '' : 'none';
        });
    },

    // 장바구니 선택 초기화 (기존 resetSelection -> 이름 변경)
    resetCartSelection() {
        const deliveryList = document.querySelector('.delivery-manage-list');
        if (!deliveryList) return;

        const checkboxes = deliveryList.querySelectorAll('.checkbox-container input[type="checkbox"]');
        const countBox = document.querySelector('.delivery-count-box span');
        const moCountText = document.querySelector('.sticky-btn-action .btn-select-action');

        checkboxes.forEach(cb => { cb.checked = false; });
        if (countBox) countBox.textContent = '0';
        if (moCountText) {
            moCountText.textContent = '선택변경';
            moCountText.classList.add('disabled');
        }
    }
};
