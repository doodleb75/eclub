import { Const } from './constants.js';

export const Slider = {
    init() {
        // 상품 슬라이더
        const productSliders = document.querySelectorAll('.list-slider');
        productSliders.forEach(list => this.initProductSlider(list));

        // 메인 슬라이더
        const mainSliders = document.querySelectorAll('.main-visual .slider-wrapper');
        mainSliders.forEach(list => this.initMainSlider(list));
    },

    // 상품 슬라이더 초기화 (5개 단위)
    initProductSlider(list) {
        const section = list.closest('.home-container');
        if (!section) return;
        const controls = section.querySelector('.pagination-controls');
        if (!controls) return;

        const prevBtn = controls.querySelector('.prev');
        const nextBtn = controls.querySelector('.next');
        const currentEl = controls.querySelector('.current');
        const totalEl = controls.querySelector('.total');

        const itemsPerPage = 5;
        const itemSelector = '.product-item';

        const updateState = () => {
            const itemsCount = list.querySelectorAll(itemSelector).length;
            const totalPages = Math.ceil(itemsCount / itemsPerPage) || 1;

            if (totalEl) {
                totalEl.innerText = totalEl.innerText.trim().startsWith('/') ? `/ ${totalPages}` : totalPages;
            }
            this.updatePagination(list, currentEl, totalPages, prevBtn, nextBtn, itemsPerPage);
        };

        updateState();
        const observer = new MutationObserver(updateState);
        observer.observe(list, { childList: true, subtree: true });

        list.addEventListener('scroll', () => {
            const itemsCount = list.querySelectorAll(itemSelector).length;
            const totalPages = Math.ceil(itemsCount / itemsPerPage) || 1;
            this.updatePagination(list, currentEl, totalPages, prevBtn, nextBtn, itemsPerPage);
        });

        if (prevBtn) prevBtn.onclick = () => this.scroll(list, 'left', itemsPerPage);
        if (nextBtn) nextBtn.onclick = () => this.scroll(list, 'right', itemsPerPage);
    },

    // 메인 슬라이더 초기화
    initMainSlider(list) {
        const section = list.closest('.main-visual');
        if (!section) return;

        const prevBtn = section.querySelector('.btn-prev');
        const nextBtn = section.querySelector('.btn-next');
        const currentEl = section.querySelector('.count-box .current');
        const totalEl = section.querySelector('.count-box .total');
        const dotsContainer = section.querySelector('.pagination-dots');
        const btnPause = (section.querySelector('.icon-mo-pause') || section.querySelector('.icon-main-pause'))?.closest('button');

        const itemSelector = '.slide-item';
        const originalItems = Array.from(list.querySelectorAll(itemSelector));
        const itemsCount = originalItems.length;
        if (itemsCount === 0) return;

        // 클론 생성 (3개 고정)
        const clonesCount = 3;
        let itemsPerPage = 1;
        let pageIndices = [];
        let totalPages = 0;
        let uniquePageIndices = [];

        const updateLayout = () => {
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            itemsPerPage = isMobile ? 1 : 3;

            pageIndices = [];
            for (let i = 0; i < itemsCount; i += itemsPerPage) {
                if (i + itemsPerPage > itemsCount) {
                    pageIndices.push(itemsCount - itemsPerPage);
                } else {
                    pageIndices.push(i);
                }
            }
            uniquePageIndices = [...new Set(pageIndices)];
            totalPages = uniquePageIndices.length;
            return uniquePageIndices;
        };

        updateLayout();

        // Pagination 초기화
        if (totalEl) totalEl.innerText = itemsCount < 10 ? `0${itemsCount}` : itemsCount;
        const drawDots = () => {
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                originalItems.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.type = 'button';
                    dot.className = 'dot';
                    dot.setAttribute('aria-label', `${i + 1}번 아이템`);
                    dot.onclick = () => {
                        const pageIdx = uniquePageIndices.findIndex(startIdx => i >= startIdx && i < startIdx + itemsPerPage);
                        if (pageIdx !== -1) goToPage(pageIdx);
                        resetAuto();
                    };
                    dotsContainer.appendChild(dot);
                });
            }
        };
        drawDots();

        // 클론 생성
        const frontClones = [];
        for (let i = 0; i < clonesCount; i++) {
            const idx = (itemsCount - 1 - i + itemsCount) % itemsCount;
            frontClones.unshift(originalItems[idx].cloneNode(true));
        }

        const backClones = [];
        for (let i = 0; i < clonesCount; i++) {
            backClones.push(originalItems[i % itemsCount].cloneNode(true));
        }

        frontClones.forEach(el => el.classList.add('is-clone'));
        backClones.forEach(el => el.classList.add('is-clone'));

        frontClones.forEach(el => list.insertBefore(el, list.firstChild));
        backClones.forEach(el => list.appendChild(el));

        let currentPageIdx = 0;
        let isTransitioning = false;
        let autoTimer = null;
        let isPaused = false;

        const getTranslateX = (itemIdxInWrapper) => {
            const style = window.getComputedStyle(list);
            const gap = parseFloat(style.gap) || 0;

            // 뷰포트 기준 이동 거리 계산
            const container = list.parentElement;
            const containerWidth = parseFloat(window.getComputedStyle(container).width);

            const step = (containerWidth + gap) / itemsPerPage;
            return -(itemIdxInWrapper * step);
        };

        const updateUI = () => {
            const realStartIdx = uniquePageIndices[currentPageIdx];
            const lastVisibleIdx = Math.min(realStartIdx + itemsPerPage, itemsCount);
            if (currentEl) {
                currentEl.innerText = lastVisibleIdx < 10 ? `0${lastVisibleIdx}` : lastVisibleIdx;
            }
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.dot');
                const isLastPage = currentPageIdx === uniquePageIndices.length - 1;
                const remainder = itemsCount % itemsPerPage;

                let activeStart = realStartIdx;
                let activeCount = itemsPerPage;

                if (isLastPage && remainder > 0) {
                    activeStart = itemsCount - remainder;
                    activeCount = remainder;
                }

                dots.forEach((dot, idx) => {
                    const isActive = idx >= activeStart && idx < activeStart + activeCount;
                    dot.classList.toggle('active', isActive);
                });
            }
        };

        const unlockTransition = () => {
            isTransitioning = false;
        };

        const goToPage = (pageIdx, animated = true) => {
            if (isTransitioning && animated) return;
            isTransitioning = true;
            currentPageIdx = pageIdx;

            // 클론 Offset 적용
            const wrapperIdx = uniquePageIndices[currentPageIdx] + clonesCount;
            const tx = getTranslateX(wrapperIdx);

            // Transition 강제
            list.style.transition = animated ? `transform ${Const.ANIMATION_DURATION}ms ease-in-out` : 'none';
            list.style.transform = `translateX(${tx}px)`;

            updateUI();

            if (animated) {
                const transitionEndHandler = () => {
                    list.removeEventListener('transitionend', transitionEndHandler);
                    unlockTransition();
                };
                list.addEventListener('transitionend', transitionEndHandler, { once: true });

                // 해제 보장 (Timeout)
                setTimeout(() => {
                    if (isTransitioning) {
                        list.removeEventListener('transitionend', transitionEndHandler);
                        unlockTransition();
                    }
                }, Const.ANIMATION_DURATION + 100);
            } else {
                setTimeout(unlockTransition, 10);
            }
        };

        const next = () => {
            if (isTransitioning) return;

            if (currentPageIdx >= totalPages - 1) {
                isTransitioning = true;
                // Last Page -> First Page 이동
                const wrapperIdx = clonesCount + itemsCount;
                const tx = getTranslateX(wrapperIdx);

                list.style.transition = `transform ${Const.ANIMATION_DURATION}ms ease-in-out`;
                list.style.transform = `translateX(${tx}px)`;

                const transitionEndHandler = () => {
                    list.removeEventListener('transitionend', transitionEndHandler);
                    currentPageIdx = 0;
                    goToPage(0, false);
                };

                list.addEventListener('transitionend', transitionEndHandler, { once: true });

                setTimeout(() => {
                    if (isTransitioning) {
                        list.removeEventListener('transitionend', transitionEndHandler);
                        currentPageIdx = 0;
                        goToPage(0, false);
                    }
                }, Const.ANIMATION_DURATION + 100);

            } else {
                goToPage(currentPageIdx + 1);
            }
        };

        const prev = () => {
            if (isTransitioning) return;

            if (currentPageIdx <= 0) {
                isTransitioning = true;
                // First Page -> Last Page 이동
                const wrapperIdx = clonesCount - itemsPerPage;
                const tx = getTranslateX(wrapperIdx);

                list.style.transition = `transform ${Const.ANIMATION_DURATION}ms ease-in-out`;
                list.style.transform = `translateX(${tx}px)`;

                const transitionEndHandler = () => {
                    list.removeEventListener('transitionend', transitionEndHandler);
                    currentPageIdx = totalPages - 1;
                    goToPage(totalPages - 1, false);
                };

                list.addEventListener('transitionend', transitionEndHandler, { once: true });

                setTimeout(() => {
                    if (isTransitioning) {
                        list.removeEventListener('transitionend', transitionEndHandler);
                        currentPageIdx = totalPages - 1;
                        goToPage(totalPages - 1, false);
                    }
                }, Const.ANIMATION_DURATION + 100);

            } else {
                goToPage(currentPageIdx - 1);
            }
        };

        const startAuto = () => {
            if (isPaused || autoTimer) return;
            autoTimer = setInterval(next, Const.SLIDER_AUTO_INTERVAL);
        };

        const stopAuto = () => {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        };

        const resetAuto = () => {
            stopAuto();
            startAuto();
        };

        if (btnPause) {
            // 아이콘 클래스 구분
            const isMoPause = !!btnPause.querySelector('.icon-mo-pause');
            const pauseClass = isMoPause ? 'icon-mo-pause' : 'icon-main-pause';
            const playClass = isMoPause ? 'icon-mo-play' : 'icon-main-play';
            btnPause.onclick = () => {
                const icon = btnPause.querySelector('i');
                if (isPaused) {
                    isPaused = false;
                    icon.className = pauseClass;
                    startAuto();
                } else {
                    isPaused = true;
                    icon.className = playClass;
                    stopAuto();
                }
            };
        }

        if (prevBtn) prevBtn.onclick = () => { prev(); resetAuto(); };
        if (nextBtn) nextBtn.onclick = () => { next(); resetAuto(); };

        list.addEventListener('mouseenter', stopAuto);
        list.addEventListener('mouseleave', () => !isPaused && startAuto());

        // 스와이프 기능
        let startX = 0;
        let dragDiff = 0;
        let isDragging = false;
        let isSwiped = false;
        let initialTx = 0;

        const onDragStart = (e) => {
            // Mobile 전용 드래그 활성화
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            if (!isMobile || isTransitioning) return;

            isDragging = true;
            isSwiped = false;
            startX = (e.type.includes('touch')) ? e.touches[0].pageX : e.pageX;
            dragDiff = 0;

            const wrapperIdx = uniquePageIndices[currentPageIdx] + clonesCount;
            initialTx = getTranslateX(wrapperIdx);

            list.style.transition = 'none';
            stopAuto();

            window.addEventListener('mousemove', onDragMove, { passive: false });
            window.addEventListener('touchmove', onDragMove, { passive: false });
            window.addEventListener('mouseup', onDragEnd);
            window.addEventListener('touchend', onDragEnd);
        };

        const onDragMove = (e) => {
            if (!isDragging) return;
            const currentX = (e.type.includes('touch')) ? e.touches[0].pageX : e.pageX;
            dragDiff = currentX - startX;

            if (Math.abs(dragDiff) > 5) {
                isSwiped = true;
                if (e.cancelable) e.preventDefault();
            }

            list.style.transform = `translateX(${initialTx + dragDiff}px)`;
        };

        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;

            window.removeEventListener('mousemove', onDragMove);
            window.removeEventListener('touchmove', onDragMove);
            window.removeEventListener('mouseup', onDragEnd);
            window.removeEventListener('touchend', onDragEnd);

            list.style.transition = 'transform 0.3s ease-in-out';

            const threshold = 50;
            if (dragDiff < -threshold) {
                next();
            } else if (dragDiff > threshold) {
                prev();
            } else {
                goToPage(currentPageIdx);
            }

            resetAuto();
            setTimeout(() => { isSwiped = false; }, 50);
        };

        list.addEventListener('mousedown', onDragStart);
        list.addEventListener('touchstart', onDragStart, { passive: false });

        // 클릭 방지
        list.addEventListener('click', (e) => {
            if (isSwiped) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);

        // Resize 대응
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const oldItemsPerPage = itemsPerPage;
                updateLayout();

                if (currentPageIdx >= totalPages) currentPageIdx = totalPages - 1;

                goToPage(currentPageIdx, false);
            }, 100);
        });

        // 초기 실행
        list.style.opacity = '0';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                goToPage(0, false);
                list.style.transition = 'opacity 0.3s ease-in-out';
                list.style.opacity = '1';
                startAuto();
            });
        });
    },

    scroll(element, direction, itemsPerPage) {
        const style = window.getComputedStyle(element);
        const gap = parseFloat(style.gap) || 0;
        const item = element.querySelector('.product-item, .slide-item');
        if (!item) return;

        const itemWidth = item.offsetWidth;
        const scrollUnit = (itemWidth + gap) * itemsPerPage;
        const currentScroll = element.scrollLeft;
        const maxScroll = element.scrollWidth - element.clientWidth;

        let targetScroll = direction === 'left' ? currentScroll - scrollUnit : currentScroll + scrollUnit;
        if (targetScroll < 0) targetScroll = 0;
        if (targetScroll > maxScroll) targetScroll = maxScroll;

        element.scrollTo({ left: targetScroll, behavior: 'smooth' });
    },

    updatePagination(element, currentEl, totalPages, prevBtn, nextBtn, itemsPerPage, dotsContainer) {
        const scrollLeft = element.scrollLeft;
        const width = element.clientWidth;
        const scrollWidth = element.scrollWidth;
        if (width === 0) return;

        const item = element.querySelector('.product-item, .slide-item');
        if (!item) return;

        const style = window.getComputedStyle(element);
        const gap = parseFloat(style.gap) || 0;
        const itemWidth = item.offsetWidth;

        if (dotsContainer) {
            // 메인 Pagination
            const itemsCount = element.querySelectorAll('.slide-item').length;
            const index = Math.round(scrollLeft / (itemWidth + gap));
            const lastVisibleIndex = Math.min(index + itemsPerPage, itemsCount);

            if (currentEl) {
                const formattedVal = lastVisibleIndex < 10 ? `0${lastVisibleIndex}` : lastVisibleIndex;
                currentEl.innerText = formattedVal;
            }

            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                const isActive = idx >= index && idx < index + itemsPerPage;
                dot.classList.toggle('active', isActive);
            });
        } else {
            // 상품 Pagination
            const unitWidth = (itemWidth + gap) * itemsPerPage;
            let page = Math.round(scrollLeft / unitWidth) + 1;

            if (scrollLeft + width >= scrollWidth - 5) {
                page = totalPages;
            }
            if (page > totalPages) page = totalPages;
            if (page < 1) page = 1;

            if (currentEl) {
                currentEl.innerText = page;
            }
        }

        if (prevBtn) {
            const isFirst = scrollLeft <= 5;
            prevBtn.classList.toggle('disabled', isFirst);
            prevBtn.disabled = isFirst;
        }
        if (nextBtn) {
            const isLast = scrollLeft + width >= scrollWidth - 5;
            nextBtn.classList.toggle('disabled', isLast);
            nextBtn.disabled = isLast;
        }
    },

    bindNavButtons(list, prevBtn, nextBtn) {
        if (!list) return null;
        const updateBtns = () => {
            const scrollLeft = list.scrollLeft;
            if (prevBtn) {
                const isFirst = scrollLeft <= 5;
                prevBtn.classList.toggle('disabled', isFirst);
                prevBtn.disabled = isFirst;
            }
            if (nextBtn) {
                const isLast = scrollLeft + list.clientWidth >= list.scrollWidth - 5;
                nextBtn.classList.toggle('disabled', isLast);
                nextBtn.disabled = isLast;
            }
        };
        updateBtns();
        list.addEventListener('scroll', updateBtns);
        return updateBtns;
    },

    resetAuto(callback) {
        // 외부 제어
    }
};
