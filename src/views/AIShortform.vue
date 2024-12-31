<template>
    <div>
      <h1>AI 숏폼 생성</h1>
      <p>숏폼 영상으로 AI 숏폼 영상을 생성합니다.</p>
      <div class="upload-section" @click="addUploadBox">
        <p>이곳을 클릭하여 AI 숏폼 영상 생성 설정창을 추가하세요.</p>
      </div>
      <div v-for="(box, index) in uploadBoxes" :key="index" class="upload-section">
        <label :for="'name-' + index">이름</label>
        <input :id="'name-' + index" type="text" placeholder="이름을 입력하세요" />
        <div>
            <input :id="'file-' + index" type="file" />
        </div>        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button style="padding: 10px 20px; background-color: #ccc; border: none; cursor: pointer;"  @click="removeUploadBox(index)">취소</button>
        <button style="padding: 10px 20px; background-color: #2c3e50; color: white; border: none; cursor: pointer;">실행</button>
      </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        uploadBoxes: [],
      };
    },
    methods: {
      addUploadBox() {
        this.uploadBoxes.push({});
      },
      removeUploadBox(index) {
        this.uploadBoxes.splice(index, 1);
      },
    },
  };
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
  .menu-item {
      margin: 10px 0;
      cursor: pointer;
      color: white;
  }
  .menu-item:hover {
      color: #ccc;
  }
  .menu-subitem {
      margin-left: 20px;
      cursor: pointer;
      color: white;
  }
  .menu-subitem:hover {
      color: #ccc;
  }
  .accordion-content {
      margin-top: 10px;
  }
  </style>
  