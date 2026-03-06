// 주문내역조회(영수증) 페이지 전용 모듈

// 날짜 포맷 (YYYY-MM-DD)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 날짜 범위 업데이트
function updateDateRange(months) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    if (startInput) startInput.value = formatDate(startDate);
    if (endInput) endInput.value = formatDate(endDate);
}

// 빠른 기간 선택 라디오 버튼
function initQuickPeriod() {
    const periodBtns = document.querySelectorAll('input[name="period"]');
    periodBtns.forEach(btn => {
        btn.addEventListener('change', (e) => {
            if (!e.target.checked) return;
            const monthMap = { 'today': 0, '1m': 1, '3m': 3, '6m': 6, '12m': 12 };
            const months = monthMap[e.target.value];
            if (months !== undefined) updateDateRange(months);
        });
    });
}

// 커스텀 캘린더 클래스 (mypage.js 로직 재사용)
class CustomCalendar {
    constructor(inputId, popupId) {
        this.input = document.getElementById(inputId);
        this.popup = document.getElementById(popupId);
        if (!this.input || !this.popup) return;

        this.trigger = this.input.parentElement.querySelector('.btn-calendar'); // .btn-calendar
        this.currentDate = new Date();
        this.selectedDate = this.input.value ? new Date(this.input.value) : new Date();
        this.viewMode = 'days'; // 'days' | 'selector'
        this.init();
    }

    init() {
        const toggleCalendar = (e) => {
            e.stopPropagation();
            // 다른 캘린더 닫기
            document.querySelectorAll('.calendar-popup').forEach(p => {
                if (p !== this.popup) p.classList.remove('show');
            });

            const isShown = this.popup.classList.contains('show');
            this.popup.classList.toggle('show', !isShown);

            if (!isShown) {
                if (this.input.value) {
                    this.selectedDate = new Date(this.input.value);
                    this.currentDate = new Date(this.input.value);
                }
                this.viewMode = 'days';
                this.render();
            }
        };

        // 감싸는 영역(date-input-wrap) 클릭 시 달력 노출
        const wrap = this.input.closest('.date-input-wrap');
        if (wrap) {
            wrap.addEventListener('click', toggleCalendar);
        }

        // 외부 클릭 닫기
        document.addEventListener('click', (e) => {
            if (!this.popup.contains(e.target) && (!wrap || !wrap.contains(e.target))) {
                this.popup.classList.remove('show');
            }
        });
    }

    render() {
        if (this.viewMode === 'selector') {
            this.renderSelector();
            return;
        }

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();

        let html = `
            <div class="cal-header">
                <div class="month-year">${year}년 ${String(month + 1).padStart(2, '0')}월</div>
                <div class="nav-btns">
                    <button class="btn-prev-mon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg></button>
                    <button class="btn-next-mon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
                </div>
            </div>
            <div class="cal-grid">
                <div class="day-name">일</div><div class="day-name">월</div><div class="day-name">화</div>
                <div class="day-name">수</div><div class="day-name">목</div><div class="day-name">금</div>
                <div class="day-name">토</div>
        `;

        for (let i = firstDay; i > 0; i--) {
            html += `<div class="day prev-month">${prevLastDate - i + 1}</div>`;
        }

        const today = new Date();
        for (let i = 1; i <= lastDate; i++) {
            const isSelected = this.selectedDate &&
                this.selectedDate.getFullYear() === year &&
                this.selectedDate.getMonth() === month &&
                this.selectedDate.getDate() === i;
            const isToday = today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === i;
            html += `<div class="day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}" data-date="${i}">${i}</div>`;
        }

        const remaining = 42 - (firstDay + lastDate);
        for (let i = 1; i <= remaining; i++) {
            html += `<div class="day next-month">${i}</div>`;
        }

        html += `
            </div>
            <div class="cal-footer">
                <div></div>
                <button class="btn-close-cal text-info">닫기</button>
            </div>
        `;

        this.popup.innerHTML = html;

        // 월년 클릭 → 월 선택 모드
        this.popup.querySelector('.month-year').onclick = (e) => {
            e.stopPropagation();
            this.viewMode = 'selector';
            this.render();
        };

        this.popup.querySelector('.btn-prev-mon').onclick = (e) => {
            e.stopPropagation();
            this.currentDate.setMonth(month - 1);
            this.render();
        };
        this.popup.querySelector('.btn-next-mon').onclick = (e) => {
            e.stopPropagation();
            this.currentDate.setMonth(month + 1);
            this.render();
        };

        this.popup.querySelectorAll('.day[data-date]').forEach(el => {
            el.onclick = (e) => {
                e.stopPropagation();
                this.selectedDate = new Date(year, month, el.dataset.date);
                this.input.value = formatDate(this.selectedDate);
                this.popup.classList.remove('show');
                // 빠른 기간 라디오 해제
                document.querySelectorAll('input[name="period"]').forEach(r => r.checked = false);
            };
        });

        this.popup.querySelector('.btn-close-cal').onclick = (e) => {
            e.stopPropagation();
            this.popup.classList.remove('show');
        };
    }

