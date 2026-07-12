const emailValue = document.getElementById('email-value');
const nicknameInput = document.getElementById('nickname');
const profilePreview = document.getElementById('profile-preview');
const profileInput = document.getElementById('profile-input');

const nicknameHelper = document.getElementById('nickname-helper');
const editBtn = document.getElementById('edit-btn');
const profileForm = document.getElementById('profile-form');
const toast = document.getElementById('toast');

const withdrawBtn = document.getElementById('withdraw-btn');
const withdrawModal = document.getElementById('withdraw-modal');
const withdrawCancel = withdrawModal.querySelector('.modal-cancel');
const withdrawConfirm = withdrawModal.querySelector('.modal-confirm');

// 페이지 열 때 내 정보 불러오기
async function loadMyInfo() {

    const token = localStorage.getItem('accessToken');

    const res = await fetch('http://localhost:8080/users/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const result = await res.json();
    console.log(result);

    const user = result.data;
    emailValue.textContent = user.email;       
    nicknameInput.value = user.nickname;        

    if (user.profile_image) {                   
        profilePreview.src = user.profile_image;
        profilePreview.style.display = 'block';
    }
    }
    loadMyInfo();

// 닉네임 검증
function validateNickname() {
    const value = nicknameInput.value.trim();
    if (value === '') { 
        nicknameHelper.textContent = '닉네임을 입력해주세요.'; 
        return false; 
    }
    if (value.length > 10) { 
        nicknameHelper.textContent = '닉네임은 최대 10자 까지 작성 가능합니다.'; 
        return false; 
    }
    nicknameHelper.textContent = '';
    return true;
}

// fetch
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateNickname()) return;

    let profileUrl = null;
    if(profileInput.files.length > 0){
        profileUrl = await uploadImage(profileInput.files[0]);
    }

    const token = localStorage.getItem('accessToken');

    const res = await fetch('http://localhost:8080/users/profile', {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        nickname: nicknameInput.value.trim(),
        profile_image: profileUrl,
        }),
    });

    const result = await res.json();
    if (res.ok) {
        showToast();   // 수정완료 토스트
    } else if (result.message === 'duplicate_nickname') {
        nicknameHelper.textContent = '중복된 닉네임 입니다.';
    }
    });

// 토스트를 2초간 보여줬다 숨기기
function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// modal
function openModal(modal){
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}
function closeModal(modal){
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
}

withdrawBtn.addEventListener('click', () => openModal(withdrawModal));

withdrawCancel.addEventListener('click', () => closeModal(withdrawModal));

withdrawConfirm.addEventListener('click', async () => {

    const token = localStorage.getItem('accessToken');

    const res = await fetch('http://localhost:8080/users',{
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if(res.ok){
        window.location.href = './login.html';
    }
});

 // 뒤로가기
 const backBtn = document.getElementById('back-btn');
 backBtn.addEventListener('click', () => {
    window.location.href = './posts.html';
 });