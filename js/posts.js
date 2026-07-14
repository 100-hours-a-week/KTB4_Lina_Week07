const profileBtn = document.getElementById('profile-btn');
const postList = document.getElementById('post-list');
const scrollSentinel = document.getElementById('scroll-sentinel');

let currentPage = 1;
let hasNext = true;
let isLoading = false;

// 카드 만들어서 post-list에 넣기
function renderPost(post) {
  const card = document.createElement('article');
  card.className = 'post-card';
  card.innerHTML = `
    <div class="post-thumbnail" style="background-image: url(${post.image});"></div>
    <h2 class="post-title">${post.title}</h2>
    <div class="post-meta">
      <span class="post-date">${post.createdAt}</span>
    </div>
    <hr class="post-divider" />
    <div class="post-author">
      <span class="author-avatar" style="background-image: url(${post.author.profileImage});
      background-size: cover;"></span>
      <span class="author-name">${post.author.nickname}</span>
      <span class="post-stats">잘했어요👏 ${formatCount(post.likesCount)}&nbsp;&nbsp;칭찬 ${formatCount(post.commentsCount)}&nbsp;&nbsp;조회수 ${formatCount(post.viewsCount)}</span>
    </div>
  `;
  // 카드 클릭 시 상세조회 이동
  card.addEventListener('click',() => {
    window.location.href = `./post-detail.html?id=${post.postId}`;
  });
  
  postList.appendChild(card);
}

// 서버에서 목록을 받아와 그리는 함수
async function loadPosts(){
  if (isLoading || !hasNext) return;
  isLoading = true;

  try{
    const res = await fetch(`http://localhost:8080/posts?page=${currentPage}&limit=10`);

    if(!res.ok){
      throw new Error(`게시글 조회 실패: ${res.status}`);
    }

    const result = await res.json();
    console.log(result);

    result.data.posts.forEach(post => renderPost(post));
    hasNext = result.data.hasNext;
    currentPage++;
  } catch(error){
    console.log('게시글을 불러오지 못했습니다.', error);
  } finally {
    isLoading = false;
  }
}

// 숫자 포맷
function formatCount(n){
  if (n>=1000){
    return Math.floor(n/1000) + 'k';
  }
  return n;
}

// 인피니티 스크롤링 (초기 조회 아이템 10, 추가 조회 아이템 10)
const observer = new IntersectionObserver((entries) => {
  if(entries[0].isIntersecting){
    loadPosts();
  }
});

observer.observe(scrollSentinel);