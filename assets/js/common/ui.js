// Eclub 공통 UI 스크립트
const Eclub = {
    // 상수 정의
    Const: {
        ANIMATION_DURATION: 300,
        SLIDER_AUTO_INTERVAL: 4000,
        TOAST_DURATION: 2500,
        ZOOM: {
            MIN: 70,
            MAX: 130,
            STEP: 10,
            DEFAULT: 100
        }
    },

    // 현재 적용된 줌 배율 반환
    getZoomScale() {
        const zoom = document.body.style.zoom;
        if (!zoom) return 1;
        return parseFloat(zoom) / 100;
    },

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
        show({ message, trigger, type = 'success', duration = Eclub.Const.TOAST_DURATION, position = 'bottom-center' }) {
            this.init();
            const toast = document.createElement('div');
            toast.className = `toast-item type-${type}`;
            toast.innerHTML = `
                <i class="toast-icon" aria-hidden="true"></i>
                <span class="toast-message">${message}</span>
            `;

            const isFixed = position.startsWith('fixed-');
            if (isFixed) {
                toast.classList.add('is-fixed');
                toast.style.position = 'fixed';
            } else {
                toast.style.position = 'absolute';
            }

            this.container.appendChild(toast);

            requestAnimationFrame(() => {
                const toastWidth = toast.offsetWidth;
                const toastHeight = toast.offsetHeight;
                const scale = Eclub.getZoomScale(); // 줌 배율 고려
                const margin = 20;
                let left, top;

                if (isFixed) {
                    // 브라우저 뷰포트(Fixed) 기준 위치
                    const winW = window.innerWidth / scale;
                    const winH = window.innerHeight / scale;

                    switch (position) {
                        case 'fixed-top-left':
                            left = margin;
                            top = margin;
                            break;
                        case 'fixed-top-center':
                            left = (winW / 2) - (toastWidth / 2);
                            top = margin;
                            break;
                        case 'fixed-top-right':
                            left = winW - toastWidth - margin;
                            top = margin;
                            break;
                        case 'fixed-bottom-left':
                            left = margin;
                            top = winH - toastHeight - margin;
                            break;
                        case 'fixed-bottom-center':
                            left = (winW / 2) - (toastWidth / 2);
                            top = winH - toastHeight - margin;
                            break;
                        case 'fixed-bottom-right':
                            left = winW - toastWidth - margin;
                            top = winH - toastHeight - margin;
                            break;
                        case 'fixed-center':
                            left = (winW / 2) - (toastWidth / 2);
                            top = (winH / 2) - (toastHeight / 2);
                            break;
                        default:
                            left = (winW / 2) - (toastWidth / 2);
                            top = margin;
                    }
                } else if (trigger) {
                    // 트리거(Relative) 기준 위치
                    const rect = trigger.getBoundingClientRect();
                    const scrollX = window.scrollX / scale;
                    const scrollY = window.scrollY / scale;

                    // 레이아웃 좌표 계산 (물리 좌표 / scale)
                    const rectLeft = rect.left / scale;
                    const rectTop = rect.top / scale;
                    const rectRight = rect.right / scale;
                    const rectBottom = rect.bottom / scale;
                    const rectWidth = rect.width / scale;
                    const rectHeight = rect.height / scale;

                    const offset = 4; // 트리거와의 기본 간격 (썸네일 바로 아래에 노출 하도록 간격 축소)

                    switch (position) {
                        case 'top-left':
                            left = rectLeft + scrollX;
                            top = rectTop + scrollY - toastHeight - offset;
                            break;
                        case 'top-center':
                        case 'top':
                            left = rectLeft + scrollX + (rectWidth / 2) - (toastWidth / 2);
                            top = rectTop + scrollY - toastHeight - offset;
                            break;
                        case 'top-right':
                            left = rectRight + scrollX - toastWidth;
                            top = rectTop + scrollY - toastHeight - offset;
                            break;
                        case 'bottom-left':
                            left = rectLeft + scrollX;
                            top = rectBottom + scrollY + offset;
                            break;
                        case 'bottom-center':
                        case 'bottom':
                        case 'center':
                            left = rectLeft + scrollX + (rectWidth / 2) - (toastWidth / 2);
                            top = rectBottom + scrollY + offset;
                            break;
                        case 'bottom-right':
                        case 'right':
                            left = rectRight + scrollX - toastWidth;
                            top = rectBottom + scrollY + offset;
                            break;
                        case 'left-top':
                            left = rectLeft + scrollX - toastWidth - offset;
                            top = rectTop + scrollY;
                            break;
                        case 'left-center':
                        case 'left':
                            left = rectLeft + scrollX - toastWidth - offset;
                            top = rectTop + scrollY + (rectHeight / 2) - (toastHeight / 2);
                            break;
                        case 'left-bottom':
                            left = rectLeft + scrollX - toastWidth - offset;
                            top = rectBottom + scrollY - toastHeight;
                            break;
                        case 'right-top':
                            left = rectRight + scrollX + offset;
                            top = rectTop + scrollY;
                            break;
                        case 'right-center':
                        case 'right':
                            left = rectRight + scrollX + offset;
                            top = rectTop + scrollY + (rectHeight / 2) - (toastHeight / 2);
                            break;
                        case 'right-bottom':
                            left = rectRight + scrollX + offset;
                            top = rectBottom + scrollY - toastHeight;
                            break;
                        case 'inner-bottom-center':
                            left = rectLeft + scrollX + (rectWidth / 2) - (toastWidth / 2);
                            top = rectBottom + scrollY - toastHeight - offset;
                            break;
                        default:
                            left = rectLeft + scrollX + (rectWidth / 2) - (toastWidth / 2);
                            top = rectBottom + scrollY + offset;
                    }

                    // 트리거 기준일 때 화면 밖으로 나가지 않도록 보정
                    const windowWidth = window.innerWidth / scale;
                    const documentHeight = document.documentElement.scrollHeight / scale;
                    const safeMargin = 10;

                    if (left < safeMargin) left = safeMargin;
                    if (left + toastWidth > windowWidth - safeMargin) left = windowWidth - toastWidth - safeMargin;
                    if (top < safeMargin + scrollY) top = safeMargin + scrollY;
                    if (top + toastHeight > documentHeight - safeMargin) top = documentHeight - toastHeight - safeMargin;
                } else {
                    // 트리거도 없고 고정 위치도 아닐 때 기본값
                    const winW = window.innerWidth / scale;
                    left = (winW / 2) - (toastWidth / 2);
                    top = margin;
                    toast.style.position = 'fixed';
                }

                toast.style.left = `${left}px`;
                toast.style.top = `${top}px`;
                toast.classList.add('active');
            });

            // 자동 제거
            setTimeout(() => {
                toast.classList.remove('active');
                setTimeout(() => toast.remove(), Eclub.Const.ANIMATION_DURATION);
            }, duration);
        }
    },

    // 클립보드 복사
    Clipboard: {
        // 복사 버튼 이벤트
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
        // 텍스트 복사 실행
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
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-toggle="slide"]');
                if (!btn) return;

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
        },
        // 토글 실행
        toggle(btn, target) {
            const isActive = btn.classList.contains('active');
            if (isActive) {
                btn.classList.remove('active');
                this.slideUp(target, Eclub.Const.ANIMATION_DURATION, () => target.classList.remove('active'));
            } else {
                btn.classList.add('active');
                target.classList.add('active');
                this.slideDown(target);
            }
        },
        // 슬라이드 업 (닫기)
        slideUp(element, duration = Eclub.Const.ANIMATION_DURATION, callback) {
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
        slideDown(element, duration = Eclub.Const.ANIMATION_DURATION, callback) {
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
        zoomLevel: 100, // 기본값은 Const.DEFAULT로 설정되나 초기화 시 덮어씀

        init() {
            // Const 값 참조
            this.min = Eclub.Const.ZOOM.MIN;
            this.max = Eclub.Const.ZOOM.MAX;
            this.step = Eclub.Const.ZOOM.STEP;
            this.zoomLevel = Eclub.Const.ZOOM.DEFAULT;

            const savedZoom = localStorage.getItem('eclub_zoom_level');
            if (savedZoom) {
                this.zoomLevel = parseInt(savedZoom, 10);
            }

            // 페이지 로드 시 줌 적용 (컨테이너 없어도 적용)
            this.applyZoom();

            // 이벤트 위임
            document.addEventListener('click', (e) => {
                const container = e.target.closest('.browser-zoom');
                if (!container) return; // browser-zoom 내부가 아니면 무시

                const btnIn = e.target.closest('.btn-zoom-in');
                const btnOut = e.target.closest('.btn-zoom-out');

                if (btnIn) {
                    this.changeZoom(this.step);
                } else if (btnOut) {
                    this.changeZoom(-this.step);
                }
            });
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
            const display = document.querySelector('.browser-zoom .zoom-value');
            if (display) {
                display.textContent = `${this.zoomLevel}%`;
            }
            // 줌 변경 후 슬라이더 레이아웃 재계산
            window.dispatchEvent(new Event('resize'));
        }
    },

    // 탭 시스템
    Tabs: {
        // 탭 트리거 초기화
        init() {
            document.removeEventListener('click', this.handleTabClick);
            this.handleTabClick = (e) => {
                const trigger = e.target.closest('[data-tab-trigger]');
                if (!trigger) return;

                if (trigger.tagName.toLowerCase() === 'a') e.preventDefault();
                const targetId = trigger.dataset.tabTarget;
                const groupName = trigger.dataset.tabGroup;
                const activeClass = trigger.dataset.tabActiveClass || 'active';

                if (targetId && groupName) this.activate(groupName, targetId, activeClass);
            };
            document.addEventListener('click', this.handleTabClick);
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

            if (group === 'best-period') {
                const activeAllBtn = document.querySelector('.category-tabs button[data-tab="all"]');
                if (activeAllBtn) {
                    activeAllBtn.click();
                }
                // 탭 전환 후 활성화된 product-list의 더보기 높이 재계산
                Eclub.ProductMore.resetActiveList(targetId);
            }
        }
    },

    // 수량 조절 버튼
    Quantity: {
        init() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.qty-box button, .qty-control button');
                if (!btn) return;
                const qtyBox = btn.closest('.qty-box, .qty-control');
                const input = qtyBox?.querySelector('input');
                const buttons = qtyBox?.querySelectorAll('button');
                if (!input || buttons.length < 2) return;
                e.preventDefault();
                let currentVal = parseInt(input.value, 10) || 0;
                const minVal = input.hasAttribute('min') ? parseInt(input.getAttribute('min'), 10) : 0;

                if (btn === buttons[0]) {
                    if (currentVal > minVal) {
                        input.value = currentVal - 1;
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        const resolvedTrigger = qtyBox.closest('.product-item')?.querySelector('.image-box') || qtyBox;
                        Eclub.Toast.show({
                            message: `최소 수량은 ${minVal} 입니다.`,
                            trigger: resolvedTrigger,
                            type: 'error',
                            position: btn.dataset.toastPosition || (resolvedTrigger.classList.contains('image-box') ? 'bottom-center' : 'bottom-right')
                        });
                    }
                } else if (btn === buttons[1]) {
                    input.value = currentVal + 1;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            document.addEventListener('input', (e) => {
                const input = e.target;
                if (!input.closest('.qty-box, .qty-control')) return;
                input.value = input.value.replace(/[^0-9]/g, '');
                const val = parseInt(input.value, 10);
                if (!isNaN(val) && val < 0) input.value = 0;
            });
        }
    },

    // 장바구니 (담기)
    Cart: {
        init() {
            document.body.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-cart');
                if (!btn) return;

                if (btn.tagName === 'A' && btn.getAttribute('href') !== 'javascript:void(0);') return;

                e.preventDefault();
                this.add(btn);
            });
        },
        add(btn) {
            const imageBox = btn.closest('.product-item')?.querySelector('.image-box');
            const container = btn.closest('.info-actions, .action-btns');
            const resolvedTrigger = imageBox || container || btn;
            Eclub.Toast.show({
                message: "장바구니에 상품이 담겼습니다.",
                trigger: resolvedTrigger,
                position: btn.dataset.toastPosition || (resolvedTrigger.classList.contains('image-box') ? 'bottom-center' : 'bottom-right'),
                type: 'success'
            });
        }
    },

    // 관심상품 (찜하기)
    Favorites: {
        init() {
            document.body.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-wish, .btn-heart, .btn-heart-overlay');
                if (!btn) return;
                e.preventDefault();
                this.toggle(btn);
            });
        },
        toggle(btn) {
            const icon = btn.querySelector('i');
            const isActive = btn.classList.contains('active');
            let message = "";
            if (isActive) {
                btn.classList.remove('active');
                if (icon) {
                    if (icon.classList.contains('icon-heart-fill')) {
                        icon.classList.remove('icon-heart-fill');

                        if (btn.classList.contains('btn-heart') || btn.classList.contains('btn-heart-overlay')) {
                            icon.classList.add('icon-heart-main');
                        } else {
                            icon.classList.add('icon-heart');
                        }
                    }
                }
                message = "관심상품에서 해제되었습니다.";
            } else {
                btn.classList.add('active');
                if (icon) {
                    if (icon.classList.contains('icon-heart')) {
                        icon.classList.remove('icon-heart');
                        icon.classList.add('icon-heart-fill');
                    } else if (icon.classList.contains('icon-heart-main')) {
                        icon.classList.remove('icon-heart-main');
                        icon.classList.add('icon-heart-fill');
                    }
                }
                message = "관심상품에 저장되었습니다.";
            }
            const imageBox = btn.closest('.product-item')?.querySelector('.image-box');
            const container = btn.closest('.info-actions, .action-btns');
            const resolvedTrigger = imageBox || container || btn;
            Eclub.Toast.show({
                message,
                trigger: resolvedTrigger,
                position: btn.dataset.toastPosition || (resolvedTrigger.classList.contains('image-box') ? 'bottom-center' : 'bottom-right'),
                type: 'success'
            });
        }
    },

    // 모바일 퀵 메뉴
    QuickMenu: {
        init() {
            const btn = document.getElementById('btn-mobile-quick');
            const layer = document.getElementById('quick-menu-layer');
            if (!btn || !layer) return;

            const closeBtn = layer.querySelector('.btn-quick-close');

            // 메뉴 열기
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(btn, layer);
            });

            // 메뉴 닫기 (닫기 버튼)
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.close(btn, layer);
                });
            }

            // 외부 클릭 시 닫기
            document.addEventListener('click', (e) => {
                if (layer.hidden) return;
                // 레이어 내부나 버튼을 클릭한 경우는 제외
                if (!layer.contains(e.target) && !btn.contains(e.target)) {
                    this.close(btn, layer);
                }
            });
        },

        open(btn, layer) {
            btn.classList.add('is-hidden');
            layer.hidden = false;
        },

        close(btn, layer) {
            btn.classList.remove('is-hidden');
            layer.hidden = true;
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

            masterCheckbox.addEventListener('change', (e) => {
                this.toggleAll(e.target.checked, groups);
                this.updateDeleteButtonState();
            });

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

            const deleteSelectedBtn = document.querySelector('.btn-delete-selected');
            if (deleteSelectedBtn) {
                deleteSelectedBtn.addEventListener('click', () => {
                    const checkedItems = document.querySelectorAll('.cart-item .item-check input[type="checkbox"]:checked');
                    deleteSelectedBtn.dataset.modalUrl = checkedItems.length === 0
                        ? '/common/components/modal/modal-alert.html'
                        : '/common/components/modal/modal-select-del.html';
                });
            }

            this.updateDeleteButtonState();
        },
        toggleAll(isChecked, groups) {
            groups.forEach(group => {
                const groupHeaderCheckbox = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
                const itemCheckboxes = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');
                if (groupHeaderCheckbox) groupHeaderCheckbox.checked = isChecked;
                itemCheckboxes.forEach(cb => cb.checked = isChecked);
            });
        },
        toggleGroupItems(isChecked, itemCheckboxes) {
            itemCheckboxes.forEach(cb => cb.checked = isChecked);
        },
        updateGroupHeaderState(groupHeaderCheckbox, itemCheckboxes) {
            if (itemCheckboxes.length === 0) return;
            groupHeaderCheckbox.checked = Array.from(itemCheckboxes).every(cb => cb.checked);
        },
        updateMasterState(masterCheckbox) {
            const allItemCheckboxes = document.querySelectorAll('.cart-item .item-check input[type="checkbox"]');
            if (allItemCheckboxes.length === 0) {
                masterCheckbox.checked = false;
                return;
            }
            masterCheckbox.checked = Array.from(allItemCheckboxes).every(cb => cb.checked);
        },
        updateDeleteButtonState() {
            const btns = document.querySelectorAll('.cart-select-bar .action-btns .btn-select-action');
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

    // 카테고리 탭 정렬/필터링
    CategorySort: {
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
                    const productLists = [];
                    let sibling = tabListWrapper.nextElementSibling;

                    while (sibling) {
                        if (sibling.classList.contains('product-list')) {
                            productLists.push(sibling);
                        }
                        sibling = sibling.nextElementSibling;
                    }

                    productLists.forEach(productList => {
                        productList.classList.add('is-fading');

                        setTimeout(() => {
                            const items = productList.querySelectorAll('.product-item');
                            items.forEach(item => {
                                const itemCategory = item.dataset.category || '';
                                const categories = itemCategory.split(/\s+/);

                                if (category === 'all' || categories.includes(category)) {
                                    item.style.display = '';
                                } else {
                                    item.style.display = 'none';
                                }
                            });

                            // 카테고리 변경 후 ProductMore 초기화
                            if (productList.classList.contains('is-more')) {
                                Eclub.ProductMore.resetByCategory(productList);
                            }

                            requestAnimationFrame(() => {
                                productList.classList.remove('is-fading');
                            });
                        }, Eclub.Const.ANIMATION_DURATION);
                    });
                }
            });
        }
    },

    // 상품 더보기 (10개씩 페이징)
    ProductMore: {
        PAGE_SIZE: 10,

        init() {
            const containers = document.querySelectorAll('.product-list.is-more');
            if (!containers.length) return;

            containers.forEach(container => {
                this.applyPaging(container);

                window.addEventListener('resize', () => {
                    this.recalcHeight(container);
                });
            });

            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-more');
                if (!btn) return;

                const moreWrap = btn.closest('.product-more');
                // 이전 형제 중 모든 product-list 수집
                const productLists = [];
                let sibling = moreWrap?.previousElementSibling;
                while (sibling) {
                    if (sibling.classList.contains('product-list')) {
                        productLists.push(sibling);
                    }
                    sibling = sibling.previousElementSibling;
                }

                // 탭으로 활성화된 product-list 우선, 없으면 첫 번째 사용
                const container = productLists.find(el => el.classList.contains('active')) || productLists[0];

                if (container && container.classList.contains('is-more')) {
                    e.preventDefault();
                    this.toggle(container, btn);
                }
            });
        },

        // visible 상태인 product-item만 반환
        getVisibleItems(container) {
            return Array.from(container.querySelectorAll('.product-item')).filter(
                item => item.style.display !== 'none' || item.dataset.hiddenByMore === 'true'
            );
        },

        // 초기 페이징 적용
        applyPaging(container) {
            const allItems = this.getVisibleItems(container);
            const moreWrap = this.getMoreWrapper(container);
            const pageSize = this.PAGE_SIZE;

            // 10개 이하면 버튼 숨김, maxHeight 해제
            if (allItems.length <= pageSize) {
                if (moreWrap) moreWrap.style.display = 'none';
                container.style.maxHeight = '';
                container.style.overflow = '';
                container.classList.remove('is-expanded');
                container.dataset.visibleCount = allItems.length;
                // 숨김 해제
                allItems.forEach(item => {
                    delete item.dataset.hiddenByMore;
                    item.style.display = '';
                });
                return;
            }

            // 10개 초과 → 첫 10개만 노출
            container.dataset.visibleCount = pageSize;
            allItems.forEach((item, idx) => {
                if (idx < pageSize) {
                    item.style.display = '';
                    delete item.dataset.hiddenByMore;
                } else {
                    item.style.display = 'none';
                    item.dataset.hiddenByMore = 'true';
                }
            });

            container.classList.add('js-initialized');
            container.classList.remove('is-expanded');
            container.style.maxHeight = '';
            container.style.overflow = '';

            // 버튼 상태
            if (moreWrap) {
                moreWrap.style.display = '';
                const btn = moreWrap.querySelector('.btn-more');
                if (btn) {
                    btn.classList.remove('active');
                    const span = btn.querySelector('span');
                    if (span) span.textContent = '상품 더보기';
                }
            }
        },

        getMoreWrapper(container) {
            let next = container.nextElementSibling;
            while (next && !next.classList.contains('product-more')) {
                next = next.nextElementSibling;
            }
            return next;
        },

        // 높이 재계산 (resize 대응)
        recalcHeight(container) {
            const visibleCount = parseInt(container.dataset.visibleCount, 10) || this.PAGE_SIZE;
            const visibleItems = Array.from(container.querySelectorAll('.product-item')).filter(
                item => item.style.display !== 'none'
            );
            if (visibleItems.length === 0) return;

            const lastItem = visibleItems[visibleItems.length - 1];
            if (lastItem) {
                container.style.maxHeight = '';
            }
        },

        toggle(container, btn) {
            const allItems = this.getVisibleItems(container);
            const pageSize = this.PAGE_SIZE;
            let visibleCount = parseInt(container.dataset.visibleCount, 10) || pageSize;
            const isExpanded = container.classList.contains('is-expanded');
            const span = btn.querySelector('span');

            // 상품닫기 → 초기 10개로 복원
            if (isExpanded) {
                container.classList.remove('is-expanded');
                container.dataset.visibleCount = pageSize;

                allItems.forEach((item, idx) => {
                    if (idx < pageSize) {
                        item.style.display = '';
                        delete item.dataset.hiddenByMore;
                    } else {
                        item.style.display = 'none';
                        item.dataset.hiddenByMore = 'true';
                    }
                });

                if (span) span.textContent = '상품 더보기';
                btn.classList.remove('active');
                return;
            }

            // 상품 더보기 → 다음 10개 추가 노출
            const nextCount = Math.min(visibleCount + pageSize, allItems.length);
            for (let i = visibleCount; i < nextCount; i++) {
                allItems[i].style.display = '';
                delete allItems[i].dataset.hiddenByMore;
            }
            container.dataset.visibleCount = nextCount;

            // 모두 노출 완료 → '상품닫기' 전환
            if (nextCount >= allItems.length) {
                container.classList.add('is-expanded');
                if (span) span.textContent = '상품닫기';
                btn.classList.add('active');
            }
        },

        // 탭 전환 후 활성 product-list 초기화
        resetActiveList(targetId) {
            const activeList = document.getElementById(targetId);
            if (!activeList || !activeList.classList.contains('is-more')) return;

            // hiddenByMore 마킹 해제 후 재적용
            activeList.querySelectorAll('.product-item[data-hidden-by-more]').forEach(item => {
                item.style.display = '';
                delete item.dataset.hiddenByMore;
            });

            requestAnimationFrame(() => {
                this.applyPaging(activeList);
            });
        },

        // 카테고리 정렬 후 초기화
        resetByCategory(container) {
            // hiddenByMore 마킹 해제
            container.querySelectorAll('.product-item[data-hidden-by-more]').forEach(item => {
                delete item.dataset.hiddenByMore;
            });

            requestAnimationFrame(() => {
                this.applyPaging(container);
            });
        }
    },

    // 슬라이더 (가로 스크롤)
    Slider: {
        init() {
            // 상품 리스트 슬라이더 (5개씩)
            const productSliders = document.querySelectorAll('.list-slider');
            productSliders.forEach(list => this.initProductSlider(list));

            // 메인 비주얼 슬라이더 (3개씩)
            const mainSliders = document.querySelectorAll('.main-visual .slider-wrapper');
            mainSliders.forEach(list => this.initMainSlider(list));
        },

        // 상품 슬라이더 초기화 (5개씩)
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

        // 메인 비주얼 슬라이더 초기화
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

            // 반응형 무관 3개 클론 생성
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

            // 도트 및 카운트 초기화
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

                //itemsPerPage가 1이든 3이든, 부모 컨테이너(뷰포트) 너비를 기준으로 정확한 단위를 계산해야
                //줌 배율(body.style.zoom)이 적용된 상태에서도 논리적 픽셀 단위로 정확히 이동하여 밀림 현상 방지
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

                // 클론 오프셋 적용
                const wrapperIdx = uniquePageIndices[currentPageIdx] + clonesCount;
                const tx = getTranslateX(wrapperIdx);

                // 트랜지션 강제 적용
                list.style.transition = animated ? `transform ${Eclub.Const.ANIMATION_DURATION}ms ease-in-out` : 'none';
                list.style.transform = `translateX(${tx}px)`;

                updateUI();

                if (animated) {
                    const transitionEndHandler = () => {
                        list.removeEventListener('transitionend', transitionEndHandler);
                        unlockTransition();
                    };
                    list.addEventListener('transitionend', transitionEndHandler, { once: true });

                    // 트랜지션 엔드 미발생 시 강제 해제
                    setTimeout(() => {
                        if (isTransitioning) {
                            list.removeEventListener('transitionend', transitionEndHandler);
                            unlockTransition();
                        }
                    }, Eclub.Const.ANIMATION_DURATION + 100);
                } else {
                    setTimeout(unlockTransition, 10);
                }
            };

            const next = () => {
                if (isTransitioning) return;

                if (currentPageIdx >= totalPages - 1) {
                    isTransitioning = true;
                    // 마지막 페이지에서 이동
                    const wrapperIdx = clonesCount + itemsCount;
                    const tx = getTranslateX(wrapperIdx);

                    list.style.transition = `transform ${Eclub.Const.ANIMATION_DURATION}ms ease-in-out`;
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
                    }, Eclub.Const.ANIMATION_DURATION + 100);

                } else {
                    goToPage(currentPageIdx + 1);
                }
            };

            const prev = () => {
                if (isTransitioning) return;

                if (currentPageIdx <= 0) {
                    isTransitioning = true;
                    // 첫 페이지에서 이동
                    const wrapperIdx = clonesCount - itemsPerPage;
                    const tx = getTranslateX(wrapperIdx);

                    list.style.transition = `transform ${Eclub.Const.ANIMATION_DURATION}ms ease-in-out`;
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
                    }, Eclub.Const.ANIMATION_DURATION + 100);

                } else {
                    goToPage(currentPageIdx - 1);
                }
            };

            const startAuto = () => {
                if (isPaused || autoTimer) return;
                autoTimer = setInterval(next, Eclub.Const.SLIDER_AUTO_INTERVAL);
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
                // 모바일/PC pause 아이콘 클래스 판별
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

            // 드래그/스와이프 기능
            let startX = 0;
            let dragDiff = 0;
            let isDragging = false;
            let isSwiped = false;
            let initialTx = 0;

            const onDragStart = (e) => {
                // 모바일일때만 드래그 활성화
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

            // 클릭 이벤트 방지
            list.addEventListener('click', (e) => {
                if (isSwiped) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);

            // 리사이즈
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
                // 메인 비주얼 페이지네이션
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
                // 상품 슬라이더 페이지네이션
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

        resetAuto(callback) {
            // 외부 제어
        }
    },

    // 스크롤 위치 감지 (탭 활성화)
    ScrollSpy: {
        init() {
            const tabWrap = document.querySelector('.cart-tab-wrap');
            if (!tabWrap) return;
            const methodLinks = document.querySelectorAll('.cart-tabs .tab-item:not(.recent) .tab-link');
            const sections = [];

            const getHeaderHeight = () => {
                const stickyWrap = tabWrap.closest('.cart-sticky-wrap') || tabWrap;
                const computedStyle = window.getComputedStyle(stickyWrap);
                const topVal = parseFloat(computedStyle.top);
                const stickyTop = isNaN(topVal) ? 0 : topVal;
                return stickyTop + stickyWrap.offsetHeight;
            };

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
                            const scale = Eclub.getZoomScale();
                            const offset = getHeaderHeight();
                            const top = targetEl.getBoundingClientRect().top + window.scrollY - (offset * scale);
                            window.scrollTo({ top, behavior: 'smooth' });
                        }
                    }
                });
            });

            window.addEventListener('scroll', () => {
                if (isAutoScrolling || isThrottled) return;
                isThrottled = true;
                requestAnimationFrame(() => {
                    const scale = Eclub.getZoomScale();
                    const offset = getHeaderHeight();
                    const scrollPos = window.scrollY + (offset * scale) + 10;
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

    // 입력 필드 핸들러
    InputHandler: {
        init() {
            // 숫자만 입력 가능 (data-input="number")
            document.addEventListener('input', (e) => {
                const input = e.target;
                const type = input.dataset.input || input.getAttribute('data-input');

                if (type === 'number') {
                    input.value = input.value.replace(/[^0-9]/g, '');
                }

                if (type === 'phone') {
                    let val = input.value.replace(/[^0-9]/g, '');
                    if (val.length > 11) val = val.substring(0, 11);

                    if (val.length <= 3) {
                        input.value = val;
                    } else if (val.length <= 7) {
                        input.value = val.replace(/(\d{3})(\d{1,4})/, '$1 $2');
                    } else {
                        input.value = val.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1 $2 $3');
                    }
                }
            });

            // 숫자 입력 시 제어
            document.addEventListener('keydown', (e) => {
                const input = e.target;
                const type = input.dataset.input || input.getAttribute('data-input');
                if (type === 'number' || type === 'phone') {
                    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                    if (allowedKeys.includes(e.key)) return;

                    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;

                    if (!/^\d$/.test(e.key)) {
                        e.preventDefault();
                    }
                }
            });
        }
    },

    // 지인 추천 관련
    Referral: {
        init() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-referral-cta, #friend-number-send');
                if (!btn) return;

                const isEnded = btn.dataset.eventStatus === 'ended';

                const message = isEnded ? '이벤트 기간이 종료되었습니다.' : (btn.dataset.toastMessage || '추천 메세지가 발송되었습니다.');
                const position = btn.dataset.toastPosition || 'bottom-center';

                Eclub.Toast.show({
                    message: message,
                    trigger: btn,
                    position: position
                });
            });
        }
    },

    FloatingUtil: {
        init() {
            const floatingContainer = document.querySelector('.floating-util');
            const btnBack = document.getElementById('btn-floating-back');
            const btnTop = document.getElementById('btn-floating-top');
            const btnQuick = document.getElementById('btn-mobile-quick');

            if (!floatingContainer || floatingContainer._isInit) return;
            floatingContainer._isInit = true;

            // 바텀 시트가 있으면 클래스 추가 (위치 보정을 위함)
            const sheetEl = document.querySelector('.bottom-sheet');
            if (sheetEl) {
                floatingContainer.classList.add('has-bottom-sheet');
            }


            if (btnBack) {
                if (window.history.length > 1) {
                    btnBack.classList.remove('is-hidden');
                } else {
                    btnBack.classList.add('is-hidden');
                }
                btnBack.addEventListener('click', () => {
                    if (window.history.length > 1) {
                        window.history.back();
                    }
                });
            }

            if (btnTop) {
                const quickMenuLayer = document.getElementById('quick-menu-layer');

                const checkScroll = () => {
                    if (window.scrollY > 300) {
                        btnTop.classList.remove('is-hidden');
                        if (btnQuick) btnQuick.classList.add('move-up');
                        if (quickMenuLayer) quickMenuLayer.classList.add('move-up');
                    } else {
                        btnTop.classList.add('is-hidden');
                        if (btnQuick) btnQuick.classList.remove('move-up');
                        if (quickMenuLayer) quickMenuLayer.classList.remove('move-up');
                    }
                };

                window.addEventListener('scroll', checkScroll, { passive: true });
                checkScroll();

                btnTop.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        }
    },

    // HTML 인클루드 로더 & 스피너 제어
    Loader: {
        overlay: null,
        requestCount: 0,

        async init() {
            // 로딩 오버레이 구조 생성 (기본 숨김)
            if (!document.querySelector('.loading-overlay')) {
                const loaderHTML = `
                    <div class="loading-overlay" style="display: none;">
                        <div class="spinner">
                            <div class="bounce1"></div>
                            <div class="bounce2"></div>
                            <div class="bounce3"></div>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('afterbegin', loaderHTML);
            }

            this.overlay = document.querySelector('.loading-overlay');

            // HTML Include 처리
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

            // Fetch 인터셉터 활성화 (데이터 통신 감지)
            this.enableInterceptor();
        },

        enableInterceptor() {
            const self = this;

            // 1. Fetch API 인터셉트
            const originalFetch = window.fetch;
            window.fetch = async (...args) => {
                self.requestCount++;
                self.show();

                try {
                    const response = await originalFetch(...args);
                    return response;
                } catch (error) {
                    throw error;
                } finally {
                    self.requestCount--;
                    if (self.requestCount <= 0) {
                        // 약간의 지연을 두어 깜빡임 방지
                        setTimeout(() => {
                            if (self.requestCount <= 0) {
                                self.requestCount = 0;
                                self.hide();
                            }
                        }, 300);
                    }
                }
            };

            // 2. XMLHttpRequest (Ajax/jQuery) 인터셉트
            const originalOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function (...args) {
                return originalOpen.apply(this, args);
            };

            XMLHttpRequest.prototype.send = function (...args) {
                self.requestCount++;
                self.show();

                this.addEventListener('loadend', () => {
                    self.requestCount--;
                    if (self.requestCount <= 0) {
                        setTimeout(() => {
                            if (self.requestCount <= 0) {
                                self.requestCount = 0;
                                self.hide();
                            }
                        }, 300);
                    }
                });

                return originalSend.apply(this, args);
            };
        },

        show() {
            if (!this.overlay) this.overlay = document.querySelector('.loading-overlay');
            if (this.overlay) {
                this.overlay.style.display = 'flex';
                this.overlay.classList.add('is-active');
                document.body.style.overflow = 'hidden';
            }
        },

        hide() {
            if (!this.overlay) this.overlay = document.querySelector('.loading-overlay');
            // 요청이 남아있으면 숨기지 않음
            if (this.requestCount > 0) return;

            if (this.overlay) {
                this.overlay.style.display = 'none';
                this.overlay.classList.remove('is-active');
                document.body.style.overflow = '';
            }
        }
    },

    // 퀵메뉴 커스텀 스크롤
    QuickMenuScroll: {
        init() {
            const container = document.querySelector('.quick-menu-container');
            const thumb = document.querySelector('.quick-menu-section .scroll-thumb');
            if (!container || !thumb) return;

            let isDragging = false;
            let startX = 0;
            let startScrollLeft = 0;

            const updateThumb = () => {
                const scrollLeft = container.scrollLeft;
                const scrollWidth = container.scrollWidth;
                const clientWidth = container.clientWidth;

                const maxScroll = scrollWidth - clientWidth;
                if (maxScroll <= 0) {
                    thumb.style.width = '0';
                    return;
                }

                const scrollRatio = scrollLeft / maxScroll;
                const track = thumb.parentElement;
                const trackWidth = track.clientWidth;

                // 썸네일 너비 계산
                const thumbWidth = (clientWidth / scrollWidth) * trackWidth;
                thumb.style.width = `${Math.max(thumbWidth, 20)}px`;

                // 위치 이동
                const maxThumbTranslate = trackWidth - thumb.offsetWidth;
                const translateX = scrollRatio * maxThumbTranslate;
                thumb.style.transform = `translateX(${translateX}px)`;
            };

            // 드래그 시작
            const onDragStart = (e) => {
                isDragging = true;
                startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
                startScrollLeft = container.scrollLeft;
                thumb.classList.add('is-dragging');
                document.body.style.userSelect = 'none';
            };

            // 드래그 움직임 처리
            const onDragMove = (e) => {
                if (!isDragging) return;

                if (e.cancelable) e.preventDefault();

                const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                const deltaX = currentX - startX;

                const track = thumb.parentElement;
                const trackWidth = track.clientWidth;
                const maxThumbTranslate = trackWidth - thumb.offsetWidth;
                const maxScroll = container.scrollWidth - container.clientWidth;

                if (maxThumbTranslate <= 0) return;

                // 드래그 비율에 따른 스크롤 이동
                const scrollDelta = (deltaX / maxThumbTranslate) * maxScroll;
                container.scrollLeft = startScrollLeft + scrollDelta;
            };

            // 드래그 종료
            const onDragEnd = () => {
                if (!isDragging) return;
                isDragging = false;
                thumb.classList.remove('is-dragging');
                document.body.style.userSelect = '';
            };

            // 이벤트 바인딩
            thumb.addEventListener('mousedown', onDragStart);
            thumb.addEventListener('touchstart', onDragStart, { passive: true });

            window.addEventListener('mousemove', onDragMove, { passive: false });
            window.addEventListener('touchmove', onDragMove, { passive: false });
            window.addEventListener('mouseup', onDragEnd);
            window.addEventListener('touchend', onDragEnd);

            container.addEventListener('scroll', updateThumb);
            window.addEventListener('resize', updateThumb);

            // 초기 실행
            updateThumb();
        }
    },


    // 전체 모듈 초기화
    async init() {
        // 비동기 로드와 무관한 Delegation 이벤트 우선 바인딩
        this.Referral.init();
        this.Tabs.init();
        this.Quantity.init();
        this.Favorites.init();
        this.Cart.init();
        this.InputHandler.init();
        this.QuickMenuScroll.init();

        // 비동기 포함 나머지 초기화
        this.Slider.init();
        await this.Loader.init();
        this.QuickMenu.init();
        this.FloatingUtil.init();
        this.Clipboard.init();
        this.Toggle.init();
        this.BottomSheet.init();
        this.CartSelection.init();
        this.CategorySort.init();
        this.ProductMore.init();
        this.ScrollSpy.init();
        if (this.BrowserZoom) this.BrowserZoom.init();

        console.log('Eclub Common UI Initialized');
    }
};

// DOM 로드 시 실행
document.addEventListener('DOMContentLoaded', () => Eclub.init());
