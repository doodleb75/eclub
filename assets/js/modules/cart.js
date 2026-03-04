import { Toast } from './toast.js';

export const Cart = {
    init() {
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-cart');
            if (!btn) return;

            if (btn.tagName === 'A' && btn.getAttribute('href') !== 'javascript:void(0);') return;

            e.preventDefault();
            this.add(btn);
        });
    },
    add(btn) {
        const imageBox = btn.closest('.product-item')?.querySelector('.image-box');
        const container = btn.closest('.info-actions, .action-btns');
        const resolvedTrigger = imageBox || container || btn;
        Toast.show({
            message: "장바구니에 상품이 담겼습니다.",
            trigger: resolvedTrigger,
            position: btn.dataset.toastPosition || (resolvedTrigger.classList.contains('image-box') ? 'bottom-center' : 'bottom-right'),
            type: 'success'
        });
    }
};
