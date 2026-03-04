export const CategoryFilter = {
    init() {
        document.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.category-tabs button[data-tab]');
            if (!targetBtn) return;

            const category = targetBtn.dataset.tab;
            const tabListWrapper = targetBtn.closest('.category-tabs-wrap');
            const tabContainer = targetBtn.closest('.category-tabs');

            if (tabContainer) {
                const currentActive = tabContainer.querySelector('li.active');
                if (currentActive) currentActive.classList.remove('active');
                targetBtn.parentElement.classList.add('active');
            }

            if (tabListWrapper) {
                // 상품 선택 초기화
                const Eclub = window.Eclub;
                if (Eclub && Eclub.Selection) {
                    Eclub.Selection.resetCategorySelection();
                }

                // 현재 섹션 안에서 대상 상품 리스트 찾기
                const currentSection = targetBtn.closest('.home-section');
                if (!currentSection) return;

                const productLists = currentSection.querySelectorAll('.product-list');
                const activePeriodBtn = currentSection.querySelector('.period-tabs button[data-tab-trigger].active');
                const hasPeriodTabs = !!currentSection.querySelector('.period-tabs');
                const activePeriodTarget = activePeriodBtn ? activePeriodBtn.dataset.tabTarget : null;

                productLists.forEach(productList => {
                    // 기간 탭이 없는 섹션이거나, 기간 탭이 있다면 현재 활성화된 리스트인 경우에만 처리
                    const isCurrentActiveList = !hasPeriodTabs || (productList.id === activePeriodTarget);

                    if (isCurrentActiveList) {
                        productList.classList.add('is-fading');
                        productList.classList.add('active'); // 활성 상태 명시적으로 설정

                        setTimeout(() => {
                            const items = productList.querySelectorAll('.product-item');
                            items.forEach((item, idx) => {
                                const itemCategory = item.dataset.category || '';
                                const categories = itemCategory.split(/\s+/);
                                let isMatch = (category === 'all' || categories.includes(category));

                                item.style.display = isMatch ? '' : 'none';
                            });

                            // 더보기 초기화 (is-more인 경우 페이징 재정렬)
                            if (productList.classList.contains('is-more') && Eclub && Eclub.ProductMore) {
                                Eclub.ProductMore.resetByCategory(productList);
                            }

                            requestAnimationFrame(() => {
                                productList.classList.remove('is-fading');
                            });
                        }, (Eclub && Eclub.Const && Eclub.Const.ANIMATION_DURATION) ? Eclub.Const.ANIMATION_DURATION : 300);
                    } else {
                        productList.classList.remove('active'); // 비활성 리스트 숨기기
                    }
                });
            }
        });
    }
};
