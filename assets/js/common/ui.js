/**
 * Eclub Common UI Script
 * Integrated components: Toast, Clipboard, Toggle, Tabs, Quantity, Favorites, CartSelection, ScrollSpy, Include Loader
 */
const Eclub = (() => {

    /* =========================================
     * Utilities
     * ========================================= */

    /**
     * Toast Notification
     */
    const Toast = (() => {
        let container = null;

        const init = () => {
            if (container) return;
            // 이미 존재하면 재사용
            container = document.querySelector('.toast-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'toast-container';
                document.body.appendChild(container);
            }
        };

        const show = ({ message, trigger, type = 'success', duration = 2500 }) => {
            init(); // ensure container exists

            const toast = document.createElement('div');
            toast.className = `toast-item type-${type}`;
            toast.innerHTML = `
                <i class="toast-icon" aria-hidden="true"></i>
                <span class="toast-message">${message}</span>
            `;

            toast.style.position = 'absolute';
            container.appendChild(toast);

            // 위치 계산
            if (trigger) {
                const rect = trigger.getBoundingClientRect();
                const scrollX = window.scrollX;
                const scrollY = window.scrollY;

                requestAnimationFrame(() => {
                    const toastWidth = toast.offsetWidth;
                    // 중앙 정렬 보정
                    let left = rect.left + scrollX - (toastWidth / 2) + (rect.width / 2);
                    let top = rect.bottom + scrollY + 12; // 트리거 12px 아래

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
                // 트리거 없으면 화면 하단 중앙 등 기본 위치 (CSS 의존)
                toast.classList.add('active');
            }

            // 자동 제거
            setTimeout(() => {
                toast.classList.remove('active');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, duration);
        };

        return { show };
    })();

    /**
     * Clipboard Copy
     */
    const Clipboard = (() => {
        const init = () => {
            const copyButtons = document.querySelectorAll('.btn-copy');

            copyButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const container = btn.closest('.bank-info-group') || btn.parentElement;
                    const valueSpan = container.querySelector('.js-copy-value') || container.querySelector('.value');

                    if (!valueSpan) return;

                    const originalText = valueSpan.textContent.trim();
                    const accountNumber = originalText.replace(/[^0-9\-\s]/g, '').trim();

                    if (accountNumber) {
                        copyToClipboard(accountNumber, btn);
                    }
                });
            });
        };

        const copyToClipboard = (text, trigger) => {
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
                    const successful = document.execCommand('copy');
                    if (successful) {
                        Toast.show({ message: '계좌번호가 복사되었습니다.', trigger });
                    }
                } catch (err) {
                    console.error('Fallback 복사 실패:', err);
                }

                document.body.removeChild(textArea);
                return;
            }

            navigator.clipboard.writeText(text).then(() => {
                Toast.show({ message: '계좌번호가 복사되었습니다.', trigger });
            }).catch(err => {
                console.error('클립보드 복사 실패:', err);
            });
        };

        return { init };
    })();

    /* =========================================
     * Core UI Components
     * ========================================= */

    /**
     * UI Toggle (Slide)
     */
    const Toggle = (() => {
        const init = () => {
            const triggers = document.querySelectorAll('[data-toggle="slide"]');
            triggers.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleClick(btn);
                });
            });
        };

        const handleClick = (btn) => {
            const targetSelector = btn.dataset.target;
            const scopeSelector = btn.dataset.scope;
            let target = null;

            if (scopeSelector) {
                const scope = btn.closest(scopeSelector);
                if (scope) {
                    target = scope.querySelector(targetSelector);
                }
            } else {
                target = document.querySelector(targetSelector);
            }

            if (target) {
                toggle(btn, target);
            }
        };

        const toggle = (btn, target) => {
            const isActive = btn.classList.contains('active');
            if (isActive) {
                btn.classList.remove('active');
                slideUp(target, 300, () => {
                    target.classList.remove('active');
                });
            } else {
                btn.classList.add('active');
                target.classList.add('active');
                slideDown(target);
            }
        };

        const slideUp = (element, duration = 300, callback) => {
            element.style.height = element.offsetHeight + 'px';
            element.offsetHeight; // Force reflow
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
        };

        const slideDown = (element, duration = 300, callback) => {
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
            element.offsetHeight; // Force reflow

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
        };

        return { init };
    })();

    /**
     * UI Tabs
     */
    const Tabs = (() => {
        const init = () => {
            const triggers = document.querySelectorAll('[data-tab-trigger]');
            triggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    const isAnchor = trigger.tagName.toLowerCase() === 'a';
                    if (isAnchor) e.preventDefault();

                    const targetId = trigger.dataset.tabTarget;
                    const groupName = trigger.dataset.tabGroup;
                    const activeClass = trigger.dataset.tabActiveClass || 'active';

                    if (targetId && groupName) {
                        activate(groupName, targetId, activeClass);
                    }
                });
            });
        };

        const activate = (group, targetId, defaultActiveClass = 'active') => {
            const groupTriggers = document.querySelectorAll(`[data-tab-group="${group}"][data-tab-trigger]`);
            groupTriggers.forEach(btn => {
                const activeClass = btn.dataset.tabActiveClass || defaultActiveClass;
                if (btn.dataset.tabTarget === targetId) {
                    btn.classList.add(activeClass);
                } else {
                    btn.classList.remove(activeClass);
                }
            });

            const groupContents = document.querySelectorAll(`[data-tab-group="${group}"][data-tab-content]`);
            groupContents.forEach(content => {
                const activeClass = content.dataset.tabActiveClass || defaultActiveClass;
                const contentId = content.id || content.dataset.tabContent;
                if (contentId === targetId) {
                    content.classList.add(activeClass);
                } else {
                    content.classList.remove(activeClass);
                }
            });

            document.dispatchEvent(new CustomEvent('tabChanged', {
                detail: { group, targetId }
            }));
        };

        return { init, activate };
    })();

    /* =========================================
     * Commerce / Functional Components
     * ========================================= */

    /**
     * Quantity Control
     */
    const Quantity = (() => {
        const init = () => {
            // Click Handler
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.qty-box button');
                if (!btn) return;

                const qtyBox = btn.closest('.qty-box');
                if (!qtyBox) return;

                const input = qtyBox.querySelector('input');
                const buttons = qtyBox.querySelectorAll('button');

                if (!input || buttons.length < 2) return;

                e.preventDefault();

                let currentVal = parseInt(input.value, 10) || 0;
                const minVal = input.hasAttribute('min') ? parseInt(input.getAttribute('min'), 10) : 0;

                // Decrease
                if (btn === buttons[0]) {
                    if (currentVal > minVal) {
                        input.value = currentVal - 1;
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
                // Increase
                else if (btn === buttons[1]) {
                    input.value = currentVal + 1;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            // Input Handler
            document.addEventListener('input', (e) => {
                const input = e.target;
                if (!input.closest('.qty-box')) return;

                input.value = input.value.replace(/[^0-9]/g, '');
                const val = parseInt(input.value, 10);
                const minVal = input.hasAttribute('min') ? parseInt(input.getAttribute('min'), 10) : 0;

                if (!isNaN(val) && val < 0) {
                    input.value = 0; // or minVal? Original code said 0.
                }
            });
        };
        return { init };
    })();

    /**
     * Favorites (Wishlist)
     */
    const Favorites = (() => {
        const init = () => {
            document.body.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-wish');
                if (!btn) return;

                e.preventDefault();
                toggle(btn);
            });
        };

        const toggle = (btn) => {
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

            Toast.show({
                message: message,
                trigger: btn,
                type: 'success'
            });
        };

        return { init };
    })();

    /**
     * Cart Selection
     */
    const CartSelection = (() => {
        const init = () => {
            const container = document.querySelector('.cart-container');
            if (!container) return;

            const masterCheckbox = document.querySelector('.cart-select-bar .checkbox-container input[type="checkbox"]');
            if (!masterCheckbox) return;

            const groups = container.querySelectorAll('.cart-group');

            masterCheckbox.addEventListener('change', (e) => {
                toggleAll(e.target.checked, groups);
            });

            groups.forEach(group => {
                const groupHeaderCheckbox = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
                const itemCheckboxes = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');

                if (groupHeaderCheckbox) {
                    groupHeaderCheckbox.addEventListener('change', (e) => {
                        toggleGroupItems(e.target.checked, itemCheckboxes);
                        updateMasterState(masterCheckbox);
                    });
                }

                itemCheckboxes.forEach(itemCheckbox => {
                    itemCheckbox.addEventListener('change', () => {
                        if (groupHeaderCheckbox) {
                            updateGroupHeaderState(groupHeaderCheckbox, itemCheckboxes);
                        }
                        updateMasterState(masterCheckbox);
                    });
                });
            });
        };

        const toggleAll = (isChecked, groups) => {
            groups.forEach(group => {
                const groupHeaderCheckbox = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
                const itemCheckboxes = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');
                if (groupHeaderCheckbox) groupHeaderCheckbox.checked = isChecked;
                itemCheckboxes.forEach(cb => cb.checked = isChecked);
            });
        };

        const toggleGroupItems = (isChecked, itemCheckboxes) => {
            itemCheckboxes.forEach(cb => cb.checked = isChecked);
        };

        const updateGroupHeaderState = (groupHeaderCheckbox, itemCheckboxes) => {
            if (itemCheckboxes.length === 0) return;
            const allChecked = Array.from(itemCheckboxes).every(cb => cb.checked);
            groupHeaderCheckbox.checked = allChecked;
        };

        const updateMasterState = (masterCheckbox) => {
            const allItemCheckboxes = document.querySelectorAll('.cart-item .item-check input[type="checkbox"]');
            if (allItemCheckboxes.length === 0) {
                masterCheckbox.checked = false;
                return;
            }
            const allChecked = Array.from(allItemCheckboxes).every(cb => cb.checked);
            masterCheckbox.checked = allChecked;
        };

        return { init };
    })();

    /**
     * Scroll Spy (Targeting .cart-tab-wrap)
     */
    const ScrollSpy = (() => {
        const init = () => {
            const tabWrap = document.querySelector('.cart-tab-wrap');
            if (!tabWrap) return;

            const methodLinks = document.querySelectorAll('.cart-tabs .tab-item:not(.recent) .tab-link');
            const sections = [];

            const getHeaderHeight = () => {
                const computedStyle = window.getComputedStyle(tabWrap);
                const topVal = parseFloat(computedStyle.top);
                const stickyTop = isNaN(topVal) ? 0 : topVal;
                return stickyTop + tabWrap.offsetHeight;
            };

            methodLinks.forEach(link => {
                const id = link.getAttribute('href');
                if (id && id.startsWith('#') && id !== '#') {
                    const section = document.querySelector(id);
                    if (section) {
                        sections.push({ id: id, el: section, link: link, parent: link.closest('.tab-item') });
                    }
                } else if (id === '#wrap') {
                    sections.push({ id: '#wrap', el: document.body, link: link, parent: link.closest('.tab-item') });
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
                    scrollTimeout = setTimeout(() => { isAutoScrolling = false; }, 1200);

                    if (targetId === '#wrap' || targetId === '#') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        const targetEl = document.querySelector(targetId);
                        if (targetEl) {
                            const offset = getHeaderHeight();
                            const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                            window.scrollTo({ top: top, behavior: 'smooth' });
                        }
                    }
                });
            });

            window.addEventListener('scroll', () => {
                if (isAutoScrolling) return;
                if (isThrottled) return;
                isThrottled = true;

                requestAnimationFrame(() => {
                    const offset = getHeaderHeight();
                    const scrollPos = window.scrollY + offset + 10;
                    let currentSection = null;

                    for (const section of sections) {
                        const offsetTop = section.el === document.body ? 0 : (section.el.getBoundingClientRect().top + window.scrollY);
                        if (scrollPos >= offsetTop) {
                            currentSection = section;
                        }
                    }

                    if (currentSection) {
                        methodLinks.forEach(l => l.closest('.tab-item').classList.remove('active'));
                        currentSection.parent.classList.add('active');
                    }
                    isThrottled = false;
                });
            });
        };
        return { init };
    })();

    /**
     * Page Loader / Include (from pc/main.js)
     */
    const Loader = (() => {
        const init = async () => {
            const includes = document.querySelectorAll('[data-include]');
            for (const el of includes) {
                const url = el.dataset.include;
                try {
                    const res = await fetch(url);
                    if (res.ok) {
                        const html = await res.text();
                        el.outerHTML = html;
                    } else {
                        console.error('Failed to load', url);
                    }
                } catch (e) {
                    console.error('Error loading', url, e);
                }
            }
        };
        return { init };
    })();

    /* =========================================
     * Initialization
     * ========================================= */

    const init = () => {
        // Core features
        Loader.init();
        Clipboard.init();
        Toggle.init();
        Tabs.init();

        // Functional/Commerce
        Quantity.init();
        Favorites.init();
        CartSelection.init();
        ScrollSpy.init();

        console.log('Eclub Common UI Initialized (Integrated)');
    };

    // Public API
    return {
        init,
        Toast, // Expose Toast for external usage if needed
        Clipboard,
        Toggle,
        Tabs
    };

})();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', Eclub.init);
