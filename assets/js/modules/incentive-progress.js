// 장려금 지급 기준 프로그래스 바 로직
const IncentiveProgress = {
    // 유형별 구간 금액 매핑
    // 0.5% = 1500 고정, 1~3%는 type에 따라 다름
    CONFIG: {
        'type-a': [
            { val: 0, pos: 0 },
            { val: 1500, pos: 0.5 },
            { val: 2000, pos: 1 },
            { val: 3000, pos: 2 },
            { val: 4000, pos: 3 }
        ],
        'type-b': [
            { val: 0, pos: 0 },
            { val: 1500, pos: 0.5 },
            { val: 3000, pos: 1 },
            { val: 4000, pos: 2 },
            { val: 5000, pos: 3 }
        ]
    },

    // 금액 포맷 (1,000 단위 콤마)
    formatMoney(val) {
        return new Intl.NumberFormat('ko-KR').format(Math.round(val));
    },

    // step DOM의 실제 left 위치 + 26px 오프셋으로 fill 타겟 위치 산출
    getStepPositions(wrap) {
        const bar = wrap.querySelector('.progress-bar');
        const steps = wrap.querySelectorAll('.step');
        if (!bar || !steps.length) return [];

        const barLeft = bar.getBoundingClientRect().left;
        const barWidth = bar.offsetWidth;
        const OFFSET = 26; // step 중심에서 오른쪽으로 26px 추가

        // 시작점(0px) 포함
        const positions = [0];
        steps.forEach(step => {
            const stepRect = step.getBoundingClientRect();
            const stepCenter = stepRect.left + stepRect.width / 2 - barLeft;
            // step 위치 + 26px offset, barWidth 초과 방지
            positions.push(Math.min(stepCenter + OFFSET, barWidth));
        });

        return positions;
    },

    // 프로그래스 바 업데이트
    update(wrap, currentVal, type = 'type-a') {
        const points = this.CONFIG[type] || this.CONFIG['type-a'];
        const barFill = wrap.querySelector('.bar-fill');
        const bar = wrap.querySelector('.progress-bar');
        const steps = wrap.querySelectorAll('.step');

        if (!barFill || !bar) return;

        // step DOM 위치 기반 px 매핑
        const stepPx = this.getStepPositions(wrap);
        const barWidth = bar.offsetWidth;
        const maxVal = points[points.length - 1].val;

        let finalPx = 0;

        // 다구간 선형 보간으로 위치(px) 계산
        if (currentVal <= 0) {
            finalPx = 0;
        } else if (currentVal >= maxVal) {
            finalPx = stepPx[stepPx.length - 1] || barWidth;
        } else {
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                if (currentVal >= p1.val && currentVal <= p2.val) {
                    const ratio = (currentVal - p1.val) / (p2.val - p1.val);
                    const px1 = stepPx[i] || 0;
                    const px2 = stepPx[i + 1] || barWidth;
                    finalPx = px1 + ratio * (px2 - px1);
                    break;
                }
            }
        }

        barFill.style.width = `${finalPx}px`;

        // 각 단계(dot) 상태 업데이트
        let currentReward = 0;
        steps.forEach((step, idx) => {
            const point = points[idx + 1]; // 0.5%, 1%, 2%, 3% 순서
            if (!point) return;

            if (currentVal >= point.val) {
                step.classList.add('is-active');
                currentReward = point.pos;

                const nextPoint = points[idx + 2];
                if (!nextPoint || currentVal < nextPoint.val) {
                    step.classList.add('is-current');
                } else {
                    step.classList.remove('is-current');
                }
            } else {
                step.classList.remove('is-active', 'is-current');
            }
        });

        // 타이틀의 리워드 수치 업데이트
        const rewardText = wrap.querySelector('.reward-value');
        if (rewardText) {
            rewardText.textContent = currentReward;
        }
    },

    // 초기화
    init() {
        const wraps = document.querySelectorAll('.incentive-progress-wrap');
        if (!wraps.length) return;

        wraps.forEach(wrap => {
            const currentVal = parseFloat(wrap.dataset.currentMoney) || 0;
            const type = wrap.dataset.type || 'type-a';

            this.update(wrap, currentVal, type);
        });
    }
};

export { IncentiveProgress };
