// 공용 메뉴 선택 바텀시트 동작
(function () {
    // 메뉴 데이터
    const MenuData = {
        exhibition: {
            title: "기획전 전체",
            items: [
                { text: "이달의 신상품", link: "/eclub/mobile/pages/exhibition.html?type=new" },
                { text: "다품목 할인", link: "/eclub/mobile/pages/exhibition.html?type=discount" },
                { text: "풀무원 브랜드위크", link: "/eclub/mobile/pages/exhibition.html?type=pulmuone" },
                { text: "냉동 국/탕 모음전", link: "/eclub/mobile/pages/exhibition.html?type=soup" },
                { text: "냉장/냉동 이달의 신상품", link: "/eclub/mobile/pages/exhibition.html?type=fresh" },
                { text: "명절 끝 봄매장 전환", link: "/eclub/mobile/pages/exhibition.html?type=spring", active: true },
                { text: "스테비아 커피/차", link: "/eclub/mobile/pages/exhibition.html?type=coffee" },
                { text: "간편하게 즐기는 요리 양념", link: "/eclub/mobile/pages/exhibition.html?type=sauce" },
                { text: "크라운 특가 모음", link: "/eclub/mobile/pages/exhibition.html?type=crown" },
                { text: "금주의 생활용품 행사", link: "/eclub/mobile/pages/exhibition.html?type=living" },
                { text: "떡국떡/만두 특가", link: "/eclub/mobile/pages/exhibition.html?type=tteok" },
                { text: "신선 금액대별 할인", link: "/eclub/mobile/pages/exhibition.html?type=fresh-sale" },
                { text: "혼밥러 공략 편의점 인기상품", link: "/eclub/mobile/pages/exhibition.html?type=convi" }
            ]
        },
        appliance: {
            title: "가전매장",
            items: [
                { text: "전체", link: "/eclub/mobile/pages/exhibition-store.html" },
                { text: "엘지전자", link: "/eclub/mobile/pages/exhibition-store.html?brand=lg" },
                { text: "삼성전자", link: "/eclub/mobile/pages/exhibition-store.html?brand=samsung", active: true },
                { text: "소니", link: "/eclub/mobile/pages/exhibition-store.html?brand=sony" },
                { text: "벨킨", link: "/eclub/mobile/pages/exhibition-store.html?brand=belkin" },
                { text: "앤커", link: "/eclub/mobile/pages/exhibition-store.html?brand=anker" },
                { text: "BOSE", link: "/eclub/mobile/pages/exhibition-store.html?brand=bose" },
                { text: "JBL", link: "/eclub/mobile/pages/exhibition-store.html?brand=jbl" }
            ]
        }
    };

    let sheet, overlay, titleText, menuList, closeBtn;

    // 요소 초기화 (lazy init)
    function initElements() {
        sheet = document.getElementById('menu-selection-sheet');
        overlay = document.getElementById('menu-selection-sheet-overlay');
        
        if (sheet && overlay) {
            titleText = sheet.querySelector('.title-text');
            menuList = sheet.querySelector('.menu-list');
            closeBtn = sheet.querySelector('.btn-sheet-close');

            // 닫기 이벤트 바인딩 (한번만)
            if (closeBtn && !closeBtn.dataset.bound) {
                closeBtn.addEventListener('click', closeSheet);
                closeBtn.dataset.bound = "true";
            }
            if (overlay && !overlay.dataset.bound) {
                overlay.addEventListener('click', closeSheet);
                overlay.dataset.bound = "true";
            }
            return true;
        }
        return false;
    }

    // 시트 열기
    function openSheet(type) {
        if (!initElements()) {
            console.warn('Menu selection sheet elements not found in DOM.');
            return;
        }

        const data = MenuData[type];
        if (!data) return;

        // 컨텐츠 렌더링
        titleText.textContent = data.title;
        menuList.innerHTML = data.items.map(item => `
            <li>
                <a href="${item.link}" class="${item.active ? 'active' : ''}">${item.text}</a>
            </li>
        `).join('');

        // 애니메이션
        sheet.classList.add('is-open');
        overlay.classList.add('is-visible');
        document.body.classList.add('no-scroll');
    }

    // 시트 닫기
    function closeSheet() {
        if (sheet && overlay) {
            sheet.classList.remove('is-open');
            overlay.classList.remove('is-visible');
            document.body.classList.remove('no-scroll');
        }
    }

    // 이벤트 위임 (트리거는 항상 감시)
    document.addEventListener('click', function (e) {
        const trigger = e.target.closest('.btn-menu-sheet');
        if (trigger) {
            e.preventDefault();
            const type = trigger.getAttribute('data-menu-type');
            openSheet(type);
        }
    });
})();
