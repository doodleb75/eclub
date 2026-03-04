import { DataLoader } from './data-loader.js';
import { CategoryRenderUtil } from './category-render.js';
import { OverlayManager } from './overlay.js';

export const MobileCategorySheet = {
    init() {
        this.sheet = document.getElementById('category-sheet');
        this.overlay = document.getElementById('category-sheet-overlay');

        if (!this.sheet || !this.overlay) return;

        this.depth1List = this.sheet.querySelector('.depth1-list');
        this.depth2List = this.sheet.querySelector('.depth2-list');
        this.closeBtn = this.sheet.querySelector('.btn-sheet-close');

        // 데이터 로드
        this.loadMenu();

        // 트리거 위임 (공통 클래스 대응)
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.js-category-sheet-trigger');
            if (trigger) {
                e.preventDefault();
                this.open();
            }
        });

        // 닫기 버튼
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // 오버레이 클릭 시 닫기
        this.overlay.addEventListener('click', () => this.close());

        // depth1 클릭 시 depth2 갱신
        this.depth1List.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li) {
                e.preventDefault();
                this.updateDepth2(li.dataset.id);
            }
        });
    },

    async loadMenu() {
        this.menuData = await DataLoader.getCategoryMenu();
        if (this.menuData) {
            CategoryRenderUtil.renderDepth1(this.menuData, this.depth1List);
            // 첫 번째 카테고리 활성화
            if (this.menuData.length > 0) {
                this.updateDepth2(this.menuData[0].id);
            }
        } else {
            console.error('모바일 카테고리 메뉴 로드 실패');
        }
    },

    updateDepth2(id) {
        CategoryRenderUtil.updateDepth2(id, this.menuData, this.depth1List, this.depth2List);
    },

    open() {
        OverlayManager.open(this.sheet, this.overlay);
    },

    close() {
        OverlayManager.close(this.sheet, this.overlay);
    }
};
