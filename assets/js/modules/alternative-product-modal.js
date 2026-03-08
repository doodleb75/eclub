import { Slider } from './slider.js';

export const AlternativeProductModal = {
    init() {
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-replace');
            if (!btn) return;

            // 모바일 환경(바텀시트가 존재하는 경우)에서는 모달을 열지 않음
            if (document.getElementById('replace-product-sheet')) return;

            e.preventDefault();

            // 모달 열기
            const Modal = window.Modal;
            if (Modal) await Modal.open('/eclub/common/components/modal/modal-alternative-product.html', { width: '1020px' });

            // 렌더링 대기 후 슬라이더 초기화
            requestAnimationFrame(() => {
                this.populateItems();
            });
        });
    },

    // 주문 가능한 일반 product-item 수집 후 모달 슬라이더에 주입
    populateItems() {
        const list = document.querySelector('.alternative-product-list');
        if (!list) return;

        list.innerHTML = '';

        // 숨김 항목 제외, 품절/주문불가 제외, 모달 내부 상품 제외
        const items = Array.from(
            document.querySelectorAll('.product-list:not(.alternative-product-list) .product-item:not(.sold-out):not(.order-soon)')
        ).filter(item => item.style.display !== 'none');

        items.forEach(item => {
            const clone = item.cloneNode(true);
            list.appendChild(clone);
        });

        this.initSlider();
    },

    // 슬라이더 초기화 (Slider.scroll 재사용)
    initSlider() {
        const list = document.querySelector('.alternative-product-list');
        if (!list) return;

        const prevBtn = document.querySelector('.alternative-product-header .btn-slide-prev');
        const nextBtn = document.querySelector('.alternative-product-header .btn-slide-next');
        const itemsPerPage = 4;

        Slider.bindNavButtons(list, prevBtn, nextBtn);

        if (prevBtn) prevBtn.onclick = () => Slider.scroll(list, 'left', itemsPerPage);
        if (nextBtn) nextBtn.onclick = () => Slider.scroll(list, 'right', itemsPerPage);
    }
};
