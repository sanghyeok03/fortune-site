document.getElementById('fortune-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/api/fortune', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('서버 응답 오류');

    const result = await res.json();
    document.getElementById('result').innerHTML = `<pre>${result.fortune}</pre>`;
  } catch (err) {
    console.error('운세 요청 실패:', err);
    document.getElementById('result').innerText = '⚠️ 운세를 불러오지 못했습니다. 서버가 실행 중인지 확인하세요.';
  }
});

// 댓글 기능
function submitComment() {
  const text = document.getElementById('new-comment').value.trim();
  if (text) {
    const div = document.createElement('div');
    div.innerText = text;
    document.getElementById('comment-list').appendChild(div);
    document.getElementById('new-comment').value = '';
  }
}

// 카카오톡 공유 기능
Kakao.init('여기에_카카오_JAVASCRIPT_KEY를_입력하세요'); // 실제 키로 대체

if (Kakao.isInitialized()) {
  document.getElementById('kakao-share-btn').addEventListener('click', function () {
    Kakao.Link.sendDefault({
      objectType: 'text',
      text: '오늘의 운세 사이트에서 나의 운세를 확인해보세요!',
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href,
      }
    });
  });
} else {
  console.warn('카카오톡 초기화 실패: 잘못된 API 키일 수 있음');
}
