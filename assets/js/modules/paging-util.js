export const PagingUtil = {
    // 공통 가시 요소 조회 (숨김 없는 요소 기준)
    getVisibleItems(container, selector) {
        if (!container) return [];
        return Array.from(container.querySelectorAll(selector)).filter(item => {
            const style = window.getComputedStyle(item);
            return style.display !== 'none' || item.hasAttribute('data-hidden-by-more');
        });
    },

    // 초기 및 재렌더링 시 페이징 적용 (닫힌 상태)
    applyPaging(container, itemSelector, limit, moreBtnClass) {
        // 이미 열림 상태(.is-open)라면 더보기 버튼만 닫기로 변경
        const isOpen = container.classList.contains('is-open');

        let allItems = Array.from(container.querySelectorAll(itemSelector));

        // 활성화 대상 (탭 전환 등으로 아예 로드되지 않은 것 외 모든 요소)
        let activeItems = allItems.filter(item => {
            const style = window.getComputedStyle(item);
            // 탭 등에 의해 명시적으로 숨겨진 경우(inline style or special class)가 아니면 활성 아이템으로 간주
            const isTabHidden = style.display === 'none' && !item.hasAttribute('data-hidden-by-more');
            return !isTabHidden;
        });

        if (activeItems.length === 0) {
            // 보이는게 없으면 버튼 숨김 처리
            const nextEl = container.nextElementSibling;
            if (nextEl && nextEl.classList.contains(moreBtnClass)) {
                nextEl.style.display = 'none';
            }
            return;
        }

        // 제한 개수를 초과하면 더보기 버튼 표시
        let moreBtnWrap = container.nextElementSibling;
        const needsBtn = activeItems.length > limit;

        if (needsBtn) {
            if (!moreBtnWrap || !moreBtnWrap.classList.contains(moreBtnClass)) {
                moreBtnWrap = document.createElement('div');
                moreBtnWrap.className = moreBtnClass;
                moreBtnWrap.innerHTML = `<button type="button" class="btn-more"><span>${isOpen ? '닫기' : '더보기'}</span><i class="${isOpen ? 'icon-chevron-up' : 'icon-chevron-down'}"></i></button>`;
                container.parentNode.insertBefore(moreBtnWrap, container.nextSibling);
            } else {
                moreBtnWrap.style.display = 'flex';
                const btnSpan = moreBtnWrap.querySelector('span');
                const btnIcon = moreBtnWrap.querySelector('i');
                if (btnSpan) btnSpan.textContent = isOpen ? '닫기' : '상품 더보기';
                if (btnIcon) btnIcon.className = isOpen ? 'icon-chevron-up' : 'icon-chevron-down';
            }
        } else {
            if (moreBtnWrap && moreBtnWrap.classList.contains(moreBtnClass)) {
                moreBtnWrap.style.display = 'none';
            }
            container.classList.remove('is-open');
        }

        // is-open 상태가 아니면 limit 이후 아이템 숨기기
        if (!container.classList.contains('is-open')) {
            activeItems.forEach((item, index) => {
                if (index >= limit) {
                    item.style.display = 'none';
                    item.dataset.hiddenByMore = 'true';
                } else {
                    item.style.display = '';
                    delete item.dataset.hiddenByMore;
                }
            });
        } else {
            activeItems.forEach(item => {
                item.style.display = '';
                delete item.dataset.hiddenByMore;
            });
        }
    },

    // 더보기 버튼 클릭 토글 동작
    toggle(container, btn, itemSelector, limit, closeText = '닫기') {
        const isOpen = container.classList.contains('is-open');
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i');

        const allItems = Array.from(container.querySelectorAll(itemSelector));
        const activeItems = allItems.filter(item => {
            const style = window.getComputedStyle(item);
            // 탭 등에 의해 명시적으로 숨겨진 경우(inline style or special class)가 아니면 활성 아이템으로 간주
            const isTabHidden = style.display === 'none' && !item.hasAttribute('data-hidden-by-more');
            return !isTabHidden;
        });

        if (isOpen) {
            // 접기 모드
            container.classList.remove('is-open');
            if (span) span.textContent = '더보기';
            if (icon) icon.className = 'icon-chevron-down';
            if (btn) btn.classList.remove('active');

            activeItems.forEach((item, index) => {
                if (index >= limit) {
                    item.style.display = 'none';
                    item.dataset.hiddenByMore = 'true';
                }
            });

            // 스크롤 탑 위치 조정 (.is-more의 위치로 이동, Sticky 헤더 대응)
            const stickyWrap = document.querySelector('.cart-sticky-wrap');
            let offset = 0;

            if (stickyWrap) {
                const style = window.getComputedStyle(stickyWrap);
                offset = parseFloat(style.top) || 0;
                offset += stickyWrap.offsetHeight;
            }

            const header = document.querySelector('header.header');
            if (header && !stickyWrap) {
                offset += header.offsetHeight;
            }

            const zoomStr = document.body.style.zoom;
            const scale = zoomStr ? parseFloat(zoomStr) / 100 : 1;
            
            const targetTop = container.getBoundingClientRect().top + window.scrollY - offset - 10;
            // 줌 스케일 고려 보정
            window.scrollTo({ top: targetTop * scale, behavior: 'smooth' });

        } else {
            // 펼치기 모드
            container.classList.add('is-open');
            if (span) span.textContent = closeText;
            if (icon) icon.className = 'icon-chevron-up';
            if (btn) btn.classList.add('active');

            activeItems.forEach(item => {
                item.style.display = '';
                delete item.dataset.hiddenByMore;
            });
        }
    }
};
