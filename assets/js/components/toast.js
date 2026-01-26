/**
 * 전역 토스트 알림 시스템
 * - Toast.show({ message, trigger, type, duration }) 형식으로 호출
 */
const Toast = (() => {
    let container = null;

    const init = () => {
        if (container) return;
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    };

    /**
     * 토스트 표시
     * @param {Object} options 
     * @param {string} options.message - 노출 메시지
     * @param {HTMLElement} options.trigger - 기준이 되는 버튼 요소
     * @param {string} [options.type='success'] - 토스트 타입 (success, error 등)
     * @param {number} [options.duration=2500] - 노출 시간 (ms)
     */
    const show = ({ message, trigger, type = 'success', duration = 2500 }) => {
        if (!container) init();

        const toast = document.createElement('div');
        toast.className = `toast-item type-${type}`;
        toast.innerHTML = `
            <i class="toast-icon" aria-hidden="true"></i>
            <span class="toast-message">${message}</span>
        `;

        toast.style.position = 'absolute';
        container.appendChild(toast);

        // 위치 계산
        if (trigger) {
            const rect = trigger.getBoundingClientRect();
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            requestAnimationFrame(() => {
                const toastWidth = toast.offsetWidth;
                let left = rect.left + scrollX - (toastWidth / 2) + (rect.width / 2);
                let top = rect.bottom + scrollY + 12; // 트리거 12px 아래

                const margin = 10;
                if (left < margin) left = margin;
                if (left + toastWidth > window.innerWidth - margin) {
                    left = window.innerWidth - toastWidth - margin;
                }

                toast.style.left = `${left}px`;
                toast.style.top = `${top}px`;
                toast.classList.add('active');
            });
        }

        // 자동 제거
        setTimeout(() => {
            toast.classList.remove('active');
            // 페이드 아웃 애니메이션 시간 대기 후 제거
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    };

    return { show };
})();
