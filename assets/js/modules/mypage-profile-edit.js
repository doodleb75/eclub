export const MypageProfileEdit = {
    init() {
        const profileEditSection = document.querySelector('.profile-edit-section');
        if (!profileEditSection) return;

        const authBlock = profileEditSection.querySelector('.auth-unlock-block');
        const sectionContainer = profileEditSection.querySelector('.section-container');
        const btnAuth = authBlock?.querySelector('.btn-auth');

        if (!authBlock || !sectionContainer || !btnAuth) return;

        btnAuth.addEventListener('click', () => {
            authBlock.style.display = 'none';
            sectionContainer.style.display = 'flex';
        });
    }
};
