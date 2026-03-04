import { Const } from './constants.js';
import { Toast } from './toast.js';

export const Clipboard = {
    // 복사 이벤트 바인딩
    init() {
        const copyButtons = document.querySelectorAll('.btn-copy');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const container = btn.closest('.bank-info-group') || btn.parentElement;
                const valueSpan = container.querySelector('.js-copy-value') || container.querySelector('.value');
                if (!valueSpan) return;
                const originalText = valueSpan.textContent.trim();
                const accountNumber = originalText.replace(/[^0-9\-\s]/g, '').trim();
                if (accountNumber) this.copyToClipboard(accountNumber, btn);
            });
        });
    },
    // 복사 실행
    copyToClipboard(text, trigger) {
        if (!navigator.clipboard) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                if (document.execCommand('copy')) {
                    Toast.show({ message: '계좌번호가 복사되었습니다.', trigger });
                }
            } catch (err) {
                console.error('복사 실패:', err);
            }
            document.body.removeChild(textArea);
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            Toast.show({ message: '계좌번호가 복사되었습니다.', trigger });
        }).catch(err => console.error('클립보드 복사 실패:', err));
    }
};
