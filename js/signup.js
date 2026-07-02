const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const nicknameInput = document.getElementById('nickname');

const emailHelper = document.getElementById('email-helper');
const passwordHelper = document.getElementById('password-helper');
const passwordConfirmHelper = document.getElementById('password-confirm-helper');
const nicknameHelper = document.getElementById('nickname-helper');
const profileHelper = document.getElementById('profile-helper');

const signupBtn = document.getElementById('signup-btn');
const signupForm = document.getElementById('signup-form');
const backBtn = document.getElementById('back-btn');

const profileInput = document.getElementById('profile-input');
const profilePreview = document.getElementById('profile-preview');

const emailReg = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const pwReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=]).{8,20}$/;

// 이메일 검증
function validateEmail(){
    const value = emailInput.value.trim();
    if (value === '') {
        emailHelper.textContent = '이메일을 입력해주세요'; return false;
    }
    if (!emailReg.test(value)) {
        emailHelper.textContent = '올바른 이메일 주소 형식을 입력해주세요.(예: example@example.com)'; 
        return false;
    }
    emailHelper.textContent = '';
    return true;
}

// 비밀번호 검증
function validatePassword(){
    const value = passwordInput.value.trim();
    if (value === ''){
        passwordHelper.textContent = '비밀번호를 입력해주세요';
        return false;
    }
    if (!pwReg.test(value)){
        passwordHelper.textContent = '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        return false;
    }
    passwordHelper.textContent = '';
    return true;
}

// 비밀번호 확인
function validatePasswordConfirm(){
    const value = passwordConfirmInput.value.trim();
    if (value === ''){
        passwordConfirmHelper.textContent = '비밀번호를 한번 더 입력해주세요';
        return false;
    }
    if (value !== passwordInput.value.trim()){
        passwordConfirmHelper.textContent = '비밀번호가 다릅니다.';
        return false;
    }
    passwordConfirmHelper.textContent = '';
    return true;
}

// 닉네임 검증
function validateNickname(){
    const value = nicknameInput.value.trim();
    if (value === ''){
        nicknameHelper.textContent = '닉네임을 입력해주세요.'; return false;
    }
    if (value.includes(' ')){
        nicknameHelper.textContent = '띄어쓰기를 없애주세요'; return false;
    }
    if (value.length >10){
        nicknameHelper.textContent = '닉네임은 최대 10자까지 작성 가능합니다.'; return false;
    }
    nicknameHelper.textContent = '';
    return true;
}

// 프로필 사진 선택
profileInput.addEventListener('change', () => {
    const file = profileInput.files[0];
    if(file){
        profilePreview.src = URL.createObjectURL(file);
        profilePreview.style.display = 'block';
        profileHelper.textContent = '';
    }
    checkForm();
});

// 버튼 활성화
function checkForm(){
    const hasProfile = profileInput.files.length > 0;

    // 프로필 사진 안내
    if (!hasProfile){
        profileHelper.textContent = '프로필 사진을 추가해주세요.';
    } else {
        profileHelper.textContent = '';
    }

    const okEmail = validateEmail();
    const okPassword = validatePassword();
    const okPasswordConfirm = validatePasswordConfirm();
    const okNickname = validateNickname();

    const isValid = okEmail && okPassword && okPasswordConfirm && okNickname && hasProfile;

    signupBtn.disabled = !isValid;
    signupBtn.classList.toggle('active', isValid);
}

emailInput.addEventListener('input', checkForm);
passwordInput.addEventListener('input', checkForm);
passwordConfirmInput.addEventListener('input', checkForm);
nicknameInput.addEventListener('input', checkForm);

// 회원가입 fetch
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const profileUrl = await uploadImage(profileInput.files[0]);

    const res = await fetch('http://localhost:8080/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        nickname: nicknameInput.value.trim(),
        profile_image: profileUrl,
        }),
    });

    const result = await res.json();
    console.log(result);

    if (res.ok){
        window.location.href = './login.html';
    } else {
        if (result.message === 'duplicate_email'){
            emailHelper.textContent = '중복된 이메일 입니다.';
        } else if (result.message === 'duplicate_nickname'){
            nicknameHelper.textContent = '중복된 닉네임 입니다.';
        }
    }
});

// 뒤로가기 -> 로그인 페이지
backBtn.addEventListener('click', () => {
    window.location.href = './login.html';
});