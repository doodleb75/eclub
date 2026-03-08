import { Slider } from './slider.js';

export const AddCartModal = {
    init() {
        if (this.initialized) return; this.initialized = true;
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-add-cart');
            if (!btn) return;
            e.preventDefault();

            // 체크된 product-item 수집 (품절/주문불가 제외 및 숨김 항목 제외, 모달 내부 상품 제외)
            const checkedInputs = Array.from(document.querySelectorAll('.product-list:not(.add-cart-list) .product-item:not(.sold-out):not(.order-soon)'))
                .filter(item => item.style.display !== 'none' && item.querySelector('.item-check input[type="checkbox"]:checked'))
                .map(item => item.querySelector('.item-check input[type="checkbox"]:checked'));
            const checked = checkedInputs.filter(Boolean);

            if (checked.length === 0) {
                const Modal = window.Modal;
                if (Modal) Modal.open('/common/components/modal/modal-alert.html', { width: '400px' });
                return;
            }

            // 모달 열기 (await로 fetch 완료 대기)
            const Modal = window.Modal;
            if (Modal) await Modal.open('/common/components/modal/modal-add-cart.html', { width: '1020px' });

            // DOM 렌더링 대기 후 슬라이더 초기화
            requestAnimationFrame(() => {
                this.populateItems(checked);
            });
        });
    },

    // 체크된 아이템을 모달 슬라이더에 주입
    populateItems(checkedInputs) {
        const list = document.querySelector('.add-cart-list');
        if (!list) return;

        list.innerHTML = ''; // 기존 복제된 자식들 지우기

        checkedInputs.forEach(input => {
            const item = input.closest('.product-item');
            if (!item) return;
            const clone = item.cloneNode(true);
            // sold-out, order-soon 상태 유지
            list.appendChild(clone);
        });

        this.initSlider();
    },

    // 슬라이더 초기화 (Slider.scroll 재사용)
    initSlider() {
        const list = document.querySelector('.add-cart-list');
        if (!list) return;

        const prevBtn = document.querySelector('.add-cart-header .btn-slide-prev');
        const nextBtn = document.querySelector('.add-cart-header .btn-slide-next');
        const itemsPerPage = 4;

        Slider.bindNavButtons(list, prevBtn, nextBtn);

        if (prevBtn) prevBtn.onclick = () => Slider.scroll(list, 'left', itemsPerPage);
        if (nextBtn) nextBtn.onclick = () => Slider.scroll(list, 'right', itemsPerPage);
    }
};
