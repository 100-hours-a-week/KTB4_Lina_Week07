// ===== 공통 이미지 업로드 =====
// 파일 하나를 서버(/images)에 올리고, 저장된 이미지의 URL을 돌려준다.
// 여러 페이지(작성/수정/회원가입/회원정보수정)에서 재사용.

async function uploadImage(file) {
  const formData = new FormData();     // 파일을 담는 상자
  formData.append('image', file);      // 'image' 이름으로 파일 담기 (백엔드 @RequestParam("image")와 일치)

  const res = await fetch('http://localhost:8080/images', {
    method: 'POST',
    body: formData,                    // JSON이 아니라 FormData를 그대로 전송 (Content-Type은 브라우저가 자동)
  });
  const result = await res.json();
  return result.data.url;              // 서버가 준 이미지 URL 반환
}
