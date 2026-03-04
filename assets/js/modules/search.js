import { SearchUtil } from './search-util.js';

export const Search = {
    init() {
        const searchBox = document.querySelector('.search-box');
        if (!searchBox) return;

        const input = searchBox.querySelector('.search-input');
        const clearBtn = searchBox.querySelector('.btn-clear');
        const dropdown = searchBox.querySelector('.search-dropdown');
        const defaultView = searchBox.querySelector('.search-default-view');
        const autocompleteView = searchBox.querySelector('.search-autocomplete-view');

        // UI 상태 업데이트 공통 유틸 적용
        const updateView = SearchUtil.bindInput(input, clearBtn, defaultView, autocompleteView);

        const showDropdown = () => {
            // 브랜드관 및 카테고리 레이어 닫기
            const Eclub = window.Eclub;
            if (Eclub) {
                if (Eclub.HeaderBrand && Eclub.HeaderBrand.close) Eclub.HeaderBrand.close();
                if (Eclub.HeaderCategory && Eclub.HeaderCategory.close) Eclub.HeaderCategory.close();
            }

            if (dropdown) dropdown.style.display = 'block';
            if (updateView) updateView();
        };

        const hideDropdown = () => {
            if (dropdown) dropdown.style.display = 'none';
        };

        this.showDropdown = showDropdown;
        this.hideDropdown = hideDropdown;

        // 추가 이벤트 바인딩
        if (input) {
            input.addEventListener('focus', this.showDropdown);
            input.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showDropdown();
            });
        }

        // 외부 클릭 시 드롭다운 닫기
        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target)) {
                hideDropdown();
            }
        });

        // 드롭다운 내부 클릭 시 전파 방지 (닫힘 방지)
        if (dropdown) {
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // 최근 검색어 관리 공통 유틸 적용
        SearchUtil.bindRecentSearch(searchBox);
    }
};
