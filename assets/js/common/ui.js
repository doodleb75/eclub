// 공통 UI 및 유틸리티 스크립트
// HTML에 직접 스크립트를 두지 않고 여기서 관리한다.

const UI = (() => {
    // 초기화 함수
    const init = () => {
        console.log('Common UI Initialized');
        _bindEvents();
    };

    // 이벤트 바인딩 내부 함수
    const _bindEvents = () => {
        // 공통 이벤트 처리 (예: 모달 닫기 버튼 등)
    };

    // 공통 기능: 모달 열기
    const openModal = (targetId) => {
        const modal = document.getElementById(targetId);
        if (modal) modal.style.display = 'block';
    };

    return {
        init,
        openModal
    };
})();

// DOM 로드 시 실행
window.addEventListener('DOMContentLoaded', UI.init);
