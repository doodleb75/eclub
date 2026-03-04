import { SearchUtil } from './search-util.js';
import { OverlayManager } from './overlay.js';

export const SearchOverlay = {
    init() {
        // 기본 헤더의 검색창과 검색 결과 페이지의 헤더 검색창을 모두 선택
        const triggerInputs = document.querySelectorAll('.header .input-search, header.header .input-search-overlay, .btn-search-trigger');
        const searchOverlay = document.getElementById('search-overlay');

        if (!searchOverlay) return;

        // 오버레이 내부 요소를 명확하게 한정하여 선택
        const overlayCloseBtn = searchOverlay.querySelector('.btn-close-overlay');
        const overlaySearchInput = searchOverlay.querySelector('.input-search-overlay');
        const overlayDefaultView = searchOverlay.querySelector('.search-default-view');
        const overlayAutocompleteView = searchOverlay.querySelector('.search-autocomplete-view');
        const clearBtn = searchOverlay.querySelector('.btn-clear');

        // 오버레이 열기
        triggerInputs.forEach(input => {
            input.addEventListener('click', (e) => {
                e.preventDefault();
                OverlayManager.open(searchOverlay);

                // 만약 검색결과 페이지에서 클릭한 경우 기존 검색어 유지
                if (input.classList.contains('input-search-overlay') && overlaySearchInput) {
                    overlaySearchInput.value = input.value;
                    overlaySearchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }

                if (overlaySearchInput) overlaySearchInput.focus();
            });
        });

        // 오버레이 닫기
        if (overlayCloseBtn) {
            overlayCloseBtn.addEventListener('click', () => {
                OverlayManager.close(searchOverlay);
            });
        }

        // 입력값 상태 제어 및 최근 검색어 관리 공통화
        SearchUtil.bindInput(overlaySearchInput, clearBtn, overlayDefaultView, overlayAutocompleteView);
        SearchUtil.bindRecentSearch(searchOverlay);
    }
};
