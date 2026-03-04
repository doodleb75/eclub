import { Const } from './constants.js';
import { OverlayManager } from './overlay.js';
import { SearchUtil } from './search-util.js';
import { DataLoader } from './data-loader.js';
import { CategoryRenderUtil } from './category-render.js';
import { Toast } from './toast.js';
import { Clipboard } from './clipboard.js';
import { Toggle } from './toggle.js';
import { BrowserZoom, getZoomScale } from './browser-zoom.js';
import { Tabs } from './tabs.js';
import { Quantity } from './quantity.js';
import { CustomSelect } from './custom-select.js';
import { Cart } from './cart.js';
import { Favorites } from './favorites.js';
import { QuickMenu } from './quick-menu.js';
import { BottomSheet } from './bottom-sheet.js';
import { Selection } from './selection.js';
import { CategorySort } from './category-sort.js';
import { DeliverySort } from './delivery-sort.js';
import { CategoryMenu } from './category-menu.js';
import { PagingUtil } from './paging-util.js';
import { ProductMore } from './product-more.js';
import { FilterMore } from './filter-more.js';
import { Slider } from './slider.js';
import { ScrollSpy } from './scroll-spy.js';
import { InputHandler } from './input-handler.js';
import { Referral } from './referral.js';
import { FloatingUtil } from './floating-util.js';
import { Loader } from './loader.js';
import { QuickMenuScroll } from './quick-menu-scroll.js';
import { ProductSortAndCount } from './product-sort-and-count.js';
import { HeaderMenu } from './header-menu.js';
import { HeaderBrand } from './header-brand.js';
import { HeaderCategory } from './header-category.js';
import { MobileCategorySheet } from './mobile-category-sheet.js';
import { Search } from './search.js';
import { SearchOverlay } from './search-overlay.js';
import { StickyExchange } from './sticky-exchange.js';
import { RecommendArea } from './recommend-area.js';
import { AddCartModal } from './add-cart-modal.js';
import { CategoryFilter } from './category-filter.js';
import { GlobalModal } from './global-modal.js';
import { Popover } from './popover.js';
import { PcQuickMenu } from './pc-quick-menu.js';
import { MenuSheet } from './menu-sheet.js';
import { SearchFilterSheet } from './search-filter-sheet.js';
import { ModalExcelUpload } from './modal-excel-upload.js';
import { ModalItemOption } from './modal-item-option.js';
import { ReplaceProductSheet } from './replace-product-sheet.js';
import { IncentiveProgress } from './incentive-progress.js';
import { ModalProductDetail } from './modal-product-detail.js';

