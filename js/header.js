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

  document.addEventListener('click', () => {
    headerDropdown.classList.remove('show');
  });
}

if (headerLogoutBtn) {
  headerLogoutBtn.addEventListener('click', () => {
    localStorage.removeItem('accessToken');
    window.location.href = './login.html';
  });
}

if(headerProfileBtn){
  const token = localStorage.getItem('accessToken');

  fetch('http://localhost:8080/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  .then(res => res.ok ? res.json() : null)
  .then(result => {
    const img = result?.data?.profile_image;
    if(img) {
      headerProfileBtn.style.backgroundImage = `url(${img})`;
      headerProfileBtn.style.backgroundSize = 'cover';
      headerProfileBtn.style.backgroundPosition = 'center';
    }
  })
  .catch(() => {});
}
