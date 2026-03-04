export const InputHandler = {
    init() {
        // 숫자 전용 입력 처리
        document.addEventListener('input', (e) => {
            const input = e.target;
            const type = input.dataset.input || input.getAttribute('data-input');

            if (type === 'number') {
                input.value = input.value.replace(/[^0-9]/g, '');
            }

            if (type === 'phone') {
                let val = input.value.replace(/[^0-9]/g, '');
                if (val.length > 11) val = val.substring(0, 11);

                if (val.length <= 3) {
                    input.value = val;
                } else if (val.length <= 7) {
                    input.value = val.replace(/(\d{3})(\d{1,4})/, '$1 $2');
                } else {
                    input.value = val.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1 $2 $3');
                }
            }
        });

        // 숫자 입력 제어
        document.addEventListener('keydown', (e) => {
            const input = e.target;
            const type = input.dataset.input || input.getAttribute('data-input');
            if (type === 'number' || type === 'phone') {
                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                if (allowedKeys.includes(e.key)) return;

                if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;

                if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                }
            }
        });
    }
};
