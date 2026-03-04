import { Const } from './constants.js';

export const Toast = {
    container: null,
    // 컨테이너 초기화
    init() {
        if (this.container) return;
        this.container = document.querySelector('.toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }

        // 모달 내 스크롤 시 자동 숨김 처리
        window.addEventListener('scroll', (e) => {
            if (this.container) {
                if (this.container.contains(e.target)) return;

                const modalToasts = this.container.querySelectorAll('.toast-item.active.is-modal-toast');
                if (modalToasts.length > 0) {
                    modalToasts.forEach(t => {
                        t.classList.remove('active');
                        setTimeout(() => t.remove(), Const.ANIMATION_DURATION);
                    });
                }
            }
        }, true);
    },
    // 토스트 노출
    show({ message, trigger, type = 'success', duration = Const.TOAST_DURATION, position = 'bottom-center' }) {
        this.init();
        const toast = document.createElement('div');
        toast.className = `toast-item type-${type}`;

        if (trigger && trigger.closest('.modal-overlay')) {
            toast.classList.add('is-modal-toast');
        }

        toast.innerHTML = `
            <i class="toast-icon" aria-hidden="true"></i>
            <span class="toast-message">${message}</span>
        `;

        const isFixed = position.startsWith('fixed-');
        if (isFixed) {
            toast.classList.add('is-fixed');
            toast.style.position = 'fixed';
        } else {
            toast.style.position = 'absolute';
        }

        this.container.appendChild(toast);

        requestAnimationFrame(() => {
            const toastWidth = toast.offsetWidth;
            const toastHeight = toast.offsetHeight;
            const scale = Eclub.getZoomScale(); // 줌 Scale 반영
            const margin = 20;
            let left, top;

            if (isFixed) {
                // 뷰포트 기준
                const winW = window.innerWidth / scale;
                const winH = window.innerHeight / scale;

                switch (position) {
                    case 'fixed-top-left':
                        left = margin;
                        top = margin;
                        break;
                    case 'fixed-top-center':
                        left = (winW / 2) - (toastWidth / 2);
                        top = margin;
                        break;
                    case 'fixed-top-right':
                        left = winW - toastWidth - margin;
                        top = margin;
                        break;
                    case 'fixed-bottom-left':
                        left = margin;
                        top = winH - toastHeight - margin;
                        break;
                    case 'fixed-bottom-center':
                        left = (winW / 2) - (toastWidth / 2);
                        top = winH - toastHeight - margin;
                        break;
                    case 'fixed-bottom-right':
                        left = winW - toastWidth - margin;
                        top = winH - toastHeight - margin;
                        break;
                    case 'fixed-center':
                        left = (winW / 2) - (toastWidth / 2);
                        top = (winH / 2) - (toastHeight / 2);
                        break;
                    default:
                        left = (winW / 2) - (toastWidth / 2);
                        top = margin;
                }
            } else if (trigger) {
                // 트리거 기준
                const rect = trigger.getBoundingClientRect();
                const scrollX = window.scrollX / scale;
                const scrollY = window.scrollY / scale;

                // 좌표 계산 (줌 스케일 반영)
                const rectLeft = rect.left / scale;
                const rectTop = rect.top / scale;
                const rectRight = rect.right / scale;
                const rectBottom = rect.bottom / scale;
                const rectWidth = rect.width / scale;
                const rectHeight = rect.height / scale;

                const offset = 4; // 트리거 간격 조정 (썸네일 대응)

                switch (position) {
                    case 'top-left':
                        left = rectLeft + scrollX;
                        top = rectTop + scrollY - toastHeight - offset;
                        break;
                    case 'top-center':
                    case 'top':
                        left = rectLeft + scrollX + (rectWidth / 2) - (toastWidth / 2);
                        top = rectTop + scrollY - toastHeight - offset;
                        break;
                    case 'top-right':
                        left = rectRight + scrollX - toastWidth;
                        top = rectTop + scrollY - toastHeight - offset;
                        break;
                    case 'bottom-left':
                        left = rectLeft + scrollX;
                        top = rectBottom + scrollY + offset;
                        break;
                    case 'bottom-center':
                    case 'bottom':
                    case 'center':
                        left = rectLeft + scrollX + (rectWidth / 2) - (toastWidth / 2);
                        top = rectBottom + scrollY + offset;
                        break;
                    case 'bottom-right':
                    case 'right':
                        left = rectRight + scrollX - toastWidth;
                        top = rectBottom + scrollY + offset;
                        break;
                    case 'left-top':
                        left = rectLeft + scrollX - toastWidth - offset;
                        top = rectTop + scrollY;
                        break;
                    case 'left-center':
                    case 'left':
                        left = rectLeft + scrollX - toastWidth - offset;
                        top = rectTop + scrollY + (rectHeight / 2) - (toastHeight / 2);
                        break;
                    case 'left-bottom':
                        left = rectLeft + scrollX - toastWidth - offset;
                        top = rectBottom + scrollY - toastHeight;
                        break;
                    case 'right-top':
                        left = rectRight + scrollX + offset;
                        top = rectTop + scrollY;
                        break;
                    case 'right-center':
                    case 'right':
                        left = rectRight + scrollX + offset;
                        top = rectTop + scrollY + (rectHeight / 2) - (toastHeight / 2);
                        break;
                    case 'right-bottom':
                        left = rectRight + scrollX + offset;
                        top = rectBottom + scrollY - toastHeight;
                        break;
                    case 'inner-bottom-center':
                        left = rectLeft + scrollX + (rectWidth / 2) - (toastWidth / 2);
                        top = rectBottom + scrollY - toastHeight - offset;
                        break;
                    default:
                        left = rectLeft + scrollX + (rectWidth / 2) - (toastWidth / 2);
                        top = rectBottom + scrollY + offset;
                }

                // 화면 이탈 방지
                const windowWidth = window.innerWidth / scale;
                const documentHeight = document.documentElement.scrollHeight / scale;
                const safeMargin = 10;

                if (left < safeMargin) left = safeMargin;
                if (left + toastWidth > windowWidth - safeMargin) left = windowWidth - toastWidth - safeMargin;
                if (top < safeMargin + scrollY) top = safeMargin + scrollY;
                if (top + toastHeight > documentHeight - safeMargin) top = documentHeight - toastHeight - safeMargin;
            } else {
                // 기본 위치 설정
                const winW = window.innerWidth / scale;
                left = (winW / 2) - (toastWidth / 2);
                top = margin;
                toast.style.position = 'fixed';
            }

            toast.style.left = `${left}px`;
            toast.style.top = `${top}px`;
            toast.classList.add('active');
        });

        // 토스트 자동 소멸
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), Const.ANIMATION_DURATION);
        }, duration);
    }
};
