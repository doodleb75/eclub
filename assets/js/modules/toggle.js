import { Const } from './constants.js';

export const Toggle = {
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
            this.slideUp(target, Const.ANIMATION_DURATION, () => target.classList.remove('active'));
        } else {
            btn.classList.add('active');
            target.classList.add('active');
            this.slideDown(target);
        }
    },
    // 슬라이드 닫기
    slideUp(element, duration = Const.ANIMATION_DURATION, callback) {
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
    slideDown(element, duration = Const.ANIMATION_DURATION, callback) {
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
};
