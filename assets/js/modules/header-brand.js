import { OverlayManager } from './overlay.js';

export const HeaderBrand = {
    init() {
        this.container = document.querySelector('.brand-menu-layer');
        this.sheet = document.getElementById('brand-sheet');
        this.overlay = document.getElementById('brand-sheet-overlay');

        this.toggleBtns = document.querySelectorAll('.brand-toggle');
        if (this.toggleBtns.length === 0) return;

        this.brandList = (this.sheet || this.container)?.querySelector('.brand-list');

        // 데이터 로드 및 렌더링
        this.loadBrands();

        // 토글 버튼 클릭 (모든 .brand-toggle 버튼 대응)
        this.toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 카테고리 메뉴/시트가 열려있으면 닫기
                const Eclub = window.Eclub;
                if (Eclub) {
                    if (Eclub.HeaderCategory && typeof Eclub.HeaderCategory.close === 'function') {
                        try { Eclub.HeaderCategory.close(); } catch (e) { }
                    }
                    if (Eclub.MobileCategorySheet && typeof Eclub.MobileCategorySheet.close === 'function') {
                        try { Eclub.MobileCategorySheet.close(); } catch (e) { }
                    }
                }

                this.toggle();
            });
        });

        // 바텀시트 닫기 버튼 (모바일)
        const closeBtn = this.sheet?.querySelector('.btn-sheet-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // 오버레이 클릭 시 닫기 (모바일)
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }

        // 외부 클릭 시 닫기 (PC용)
        document.addEventListener('click', (e) => {
            if (this.container && this.container.style.display === 'block') {
                const isToggleBtn = Array.from(this.toggleBtns).some(btn => btn.contains(e.target));
                if (!this.container.contains(e.target) && !isToggleBtn) {
                    this.close();
                }
            }
        });

        // 드롭다운 내부 클릭 시 전파 방지
        this.container?.addEventListener('click', (e) => e.stopPropagation());
        this.sheet?.addEventListener('click', (e) => e.stopPropagation());
    },

    async loadBrands() {
        try {
            const response = await fetch('/eclub/assets/data/brand-list.json');
            if (!response.ok) throw new Error('Network response was not ok');
            this.brandData = await response.json();
            this.render();
        } catch (err) {
            console.error('브랜드 리스트 로드 실패:', err);
        }
    },

    render() {
        if (!this.brandList || !this.brandData) return;
        const isMobile = !!this.sheet; // 시트가 존재하면 모바일 환경
        const basePath = isMobile ? '/mobile' : '/pc';

        this.brandList.innerHTML = this.brandData.map(item => `
            <li>
                <a href="${basePath}/pages/brand.html?id=${item.id}">
                    <div class="thumb">
                        <img src="/eclub/assets/icons/brand/${item.logo}" alt="${item.name}">
                    </div>
                    <span class="name">${item.name}</span>
                </a>
            </li>
        `).join('');
    },

    toggle() {
        const isOpen = this.sheet
            ? this.sheet.classList.contains('is-open')
            : (this.container?.style.display === 'block');

        if (isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        const Eclub = window.Eclub;
        if (Eclub && Eclub.Search && Eclub.Search.hideDropdown) Eclub.Search.hideDropdown();

        if (this.sheet) {
            OverlayManager.open(this.sheet, this.overlay);
        } else if (this.container) {
            this.container.style.display = 'block';
        }

        this.toggleBtns.forEach(btn => btn.classList.add('active'));
    },

    close() {
        if (this.sheet) {
            OverlayManager.close(this.sheet, this.overlay);
        } else if (this.container) {
            this.container.style.display = 'none';
        }

        this.toggleBtns.forEach(btn => btn.classList.remove('active'));
    }
};
