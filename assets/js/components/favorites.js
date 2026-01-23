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
            e.stopPropagation();
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

        if (isActive) {
            // 찜 해제
            btn.classList.remove('active');
            if (icon) {
                // 아이콘 교체: fill -> line
                icon.classList.remove('icon-heart-fill');
                icon.classList.add('icon-heart');
            }
        } else {
            // 찜 등록
            btn.classList.add('active');
            if (icon) {
                // 아이콘 교체: line -> fill
                icon.classList.remove('icon-heart');
                icon.classList.add('icon-heart-fill');
            }
            // TODO: API 호출 또는 토스트 메시지 연동 가능
        }
    };

    return { init };
})();

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', favorites.init);
