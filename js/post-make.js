const titleInput = document.getElementById('title-input');
const contentInput = document.getElementById('content-input');
const helperText = document.getElementById('helper-text');
const submitBtn = document.getElementById('submit-btn');
const writeForm = document.getElementById('write-form');
const backBtn = document.getElementById('back-btn');
const imageInput = document.getElementById('image-input');

// 게시글 작성 버튼 활성화
function checkForm(){
    const filled = titleInput.value.trim() !== '' && contentInput.value.trim() !== '';
    submitBtn.disabled = !filled;
    submitBtn.classList.toggle('active', filled);
}

titleInput.addEventListener('input', checkForm);
contentInput.addEventListener('input', checkForm);

// fetch
writeForm.addEventListener('submit', async(e) =>{
    e.preventDefault();

    let imageUrl = null;
    if (imageInput.files.length > 0) {
        imageUrl = await uploadImage(imageInput.files[0])
    }

    const token = localStorage.getItem('accessToken');

    const res = await fetch('http://localhost:8080/posts',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            title: titleInput.value.trim(),
            content: contentInput.value.trim(),
            image: imageUrl,
        }),
    });
    const result = await res.json();
    console.log(result);

    if (res.ok){
        window.location.href = `./post-detail.html?id=${result.data.post_id}`;
    } else {
        helperText.textContent = '제목, 내용을 모두 작성해주세요';
    }
});

// 뒤로가기
backBtn.addEventListener('click', () => {
  window.location.href = './posts.html';
});