const Eclub = {
    Const,
    OverlayManager,
    SearchUtil,
    DataLoader,
    CategoryRenderUtil,
    Toast,
    Clipboard,
    Toggle,
    BrowserZoom,
    getZoomScale,
    Tabs,
    Quantity,
    CustomSelect,
    Cart,
    Favorites,
    QuickMenu,
    BottomSheet,
    Selection,
    CategorySort,
    DeliverySort,
    CategoryMenu,
    PagingUtil,
    ProductMore,
    FilterMore,
    Slider,
    ScrollSpy,
    InputHandler,
    Referral,
    FloatingUtil,
    Loader,
    QuickMenuScroll,
    ProductSortAndCount,
    HeaderMenu,
    HeaderBrand,
    HeaderCategory,
    MobileCategorySheet,
    Search,
    SearchOverlay,
    StickyExchange,
    RecommendArea,
    AddCartModal,
    CategoryFilter,
    GlobalModal,
    Popover,
    PcQuickMenu,
    MenuSheet,
    SearchFilterSheet,
    ModalExcelUpload,
    ModalItemOption,
    ReplaceProductSheet,
    IncentiveProgress,
    ModalProductDetail,

    async init() {
        // 전역 객체로 등록 (하위 호환성 유지)
        window.Eclub = this;

        // 공통 모듈 초기화 (모든 페이지 공통)
        this.initCommon();

        // 비동기 모듈 초기화 (헤더 인클루드 등 외부 리소스 로딩)
        await this.Loader.init();

        // 헤더 인클루드 이후 실행되어야 하는 공통 모듈
        if (this.BrowserZoom) this.BrowserZoom.init();
        this.Search.init();
        this.HeaderBrand.init();
        this.HeaderMenu.init();
        this.HeaderCategory.init();
        this.MobileCategorySheet.init();
        this.SearchOverlay.init();
        
        // 플로팅 메뉴 (푸터 로딩 후 실행되어야 할 수 있음)
        this.FloatingUtil.init();

        // 페이지별 렌더링 후 이벤트 바인딩 (data-page-id 기반)
        const pageId = document.body.dataset.pageId;
        this.initPage(pageId);

        console.log(`Eclub Common UI Initialized (Page ID: ${pageId || 'common'})`);
    },

    initCommon() {
        // 이벤트 위임 기반 공통 UI
        this.CategoryFilter.init();
        this.Referral.init();
        this.CustomSelect.init();
        this.Tabs.init();
        this.Quantity.init();
        this.Favorites.init();
        this.Cart.init();
        this.InputHandler.init();
        this.Clipboard.init();
        this.Toggle.init();
        
        // 플로팅 메뉴 등 공통 레이아웃 (FloatingUtil은 init에서 처리)
        this.QuickMenu.init();
        this.PcQuickMenu.init();
        this.QuickMenuScroll.init();
        
        // 공통 유틸리티
        
        // 추가 모달 등 범용 기능
        this.Popover.init();
        this.MenuSheet.init();
        this.SearchFilterSheet.init();
        this.ModalExcelUpload.init();
        this.ModalItemOption.init();
        this.AddCartModal.init();
        this.BottomSheet.init();
        this.ReplaceProductSheet.init();
        this.ModalProductDetail.init();
    },

    initPage(pageId) {
        // 1. 상품 리스트가 있는 페이지들 (홈, 카테고리, 장바구니, 검색결과, 상품상세 등)
        this.Slider.init();
        this.ProductMore.init();
        this.FilterMore.init();
        this.RecommendArea.init();

        // 2. data-page-id 별 특정 모듈 로드
        switch (pageId) {
            case 'new-product':
            case 'category':
                // 카테고리 및 신상품 페이지 특화 패널
                this.Selection.init();
                this.CategorySort.init();
                this.DeliverySort.init();
                this.ProductSortAndCount.init();
                this.StickyExchange.init();
                this.CategoryMenu.init();
                this.AddCartModal.init();
                break;

            case 'search':
                // 검색 결과 페이지 특화 패널 (사이드바 메뉴 대신 검색 필터 사용)
                this.Selection.init();
                this.CategorySort.init();
                this.DeliverySort.init();
                this.ProductSortAndCount.init();
                this.StickyExchange.init();
                this.AddCartModal.init();
                // CategoryMenu.init() 대신 FilterMore.init()이 공통 init에서 호출됨
                break;
                
            case 'cart':
            case 'checkout':
                // 장바구니 및 구매/결제 페이지 특화 로직
                this.Selection.init(); // 장바구니 내 체크박스 로직 공용
                this.ScrollSpy.init();
                this.DeliverySort.init();
                break;
                
            case 'product':
                // 상품 상세 전용
                break;
                
            case 'home':
                // 홈(메인) 페이지 전용 로직 (슬라이더 등은 공통에서 처리중)
                break;

            case 'exhibition':
                this.ProductSortAndCount.init();
                this.DeliverySort.init();
                break;
            case 'mypage':
                this.CategoryMenu.init();
                this.IncentiveProgress.init();
                break;
                
            default:
                // 지정되지 않은 페이지의 경우 필요시 전체 실행 (하위 호환)
                this.Selection.init();
                this.CategorySort.init();
                this.ProductSortAndCount.init();
                this.StickyExchange.init();
                this.CategoryMenu.init();
                this.ScrollSpy.init();
                this.DeliverySort.init();
                break;
        }
    }
};

// DOM 로딩 완료 시 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Eclub.init());
} else {
    Eclub.init();
}

export default Eclub;
