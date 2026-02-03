// Eclub 공통 UI 스크립트
const Eclub = {
    // 토스트 알림
    Toast: {
        container: null,
        // 토스트 컨테이너 초기화
        init() {
            if (this.container) return;
            this.container = document.querySelector('.toast-container');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'toast-container';
                document.body.appendChild(this.container);
            }
        },
        // 토스트 표시
        show({ message, trigger, type = 'success', duration = 2500, align = 'center' }) {
            this.init();
            const toast = document.createElement('div');
            toast.className = `toast-item type-${type}`;
            toast.innerHTML = `
                <i class="toast-icon" aria-hidden="true"></i>
                <span class="toast-message">${message}</span>
            `;
            toast.style.position = 'absolute';
            this.container.appendChild(toast);

            if (trigger) {
                const rect = trigger.getBoundingClientRect();
                const scrollX = window.scrollX;
                const scrollY = window.scrollY;
                requestAnimationFrame(() => {
                    const toastWidth = toast.offsetWidth;
                    let left;

                    if (align === 'right') {
                        // 트리거 우측 정렬
                        left = rect.right + scrollX - toastWidth;
                    } else {
                        // 트리거 중앙 정렬
                        left = rect.left + scrollX - (toastWidth / 2) + (rect.width / 2);
                    }

                    let top = rect.bottom + scrollY + 12; // 12px 간격
                    const margin = 10;
                    if (left < margin) left = margin;
                    if (left + toastWidth > window.innerWidth - margin) {
                        left = window.innerWidth - toastWidth - margin;
                    }
                    toast.style.left = `${left}px`;
                    toast.style.top = `${top}px`;
                    toast.classList.add('active');
                });
            } else {
                toast.classList.add('active');
            }

            // 자동 제거
            setTimeout(() => {
                toast.classList.remove('active');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    },

    // 클립보드 복사
    Clipboard: {
        // 복사 버튼 이벤트 바인딩
        init() {
            const copyButtons = document.querySelectorAll('.btn-copy');
            copyButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const container = btn.closest('.bank-info-group') || btn.parentElement;
                    const valueSpan = container.querySelector('.js-copy-value') || container.querySelector('.value');
                    if (!valueSpan) return;
                    const originalText = valueSpan.textContent.trim();
                    const accountNumber = originalText.replace(/[^0-9\-\s]/g, '').trim();
                    if (accountNumber) this.copyToClipboard(accountNumber, btn);
                });
            });
        },
        // 클립보드 실제 복사 로직
        copyToClipboard(text, trigger) {
            if (!navigator.clipboard) {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    if (document.execCommand('copy')) {
                        Eclub.Toast.show({ message: '계좌번호가 복사되었습니다.', trigger });
                    }
                } catch (err) {
                    console.error('복사 실패:', err);
                }
                document.body.removeChild(textArea);
                return;
            }
            navigator.clipboard.writeText(text).then(() => {
                Eclub.Toast.show({ message: '계좌번호가 복사되었습니다.', trigger });
            }).catch(err => console.error('클립보드 복사 실패:', err));
        }
    },

    // 토글 (슬라이드 애니메이션)
    Toggle: {
        // 트리거 이벤트 바인딩
        init() {
            const triggers = document.querySelectorAll('[data-toggle="slide"]');
            triggers.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetSelector = btn.dataset.target;
                    const scopeSelector = btn.dataset.scope;
                    let target = null;
                    if (scopeSelector) {
                        const scope = btn.closest(scopeSelector);
                        if (scope) target = scope.querySelector(targetSelector);
                    } else {
                        target = document.querySelector(targetSelector);
                    }
                    if (target) this.toggle(btn, target);
                });
            });
        },
        // 토글 실행
        toggle(btn, target) {
            const isActive = btn.classList.contains('active');
            if (isActive) {
                btn.classList.remove('active');
                this.slideUp(target, 300, () => target.classList.remove('active'));
            } else {
                btn.classList.add('active');
                target.classList.add('active');
                this.slideDown(target);
            }
        },
        // 슬라이드 업 (닫기)
        slideUp(element, duration = 300, callback) {
            element.style.height = element.offsetHeight + 'px';
            element.offsetHeight; // 리플로우 강제
            element.style.transitionProperty = 'height, margin, padding';
            element.style.transitionDuration = duration + 'ms';
            element.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                element.style.height = 0;
                element.style.paddingTop = 0;
                element.style.paddingBottom = 0;
                element.style.marginTop = 0;
                element.style.marginBottom = 0;
            });
            setTimeout(() => {
                element.style.display = 'none';
                element.style.removeProperty('height');
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
                if (callback) callback();
            }, duration);
        },
        // 슬라이드 다운 (열기)
        slideDown(element, duration = 300, callback) {
            element.style.removeProperty('display');
            let display = window.getComputedStyle(element).display;
            if (display === 'none') display = 'block';
            element.style.display = display;
            const height = element.offsetHeight;
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            element.style.overflow = 'hidden';
            element.offsetHeight;
            element.style.transitionProperty = 'height, margin, padding';
            element.style.transitionDuration = duration + 'ms';
            requestAnimationFrame(() => {
                element.style.height = height + 'px';
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');
            });
            setTimeout(() => {
                element.style.height = 'auto';
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
                if (callback) callback();
            }, duration);
        }
    },

    // 브라우저 줌 (80~120%)
    BrowserZoom: {
        zoomLevel: 100, // 기본값
        min: 80,        // 최소 80%
        max: 120,       // 최대 120%
        step: 10,       // 10% 단위 증감

        init() {
            const container = document.querySelector('.browser-zoom');
            if (!container) return;

            // 로컬스토리지 저장된 값 확인
            const savedZoom = localStorage.getItem('eclub_zoom_level');
            if (savedZoom) {
                this.zoomLevel = parseInt(savedZoom, 10);
            }

            this.applyZoom();
            this.bindEvents(container);
        },

        bindEvents(container) {
            const btnIn = container.querySelector('.btn-zoom-in');
            const btnOut = container.querySelector('.btn-zoom-out');

            if (btnIn) {
                btnIn.addEventListener('click', () => this.changeZoom(this.step));
            }
            if (btnOut) {
                btnOut.addEventListener('click', () => this.changeZoom(-this.step));
            }
        },

        changeZoom(delta) {
            const newLevel = this.zoomLevel + delta;
            if (newLevel >= this.min && newLevel <= this.max) {
                this.zoomLevel = newLevel;
                this.applyZoom();
                localStorage.setItem('eclub_zoom_level', this.zoomLevel);
            }
        },

        applyZoom() {
            document.body.style.zoom = `${this.zoomLevel}%`;
            // 텍스트 업데이트
            const display = document.querySelector('.browser-zoom .zoom-value');
            if (display) {
                display.textContent = `${this.zoomLevel}%`;
            }
        }
    },

    // 탭 시스템
    Tabs: {
        // 탭 트리거 초기화
        init() {
            const triggers = document.querySelectorAll('[data-tab-trigger]');
            triggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    if (trigger.tagName.toLowerCase() === 'a') e.preventDefault();
                    const targetId = trigger.dataset.tabTarget;
                    const groupName = trigger.dataset.tabGroup;
                    const activeClass = trigger.dataset.tabActiveClass || 'active';
                    if (targetId && groupName) this.activate(groupName, targetId, activeClass);
                });
            });
        },
        // 특정 탭 활성화
        activate(group, targetId, defaultActiveClass = 'active') {
            const groupTriggers = document.querySelectorAll(`[data-tab-group="${group}"][data-tab-trigger]`);
            groupTriggers.forEach(btn => {
                const activeClass = btn.dataset.tabActiveClass || defaultActiveClass;
                btn.classList.toggle(activeClass, btn.dataset.tabTarget === targetId);
            });
            const groupContents = document.querySelectorAll(`[data-tab-group="${group}"][data-tab-content]`);
            groupContents.forEach(content => {
                const activeClass = content.dataset.tabActiveClass || defaultActiveClass;
                const contentId = content.id || content.dataset.tabContent;
                content.classList.toggle(activeClass, contentId === targetId);
            });
            document.dispatchEvent(new CustomEvent('tabChanged', { detail: { group, targetId } }));
        }
    },

    // 수량 조절 버튼
    Quantity: {
        init() {
            // 버튼 클릭 핸들러
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.qty-box button');
                if (!btn) return;
                const qtyBox = btn.closest('.qty-box');
                const input = qtyBox?.querySelector('input');
                const buttons = qtyBox?.querySelectorAll('button');
                if (!input || buttons.length < 2) return;
                e.preventDefault();
                let currentVal = parseInt(input.value, 10) || 0;
                const minVal = input.hasAttribute('min') ? parseInt(input.getAttribute('min'), 10) : 0;
                // 감소/증가 분기
                if (btn === buttons[0]) {
                    if (currentVal > minVal) {
                        input.value = currentVal - 1;
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        Eclub.Toast.show({
                            message: `최소 수량은 ${minVal} 입니다.`,
                            trigger: qtyBox,
                            type: 'error',
                            align: 'right'
                        });
                    }
                } else if (btn === buttons[1]) {
                    input.value = currentVal + 1;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            // 숫자 직접 입력 제어
            document.addEventListener('input', (e) => {
                const input = e.target;
                if (!input.closest('.qty-box')) return;
                input.value = input.value.replace(/[^0-9]/g, '');
                const val = parseInt(input.value, 10);
                if (!isNaN(val) && val < 0) input.value = 0;
            });
        }
    },

    // 관심상품 (찜하기)
    Favorites: {
        init() {
            document.body.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-wish');
                if (!btn) return;
                e.preventDefault();
                this.toggle(btn);
            });
        },
        // 찜 상태 토글
        toggle(btn) {
            const icon = btn.querySelector('i');
            const isActive = btn.classList.contains('active');
            let message = "";
            if (isActive) {
                btn.classList.remove('active');
                if (icon) {
                    icon.classList.remove('icon-heart-fill');
                    icon.classList.add('icon-heart');
                }
                message = "관심상품에서 해제되었습니다.";
            } else {
                btn.classList.add('active');
                if (icon) {
                    icon.classList.remove('icon-heart');
                    icon.classList.add('icon-heart-fill');
                }
                message = "관심상품에 저장되었습니다.";
            }
            Eclub.Toast.show({
                message,
                trigger: btn.closest('.info-actions') || btn,
                type: 'success',
                align: 'right'
            });
        }
    },

    // 바텀 시트 (결제/장바구니 요약)
    BottomSheet: {
        init() {
            const sheets = document.querySelectorAll('.bottom-sheet');
            sheets.forEach(sheet => {
                const header = sheet.querySelector('.sheet-header');
                const body = sheet.querySelector('.sheet-body');
                if (!header || !body) return;

                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isExpanded = sheet.classList.contains('is-expanded');

                    if (isExpanded) {
                        this.collapse(sheet, body);
                    } else {
                        this.expand(sheet, body);
                    }
                });
            });
        },
        expand(sheet, body) {
            sheet.classList.add('is-expanded');
            body.style.maxHeight = body.scrollHeight + 'px';

            // 만약 오버레이가 필요하다면 여기서 처리
            const overlay = document.querySelector('.sheet-overlay');
            if (overlay) overlay.classList.add('is-visible');
            document.body.classList.add('no-scroll');
        },
        collapse(sheet, body) {
            sheet.classList.remove('is-expanded');
            body.style.maxHeight = '0';

            const overlay = document.querySelector('.sheet-overlay');
            if (overlay) overlay.classList.remove('is-visible');
            document.body.classList.remove('no-scroll');
        }
    },

    // 장바구니 전체/그룹 선택
    CartSelection: {
        init() {
            const container = document.querySelector('.cart-container');
            if (!container) return;
            const masterCheckbox = document.querySelector('.cart-select-bar .checkbox-container input[type="checkbox"]');
            if (!masterCheckbox) return;
            const groups = container.querySelectorAll('.cart-group');

            // 전체 선택 체크박스
            masterCheckbox.addEventListener('change', (e) => {
                this.toggleAll(e.target.checked, groups);
                this.updateDeleteButtonState();
            });

            // 그룹 및 개별 체크박스
            groups.forEach(group => {
                const groupHeaderCheckbox = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
                const itemCheckboxes = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');
                if (groupHeaderCheckbox) {
                    groupHeaderCheckbox.addEventListener('change', (e) => {
                        this.toggleGroupItems(e.target.checked, itemCheckboxes);
                        this.updateMasterState(masterCheckbox);
                        this.updateDeleteButtonState();
                    });
                }
                itemCheckboxes.forEach(itemCheckbox => {
                    itemCheckbox.addEventListener('change', () => {
                        if (groupHeaderCheckbox) this.updateGroupHeaderState(groupHeaderCheckbox, itemCheckboxes);
                        this.updateMasterState(masterCheckbox);
                        this.updateDeleteButtonState();
                    });
                });
            });

            // 선택 삭제 버튼 모달 연결
            const deleteSelectedBtn = document.querySelector('.btn-delete-selected');
            if (deleteSelectedBtn) {
                deleteSelectedBtn.addEventListener('click', () => {
                    const checkedItems = document.querySelectorAll('.cart-item .item-check input[type="checkbox"]:checked');
                    deleteSelectedBtn.dataset.modalUrl = checkedItems.length === 0
                        ? '/common/components/modal/modal-alert.html'
                        : '/common/components/modal/modal-select-del.html';
                });
            }

            // 초기 버튼 상태 체크
            this.updateDeleteButtonState();
        },
        // 전체 체크박스 토글
        toggleAll(isChecked, groups) {
            groups.forEach(group => {
                const groupHeaderCheckbox = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
                const itemCheckboxes = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');
                if (groupHeaderCheckbox) groupHeaderCheckbox.checked = isChecked;
                itemCheckboxes.forEach(cb => cb.checked = isChecked);
            });
        },
        // 그룹 내 모든 아이템 토글
        toggleGroupItems(isChecked, itemCheckboxes) {
            itemCheckboxes.forEach(cb => cb.checked = isChecked);
        },
        // 그룹 헤더 상태 업데이트
        updateGroupHeaderState(groupHeaderCheckbox, itemCheckboxes) {
            if (itemCheckboxes.length === 0) return;
            groupHeaderCheckbox.checked = Array.from(itemCheckboxes).every(cb => cb.checked);
        },
        // 최상단 전체 선택 상태 업데이트
        updateMasterState(masterCheckbox) {
            const allItemCheckboxes = document.querySelectorAll('.cart-item .item-check input[type="checkbox"]');
            if (allItemCheckboxes.length === 0) {
                masterCheckbox.checked = false;
                return;
            }
            masterCheckbox.checked = Array.from(allItemCheckboxes).every(cb => cb.checked);
        },
        // 선택삭제 버튼 상태 업데이트
        updateDeleteButtonState() {
            const btns = document.querySelectorAll('.cart-select-bar .action-btns .btn-select-action');
            // '선택삭제' 텍스트를 가진 버튼 찾기
            const targetBtn = Array.from(btns).find(b => b.textContent.trim() === '선택삭제');

            if (targetBtn) {
                const checkedItems = document.querySelectorAll('.cart-item .item-check input[type="checkbox"]:checked');
                if (checkedItems.length > 0) {
                    targetBtn.removeAttribute('disabled');
                } else {
                    targetBtn.setAttribute('disabled', '');
                }
            }
        }
    },

    // 슬라이더 (가로 스크롤)
    Slider: {
        init() {
            const sliders = document.querySelectorAll('.list-slider');
            sliders.forEach(list => {
                this.initSlider(list);
            });
        },
        initSlider(list) {
            const section = list.closest('.home-container');
            if (!section) return;
            const controls = section.querySelector('.pagination-controls');
            if (!controls) return;

            const prevBtn = controls.querySelector('.prev');
            const nextBtn = controls.querySelector('.next');
            const currentEl = controls.querySelector('.current');
            const totalEl = controls.querySelector('.total');

            // 상태 업데이트 함수
            const updateState = () => {
                const items = list.querySelectorAll('.product-item');
                const itemsCount = items.length;
                const itemsPerPage = 5;
                const totalPages = Math.ceil(itemsCount / itemsPerPage) || 1;

                // 마지막 페이지 여백 처리 (부족한 아이템만큼 우측 마진 추가)
                items.forEach(item => item.style.marginRight = ''); // 초기화

                const remainder = itemsCount % itemsPerPage;
                if (itemsCount > 0 && remainder > 0) {
                    const item = items[0];
                    const style = window.getComputedStyle(list);
                    const gap = parseFloat(style.gap) || 20;
                    const itemWidth = item.offsetWidth;
                    const missingCount = itemsPerPage - remainder;
                    const marginToAdd = (itemWidth + gap) * missingCount;

                    items[itemsCount - 1].style.marginRight = `${marginToAdd}px`;
                }

                // Total 페이지 업데이트
                if (totalEl) {
                    const text = totalEl.innerText.trim();
                    if (text.startsWith('/')) {
                        totalEl.innerText = '/ ' + totalPages;
                    } else {
                        totalEl.innerText = totalPages;
                    }
                }

                // 현재 페이지 및 버튼 상태 업데이트
                this.updatePagination(list, currentEl, totalPages, prevBtn, nextBtn);
            };

            // 초기 실행
            updateState();

            // Dom 변경 감지 (아이템 추가/삭제)
            const observer = new MutationObserver(() => {
                updateState();
            });
            observer.observe(list, { childList: true, subtree: true });

            // 스크롤 이벤트
            list.addEventListener('scroll', () => {
                // 스크롤 시에는 itemsCount가 변하지 않으므로, 
                // totalPages를 매번 계산하지 않으려면 클로저 변수를 써야 하지만,
                // updatePagination 내부에서만 사용하는 값이라면,
                // 여기서 다시 계산해서 넘겨주거나, updateState를 호출하는 방식은 비효율적일 수 있음.
                // 다만 렌더링 성능에 큰 지장이 없다면 단순하게 itemsCount 다시 구해서 넘김.
                const items = list.querySelectorAll('.product-item');
                const totalPages = Math.ceil(items.length / 5) || 1;
                this.updatePagination(list, currentEl, totalPages, prevBtn, nextBtn);
            });

            if (prevBtn) {
                prevBtn.onclick = () => this.scroll(list, 'left');
            }
            if (nextBtn) {
                nextBtn.onclick = () => this.scroll(list, 'right');
            }
        },
        scroll(element, direction) {
            const style = window.getComputedStyle(element);
            const gap = parseFloat(style.gap) || 20;

            const item = element.querySelector('.product-item');
            if (!item) return;
            const itemWidth = item.offsetWidth;

            const scrollUnit = (itemWidth + gap) * 5;

            const currentScroll = element.scrollLeft;
            const targetScroll = direction === 'left' ? currentScroll - scrollUnit : currentScroll + scrollUnit;

            element.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        },
        updatePagination(element, currentEl, totalPages, prevBtn, nextBtn) {
            const scrollLeft = element.scrollLeft;
            const width = element.clientWidth;
            const scrollWidth = element.scrollWidth;

            if (width === 0) return;

            let page = Math.round(scrollLeft / width) + 1;

            // 끝에 도달했으면 마지막 페이지로 처리 (오차 범위 5px)
            if (scrollLeft + width >= scrollWidth - 5) {
                page = totalPages;
            }

            // 범위 보정
            if (page > totalPages) page = totalPages;
            if (page < 1) page = 1;

            if (currentEl) currentEl.innerText = page;

            // 버튼 Disabled 처리
            if (prevBtn) {
                if (page === 1) {
                    prevBtn.classList.add('disabled');
                    prevBtn.setAttribute('disabled', 'true');
                } else {
                    prevBtn.classList.remove('disabled');
                    prevBtn.removeAttribute('disabled');
                }
            }

            if (nextBtn) {
                if (page === totalPages) {
                    nextBtn.classList.add('disabled');
                    nextBtn.setAttribute('disabled', 'true');
                } else {
                    nextBtn.classList.remove('disabled');
                    nextBtn.removeAttribute('disabled');
                }
            }
        }
    },

    // 스크롤 위치 감지 (탭 활성화)
    ScrollSpy: {
        init() {
            const tabWrap = document.querySelector('.cart-tab-wrap');
            if (!tabWrap) return;
            const methodLinks = document.querySelectorAll('.cart-tabs .tab-item:not(.recent) .tab-link');
            const sections = [];

            // 헤더 높이(Sticky 포함) 계산
            const getHeaderHeight = () => {
                const stickyWrap = tabWrap.closest('.cart-sticky-wrap') || tabWrap;
                const computedStyle = window.getComputedStyle(stickyWrap);
                const topVal = parseFloat(computedStyle.top);
                const stickyTop = isNaN(topVal) ? 0 : topVal;
                return stickyTop + stickyWrap.offsetHeight;
            };

            // 섹션 데이터 프리로드
            methodLinks.forEach(link => {
                const id = link.getAttribute('href');
                if (id && id.startsWith('#') && id !== '#') {
                    const section = document.querySelector(id);
                    if (section) sections.push({ id, el: section, link, parent: link.closest('.tab-item') });
                } else if (id === '#wrap') {
                    sections.push({ id: '#wrap', el: document.body, link, parent: link.closest('.tab-item') });
                }
            });

            let isAutoScrolling = false;
            let scrollTimeout = null;
            let isThrottled = false;

            // 탭 클릭 시 스무스 스크롤
            methodLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    methodLinks.forEach(l => l.closest('.tab-item').classList.remove('active'));
                    link.closest('.tab-item').classList.add('active');
                    isAutoScrolling = true;
                    if (scrollTimeout) clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => isAutoScrolling = false, 1200);
                    if (targetId === '#wrap' || targetId === '#') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        const targetEl = document.querySelector(targetId);
                        if (targetEl) {
                            const offset = getHeaderHeight();
                            const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                            window.scrollTo({ top, behavior: 'smooth' });
                        }
                    }
                });
            });

            // 스크롤 시 섹션 감지
            window.addEventListener('scroll', () => {
                if (isAutoScrolling || isThrottled) return;
                isThrottled = true;
                requestAnimationFrame(() => {
                    const offset = getHeaderHeight();
                    const scrollPos = window.scrollY + offset + 10;
                    let currentSection = null;
                    for (const section of sections) {
                        const offsetTop = section.el === document.body ? 0 : (section.el.getBoundingClientRect().top + window.scrollY);
                        if (scrollPos >= offsetTop) currentSection = section;
                    }
                    if (currentSection) {
                        methodLinks.forEach(l => l.closest('.tab-item').classList.remove('active'));
                        currentSection.parent.classList.add('active');
                    }
                    isThrottled = false;
                });
            });
        }
    },

    // 입력 필드 핸들러 (숫자 제한 등)
    InputHandler: {
        init() {
            // 숫자만 입력 가능하도록 제한 (data-input="number")
            document.addEventListener('input', (e) => {
                const input = e.target;
                if (input.dataset.input === 'number' || input.getAttribute('data-input') === 'number') {
                    input.value = input.value.replace(/[^0-9]/g, '');
                }
            });

            // 숫자 입력 시 한글/특수문자 차단 (keydown 보조)
            document.addEventListener('keydown', (e) => {
                const input = e.target;
                if (input.dataset.input === 'number' || input.getAttribute('data-input') === 'number') {
                    // 허용 키: BACKSPACE, DELETE, TAB, ESCAPE, ENTER, 방향키, 숫자, 넘패드 숫자
                    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                    if (allowedKeys.includes(e.key)) return;

                    // Ctrl/Cmd 조합 허용 (A, C, V, X)
                    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;

                    // 숫자만 허용
                    if (!/^\d$/.test(e.key)) {
                        e.preventDefault();
                    }
                }
            });
        }
    },

    // HTML 인클루드 로더
    Loader: {
        async init() {
            const includes = document.querySelectorAll('[data-include]');
            for (const el of includes) {
                const url = el.dataset.include;
                try {
                    const res = await fetch(url);
                    if (res.ok) {
                        const html = await res.text();
                        el.outerHTML = html;
                    } else {
                        console.error('로드 실패:', url);
                    }
                } catch (e) {
                    console.error('인클루드 오류:', url, e);
                }
            }
        }
    },

    // 전체 모듈 초기화
    async init() {
        await this.Loader.init();
        this.Clipboard.init();
        this.Toggle.init();
        this.Tabs.init();
        this.Quantity.init();
        this.Favorites.init();
        this.BottomSheet.init();
        this.CartSelection.init();
        this.Slider.init();
        this.ScrollSpy.init();
        this.InputHandler.init();
        if (this.BrowserZoom) this.BrowserZoom.init();
        console.log('Eclub Common UI Initialized');
    }
};

// DOM 로드 시 실행
document.addEventListener('DOMContentLoaded', () => Eclub.init());
