// 공통 UI
const Eclub = {
    // 상수
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

    // 줌 배율 반환
    getZoomScale() {
        const zoom = document.body.style.zoom;
        if (!zoom) return 1;
        return parseFloat(zoom) / 100;
    },

    // 토스트
    Toast: {
        container: null,
        // 컨테이너 초기화
        init() {
            if (this.container) return;
            this.container = document.querySelector('.toast-container');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'toast-container';
                document.body.appendChild(this.container);
            }
        },
        // 토스트 노출
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
                const scale = Eclub.getZoomScale(); // 줌 Scale 반영
                const margin = 20;
                let left, top;

                if (isFixed) {
                    // 뷰포트 기준
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
                    // 트리거 기준
                    const rect = trigger.getBoundingClientRect();
                    const scrollX = window.scrollX / scale;
                    const scrollY = window.scrollY / scale;

                    // 좌표 계산 (줌 스케일 반영)
                    const rectLeft = rect.left / scale;
                    const rectTop = rect.top / scale;
                    const rectRight = rect.right / scale;
                    const rectBottom = rect.bottom / scale;
                    const rectWidth = rect.width / scale;
                    const rectHeight = rect.height / scale;

                    const offset = 4; // 트리거 간격 조정 (썸네일 대응)

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

                    // 화면 이탈 방지
                    const windowWidth = window.innerWidth / scale;
                    const documentHeight = document.documentElement.scrollHeight / scale;
                    const safeMargin = 10;

                    if (left < safeMargin) left = safeMargin;
                    if (left + toastWidth > windowWidth - safeMargin) left = windowWidth - toastWidth - safeMargin;
                    if (top < safeMargin + scrollY) top = safeMargin + scrollY;
                    if (top + toastHeight > documentHeight - safeMargin) top = documentHeight - toastHeight - safeMargin;
                } else {
                    // 기본 위치 설정
                    const winW = window.innerWidth / scale;
                    left = (winW / 2) - (toastWidth / 2);
                    top = margin;
                    toast.style.position = 'fixed';
                }

                toast.style.left = `${left}px`;
                toast.style.top = `${top}px`;
                toast.classList.add('active');
            });

            // 토스트 자동 소멸
            setTimeout(() => {
                toast.classList.remove('active');
                setTimeout(() => toast.remove(), Eclub.Const.ANIMATION_DURATION);
            }, duration);
        }
    },

    // 클립보드 복사
    Clipboard: {
        // 복사 이벤트 바인딩
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
        // 복사 실행
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

    // 슬라이드 토글
    Toggle: {
        // 이벤트 바인딩
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
        // 토글 동작
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
        // 슬라이드 닫기
        slideUp(element, duration = Eclub.Const.ANIMATION_DURATION, callback) {
            element.style.height = element.offsetHeight + 'px';
            element.offsetHeight; // Reflow 강제
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
        // 슬라이드 열기
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

    // 줌 배율 설정 (80~120%)
    BrowserZoom: {
        zoomLevel: 100, // 초기화 시 DEFAULT 기준 설정

        init() {
            // 상수 참조
            this.min = Eclub.Const.ZOOM.MIN;
            this.max = Eclub.Const.ZOOM.MAX;
            this.step = Eclub.Const.ZOOM.STEP;
            this.zoomLevel = Eclub.Const.ZOOM.DEFAULT;

            const savedZoom = localStorage.getItem('eclub_zoom_level');
            if (savedZoom) {
                this.zoomLevel = parseInt(savedZoom, 10);
            }

            // 초기 줌 배율 적용
            this.applyZoom();

            // 이벤트 위임 처리
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
            // 레이아웃 재계산 (슬라이더 대응)
            window.dispatchEvent(new Event('resize'));
        }
    },

    // 탭
    Tabs: {
        // 탭 초기화
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
        // 탭 활성화
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
                // 더보기 높이 갱신 (탭 전환 대응)
                Eclub.ProductMore.resetActiveList(targetId);
            }
        }
    },

    // 수량 제어
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

    // 커스텀 셀렉트
    CustomSelect: {
        init() {
            document.addEventListener('click', (e) => {
                const label = e.target.closest('.custom-select .select-label');
                const option = e.target.closest('.custom-select .select-options li');
                const allSelects = document.querySelectorAll('.custom-select');

                // 라벨 클릭 처리
                if (label) {
                    const select = label.closest('.custom-select');
                    const isOpen = select.classList.contains('is-open');

                    // 외부 드롭다운 닫기
                    allSelects.forEach(s => s.classList.remove('is-open'));

                    if (!isOpen) {
                        select.classList.add('is-open');
                    }
                    return;
                }

                // 옵션 선택 처리
                if (option) {
                    const select = option.closest('.custom-select');
                    const labelText = select.querySelector('.select-label');
                    const icon = labelText.querySelector('i');
                    
                    // 값 변경 (아이콘 보존)
                    labelText.innerHTML = `${option.textContent} <i class="${icon.className}"></i>`;
                    
                    // active 상태 갱신
                    select.querySelectorAll('li').forEach(li => li.classList.remove('active'));
                    option.classList.add('active');
                    
                    select.classList.remove('is-open');
                    return;
                }

                // 외부 클릭 해제
                allSelects.forEach(s => s.classList.remove('is-open'));
            });
        }
    },

    // 장바구니
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

    // 관심상품
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

    // 모바일 퀵메뉴
    QuickMenu: {
        init() {
            const btn = document.getElementById('btn-mobile-quick');
            const layer = document.getElementById('quick-menu-layer');
            if (!btn || !layer) return;

            const closeBtn = layer.querySelector('.btn-quick-close');

            // 메뉴 노출
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(btn, layer);
            });

            // 메뉴 숨김
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.close(btn, layer);
                });
            }

            // 외부 클릭 대응
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



    // 바텀 시트
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

    // 전체/그룹 선택 (장바구니, 카테고리 등)
    Selection: {
        init() {
            // 1. 장바구니 페이지
            const cartContainer = document.querySelector('.cart-container');
            const cartMaster = document.querySelector('.cart-select-bar .checkbox-container input[type="checkbox"]');
            
            if (cartContainer && cartMaster) {
                this.initCart(cartContainer, cartMaster);
            }

            // 2. 카테고리 페이지
            const categoryBar = document.querySelector('.category-filter-bar');
            // 필터 바가 속한 메인 영역의 리스트를 참조하도록 수정
            const productList = categoryBar?.closest('.category-main')?.querySelector('.product-list');
            const categoryMaster = categoryBar?.querySelector('.filter-left .checkbox-container input[type="checkbox"]');

            if (productList && categoryMaster) {
                this.initCategory(productList, categoryMaster);
            }
        },

        // 장바구니 로직 (그룹 존재)
        initCart(container, master) {
            const groups = container.querySelectorAll('.cart-group');

            master.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                groups.forEach(group => {
                    const groupHeader = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
                    const items = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');
                    if (groupHeader) groupHeader.checked = isChecked;
                    items.forEach(cb => cb.checked = isChecked);
                });
                this.updateDeleteButtonState();
            });

            groups.forEach(group => {
                const groupHeader = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
                const items = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');
                
                if (groupHeader) {
                    groupHeader.addEventListener('change', (e) => {
                        const isChecked = e.target.checked;
                        items.forEach(cb => cb.checked = isChecked);
                        this.updateMasterState(master, '.cart-item .item-check input[type="checkbox"]');
                        this.updateDeleteButtonState();
                    });
                }

                items.forEach(item => {
                    item.addEventListener('change', () => {
                        if (groupHeader) {
                            groupHeader.checked = Array.from(items).every(cb => cb.checked);
                        }
                        this.updateMasterState(master, '.cart-item .item-check input[type="checkbox"]');
                        this.updateDeleteButtonState();
                    });
                });
            });

            // 초기 상태 업데이트
            this.updateDeleteButtonState();
        },

        // 카테고리 로직 (평면 리스트)
        initCategory(container, master) {
            const items = container.querySelectorAll('.product-item .item-check input[type="checkbox"]');

            master.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                items.forEach(cb => cb.checked = isChecked);
                this.updateAddCartButtonState();
            });

            items.forEach(item => {
                item.addEventListener('change', () => {
                    master.checked = Array.from(items).every(cb => cb.checked);
                    this.updateAddCartButtonState();
                });
            });

            // 초기 상태 업데이트
            master.checked = items.length > 0 && Array.from(items).every(cb => cb.checked);
            this.updateAddCartButtonState();
        },

        updateMasterState(master, itemSelector) {
            const allItems = document.querySelectorAll(itemSelector);
            if (allItems.length === 0) {
                master.checked = false;
                return;
            }
            master.checked = Array.from(allItems).every(cb => cb.checked);
        },

        updateDeleteButtonState() {
            const btn = document.querySelector('.btn-delete-selected, .btn-select-action');
            if (btn) {
                const checkedCount = document.querySelectorAll('.cart-item .item-check input[type="checkbox"]:checked').length;
                if (checkedCount > 0) {
                    btn.removeAttribute('disabled');
                } else {
                    btn.setAttribute('disabled', '');
                }
            }
        },
        // 상품 선택 초기화
        resetCategorySelection() {
            // 메인 영역의 리스트를 명확히 지칭
            const productList = document.querySelector('.category-main .product-list');
            if (!productList) return;
            
            const items = productList.querySelectorAll('.product-item .item-check input[type="checkbox"]');
            const master = document.querySelector('.category-filter-bar .filter-left .checkbox-container input[type="checkbox"]');
            
            items.forEach(cb => {
                cb.checked = false;
            });
            
            if (master) {
                master.checked = false;
            }
            
            this.updateAddCartButtonState();
        },

        updateAddCartButtonState() {
            const btn = document.querySelector('.category-filter-bar .btn-add-cart');
            if (btn) {
                const checkedCount = document.querySelectorAll('.product-item .item-check input[type="checkbox"]:checked').length;
                if (checkedCount > 0) {
                    btn.classList.add('active'); // active 상태 표시
                    btn.removeAttribute('disabled');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('disabled', '');
                }
            }
        }
    },

    // 카테고리 필터링
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
                    // 상품 선택 초기화
                    Eclub.Selection.resetCategorySelection();

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

                            // 더보기 초기화
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

    // 배송 필터링
    DeliverySort: {
        init() {
            // 초기 상태 동기화
            document.querySelectorAll('.delivery-types .type-btn').forEach(btn => {
                const input = btn.querySelector('input');
                if (input && input.checked) {
                    btn.classList.add('active');
                }
            });

            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.delivery-types .type-btn');
                if (!btn) return;

                // 체크박스 수동 제어
                if (e.target.tagName === 'INPUT') return; 
                e.preventDefault();

                const group = btn.closest('.btn-group');
                const filterGroup = group?.dataset.filterGroup;
                if (!filterGroup) return;

                const input = btn.querySelector('input');
                const wasActive = btn.classList.contains('active');

                // 상호 배타 선택 처리
                group.querySelectorAll('.type-btn').forEach(b => {
                    b.classList.remove('active');
                    const cb = b.querySelector('input');
                    if (cb) cb.checked = false;
                });

                // 현재 항목 토글
                if (!wasActive) {
                    btn.classList.add('active');
                    if (input) input.checked = true;
                } else {
                    if (input) input.checked = false;
                }

                // 상품 선택 초기화
                Eclub.Selection.resetCategorySelection();

                this.applyFilter();
            });

            // 초기 필터 적용
            this.applyFilter();
        },

        // 상품 노출 제어
        applyFilter() {
            const activeFilter = document.querySelector('.btn-group[data-filter-group="delivery"] .type-btn.active')?.dataset.type;
            const productItems = document.querySelectorAll('.product-list .product-item');
            
            productItems.forEach(item => {
                const itemDelivery = item.dataset.deliveryType;
                const itemCenter = item.dataset.deliveryCenter;
                
                let isMatch = true;
                
                // 통합 필터 매칭
                if (activeFilter) {
                    isMatch = (itemDelivery === activeFilter || itemCenter === activeFilter);
                }
                
                // Display 제어
                item.style.display = isMatch ? '' : 'none';
            });
        }
    },

    // 사이드바 아코디언
    CategoryMenu: {
        init() {
            const sidebar = document.querySelector('.category-sidebar');
            if (!sidebar) return;

            // 데이터 렌더링
            this.loadMenu();

            // 이벤트 위임
            sidebar.addEventListener('click', (e) => {
                const header = e.target.closest('.sidebar-menu > li.has-sub > a');
                const subLink = e.target.closest('.sub-menu a');

                // 1Depth 토글
                if (header) {
                    e.preventDefault();
                    const parent = header.parentElement;
                    const subMenu = parent.querySelector('.sub-menu');
                    const isOpen = parent.classList.contains('is-open');

                    // 타 메뉴 닫기
                    const otherOpenMenus = sidebar.querySelectorAll('.sidebar-menu > li.has-sub.is-open');
                    otherOpenMenus.forEach(menu => {
                        if (menu !== parent) {
                            const otherSub = menu.querySelector('.sub-menu');
                            menu.classList.remove('is-open');
                            Eclub.Toggle.slideUp(otherSub);
                        }
                    });

                    // 현재 메뉴 토글
                    if (isOpen) {
                        parent.classList.remove('is-open');
                        Eclub.Toggle.slideUp(subMenu);
                    } else {
                        parent.classList.add('is-open');
                        Eclub.Toggle.slideDown(subMenu);
                    }
                    return;
                }

                // 서브메뉴 활성화
                if (subLink) {
                    // active 상태 초기화
                    const allLinks = sidebar.querySelectorAll('a');
                    allLinks.forEach(link => link.classList.remove('active', 'active-header'));

                    // 클릭한 서브메뉴 활성화
                    subLink.classList.add('active');

                    // 부모 헤더 강조
                    const parentLi = subLink.closest('.has-sub');
                    if (parentLi) {
                        const parentHeader = parentLi.querySelector('> a');
                        if (parentHeader) parentHeader.classList.add('active-header');
                    }
                }
            });
        },

        // 데이터 로드 (JSON)
        async loadMenu() {
            try {
                const response = await fetch('/assets/data/category-menu.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                this.render(data);
            } catch (err) {
                console.error('카테고리 메뉴 로드 실패:', err);
            }
        },

        // DOM 렌더링
        render(data) {
            const container = document.querySelector('.category-sidebar');
            if (!container) return;

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
            container.innerHTML = html;
        }
    },

    // 상품 더보기 (Paging)
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

        // 노출 아이템 필터링
        getVisibleItems(container) {
            return Array.from(container.querySelectorAll('.product-item')).filter(
                item => item.style.display !== 'none' || item.dataset.hiddenByMore === 'true'
            );
        },

        // 초기 페이징 설정
        applyPaging(container) {
            const allItems = this.getVisibleItems(container);
            const moreWrap = this.getMoreWrapper(container);
            const pageSize = this.PAGE_SIZE;

            // 10개 이하 버튼 숨김
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

            // 초기 10개 노출
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

            // 버튼 상태 갱신
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

        // 높이 갱신 (Resize 대응)
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

            // 목록 축소 (10개 복원)
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

            // 목록 확장 (+10개)
            const nextCount = Math.min(visibleCount + pageSize, allItems.length);
            for (let i = visibleCount; i < nextCount; i++) {
                allItems[i].style.display = '';
                delete allItems[i].dataset.hiddenByMore;
            }
            container.dataset.visibleCount = nextCount;

            // 전체 노출 완료 처리
            if (nextCount >= allItems.length) {
                container.classList.add('is-expanded');
                if (span) span.textContent = '상품닫기';
                btn.classList.add('active');
            }
        },

        // 활성 리스트 초기화 (탭 대응)
        resetActiveList(targetId) {
            const activeList = document.getElementById(targetId);
            if (!activeList || !activeList.classList.contains('is-more')) return;

            // 상태 마킹 갱신
            activeList.querySelectorAll('.product-item[data-hidden-by-more]').forEach(item => {
                item.style.display = '';
                delete item.dataset.hiddenByMore;
            });

            requestAnimationFrame(() => {
                this.applyPaging(activeList);
            });
        },

        // 정렬 초기화
        resetByCategory(container) {
            // 마킹 해제
            container.querySelectorAll('.product-item[data-hidden-by-more]').forEach(item => {
                delete item.dataset.hiddenByMore;
            });

            requestAnimationFrame(() => {
                this.applyPaging(container);
            });
        }
    },

    // 필터 더보기 (Paging)
    FilterMore: {
        init() {
            const containers = document.querySelectorAll('.filter-list.is-more');
            if (!containers.length) return;

            containers.forEach(container => {
                this.applyPaging(container);
            });

            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.filter-more .btn-more');
                if (!btn) return;

                const moreWrap = btn.closest('.filter-more');
                // 이전 형제 중 filter-list 찾기
                const container = moreWrap?.previousElementSibling;

                if (container && container.classList.contains('is-more')) {
                    e.preventDefault();
                    this.toggle(container, btn);
                }
            });
        },

        getVisibleItems(container) {
            return Array.from(container.querySelectorAll('li')).filter(
                item => item.style.display !== 'none' || item.dataset.hiddenByMore === 'true'
            );
        },

        applyPaging(container) {
            const allItems = this.getVisibleItems(container);
            const moreWrap = container.nextElementSibling;
            const pageSize = parseInt(container.dataset.moreLimit || '5', 10);

            if (allItems.length <= pageSize) {
                if (moreWrap && moreWrap.classList.contains('filter-more')) {
                    moreWrap.style.display = 'none';
                }
                container.dataset.visibleCount = allItems.length;
                allItems.forEach(item => {
                    delete item.dataset.hiddenByMore;
                    item.style.display = '';
                });
                return;
            }

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

            if (moreWrap && moreWrap.classList.contains('filter-more')) {
                moreWrap.style.display = '';
                const btn = moreWrap.querySelector('.btn-more');
                if (btn) {
                    btn.classList.remove('active');
                    const span = btn.querySelector('span');
                    if (span) {
                        const originalText = span.dataset.originalText || span.textContent;
                        span.dataset.originalText = originalText;
                        span.textContent = originalText;
                    }
                }
            }
        },

        toggle(container, btn) {
            const allItems = this.getVisibleItems(container);
            const pageSize = parseInt(container.dataset.moreLimit || '5', 10);
            let visibleCount = parseInt(container.dataset.visibleCount, 10) || pageSize;
            const isExpanded = container.classList.contains('is-expanded');
            const span = btn.querySelector('span');
            const originalText = span ? (span.dataset.originalText || span.textContent) : '';

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

                if (span) span.textContent = originalText;
                btn.classList.remove('active');
                return;
            }

            const nextCount = Math.min(visibleCount + pageSize, allItems.length);
            for (let i = visibleCount; i < nextCount; i++) {
                allItems[i].style.display = '';
                delete allItems[i].dataset.hiddenByMore;
            }
            container.dataset.visibleCount = nextCount;

            if (nextCount >= allItems.length) {
                container.classList.add('is-expanded');
                if (span) {
                    span.textContent = '닫기'; // // 피그마 분석 기반 텍스트 변경
                }
                btn.classList.add('active');
            }
        }
    },

    // 슬라이더
    Slider: {
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
                list.style.transition = animated ? `transform ${Eclub.Const.ANIMATION_DURATION}ms ease-in-out` : 'none';
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
                    }, Eclub.Const.ANIMATION_DURATION + 100);
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
                    // First Page -> Last Page 이동
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

        resetAuto(callback) {
            // 외부 제어
        }
    },

    // 스크롤 스파이
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

    // 입력 핸들러
    InputHandler: {
        init() {
            // 숫자 전용 입력 처리
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

            // 숫자 입력 제어
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

    // 지인 추천
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

            // 위치 보정 (바텀 시트 대응)
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

    // 인클루드/로딩 제어
    Loader: {
        overlay: null,
        requestCount: 0,

        async init() {
            // 오버레이 생성
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

            // HTML Include
            let includes = document.querySelectorAll('[data-include]');
            while (includes.length > 0) {
                const promises = Array.from(includes).map(async (el) => {
                    const url = el.dataset.include;
                    try {
                        const res = await fetch(url);
                        if (res.ok) {
                            let html = await res.text();
                            
                            // 동적으로 페이지 타이틀 변경 지원 (ex: data-page-title="타이틀 명")
                            if (el.dataset.pageTitle) {
                                html = html.replace(/<h1 class="page-title">.*?<\/h1>/, `<h1 class="page-title">${el.dataset.pageTitle}</h1>`);
                            }
                            
                            el.outerHTML = html;
                        } else {
                            console.error('로드 실패:', url);
                            el.removeAttribute('data-include'); // 무한루프 방지
                        }
                    } catch (e) {
                        console.error('인클루드 오류:', url, e);
                        el.removeAttribute('data-include'); // 무한루프 방지
                    }
                });
                await Promise.all(promises);
                includes = document.querySelectorAll('[data-include]');
            }

            // 통신 감지 인터셉터
            this.enableInterceptor();
        },

        enableInterceptor() {
            const self = this;

            // Fetch 인터셉트
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
                        // 깜빡임 방지 (Delay)
                        setTimeout(() => {
                            if (self.requestCount <= 0) {
                                self.requestCount = 0;
                                self.hide();
                            }
                        }, 300);
                    }
                }
            };

            // XHR 인터셉트
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

    // 퀵메뉴 스크롤
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

            // 드래그 이동
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

                // 스크롤 동기화
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

    // 상품 정렬/개수
    ProductSortAndCount: {
        init() {
            document.addEventListener('click', (e) => {
                const sortOption = e.target.closest('.sort-select .select-options li');
                const countOption = e.target.closest('.count-select .select-options li');
                
                if (sortOption || countOption) {
                    // 상품 선택 초기화
                    Eclub.Selection.resetCategorySelection();
                    
                    // UI 갱신 대기 (Timeout)
                    setTimeout(() => {
                        this.applyFilterAndSort();
                    }, 0);
                }
            });

            const productList = document.querySelector('.product-list');
            if (productList) {
                // 초기 정렬 적용
                this.applyFilterAndSort();
            }
        },

        applyFilterAndSort() {
            const productList = document.querySelector('.product-list');
            if (!productList) return;

            const items = Array.from(productList.querySelectorAll('.product-item'));
            if (items.length === 0) return;

            const sortActive = document.querySelector('.sort-select .select-options li.active');
            const countActive = document.querySelector('.count-select .select-options li.active');
            
            const sortType = sortActive ? sortActive.textContent.trim() : '판매순';
            let countLimit = 80;
            if (countActive) {
                const countText = countActive.textContent.trim();
                countLimit = parseInt(countText.replace(/[^0-9]/g, ''), 10) || 80;
            }

            items.sort((a, b) => {
                if (sortType === '판매순') {
                    // 판매량 기준 정렬
                    return (parseInt(b.dataset.sales) || 0) - (parseInt(a.dataset.sales) || 0);
                } else if (sortType === '많은 구매횟수') {
                    // 구매 횟수 정렬
                    return (parseInt(b.dataset.purchase) || 0) - (parseInt(a.dataset.purchase) || 0);
                } else if (sortType === '신상품순') {
                    // 신상품 정렬
                    return (parseInt(b.dataset.new) || 0) - (parseInt(a.dataset.new) || 0);
                } else if (sortType === '낮은가격순') {
                    // 최저가 정렬
                    return (parseInt(a.dataset.price) || 0) - (parseInt(b.dataset.price) || 0);
                }
                return 0;
            });

            items.forEach((item, index) => {
                if (index < countLimit) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
                productList.appendChild(item); // 노드 재배치 (정렬 반영)
            });
        }
    },

    // 헤더 메인 메뉴
    HeaderMenu: {
        init() {
            const mainMenu = document.querySelector('.main-menu');
            if (!mainMenu) return;

            const links = mainMenu.querySelectorAll('a');
            const currentPath = window.location.pathname;

            links.forEach(link => {
                const href = link.getAttribute('href');
                // 현재 경로와 href가 일치하면 active 클래스 추가 (단순 포함 여부로 체크)
                if (href && href !== '#' && currentPath.includes(href)) {
                    link.classList.add('active');
                }

                link.addEventListener('click', () => {
                    // 클릭 시 모든 active 제거 후 현재 요소에 추가
                    links.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                });
            });
        }
    },

    // 헤더 카테고리 메뉴
    HeaderBrand: {
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
                    if (Eclub.HeaderCategory && typeof Eclub.HeaderCategory.close === 'function') {
                        try { Eclub.HeaderCategory.close(); } catch(e) {}
                    }
                    if (Eclub.MobileCategorySheet && typeof Eclub.MobileCategorySheet.close === 'function') {
                        try { Eclub.MobileCategorySheet.close(); } catch(e) {}
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
                const response = await fetch('/assets/data/brand-list.json');
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
                            <img src="/assets/icons/brand/${item.logo}" alt="${item.name}">
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
            if (Eclub.Search && Eclub.Search.hideDropdown) Eclub.Search.hideDropdown();
            
            if (this.sheet) {
                this.sheet.classList.add('is-open');
                this.overlay?.classList.add('is-visible');
                document.body.classList.add('no-scroll');
            } else if (this.container) {
                this.container.style.display = 'block';
            }
            
            this.toggleBtns.forEach(btn => btn.classList.add('active'));
        },

        close() {
            if (this.sheet) {
                this.sheet.classList.remove('is-open');
                this.overlay?.classList.remove('is-visible');
                document.body.classList.remove('no-scroll');
            } else if (this.container) {
                this.container.style.display = 'none';
            }
            
            this.toggleBtns.forEach(btn => btn.classList.remove('active'));
        }
    },


    HeaderCategory: {
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
            try {
                const response = await fetch('/assets/data/category-menu.json');
                if (!response.ok) throw new Error('Network response was not ok');
                this.menuData = await response.json();
                this.renderDepth1();
                // 초기값으로 첫 번째 카테고리 활성화
                if (this.menuData.length > 0) {
                    this.updateDepth2(this.menuData[0].id);
                }
            } catch (err) {
                console.error('카테고리 메뉴 로드 실패:', err);
            }
        },

        renderDepth1() {
            this.depth1List.innerHTML = this.menuData.map(item => `
                <li data-id="${item.id}">
                    <a href="${item.link}">${item.name}</a>
                </li>
            `).join('');
        },

        updateDepth2(id) {
            const data = this.menuData.find(item => item.id === id);
            if (!data) return;

            // Depth1 활성화 상태 변경
            const items = this.depth1List.querySelectorAll('li');
            items.forEach(li => {
                li.classList.toggle('active', li.dataset.id === id);
            });

            // Depth2 렌더링
            let html = `<li><a href="${data.link}" class="is-all">${data.name === '전체' ? '전체' : data.name + ' 전체'}</a></li>`; // '전체' 카테고리는 중복 방지
            if (data.subMenu) {
                html += data.subMenu.map(sub => `
                    <li><a href="${sub.link}">${sub.name}</a></li>
                `).join('');
            }
            this.depth2List.innerHTML = html;
        },

        toggle() {
            const isOpen = this.container.style.display === 'block';
            if (isOpen) {
                this.close();
            } else {
                // 브랜드관이 열려있으면 닫기
                if (Eclub.HeaderBrand && Eclub.HeaderBrand.close) {
                    Eclub.HeaderBrand.close();
                }
                this.open();
            }
        },

        open() {
            if (!this.container) return; // 엘리먼트 없으면 중단
            // 검색창 드롭다운 닫기
            if (Eclub.Search && Eclub.Search.hideDropdown) Eclub.Search.hideDropdown();

            this.container.style.display = 'block';
            if (this.toggleBtn) this.toggleBtn.classList.add('active');
        },

        close() {
            if (!this.container) return; // 엘리먼트 없으면 중단
            this.container.style.display = 'none';
            if (this.toggleBtn) this.toggleBtn.classList.remove('active');
        }
    },

    // 모바일 카테고리 바텀시트
    MobileCategorySheet: {
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
            try {
                const response = await fetch('/assets/data/category-menu.json');
                if (!response.ok) throw new Error('Network response was not ok');
                this.menuData = await response.json();
                this.renderDepth1();
                // 첫 번째 카테고리 활성화
                if (this.menuData.length > 0) {
                    this.updateDepth2(this.menuData[0].id);
                }
            } catch (err) {
                console.error('모바일 카테고리 메뉴 로드 실패:', err);
            }
        },

        renderDepth1() {
            this.depth1List.innerHTML = this.menuData.map(item => `
                <li data-id="${item.id}">
                    <a href="${item.link}">${item.name}</a>
                </li>
            `).join('');
        },

        updateDepth2(id) {
            const data = this.menuData.find(item => item.id === id);
            if (!data) return;

            // depth1 활성화 상태 변경
            this.depth1List.querySelectorAll('li').forEach(li => {
                li.classList.toggle('active', li.dataset.id === id);
            });

            // depth2 렌더링
            let html = `<li><a href="${data.link}" class="is-all">${data.name === '전체' ? '전체' : data.name + ' 전체'}</a></li>`;
            if (data.subMenu) {
                html += data.subMenu.map(sub => `
                    <li><a href="${sub.link}">${sub.name}</a></li>
                `).join('');
            }
            this.depth2List.innerHTML = html;
        },

        open() {
            this.overlay.classList.add('is-visible');
            this.sheet.classList.add('is-open');
            document.body.classList.add('no-scroll');
        },

        close() {
            this.sheet.classList.remove('is-open');
            this.overlay.classList.remove('is-visible');
            document.body.classList.remove('no-scroll');
        }
    },

    // 검색창 드롭다운 제어
    Search: {
        init() {
            const searchBox = document.querySelector('.search-box');
            if (!searchBox) return;

            const input = searchBox.querySelector('.search-input');
            const clearBtn = searchBox.querySelector('.btn-clear');
            const dropdown = searchBox.querySelector('.search-dropdown');
            const defaultView = searchBox.querySelector('.search-default-view');
            const autocompleteView = searchBox.querySelector('.search-autocomplete-view');

            // UI 상태 업데이트
            const updateView = () => {
                const val = input.value.trim();
                const hasText = val.length > 0;

                // 텍스트 삭제 버튼 노출
                if (clearBtn) {
                    clearBtn.style.display = hasText ? 'flex' : 'none';
                }

                if (hasText) {
                    // 초성 검색 블럭으로 전환
                    if (defaultView) defaultView.style.display = 'none';
                    if (autocompleteView) autocompleteView.style.display = 'block';
                } else {
                    // 최근검색어, 급상승 검색어로 복구
                    if (defaultView) defaultView.style.display = 'block';
                    if (autocompleteView) autocompleteView.style.display = 'none';
                }
            };

            const showDropdown = () => {
                // 브랜드관 및 카테고리 레이어 닫기
                if (Eclub.HeaderBrand && Eclub.HeaderBrand.close) Eclub.HeaderBrand.close();
                if (Eclub.HeaderCategory && Eclub.HeaderCategory.close) Eclub.HeaderCategory.close();

                if (dropdown) dropdown.style.display = 'block';
                updateView();
            };

            const hideDropdown = () => {
                if (dropdown) dropdown.style.display = 'none';
            };

            this.showDropdown = showDropdown;
            this.hideDropdown = hideDropdown;

            // 이벤트 바인딩
            if (input) {
                input.addEventListener('focus', this.showDropdown);
                input.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showDropdown();
                });
                input.addEventListener('input', updateView);
            }

            // 입력 텍스트 전체 삭제
            if (clearBtn) {
                clearBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    input.value = '';
                    input.focus();
                    updateView();
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

            // 최근 검색어 개별 삭제 (예시 및 전파 방지)
            const deleteItems = searchBox.querySelectorAll('.btn-delete-item');
            deleteItems.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const li = btn.closest('li');
                    if (li) li.remove();
                    
                    // 모든 항목 삭제 시 '최근 검색어가 없습니다' 노출 로직 (추가 가능)
                    const list = searchBox.querySelector('.recent-list');
                    if (list && list.children.length === 0) {
                        const noData = searchBox.querySelector('.no-data');
                        if (noData) noData.style.display = 'block';
                    }
                });
            });

            // 전체 삭제 버튼
            const deleteAllBtn = searchBox.querySelector('.btn-delete-all');
            if (deleteAllBtn) {
                deleteAllBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const list = searchBox.querySelector('.recent-list');
                    if (list) list.innerHTML = '';
                    const noData = searchBox.querySelector('.no-data');
                    if (noData) noData.style.display = 'block';
                });
            }
        }
    },

    // 모바일 검색 오버레이 제어
    SearchOverlay: {
        init() {
            // 기본 헤더의 검색창과 검색 결과 페이지의 헤더 검색창을 모두 선택
            const triggerInputs = document.querySelectorAll('.header .input-search, header.header .input-search-overlay');
            const searchOverlay = document.getElementById('search-overlay');
            
            if (!searchOverlay) return;

            // 오버레이 내부 요소를 명확하게 한정하여 선택
            const overlayCloseBtn = searchOverlay.querySelector('.btn-close-overlay');
            const overlaySearchInput = searchOverlay.querySelector('.input-search-overlay');
            const overlayDefaultView = searchOverlay.querySelector('.search-default-view');
            const overlayAutocompleteView = searchOverlay.querySelector('.search-autocomplete-view');

            // 오버레이 열기
            triggerInputs.forEach(input => {
                input.addEventListener('click', (e) => {
                    e.preventDefault();
                    searchOverlay.classList.add('open');
                    
                    // 만약 검색결과 페이지에서 클릭한 경우 기존 검색어 유지
                    if(input.classList.contains('input-search-overlay') && overlaySearchInput) {
                        overlaySearchInput.value = input.value;
                        overlaySearchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    
                    if (overlaySearchInput) overlaySearchInput.focus();
                    document.body.style.overflow = 'hidden'; 
                });
            });

            // 오버레이 닫기
            if (overlayCloseBtn) {
                overlayCloseBtn.addEventListener('click', () => {
                    searchOverlay.classList.remove('open');
                    document.body.style.overflow = ''; 
                });
            }

            const clearBtn = searchOverlay.querySelector('.btn-clear');

            // 입력값에 따라 뷰 전환 및 삭제 버튼 제어 (PC 로직 적용)
            if (overlaySearchInput) {
                const updateOverlayView = () => {
                    const value = overlaySearchInput.value.trim();
                    const hasText = value.length > 0;

                    // 텍스트 삭제 버튼 노출 제어
                    if (clearBtn) {
                        clearBtn.style.display = hasText ? 'flex' : 'none';
                    }

                    if (hasText) {
                        if (overlayDefaultView) overlayDefaultView.style.display = 'none';
                        if (overlayAutocompleteView) overlayAutocompleteView.style.display = 'block';
                    } else {
                        if (overlayDefaultView) overlayDefaultView.style.display = 'block';
                        if (overlayAutocompleteView) overlayAutocompleteView.style.display = 'none';
                    }
                };

                overlaySearchInput.addEventListener('input', updateOverlayView);

                // 삭제 버튼 클릭 이벤트
                if (clearBtn) {
                    clearBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        overlaySearchInput.value = '';
                        overlaySearchInput.focus();
                        updateOverlayView();
                    });
                }
            }

            // 최근 검색어 개별 삭제
            const deleteButtons = document.querySelectorAll('.search-overlay .btn-delete-item');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const li = this.closest('li');
                    const list = li.closest('.recent-list');
                    li.remove();
                    
                    if (list && list.children.length === 0) {
                        const noData = document.createElement('div');
                        noData.className = 'no-data';
                        noData.textContent = '최근 검색어가 없습니다.';
                        list.parentNode.appendChild(noData);
                        list.remove();
                    }
                });
            });

            // 전체 삭제
            const deleteAllBtn = document.querySelector('.search-overlay .btn-delete-all');
            if (deleteAllBtn) {
                deleteAllBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const list = document.querySelector('.search-overlay .recent-list');
                    if (list) {
                        const noData = document.createElement('div');
                        noData.className = 'no-data';
                        noData.textContent = '최근 검색어가 없습니다.';
                        list.parentNode.appendChild(noData);
                        list.remove();
                    }
                });
            }
        }
    },

    // 모듈 초기화

    async init() {
        // 이벤트 위임 우선 바인딩
        this.Referral.init();
        this.CustomSelect.init();
        this.Tabs.init();
        this.Quantity.init();
        this.Favorites.init();
        this.Cart.init();
        this.InputHandler.init();
        this.QuickMenuScroll.init();
        // 비동기 모듈 초기화
        this.Slider.init();
        await this.Loader.init();
        this.Search.init(); // 검색창 모듈 초기화 (헤더 인클루드 이후 실행)
        this.QuickMenu.init();
        this.FloatingUtil.init();
        this.Clipboard.init();
        this.Toggle.init();
        this.BottomSheet.init();
        this.Selection.init();
        this.CategorySort.init();
        this.DeliverySort.init();
        this.ProductSortAndCount.init();
        this.HeaderBrand.init();
        this.HeaderMenu.init();
        this.HeaderCategory.init();
        this.CategoryMenu.init();
        this.ProductMore.init();
        this.FilterMore.init();
        this.ScrollSpy.init();
        if (this.BrowserZoom) this.BrowserZoom.init();
        this.MobileCategorySheet.init();
        this.SearchOverlay.init();


        console.log('Eclub Common UI Initialized');
    }
};

// DOM 로딩 완료 시 실행
document.addEventListener('DOMContentLoaded', () => Eclub.init());
