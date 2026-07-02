const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm'); 
const passwordHelper = document.getElementById('password-helper');              
const passwordConfirmHelper = document.getElementById('password-confirm-helper');
const editBtn = document.getElementById('edit-btn');
const passwordForm = document.getElementById('password-form');
const toast = document.getElementById('toast');

const pwReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=]).{8,20}$/;

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
// 비밀번호 확인 검증
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

// 수정 버튼 활성화
function checkForm(){
    const okPw = validatePassword();
    const okConfirm = validatePasswordConfirm();
    editBtn.disabled = !(okPw && okConfirm);
}
passwordInput.addEventListener('input', checkForm);
passwordConfirmInput.addEventListener('input', checkForm);

// fetch
passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:8080/users/password',{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
            password: passwordInput.value.trim()
        }),
    });

    if (res.ok){
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
});