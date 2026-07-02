const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const helperText = document.getElementById('helper-text');
const loginBtn = document.getElementById('login-btn');
const loginForm = document.getElementById('login-form');

const emailReg = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const pwReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=]).{8,20}$/;

// 이메일 유효성 검사
function validateEmail(){
    const value = emailInput.value.trim();

    if (value === ''){
        helperText.textContent = '이메일을 입력해주세요.'
        return false;
    }

    if (!emailReg.test(value)){
        helperText.textContent = '올바른 이메일 주소 형식을 입력해주세요. (예:example@adapterz.kr)'
        return false;
    }
    return true;
}

// 비밀번호 유효성 검사
function validatePassword(){
    const value = passwordInput.value.trim();

    if (value === ''){
        helperText.textContent = '비밀번호를 입력해주세요.'
        return false;
    }

    if (!pwReg.test(value)){
        helperText.textContent = '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'
        return false;
    }
    return true;
}

// 언제 실행할지
function checkForm(){
    const isValid = validateEmail() && validatePassword() ;

    if (isValid){
        helperText.textContent = '';
        loginBtn.disabled = false; // 활성화
        loginBtn.classList.add('active');
    } else {
        loginBtn.disabled = true;
        loginBtn.classList.remove('active');
    }
}

// event 사용
emailInput.addEventListener('input', checkForm);
passwordInput.addEventListener('input', checkForm);

// 로그인 요청 -> 요청 성공 시 게시글 페이지로 이동
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // 새로고침 막기

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try{
        const res = await fetch('http://localhost:8080/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password}),
        });

        const result = await res.json();
        console.log('서버 응답:', result);

        if (result.message === 'login_success'){
            localStorage.setItem('token', result.data.token);
            window.location.href = './posts.html';
        } else {
            helperText.textContent = '아이디 또는 비밀번호를 확인해주세요';
        }
    } catch (err){
        console.error(err);
        helperText.textContent = '서버와 통신에 실패했습니다.';
    }
});