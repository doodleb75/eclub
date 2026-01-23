// PC 전용 비즈니스 로직

const PC = (() => {
    const loadInclude = async () => {
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

    const init = () => {
        console.log('PC Scripts Loaded');
        loadInclude();
    };

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', PC.init);
