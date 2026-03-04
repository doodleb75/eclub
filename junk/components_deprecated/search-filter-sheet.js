// 검색필터 바텀시트 동작
(function () {
    const sheet = document.getElementById('searchFilterSheet');
    if (!sheet) return;

    const overlay = document.querySelector('.search-filter-overlay');
    const triggers = document.querySelectorAll('.filter-select-trigger .select-label');
    const closeBtn = sheet.querySelector('.btn-sheet-close');
    const tabBtns = sheet.querySelectorAll('.sheet-tab-group .tab-btn');
    const tabContents = sheet.querySelectorAll('[data-tab-content]');
    const resetBtns = sheet.querySelectorAll('.btn-filter-reset');
    const applyBtns = sheet.querySelectorAll('.btn-filter-apply');

    // 바텀시트 열기
    function openSheet(tabName) {
        sheet.classList.add('is-open');
        overlay.classList.add('is-visible');
        document.body.classList.add('no-scroll');
        if (tabName) switchTab(tabName);
    }

    // 바텀시트 닫기
    function closeSheet() {
        sheet.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        document.body.classList.remove('no-scroll');
    }

    // 탭 전환
    function switchTab(tabName) {
        tabBtns.forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
        });
        tabContents.forEach(function (content) {
            content.style.display = content.getAttribute('data-tab-content') === tabName ? '' : 'none';
        });
    }

    // 트리거 버튼 클릭
    triggers.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tab = this.getAttribute('data-filter-tab');
            openSheet(tab);
        });
    });

    // 닫기 버튼
    if (closeBtn) closeBtn.addEventListener('click', closeSheet);

    // 오버레이 클릭 시 닫기
    if (overlay) overlay.addEventListener('click', closeSheet);

    // 탭 전환 클릭
    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            switchTab(this.getAttribute('data-tab'));
        });
    });

    // 필터 초기화 (각 탭 내의 체크박스만 초기화)
    resetBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const container = this.closest('[data-tab-content]');
            if (container) {
                container.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
                    cb.checked = false;
                });
            }
        });
    });

    // 적용 후 닫기
    applyBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            closeSheet();
        });
    });
})();
