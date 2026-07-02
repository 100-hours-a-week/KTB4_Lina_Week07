// ===== 공통 헤더: 프로필 드롭다운 + 로그아웃 =====
// 모든 로그인 후 페이지에서 이 파일을 불러와 재사용
// (변수명 앞에 header 를 붙여 각 페이지 스크립트와 충돌 방지)

const headerProfileBtn = document.getElementById('profile-btn');
const headerDropdown = document.getElementById('profile-dropdown');
const headerLogoutBtn = document.getElementById('logout-btn');

// 프로필 버튼 클릭 → 드롭다운 열기/닫기
if (headerProfileBtn && headerDropdown) {
  headerProfileBtn.addEventListener('click', (e) => {
    e.stopPropagation();                     // 바깥 클릭 감지로 바로 닫히는 것 방지
    headerDropdown.classList.toggle('show');
  });

  // 메뉴 바깥 아무 곳이나 클릭하면 닫기
  document.addEventListener('click', () => {
    headerDropdown.classList.remove('show');
  });
}

// 로그아웃 → 토큰 삭제하고 로그인 페이지로
if (headerLogoutBtn) {
  headerLogoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = './login.html';
  });
}
