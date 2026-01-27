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

    // 장바구니 전체/그룹 선택
    CartSelection: {
        init() {
            const container = document.querySelector('.cart-container');
            if (!container) return;
            const masterCheckbox = document.querySelector('.cart-select-bar .checkbox-container input[type="checkbox"]');
            if (!masterCheckbox) return;
            const groups = container.querySelectorAll('.cart-group');

            // 전체 선택 체크박스
            masterCheckbox.addEventListener('change', (e) => this.toggleAll(e.target.checked, groups));

            // 그룹 및 개별 체크박스
            groups.forEach(group => {
                const groupHeaderCheckbox = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
                const itemCheckboxes = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');
                if (groupHeaderCheckbox) {
                    groupHeaderCheckbox.addEventListener('change', (e) => {
                        this.toggleGroupItems(e.target.checked, itemCheckboxes);
                        this.updateMasterState(masterCheckbox);
                    });
                }
                itemCheckboxes.forEach(itemCheckbox => {
                    itemCheckbox.addEventListener('change', () => {
                        if (groupHeaderCheckbox) this.updateGroupHeaderState(groupHeaderCheckbox, itemCheckboxes);
                        this.updateMasterState(masterCheckbox);
                    });
                });
            });

            // 선택 삭제 버튼 모달 연결
            const deleteSelectedBtn = document.querySelector('.btn-delete-selected');
            if (deleteSelectedBtn) {
                deleteSelectedBtn.addEventListener('click', () => {
                    const checkedItems = document.querySelectorAll('.cart-item .item-check input[type="checkbox"]:checked');
                    deleteSelectedBtn.dataset.modalUrl = checkedItems.length === 0
                        ? '/common/components/modal-alert.html'
                        : '/common/components/modal-confirm.html';
                });
            }
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
                const computedStyle = window.getComputedStyle(tabWrap);
                const topVal = parseFloat(computedStyle.top);
                const stickyTop = isNaN(topVal) ? 0 : topVal;
                return stickyTop + tabWrap.offsetHeight;
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
    init() {
        this.Loader.init();
        this.Clipboard.init();
        this.Toggle.init();
        this.Tabs.init();
        this.Quantity.init();
        this.Favorites.init();
        this.CartSelection.init();
        this.ScrollSpy.init();
        console.log('Eclub Common UI Initialized');
    }
};

// DOM 로드 시 실행
document.addEventListener('DOMContentLoaded', () => Eclub.init());
