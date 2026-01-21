// PC 전용 비즈니스 로직

const PC = (() => {
    const init = () => {
        console.log('PC Scripts Loaded');
    };

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', PC.init);
