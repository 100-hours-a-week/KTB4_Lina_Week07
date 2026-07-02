// 게시글
const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

const postTitle = document.getElementById('post-title');
const authorName = document.getElementById('author-name');
const postImage = document.getElementById('post-image');
const postContent = document.getElementById('post-content');
const editPostBtn = document.getElementById('edit-post-btn');
const deletePostBtn = document.getElementById('delete-post-btn');
const postDate = document.getElementById('post-date');
const postDeleteModal = document.getElementById('post-delete-modal');

// 좋아요
const likeCount = document.getElementById('like-count');
const likeBtn = document.getElementById('like-btn');

// 조회수
const viewCount = document.getElementById('view-count');

// 댓글
const commentCount = document.getElementById('comment-count');
const commentDeleteModal = document.getElementById('comment-delete-modal');
const commentList = document.getElementById('comment-list');
const commentInput = document.getElementById('comment-input');
const commentSubmit = document.getElementById('comment-submit');
const commentForm = document.getElementById('comment-form');

let commentDeleteTargetId = null;
let editingCommentId = null;

// 숫자 포맷
function formatCount(n){
  if (n>=1000){
    return Math.floor(n/1000) + 'k';
  }
  return n;
}

// ?id= 읽어서 게시글 상세 불러오기
function renderDetail(post){
    postTitle.textContent = post.title;
    authorName.textContent = post.author.nickname;
    postDate.textContent = post.createdAt;
    postContent.textContent = post.content;

    likeCount.textContent = formatCount(post.likesCount);
    viewCount.textContent = formatCount(post.viewsCount);
    commentCount.textContent = formatCount(post.commentsCount);

    if(post.image){
        postImage.style.backgroundImage = `url(${post.image})`;
        postImage.style.backgroundSize = 'cover';
        postImage.style.backgroundPosition = 'center';
    }

    commentList.innerHTML = '';
    post.comments.forEach(comment => renderComment(comment));
}

// fetch 구현
async function loadPostDetail(){
    const res = await fetch(`http://localhost:8080/posts/${postId}`);
    const result = await res.json();
    console.log(result);

    renderDetail(result.data);
}

loadPostDetail();

// 좋아요 토글(event+fetch)
likeBtn.addEventListener('click', async() => {
    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:8080/posts/${postId}/likes`,{
        method: 'POST',
        headers: {'Authorization' : `Bearer ${token}`},
    });
    const result = await res.json();
    console.log(result);

    likeCount.textContent = formatCount(result.data.likesCount);
    likeBtn.classList.toggle('liked', result.data.liked);
});

// 모달
function openModal(modal){
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}
function closeModal(modal){
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
}

editPostBtn.addEventListener('click', () =>{
    window.location.href = `./post-edit.html?id=${postId}`;
});

const postCancel = postDeleteModal.querySelector('.modal-cancel');
const postConfirm = postDeleteModal.querySelector('.modal-confirm');

// 삭제 버튼 누르면 모달 오픈
deletePostBtn.addEventListener('click', () => openModal(postDeleteModal));

postCancel.addEventListener('click', () => closeModal(postDeleteModal));

// 확인 버튼 누름(fetch)
postConfirm.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8080/posts/${postId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (res.ok) {
    window.location.href = './posts.html';
  }
});


// 댓글 목록 그리기
function renderComment(comment){
    const item = document.createElement('article');
    item.className = 'comment-item';
    item.innerHTML = `
    <div class="comment-head">
        <div class="comment-author">
            <span class="author-avatar" style="background-image: url(${comment.author.profileImage});
            background-size: cover;"></span>
            <span class="author-name">${comment.author.nickname}</span>
            <span class="comment-date">${comment.createdAt}</span>
        </div>
        <div class="comment-actions">
            <button class="small-btn comment-edit-btn">수정</button>
            <button class="small-btn comment-delete-btn">삭제</button>
      </div>
    </div>
    <p class="comment-content">${comment.content}</p>
    `;
    commentList.appendChild(item);

    const deleteBtn = item.querySelector('.comment-delete-btn');
    deleteBtn.addEventListener('click', () => {
        commentDeleteTargetId = comment.commentId;
        openModal(commentDeleteModal);
    });

    const editBtn = item.querySelector('.comment-edit-btn');
    editBtn.addEventListener('click', () => {
        editingCommentId = comment.commentId;
        commentInput.value = comment.content;
        commentSubmit.textContent = '댓글 수정';
        commentSubmit.disabled = false;
        commentSubmit.classList.add('active');
        commentInput.focus();
    });
}

// 댓글 등록 (이벤트)
commentInput.addEventListener('input', () => {
    const hasText = commentInput.value.trim() !=='';
    commentSubmit.disabled = !hasText;
    commentSubmit.classList.toggle('active', hasText);
});

// 댓글 삭제/수정
 const commentCancel = commentDeleteModal.querySelector('.modal-cancel');
 const commentConfirm = commentDeleteModal.querySelector('.modal-confirm');
 
 commentCancel.addEventListener('click', () => closeModal(commentDeleteModal));

 commentConfirm.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8080/posts/${postId}/comments/${commentDeleteTargetId}`,{
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${token}`},
    });
    if (res.ok){
        closeModal(commentDeleteModal);
        loadPostDetail();
    }
 });

 commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const content = commentInput.value.trim();

    let url, method;
    if (editingCommentId === null){
        url = `http://localhost:8080/posts/${postId}/comments`;
        method = 'POST';
    } else {                                  
        url = `http://localhost:8080/posts/${postId}/comments/${editingCommentId}`;
        method = 'PUT';
    }

    const res = await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({content}),
    });

    if(res.ok){
        commentInput.value = '';
        commentSubmit.disabled = true;
        commentSubmit.classList.remove('active');
        commentSubmit.textContent = '댓글 등록';  
        editingCommentId = null;                  
        loadPostDetail();
    }
 });

 // 뒤로가기
 const backBtn = document.getElementById('back-btn');
 backBtn.addEventListener('click', () => {
    window.location.href = './posts.html';
 });