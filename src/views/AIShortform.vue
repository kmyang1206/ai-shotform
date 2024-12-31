<template>
    <div>
      <h1>AI 숏폼 생성</h1>
      <p>숏폼 영상으로 AI 숏폼 영상을 생성합니다.</p>
      <div class="upload-section">
        <p>이곳을 클릭하여 AI 숏폼 영상 생성 설정창을 추가하세요.</p>
      </div>
      <div class="upload-section">
      <label for="name">이름</label>
      <input type="text" id="name" placeholder="이름을 입력하세요" style="display: block; margin-bottom: 20px; width: 100%; padding: 10px;" />
      <label for="file">파일 선택</label>
      <input type="file" id="file" style="display: block; margin-bottom: 20px;" />
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button style="padding: 10px 20px; background-color: #ccc; border: none; cursor: pointer;">취소</button>
        <button style="padding: 10px 20px; background-color: #2c3e50; color: white; border: none; cursor: pointer;">실행</button>
      </div>
    </div>
      <div>
        <h3>파일 업로드 진행</h3>
        <p>총 0개 진행중</p>
      </div>
    </div>
</template>

<script>
export default {};
</script>

<style>
.upload-section {
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: left;
    margin: 20px 0;
    width: calc(100% - 250px); /* 사이드바를 제외한 나머지 너비 */
    margin-left: 250px; /* 사이드바 너비만큼 왼쪽 정렬 */
    box-sizing: border-box; /* 패딩 포함 가로 길이 계산 */
    overflow-x: hidden; /* 가로 스크롤 제거 */
}
</style>
