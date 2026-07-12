const titleInput = document.getElementById('title-input');
const contentInput = document.getElementById('content-input');
const helperText = document.getElementById('helper-text');
const submitBtn = document.getElementById('submit-btn');
const backBtn = document.getElementById('back-btn');
const editForm = document.getElementById('edit-form');
const imageInput = document.getElementById('image-input');

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

// 기존 게시글 불러오기
async function loadPost(){
    const res = await fetch(`http://localhost:8080/posts/${postId}`);
    const result = await res.json();
    const post = result.data;

    titleInput.value = post.title;
    contentInput.value = post.content;
    checkForm();
}
loadPost();

// 수정 완료 버튼 활성화
function checkForm(){
    const filled = titleInput.value.trim() !== '' && contentInput.value.trim() !== '';
    submitBtn.disabled = !filled;
    submitBtn.classList.toggle('active', filled);
}
titleInput.addEventListener('input', checkForm);
contentInput.addEventListener('input', checkForm);

// fetch
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  let imageUrl = null;
  if(imageInput.files.length > 0){
    imageUrl = await uploadImage(imageInput.files[0]);
  }

  const token = localStorage.getItem('accessToken');

  const res = await fetch(`http://localhost:8080/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
      image: imageUrl,
    }),
  });

  if (res.ok) {
    window.location.href = `./post-detail.html?id=${postId}`;
  } else {
    helperText.textContent = '제목, 내용을 모두 작성해주세요';
  }
});

// 뒤로가기
backBtn.addEventListener('click', () => {
  window.location.href = `./post-detail.html?id=${postId}`;
});