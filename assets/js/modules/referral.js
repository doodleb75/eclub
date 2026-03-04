import { Toast } from './toast.js';

export const Referral = {
    init() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-referral-cta, #friend-number-send');
            if (!btn) return;

            const isEnded = btn.dataset.eventStatus === 'ended';

            const message = isEnded ? '이벤트 기간이 종료되었습니다.' : (btn.dataset.toastMessage || '추천 메세지가 발송되었습니다.');
            const position = btn.dataset.toastPosition || 'bottom-center';

            Toast.show({
                message: message,
                trigger: btn,
                position: position
            });
        });
    }
};
