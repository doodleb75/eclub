import { DataLoader } from './data-loader.js';
import { CategoryRenderUtil } from './category-render.js';

export const HeaderCategory = {
    init() {
        const navLeft = document.querySelector('.header-nav .nav-left');
        if (!navLeft) return;

        this.container = navLeft.querySelector('.category-menu-layer');
        this.toggleBtn = navLeft.querySelector('.category-toggle');
        if (!this.container || !this.toggleBtn) return;

        this.depth1List = this.container.querySelector('.depth1-list');
        this.depth2List = this.container.querySelector('.depth2-list');

        // 데이터 로드 및 렌더링
        this.loadMenu();

        // 토글 버튼 클릭
        this.toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target) && !this.toggleBtn.contains(e.target)) {
                this.close();
            }
        });

        // 드롭다운 내부 클릭 시 전파 방지
        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Depth1 마우스 오버 시 Depth2 갱신
        this.depth1List.addEventListener('mouseover', (e) => {
            const item = e.target.closest('li');
            if (item) this.updateDepth2(item.dataset.id);
        });
    },

    async loadMenu() {
        this.menuData = await DataLoader.getCategoryMenu();
        if (this.menuData) {
            CategoryRenderUtil.renderDepth1(this.menuData, this.depth1List);
            // 초기값으로 첫 번째 카테고리 활성화
            if (this.menuData.length > 0) {
                this.updateDepth2(this.menuData[0].id);
            }
        } else {
            console.error('헤더 카테고리 메뉴 로드 실패');
        }
    },

    updateDepth2(id) {
        CategoryRenderUtil.updateDepth2(id, this.menuData, this.depth1List, this.depth2List);
    },

    toggle() {
        const isOpen = this.container.style.display === 'block';
        if (isOpen) {
            this.close();
        } else {
            // 브랜드관이 열려있으면 닫기
            const Eclub = window.Eclub;
            if (Eclub && Eclub.HeaderBrand && Eclub.HeaderBrand.close) {
                Eclub.HeaderBrand.close();
            }
            this.open();
        }
    },

    open() {
        if (!this.container) return; // 엘리먼트 없으면 중단
        // 검색창 드롭다운 닫기
        const Eclub = window.Eclub;
        if (Eclub && Eclub.Search && Eclub.Search.hideDropdown) Eclub.Search.hideDropdown();

        this.container.style.display = 'block';
        if (this.toggleBtn) this.toggleBtn.classList.add('active');
    },

    close() {
        if (!this.container) return; // 엘리먼트 없으면 중단
        this.container.style.display = 'none';
        if (this.toggleBtn) this.toggleBtn.classList.remove('active');
    }
};
