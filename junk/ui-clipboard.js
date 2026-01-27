// UI 클립보드 복사 컴포넌트
const uiClipboard = (() => {
    const init = () => {
        const copyButtons = document.querySelectorAll('.btn-copy');

        copyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 부모 컨테이너 내의 .value 요소 찾기
                const container = btn.closest('.bank-info-group') || btn.parentElement;
                const valueSpan = container.querySelector('.js-copy-value') || container.querySelector('.value');

                if (!valueSpan) return;

                const originalText = valueSpan.textContent.trim();
                // 계좌번호 패턴(숫자, 공백, 하이픈)만 추출
                const accountNumber = originalText.replace(/[^0-9\-\s]/g, '').trim();

                if (accountNumber) {
                    copyToClipboard(accountNumber, btn); // 버튼 요소를 트리거로 전달
                }
            });
        });
    };

    // 클립보드 복사 실행
    const copyToClipboard = (text, trigger) => {
        if (!navigator.clipboard) {
            // 구형 브라우저 대응용 임시 textarea 생성
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed"; // 화면에 안보이게 처리
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showToast('계좌번호가 복사되었습니다.', trigger);
                }
            } catch (err) {
                console.error('Fallback 복사 실패:', err);
            }

            document.body.removeChild(textArea);
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showToast('계좌번호가 복사되었습니다.', trigger);
        }).catch(err => {
            console.error('클립보드 복사 실패:', err);
        });
    };

    // 토스트 노출 (Toast가 정의되어 있지 않으면 alert으로 대체)
    const showToast = (message, trigger) => {
        if (typeof Toast !== 'undefined') {
            Toast.show({ message, trigger });
        } else {
            alert(message);
        }
    };

    return { init };
})();

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', uiClipboard.init);
