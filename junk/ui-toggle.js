/**
 * UI Toggle Component
 * - Supports smooth slide toggle (expand/collapse)
 * - Usage: <button data-toggle="slide" data-target=".target-class" data-scope=".scope-class">
 */
const uiToggle = (() => {
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
            element.style.height = 'auto'; // Reset to auto for responsiveness
            element.style.removeProperty('overflow');
            element.style.removeProperty('transition-duration');
            element.style.removeProperty('transition-property');
            if (callback) callback();
        }, duration);
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', uiToggle.init);
