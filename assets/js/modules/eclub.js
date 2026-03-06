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
import { AlternativeProductModal } from './alternative-product-modal.js';
import { CartConfirmModal } from './cart-confirm-modal.js';
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
import { initOrderHistoryReceipt } from './order-history-receipt.js';
import { MypageSidebar } from './mypage-sidebar.js';

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
    AlternativeProductModal,
    CartConfirmModal,
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
    MypageSidebar,

    async init() {
        // 전역 객체로 등록 
        window.Eclub = this;

        // 공통 모듈 초기화 
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
        console.log("[Eclub] Initializing common UI modules...");
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
        this.AlternativeProductModal.init();
        this.BottomSheet.init();
        this.ReplaceProductSheet.init();
        this.ModalProductDetail.init();
        console.log("[Eclub] Common UI modules initialized.");
    },

    initPage(pageId) {
        console.log(`[Eclub] Initializing page-specific modules for: ${pageId || 'unknown'}`);
        // 1. 상품 리스트가 있는 페이지들 (홈, 카테고리, 장바구니, 검색결과, 상품상세 등)
        this.Slider.init();
        this.ProductMore.init();
        this.FilterMore.init();
        this.RecommendArea.init();

        // 2. data-page-id 별 특정 모듈 로드
        switch (pageId) {
            case 'new-product':
            case 'category':
                console.log("[Eclub] Loading Category/New-Product modules");
                // 카테고리 및 신상품 페이지 특화 패널
                this.Selection.init();
                this.CategorySort.init();
                this.DeliverySort.init();
                this.ProductSortAndCount.init();
                this.StickyExchange.init();
                this.CategoryMenu.init();
                this.AddCartModal.init();
                this.CartConfirmModal.init();
                break;

            case 'search':
                console.log("[Eclub] Loading Search modules");
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
                console.log("[Eclub] Loading Cart/Checkout modules");
                // 장바구니 및 구매/결제 페이지 특화 로직
                this.Selection.init(); // 장바구니 내 체크박스 로직 공용
                this.ScrollSpy.init();
                this.DeliverySort.init();
                break;
                
            case 'product':
                console.log("[Eclub] Loading Product Detail modules");
                break;
                
            case 'home':
                console.log("[Eclub] Loading Home modules");
                break;

            case 'exhibition-store':
                console.log("[Eclub] Loading Exhibition Store modules");
                this.Selection.init();
                this.CartConfirmModal.init();
                break;

            case 'order-complete':
                console.log("[Eclub] Loading Order Complete modules");
                break;

            case 'mypage':
                console.log("[Eclub] Loading MyPage modules");
                this.Selection.init();
                this.CategoryMenu.init();
                this.IncentiveProgress.init();
                this.DeliverySort.init();
                this.ProductSortAndCount.init();
                this.MypageSidebar.init(); // 활성 상태 업데이트 추가
                // 주문내역조회(영수증) 필터 초기화
                initOrderHistoryReceipt();
                break;
                
            default:
                console.log("[Eclub] Loading Default modules (Fallback)");
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
