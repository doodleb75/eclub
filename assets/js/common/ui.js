// Eclub 공통 UI 스크립트
const Eclub = {
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
        show({ message, trigger, type = 'success', duration = 2500, position = 'bottom-center' }) {
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

                    const offset = 12; // 트리거와의 기본 간격

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
                    // 트리거도 없고 고정 위치도 아닐 때 기본값 (브라우저 상단 중앙 고정처럼 동작)
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
        // 탭 트리거 초기화 (Event Delegation)
        init() {
            document.removeEventListener('click', this.handleTabClick); // 중복 방지
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

            // 탭 변경 시 카테고리 필터 초기화
            if (group === 'best-period') {
                const activeAllBtn = document.querySelector('.category-tabs button[data-tab="all"]');
                if (activeAllBtn) {
                    activeAllBtn.click();
                }
            }
        }
    },

    // 수량 조절 버튼
    Quantity: {
        init() {
            // 버튼 클릭 핸들러
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
                // 감소/증가 분기
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
                            position: btn.dataset.toastPosition || (resolvedTrigger.classList.contains('image-box') ? 'inner-bottom-center' : 'bottom-right')
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

                // 헤더의 장바구니 이동 버튼 등 실제 링크가 있는 A 태그는 스크립트 처리 제외
                if (btn.tagName === 'A' && btn.getAttribute('href') !== 'javascript:void(0);') return;

                e.preventDefault();
                this.add(btn);
            });
        },
        add(btn) {
            // TODO: 실제 장바구니 담기 API 연동 필요
            const imageBox = btn.closest('.product-item')?.querySelector('.image-box');
            const container = btn.closest('.info-actions, .action-btns');
            const resolvedTrigger = imageBox || container || btn;
            Eclub.Toast.show({
                message: "장바구니에 상품이 담겼습니다.",
                trigger: resolvedTrigger,
                position: btn.dataset.toastPosition || (resolvedTrigger.classList.contains('image-box') ? 'inner-bottom-center' : 'bottom-right'),
                type: 'success'
            });
        }
    },

    // 관심상품 (찜하기)
    Favorites: {
        init() {
            document.body.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-wish, .btn-heart');
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
                    if (icon.classList.contains('icon-heart-fill')) {
                        icon.classList.remove('icon-heart-fill');

                        // 원래 아이콘 복구 (main or normal)
                        if (btn.classList.contains('btn-heart')) {
                            icon.classList.add('icon-heart-main');
                            // 메인 페이지 아이콘 복구 시 style 변경 필요할 수 있음 (SCSS에서 처리)
                        } else {
                            icon.classList.add('icon-heart');
                        }
                    }
                    // 이미 main이었다면? (toggle logic assumes swap)
                    // 현재 active 상태에서 click -> inactive
                    // active 상태일 때는 heart-fill이 되어 있어야 함.
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
                        icon.classList.add('icon-heart-fill'); // 메인에서도 fill 아이콘 사용
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
                position: btn.dataset.toastPosition || (resolvedTrigger.classList.contains('image-box') ? 'inner-bottom-center' : 'bottom-right'),
                type: 'success'
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
                        ? '/eclub/common/components/modal/modal-alert.html'
                        : '/eclub/common/components/modal/modal-select-del.html';
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

    // 카테고리 탭 정렬/필터링
    CategorySort: {
        init() {
            // .category-tabs 내부의 버튼에 클릭 이벤트 바인딩
            // data-tab 속성이 있는 버튼만 대상
            const tabButtons = document.querySelectorAll('.category-tabs button[data-tab]');

            if (!tabButtons.length) return;

            tabButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetBtn = e.currentTarget;
                    const category = targetBtn.dataset.tab;
                    const tabListWrapper = targetBtn.closest('.category-tabs-wrap');

                    // 탭 활성화 상태 변경
                    const tabContainer = targetBtn.closest('.category-tabs');
                    if (tabContainer) {
                        const currentActive = tabContainer.querySelector('li.active');
                        if (currentActive) currentActive.classList.remove('active');
                        targetBtn.parentElement.classList.add('active');
                    }

                    // 연관된 product-list 모두 찾기 (탭 전환으로 여러 개가 존재할 수 있음)
                    if (tabListWrapper) {
                        const productLists = [];
                        let sibling = tabListWrapper.nextElementSibling;

                        // 형제 요소 중 모든 .product-list 수집
                        while (sibling) {
                            if (sibling.classList.contains('product-list')) {
                                productLists.push(sibling);
                            }
                            sibling = sibling.nextElementSibling;
                        }

                        productLists.forEach(productList => {
                            // 페이드 아웃 시작
                            productList.classList.add('is-fading');

                            // 트랜지션 시간(300ms) 만큼 대기 후 필터링 적용
                            setTimeout(() => {
                                const items = productList.querySelectorAll('.product-item');
                                items.forEach(item => {
                                    const itemCategory = item.dataset.category || '';
                                    const categories = itemCategory.split(/\s+/); // 공백으로 분리

                                    // 전체보기(all)이거나 카테고리가 포함되어 있으면 표시
                                    if (category === 'all' || categories.includes(category)) {
                                        item.style.display = ''; // block/flex 등 원래 스타일 복구
                                    } else {
                                        item.style.display = 'none';
                                    }
                                });

                                // 필터링 완료 후, DOM 업데이트를 위해 잠시 지연 후 페이드 인
                                requestAnimationFrame(() => {
                                    productList.classList.remove('is-fading');
                                });
                            }, 300);
                        });
                    }
                });
            });
        }
    },

    // 상품 더보기 (Show More)
    ProductMore: {
        init() {
            const containers = document.querySelectorAll('.product-list.is-more');
            if (!containers.length) return;

            containers.forEach(container => {
                const limit = parseInt(container.dataset.moreLimit, 10) || 4;
                const items = container.querySelectorAll('.product-item');
                const moreWrap = this.getMoreWrapper(container);

                if (items.length <= limit) {
                    if (moreWrap) moreWrap.style.display = 'none';
                } else {
                    // Set initial collapsed height
                    this.setCollapsedHeight(container, limit);
                    container.classList.add('js-initialized');

                    // Add listener for resize
                    window.addEventListener('resize', () => {
                        if (!container.classList.contains('active')) {
                            this.setCollapsedHeight(container, limit);
                        } else {
                            // Update expanded height if needed
                            // container.style.maxHeight = container.scrollHeight + 'px';
                            // Usually max-height: none is better for expanded, but for transition back we need specific height.
                            // For now, let's keep it simple.
                            container.style.maxHeight = container.scrollHeight + 'px';
                        }
                    });
                }
            });

            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-more');
                if (!btn) return;

                const moreWrap = btn.closest('.product-more');
                let container = moreWrap?.previousElementSibling;
                while (container && !container.classList.contains('product-list')) {
                    container = container.previousElementSibling;
                }

                if (container && container.classList.contains('is-more')) {
                    e.preventDefault();
                    this.toggle(container, btn);
                }
            });
        },

        getMoreWrapper(container) {
            let next = container.nextElementSibling;
            while (next && !next.classList.contains('product-more')) {
                next = next.nextElementSibling;
            }
            return next;
        },

        setCollapsedHeight(container, limit) {
            const items = container.querySelectorAll('.product-item');
            if (items.length < limit) return;

            // Get the element at index limit-1 (0-based)
            const lastVisibleItem = items[limit - 1];
            if (lastVisibleItem) {
                const bottom = lastVisibleItem.offsetTop + lastVisibleItem.offsetHeight;
                container.style.maxHeight = bottom + 'px';
            }
        },

        toggle(container, btn) {
            const limit = parseInt(container.dataset.moreLimit, 10) || 4;
            const isExpanded = container.classList.contains('active');
            const span = btn.querySelector('span');

            // Start transition via class
            // container needs transition property in CSS

            if (isExpanded) {
                // Close
                container.classList.remove('active');
                this.setCollapsedHeight(container, limit);

                if (span) span.textContent = '상품 더보기';
                btn.classList.remove('active');

            } else {
                // Open
                container.classList.add('active');
                // Set max-height to full height to allow transition
                container.style.maxHeight = container.scrollHeight + 'px';

                if (span) span.textContent = '상품닫기';
                btn.classList.add('active');
            }
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

        // 메인 비주얼 슬라이더 초기화 (3개씩, transform 방식, 무한 루프)
        initMainSlider(list) {
            const section = list.closest('.main-visual');
            if (!section) return;

            const prevBtn = section.querySelector('.btn-prev');
            const nextBtn = section.querySelector('.btn-next');
            const currentEl = section.querySelector('.count-box .current');
            const totalEl = section.querySelector('.count-box .total');
            const dotsContainer = section.querySelector('.pagination-dots');
            const btnPause = section.querySelector('.icon-main-pause')?.closest('button');

            const itemSelector = '.slide-item';
            const originalItems = Array.from(list.querySelectorAll(itemSelector));
            const itemsCount = originalItems.length;
            if (itemsCount === 0) return;

            // [수정] 반응형과 상관없이 항상 최대 개수(3개)만큼 클론 생성하여 오프셋 고정
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

            // 초기 레이아웃 계산
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

            // 앞쪽에 붙일 클론 (마지막 아이템들)
            const frontClones = [];
            for (let i = 0; i < clonesCount; i++) {
                const idx = (itemsCount - 1 - i + itemsCount) % itemsCount; // 뒤에서부터 가져옴
                frontClones.unshift(originalItems[idx].cloneNode(true));
            }

            // 뒤쪽에 붙일 클론 (처음 아이템들)
            const backClones = [];
            for (let i = 0; i < clonesCount; i++) {
                backClones.push(originalItems[i % itemsCount].cloneNode(true));
            }

            // 클론 클래스 추가
            frontClones.forEach(el => el.classList.add('is-clone'));
            backClones.forEach(el => el.classList.add('is-clone'));

            // DOM 삽입
            frontClones.forEach(el => list.insertBefore(el, list.firstChild));
            backClones.forEach(el => list.appendChild(el));

            let currentPageIdx = 0;
            let isTransitioning = false;
            let autoTimer = null;
            let isPaused = false;

            const getTranslateX = (itemIdxInWrapper) => {
                const style = window.getComputedStyle(list);
                const gap = parseFloat(style.gap) || 0;
                const firstItem = list.querySelector(itemSelector);
                if (!firstItem) return 0;
                // [Fix] sub-pixel 렌더링 오차 해결을 위해 getBoundingClientRect 사용
                const itemWidth = firstItem.getBoundingClientRect().width;
                return -(itemIdxInWrapper * (itemWidth + gap));
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

                    // 마지막 페이지이고 나머지가 있을 경우 (예: 17개 아이템, 3개씩 보기 -> 나머지 2개)
                    // 나머지만큼만 마지막 도트 활성화
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

                // [수정] clonesCount가 항상 앞에 있으므로 offset으로 사용
                const wrapperIdx = uniquePageIndices[currentPageIdx] + clonesCount;
                const tx = getTranslateX(wrapperIdx);

                // [Fix] 명시적인 트랜지션 적용
                list.style.transition = animated ? 'transform 0.3s ease-in-out' : 'none';
                list.style.transform = `translateX(${tx}px)`;

                updateUI();

                if (animated) {
                    const transitionEndHandler = () => {
                        list.removeEventListener('transitionend', transitionEndHandler);
                        unlockTransition();
                    };
                    list.addEventListener('transitionend', transitionEndHandler, { once: true });

                    // [Safety] 트랜지션 엔드 미발생 시 강제 해제
                    setTimeout(() => {
                        if (isTransitioning) {
                            list.removeEventListener('transitionend', transitionEndHandler);
                            unlockTransition();
                        }
                    }, 400);
                } else {
                    setTimeout(unlockTransition, 10);
                }
            };

            const next = () => {
                if (isTransitioning) return;

                if (currentPageIdx >= totalPages - 1) {
                    // 마지막 페이지에서 다음으로: 뒤쪽 클론 영역으로 이동 후 첫 페이지로 점프
                    isTransitioning = true;

                    // [수정] itemsCount + clonesCount 지점이 첫 번째 뒤쪽 클론(item 0)의 위치
                    const wrapperIdx = clonesCount + itemsCount;
                    const tx = getTranslateX(wrapperIdx);

                    // [Fix] 점프 애니메이션 명시적 적용
                    list.style.transition = 'transform 0.3s ease-in-out';
                    list.style.transform = `translateX(${tx}px)`;

                    const transitionEndHandler = () => {
                        list.removeEventListener('transitionend', transitionEndHandler);
                        // 애니메이션 종료 후 0페이지로 점프 (transition 없이)
                        currentPageIdx = 0;
                        goToPage(0, false);
                    };

                    list.addEventListener('transitionend', transitionEndHandler, { once: true });

                    // [Safety]
                    setTimeout(() => {
                        if (isTransitioning) {
                            list.removeEventListener('transitionend', transitionEndHandler);
                            currentPageIdx = 0;
                            goToPage(0, false);
                        }
                    }, 400);

                } else {
                    goToPage(currentPageIdx + 1);
                }
            };

            const prev = () => {
                if (isTransitioning) return;

                if (currentPageIdx <= 0) {
                    // 첫 페이지에서 이전으로: 앞쪽 클론 영역으로 이동 후 마지막 페이지로 점프
                    isTransitioning = true;

                    // [수정] 앞쪽 클론 영역에서 보여줄 위치: clonesCount - itemsPerPage
                    const wrapperIdx = clonesCount - itemsPerPage;
                    const tx = getTranslateX(wrapperIdx);

                    // [Fix] 점프 애니메이션 명시적 적용
                    list.style.transition = 'transform 0.3s ease-in-out';
                    list.style.transform = `translateX(${tx}px)`;

                    const transitionEndHandler = () => {
                        list.removeEventListener('transitionend', transitionEndHandler);
                        // 애니메이션 종료 후 마지막 페이지로 점프
                        currentPageIdx = totalPages - 1;
                        goToPage(totalPages - 1, false);
                    };

                    list.addEventListener('transitionend', transitionEndHandler, { once: true });

                    // [Safety]
                    setTimeout(() => {
                        if (isTransitioning) {
                            list.removeEventListener('transitionend', transitionEndHandler);
                            currentPageIdx = totalPages - 1;
                            goToPage(totalPages - 1, false);
                        }
                    }, 400);

                } else {
                    goToPage(currentPageIdx - 1);
                }
            };

            const startAuto = () => {
                if (isPaused || autoTimer) return;
                autoTimer = setInterval(next, 4000);
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
                btnPause.onclick = () => {
                    const icon = btnPause.querySelector('i');
                    if (isPaused) {
                        isPaused = false;
                        icon.className = 'icon-main-pause';
                        startAuto();
                    } else {
                        isPaused = true;
                        icon.className = 'icon-main-play';
                        stopAuto();
                    }
                };
            }

            if (prevBtn) prevBtn.onclick = () => { prev(); resetAuto(); };
            if (nextBtn) nextBtn.onclick = () => { next(); resetAuto(); };

            list.addEventListener('mouseenter', stopAuto);
            list.addEventListener('mouseleave', () => !isPaused && startAuto());

            // 드래그/스와이프 기능 (Drag & Swipe)
            let startX = 0;
            let dragDiff = 0;
            let isDragging = false;
            let isSwiped = false;
            let initialTx = 0;

            const onDragStart = (e) => {
                // 모바일인 경우에만 드래그 활성화
                const isMobile = window.matchMedia('(max-width: 768px)').matches;
                if (!isMobile || isTransitioning) return;

                isDragging = true;
                isSwiped = false;
                startX = (e.type.includes('touch')) ? e.touches[0].pageX : e.pageX;
                dragDiff = 0;

                // 드래그 시작 시점의 위치 계산
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
                    if (e.cancelable) e.preventDefault(); // 가로 스와이프 시 세로 스크롤 방지
                }

                // 실시간 위치 반영
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

                const threshold = 50; // 스와이프 판정 임계값
                if (dragDiff < -threshold) {
                    next();
                } else if (dragDiff > threshold) {
                    prev();
                } else {
                    goToPage(currentPageIdx);
                }

                resetAuto();
                // 클릭 이벤트 전파 방지를 위해 약간의 지연 후 상태 해제
                setTimeout(() => { isSwiped = false; }, 50);
            };

            list.addEventListener('mousedown', onDragStart);
            list.addEventListener('touchstart', onDragStart, { passive: false });

            // 드래그 완료 후 의도치 않은 링크 클릭 방지
            list.addEventListener('click', (e) => {
                if (isSwiped) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);

            // 리사이즈 시 위치 재조정
            let resizeTimer = null;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    const oldItemsPerPage = itemsPerPage;
                    updateLayout(); // itemsPerPage, totalPages, uniquePageIndices 업데이트

                    // 페이지 인덱스 보정
                    if (currentPageIdx >= totalPages) currentPageIdx = totalPages - 1;

                    // 즉시 이동 (오프셋 재계산되므로 위치 맞춤)
                    goToPage(currentPageIdx, false);
                }, 100);
            });

            // 초기 위치 설정 및 자동 롤링 시작
            // 계산 오차 방지를 위해 레이아웃 확정 후 실행
            list.style.opacity = '0'; // 초기 위치 잡기 전까지 숨김
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
                // [메인 비주얼 전용] 아이템 개수 기반 (ex: 03 / 17)
                const itemsCount = element.querySelectorAll('.slide-item').length;
                const index = Math.round(scrollLeft / (itemWidth + gap));
                const lastVisibleIndex = Math.min(index + itemsPerPage, itemsCount);

                if (currentEl) {
                    const formattedVal = lastVisibleIndex < 10 ? `0${lastVisibleIndex}` : lastVisibleIndex;
                    currentEl.innerText = formattedVal;
                }

                // 도트 활성화 (3개씩 활성화)
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, idx) => {
                    const isActive = idx >= index && idx < index + itemsPerPage;
                    dot.classList.toggle('active', isActive);
                });
            } else {
                // [일반 상품 슬라이더 전용] 페이지 번호 기반 (ex: 1 / 4)
                const unitWidth = (itemWidth + gap) * itemsPerPage;
                let page = Math.round(scrollLeft / unitWidth) + 1;

                // 끝에 도달했으면 무조건 마지막 페이지
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
            // 외부 제어 시 자동 롤링 초기화 등에 사용
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
                            const scale = Eclub.getZoomScale();
                            const offset = getHeaderHeight();
                            const top = targetEl.getBoundingClientRect().top + window.scrollY - (offset * scale);
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

    // 입력 필드 핸들러 (숫자 제한 등)
    InputHandler: {
        init() {
            // 숫자만 입력 가능하도록 제한 (data-input="number")
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

            // 숫자 입력 시 한글/특수문자 차단 (keydown 보조)
            document.addEventListener('keydown', (e) => {
                const input = e.target;
                const type = input.dataset.input || input.getAttribute('data-input');
                if (type === 'number' || type === 'phone') {
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

    // 지인 추천 관련
    Referral: {
        init() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-referral-cta, #friend-number-send');
                if (!btn) return;

                // 서버 API 연동 시 응답값에 따라 처리되는 로직 (예: data-event-status="ended")
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

            if (!floatingContainer || floatingContainer._isInit) return;
            floatingContainer._isInit = true;

            // 바텀 시트 상태에 따라 애니메이션 점프 없는 위치 계산 (이미지 200번 대응)
            const updatePosition = () => {
                const sheet = document.querySelector('.bottom-sheet');
                const summary = document.querySelector('.summary-section');
                const isExpanded = sheet && sheet.classList.contains('is-expanded');

                let target = null;
                if (isExpanded) {
                    // 시트 확장 시: 요약 바를 기준으로 하여 시트 본문에 가려지도록 함
                    target = summary;
                } else {
                    // 시트 축소 시: 시트 전체 높이를 기준으로 하여 버튼이 시트 위에 노출되도록 함
                    target = sheet || summary;
                }

                let h = 0;
                if (target) {
                    const rect = target.getBoundingClientRect();
                    // 시각적으로 유효한 범위(화면 안)에 있을 때만 높이 반영
                    if (rect.top > 0 && rect.top < window.innerHeight) {
                        h = window.innerHeight - rect.top;
                    }
                }

                let nextBottom = h > 0 ? h + 12 : 20;

                // 최종 방어선: 화면 상단 25% 이내(75% 지점)로는 절대 올라가지 않음
                const topLimit = window.innerHeight * 0.75;
                if (nextBottom > topLimit) nextBottom = topLimit;

                floatingContainer.style.bottom = `${nextBottom}px`;
            };

            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, { passive: true });

            // 바텀 시트 상태 변화(펼침/닫힘) 실시간 추적
            const sheetEl = document.querySelector('.bottom-sheet');
            if (sheetEl) {
                const observer = new MutationObserver(updatePosition);
                observer.observe(sheetEl, { attributes: true, attributeFilter: ['class', 'style'] });
                sheetEl.addEventListener('transitionend', updatePosition);
            }

            // 클릭 직후 애니메이션 중 위치 보정 (Tick 시작)
            document.addEventListener('click', (e) => {
                if (e.target.closest('.sheet-header, .btn-sheet-toggle')) {
                    let count = 0;
                    const loop = () => {
                        updatePosition();
                        if (count++ < 30) requestAnimationFrame(loop);
                    };
                    requestAnimationFrame(loop);
                }
            });

            if (btnBack) {
                // 이전 히스토리가 있을 때만 노출
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
                const checkScroll = () => {
                    if (window.scrollY > 300) {
                        btnTop.classList.remove('is-hidden');
                    } else {
                        btnTop.classList.add('is-hidden');
                    }
                };

                window.addEventListener('scroll', checkScroll, { passive: true });
                checkScroll(); // 초기 상태 체크

                btnTop.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
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

            // 드래그 시작 // 드래그 시작
            const onDragStart = (e) => {
                isDragging = true;
                startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
                startScrollLeft = container.scrollLeft;
                thumb.classList.add('is-dragging');
                document.body.style.userSelect = 'none';
            };

            // 드래그 중 // 드래그 움직임 처리
            const onDragMove = (e) => {
                if (!isDragging) return;

                // 터치 기기에서 드래그 중 페이지 스크롤 방지
                if (e.cancelable) e.preventDefault();

                const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                const deltaX = currentX - startX;

                const track = thumb.parentElement;
                const trackWidth = track.clientWidth;
                const maxThumbTranslate = trackWidth - thumb.offsetWidth;
                const maxScroll = container.scrollWidth - container.clientWidth;

                if (maxThumbTranslate <= 0) return;

                // 드래그 비율에 맞춰 컨테이너 스크롤 이동 // 썸네일 이동 비율에 따른 실제 스크롤 위치 계산
                const scrollDelta = (deltaX / maxThumbTranslate) * maxScroll;
                container.scrollLeft = startScrollLeft + scrollDelta;
            };

            // 드래그 종료 // 드래그 상태 해제
            const onDragEnd = () => {
                if (!isDragging) return;
                isDragging = false;
                thumb.classList.remove('is-dragging');
                document.body.style.userSelect = '';
            };

            // 이벤트 바인딩 // 스크롤 바 드래그 이벤트 연결
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
        this.Slider.init(); // 슬라이더는 로더를 기다리지 않고 즉시 실행
        await this.Loader.init();
        this.FloatingUtil.init(); // 인클루드 완료 후 초기화
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
