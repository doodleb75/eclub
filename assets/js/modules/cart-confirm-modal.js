export const CartConfirmModal = {
    init() {
        if (this.initialized) return; this.initialized = true;
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-add-cart');
            if (!btn) return;
            e.preventDefault();

            // 체크된 product-item 수집 (품절/주문불가 제외, 숨김 항목 제외, 모달 내부 상품 제외)
            const checkedInputs = Array.from(document.querySelectorAll('.product-list:not(.add-cart-list) .product-item:not(.sold-out):not(.order-soon)'))
                .filter(item => item.style.display !== 'none' && item.querySelector('.item-check input[type="checkbox"]:checked'))
                .map(item => item.querySelector('.item-check input[type="checkbox"]:checked'));
            const checked = checkedInputs.filter(Boolean);

            const Modal = window.Modal;

            // 체크 없으면 alert 모달
            if (checked.length === 0) {
                if (Modal) Modal.open('/common/components/modal/modal-alert.html', { width: '400px' });
                return;
            }

            // 체크 있으면 cart-confirm 모달
            if (Modal) Modal.open('/common/components/modal/modal-cart-confirm.html', { width: '400px' });
        });
    }
};
