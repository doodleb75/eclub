// Mobile 전용 비즈니스 로직 (APK 관련 포함)

const Mobile = (() => {
    const init = () => {
        console.log('Mobile Scripts Loaded');
    };

    // APK 앱과의 통신 예시
    const callNative = (action, data) => {
        // window.AppInterface 를 통한 통신 등
    };

    return {
        init,
        callNative
    };
})();

document.addEventListener('DOMContentLoaded', Mobile.init);
