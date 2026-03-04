import { Toast } from './toast.js';

export const Favorites = {
    init() {
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-wish, .btn-heart, .btn-heart-overlay');
            if (!btn) return;
            e.preventDefault();
            this.toggle(btn);
        });
    },
    toggle(btn) {
        const icon = btn.querySelector('i');
        const isActive = btn.classList.contains('active');
        let message = "";
        if (isActive) {
            btn.classList.remove('active');
            if (icon) {
                if (icon.classList.contains('icon-heart-fill')) {
                    icon.classList.remove('icon-heart-fill');

                    if (btn.classList.contains('btn-heart') || btn.classList.contains('btn-heart-overlay')) {
                        icon.classList.add('icon-heart-main');
                    } else {
                        icon.classList.add('icon-heart');
                    }
                }
            }
            message = "관심상품에서 해제되었습니다.";
        } else {
            btn.classList.add('active');
            if (icon) {
                if (icon.classList.contains('icon-heart')) {
                    icon.classList.remove('icon-heart');
                    icon.classList.add('icon-heart-fill');
                } else if (icon.classList.contains('icon-heart-main')) {
                    icon.classList.remove('icon-heart-main');
                    icon.classList.add('icon-heart-fill');
                }
            }
            message = "관심상품에 저장되었습니다.";
        }
        const imageBox = btn.closest('.product-item')?.querySelector('.image-box');
        const container = btn.closest('.info-actions, .action-btns');
        const resolvedTrigger = imageBox || container || btn;
        Toast.show({
            message,
            trigger: resolvedTrigger,
            position: btn.dataset.toastPosition || (resolvedTrigger.classList.contains('image-box') ? 'bottom-center' : 'bottom-right'),
            type: 'success'
        });
    }
};