    renderSelector() {
        const year = this.currentDate.getFullYear();

        let html = `
            <div class="cal-header">
                <div class="month-year selector-title">${year}년</div>
                <div class="nav-btns">
                    <button class="btn-prev-year"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg></button>
                    <button class="btn-next-year"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
                </div>
            </div>
            <div class="cal-grid selector-grid">
        `;

        for (let i = 0; i < 12; i++) {
            const isSelected = this.currentDate.getMonth() === i;
            html += `<div class="month-item ${isSelected ? 'selected' : ''}" data-month="${i}">${i + 1}월</div>`;
        }

        html += `
            </div>
            <div class="cal-footer">
                <button class="btn-back">뒤로</button>
                <button class="btn-close-cal text-info">닫기</button>
            </div>
        `;

        this.popup.innerHTML = html;

        this.popup.querySelector('.btn-prev-year').onclick = (e) => {
            e.stopPropagation();
            this.currentDate.setFullYear(year - 1);
            this.renderSelector();
        };
        this.popup.querySelector('.btn-next-year').onclick = (e) => {
            e.stopPropagation();
            this.currentDate.setFullYear(year + 1);
            this.renderSelector();
        };

        this.popup.querySelectorAll('.month-item').forEach(el => {
            el.onclick = (e) => {
                e.stopPropagation();
                this.currentDate.setMonth(parseInt(el.dataset.month));
                this.viewMode = 'days';
                this.render();
            };
        });

        this.popup.querySelector('.btn-back').onclick = (e) => {
            e.stopPropagation();
            this.viewMode = 'days';
            this.render();
        };

        this.popup.querySelector('.btn-close-cal').onclick = (e) => {
            e.stopPropagation();
            this.popup.classList.remove('show');
        };
    }
}

// 상품검색 엔터키 처리
function initProductSearch() {
    const searchInput = document.getElementById('productSearchInput');
    const searchBtn = document.getElementById('btnFilterSearch');

    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') searchBtn?.click();
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const keyword = searchInput?.value.trim();
            // 조회 로직 (추후 API 연동)
            console.log('조회 키워드:', keyword);
        });
    }
}

// 초기화 진입점
export function initOrderHistoryReceipt() {
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');

    // 오늘 날짜로 초기화
    if (startInput && endInput && !startInput.value) {
        startInput.value = formatDate(new Date());
        endInput.value = formatDate(new Date());
    }

    // 캘린더 초기화
    if (startInput) new CustomCalendar('startDate', 'calendar-start');
    if (endInput) new CustomCalendar('endDate', 'calendar-end');

    // 빠른 기간 선택
    initQuickPeriod();

    // 상품검색
    initProductSearch();
}
