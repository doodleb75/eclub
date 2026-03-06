import { DataLoader } from './data-loader.js';
import { Toggle } from './toggle.js';

export const CategoryMenu = {
    async init() {
        const sidebar = document.querySelector('.category-sidebar, .exhibition-sidebar');
        if (!sidebar) return;

        this.sidebar = sidebar;
        
        // 메뉴가 비어있거나 사이드바 메뉴가 없으면 데이터 로드하여 렌더링
        if (this.sidebar.children.length === 0 || (!this.sidebar.querySelector('.sidebar-menu') && !this.sidebar.classList.contains('no-render'))) {
            this.menuData = await DataLoader.getCategoryMenu();
            if (this.menuData) {
                this.render(this.menuData);
            } else {
                console.error('카테고리 메뉴 데이터를 불러오지 못했습니다.');
            }
        }

        // 이벤트 위임 (1Depth 토글 및 서브메뉴 활성화)
        this.sidebar.addEventListener('click', (e) => {
            const header = e.target.closest('.sidebar-menu > li.has-sub > a');
            const subLink = e.target.closest('.sub-menu a');

            // 1Depth 토글 및 활성화
            if (header) {
                e.preventDefault();
                const parent = header.parentElement;
                const subMenu = parent.querySelector('.sub-menu');

                if (subMenu) {
                    const isOpen = parent.classList.contains('is-open');

                    // 타 메뉴 닫기
                    const otherOpenMenus = this.sidebar.querySelectorAll('.sidebar-menu > li.has-sub.is-open');
                    otherOpenMenus.forEach(menu => {
                        if (menu !== parent) {
                            const otherSub = menu.querySelector('.sub-menu');
                            menu.classList.remove('is-open');
                            if (otherSub) Toggle.slideUp(otherSub);
                        }
                    });

                    // 현재 메뉴 토글
                    if (isOpen) {
                        parent.classList.remove('is-open');
                        Toggle.slideUp(subMenu);
                    } else {
                        parent.classList.add('is-open');
                        Toggle.slideDown(subMenu);
                    }
                } else {
                    // 서브메뉴가 없는 경우 (예: 기획전) active 토글
                    const isActive = header.classList.contains('active');

                    // 기존 active 초기화
                    const allLinks = this.sidebar.querySelectorAll('.sidebar-menu a');
                    allLinks.forEach(link => link.classList.remove('active', 'active-header'));

                    // 토글 (이미 active면 해제, 아니면 적용)
                    if (!isActive) {
                        header.classList.add('active');
                    }
                }
                return;
            }

            // 서브메뉴 활성화
            if (subLink) {
                // active 상태 초기화
                const allLinks = this.sidebar.querySelectorAll('a');
                allLinks.forEach(link => link.classList.remove('active', 'active-header'));

                // 클릭한 서브메뉴 활성화
                subLink.classList.add('active');

                // 부모 헤더 강조
                const parentLi = subLink.closest('.has-sub');
                if (parentLi) {
                    const parentHeader = parentLi.querySelector(':scope > a');
                    if (parentHeader) parentHeader.classList.add('active-header');
                }
                return;
            }

            // 마이페이지 메뉴 active 토글
            const menuLink = e.target.closest('.menu-link');
            if (menuLink) {
                const href = menuLink.getAttribute('href');
                if (!href || href === 'javascript:void(0);') {
                    e.preventDefault();
                }

                const isActive = menuLink.classList.contains('active');

                // 기존 active 초기화
                const allMenuLinks = this.sidebar.querySelectorAll('.menu-link');
                allMenuLinks.forEach(link => link.classList.remove('active'));

                // 토글 (이미 active면 해제, 아니면 적용)
                if (!isActive) {
                    menuLink.classList.add('active');
                }
            }
        });
    },

    render(data) {
        let html = '<ul class="sidebar-menu">';
        data.forEach(item => {
            const hasSub = item.hasSub ? 'has-sub' : '';
            const activeClass = item.active ? 'active' : '';
            const headerActiveClass = item.active && item.hasSub ? 'active-header' : '';

            html += `
                <li class="${hasSub} ${item.active && item.hasSub ? 'is-open' : ''}">
                    <a href="${item.link}" class="${activeClass} ${headerActiveClass}">
                        ${item.name}
                        ${item.hasSub ? '<i class="icon-toggle"></i>' : ''}
                    </a>
                    ${item.hasSub ? `
                        <ul class="sub-menu" style="${item.active ? 'display: block;' : 'display: none;'}">
                            ${item.subMenu.map(sub => `
                                <li><a href="${sub.link}" class="${sub.active ? 'active' : ''}">${sub.name}</a></li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </li>
            `;
        });
        html += '</ul>';
        this.sidebar.innerHTML = html;
    }
};
