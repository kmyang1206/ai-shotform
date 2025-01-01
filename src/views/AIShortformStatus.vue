<template>
  <div>
    <h1>분석 이력 조회</h1>
    <!-- 필터 섹션 -->
    <div class="filter-section">
      <label for="startDate">요청 시간</label>
      <input type="date" id="startDate" v-model="startDate" />
      <span> - </span>
      <input type="date" id="endDate" v-model="endDate" />
      <button class="filter-button" @click="filterResults">조회</button>
    </div>

    <!-- 테이블 섹션 -->
    <div class="table-section">
      <table>
        <thead>
          <tr>
            <th>작업 ID</th>
            <th>API</th>
            <th>이름(파일명)</th>
            <th>인증키 명</th>
            <th>사용자</th>
            <th>상태</th>
            <th>요청 시간</th>
            <th>시작 시간</th>
            <th>완료 시간</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="box in uploadHistory" :key="box.id">
          <td>{{ box.id }}</td>
          <td>AI숏폼업로드</td>
          <td>{{ box.fileName }}</td>
          <td>abcde12345</td>
          <td>테스트</td>
          <td>{{ box.status }}</td>
          <td>{{ box.requestTime }}</td>
          <td>{{ box.startTime || "미시작" }}</td>
          <td>{{ box.endTime || "진행 중" }}</td>
        </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadHistory: [], // 로컬 저장된 업로드 이력
    };
  },
  methods: {
    loadUploadHistory() {
      const data = localStorage.getItem("uploadHistory");
      this.uploadHistory = data ? JSON.parse(data) : [];
    },
    startWatchingLocalStorage() {
      // 로컬 스토리지 변화 감지
      window.addEventListener("storage", this.loadUploadHistory);
    },
    stopWatchingLocalStorage() {
      // 이벤트 리스너 제거
      window.removeEventListener("storage", this.loadUploadHistory);
    },
  },
  mounted() {
    this.loadUploadHistory(); // 초기 데이터 로드
    this.startWatchingLocalStorage(); // 로컬 스토리지 감시 시작
  },
  beforeUnmount() {
    this.stopWatchingLocalStorage(); // 컴포넌트 해제 시 감시 종료
  },
};
</script>

<style>
.filter-section {
  margin-bottom: 20px;
}

.filter-section label {
  margin-right: 10px;
}

.filter-section input {
  margin-right: 10px;
}

.filter-button {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
}

.table-section table {
  width: 100%;
  border-collapse: collapse;
}

.table-section th,
.table-section td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table-section th {
  background-color: #f2f2f2;
}

.status-진행중 {
  color: orange;
}

.status-완료 {
  color: green;
}

.status-취소됨 {
  color: gray;
}

.status-에러 {
  color: red;
}
</style>
