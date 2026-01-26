/**
 * Favorite (Wishlist) Button Logic
 * 즐겨찾기(찜) 토글 기능 및 아이콘 상태 전환
 */
const favorites = (() => {
    const init = () => {
        // 이벤트 위임 방식으로 처리 (동적 요소 대응)
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-wish');

            // .btn-wish 요소가 아니면 무시
            if (!btn) return;

            e.preventDefault();
            // e.stopPropagation(); // 전역 이벤트를 위해 전파 차단 해제
            toggle(btn);
        });
    };

    /**
     * 토글 상태 처리
     * @param {HTMLElement} btn - 클릭된 버튼 요소
     */
    const toggle = (btn) => {
        const icon = btn.querySelector('i');
        const isActive = btn.classList.contains('active');
        let message = "";

        if (isActive) {
            // 찜 해제
            btn.classList.remove('active');
            if (icon) {
                icon.classList.remove('icon-heart-fill');
                icon.classList.add('icon-heart');
            }
            message = "관심상품에서 해제되었습니다.";
        } else {
            // 찜 등록
            btn.classList.add('active');
            if (icon) {
                icon.classList.remove('icon-heart');
                icon.classList.add('icon-heart-fill');
            }
            message = "관심상품에 저장되었습니다.";
        }

        // 전역 토스트 연동
        if (typeof Toast !== 'undefined') {
            Toast.show({
                message: message,
                trigger: btn,
                type: 'success'
            });
        }
    };

    return { init };
})();

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', favorites.init);
