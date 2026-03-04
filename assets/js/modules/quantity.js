import { Toast } from './toast.js';

export const Quantity = {
    init() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.qty-box button, .qty-control button');
            if (!btn) return;
            const qtyBox = btn.closest('.qty-box, .qty-control');
            const input = qtyBox?.querySelector('input');
            const buttons = qtyBox?.querySelectorAll('button');
            if (!input || buttons.length < 2) return;
            e.preventDefault();
            let currentVal = parseInt(input.value, 10) || 0;
            const minVal = input.hasAttribute('min') ? parseInt(input.getAttribute('min'), 10) : 0;

            if (btn === buttons[0]) {
                if (currentVal > minVal) {
                    input.value = currentVal - 1;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    const resolvedTrigger = qtyBox.closest('.product-item')?.querySelector('.image-box') || qtyBox;
                    Toast.show({
                        message: `최소 수량은 ${minVal} 입니다.`,
                        trigger: resolvedTrigger,
                        type: 'error',
                        position: btn.dataset.toastPosition || (resolvedTrigger.classList.contains('image-box') ? 'bottom-center' : 'bottom-right')
                    });
                }
            } else if (btn === buttons[1]) {
                input.value = currentVal + 1;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        document.addEventListener('input', (e) => {
            const input = e.target;
            if (!input.closest('.qty-box, .qty-control')) return;
            input.value = input.value.replace(/[^0-9]/g, '');
            const val = parseInt(input.value, 10);
            if (!isNaN(val) && val < 0) input.value = 0;
        });
    }
};
