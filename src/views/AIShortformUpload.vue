<template>
  <div>
    <h1>AI 숏폼 생성</h1>
    <input type="file" @change="handleFileSelection" multiple />
    <div v-if="files.length">
      <div v-for="(file, index) in files" :key="index" style="margin-bottom: 20px">
        <p>
          <strong>{{ file.name }}</strong> - {{ progress[index] }}%
        </p>
        <p>Status: {{ status[index] }}</p>
      </div>
    </div>

    <!-- 기존 업로드 섹션 -->
    <div class="upload-section" @click="addUploadBox">
      <p>이곳을 클릭하여 AI 숏폼 영상 생성 설정창을 추가하세요.</p>
    </div>
    <div v-for="(box, index) in uploadBoxes" :key="index" class="upload-section">
      <label :for="'name-' + index">이름</label>
      <input :id="'name-' + index" type="text" placeholder="이름을 입력하세요"
        style="display: block; margin-bottom: 20px; width: 100%" />
      <label :for="'file-' + index">파일 선택</label>
      <input :id="'file-' + index" type="file" style="display: block; margin-bottom: 20px"
        @change="onFileSelected(index, $event)" />
      <progress v-if="box.progress !== null" :value="box.progress" max="100"
        style="width: 100%; margin: 10px 0"></progress>
      <div style="display: flex; gap: 10px; justify-content: flex-end">
        <button class="cancel" @click="cancelUpload(index)">취소</button>
        <button class="execute" @click="startUpload(index)">실행</button>
      </div>
    </div>

    <!-- 파일 업로드 진행 박스 -->
    <div class="upload-progress">
      <h3>파일 업로드 진행</h3>
      <p>총 {{ uploadBoxes.length }}개 진행중</p>
      <ul>
        <li v-for="(box, index) in uploadBoxes" :key="index">
          {{ box.name || "이름 없음" }}: {{ box.progress || 0 }}% -
          {{ box.status || "대기 중" }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  uploadChunk,
  checkUploadedChunks,
  checkStatus
} from "@/services/apiService";
import CryptoJS from "crypto-js";

export default {
  data() {
    return {
      files: [],
      progress: [],
      status: [],
      isUploading: [],
      errors: [],
      uploadBoxes: [],
      cancelTokens: {}
    };
  },
  methods: {
    handleFileSelection(event) {
      this.files = Array.from(event.target.files);
      this.progress = this.files.map(() => 0);
      this.status = this.files.map(() => "대기");
      this.isUploading = this.files.map(() => false);
      this.errors = this.files.map(() => null);
    },
    async startUpload(index) {
  
      const box = this.uploadBoxes[index];
      if (!box.file) {
        alert("파일을 선택해주세요.");
        return;
      }
   
      const chunkSize = 100 * 1024 * 1024; // 100MB
      const totalChunks = Math.ceil(box.file.size / chunkSize);

      const cancelToken = { cancel: false };
      this.cancelTokens[index] = cancelToken;
      
      try {
        // Check if file already exists in local history
        // const history = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
        // const existingEntry = history.find(entry => entry.name === box.name);

        // if (existingEntry && box.status === '업로드중') {
        //   console.log(`existingEntry ${box.name} ${existingEntry.status}`);

        //   box.id = existingEntry.id;
        //   //box.file = existingEntry.file;
        //   box.status = existingEntry.status;
        //   box.progress = existingEntry.progress;
        //   box.startTime = existingEntry.startTime;
        //   box.endTime = existingEntry.endTime;
        // }       
        // else {
        //   console.log(`not existingEntry ${box.name}`);
        //   const now = new Date();
        //   box.id = now.toISOString().replace(/[-:.TZ]/g, '');
        //   box.startTime = now.toISOString();
        //   box.progress = 0;
        //   box.status = "업로드중";
        //   this.saveUploadHistory(box);
        // }

        const now = new Date();
        box.id = now.toISOString().replace(/[-:.TZ]/g, '');
        box.startTime = now.toISOString();
        box.progress = 0;
        box.status = "업로드중";
        this.saveUploadHistory(box);

        const serverStatus = await checkUploadedChunks(box.name);
        const uploadedChunks = serverStatus.uploadedChunks || [];
        const serverChecksum = serverStatus.checksum;

        console.log(`uploadedChunks.length ${uploadedChunks.length}`);
        if (uploadedChunks.length > 0) {
          const lastUploadedChunkNumber = Math.max(...uploadedChunks);
          const start = lastUploadedChunkNumber * chunkSize;
          const end = Math.min(start + chunkSize, box.file.size);
          const lastChunk = box.file.slice(start, end);

          const localChecksum = await this.calculateMD5(lastChunk);
          if (serverChecksum && localChecksum !== serverChecksum) {
            console.error(
              `Checksum mismatch. Restarting upload for ${box.file.name}`
            );
            uploadedChunks.length = 0; // Reset uploaded chunks
          }
        }

        for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
          if (cancelToken.cancel) {
            box.status = "취소";
            box.endTime = new Date().toISOString();
            this.saveUploadHistory(box);
            return;
          }
          if (uploadedChunks.includes(chunkNumber)) continue;

          const start = chunkNumber * chunkSize;
          const end = Math.min(start + chunkSize, box.file.size);
          const chunk = box.file.slice(start, end);

          await uploadChunk(chunk, box.file.name, chunkNumber, totalChunks);
          box.progress = Math.round(((chunkNumber + 1) / totalChunks) * 100);
          this.saveUploadHistory(box);
        }

        // chunk 업로드 완료 후 merge상태 체크
        let merging = true;
        box.status = "머지중";
        this.saveUploadHistory(box);

        while (merging) {
          const status = await checkStatus(box.file.name);
          box.status = status.status;
          if (status.status === "done") {
            merging = false;
            box.status = "완료";
            box.endTime = new Date().toISOString();
            this.saveUploadHistory(box);
            this.removeUploadBox(index);
          }

          await new Promise((resolve) => setTimeout(resolve, 2000)); //2초마다 체크
        }
      } catch (error) {
        box.status = "에러";
        box.endTime = new Date().toISOString();
        this.saveUploadHistory(box);
        console.error(`Error uploading file: ${error.message}`);
      }
    },
    cancelUpload(index) {
      if (this.cancelTokens[index] && this.uploadBoxes[index].status !== "완료") {
        this.cancelTokens[index].cancel = true;
        this.uploadBoxes[index].status = "취소";

        console.log(`Upload for index ${index} has been canceled.`);
        this.uploadBoxes[index].endTime = new Date().toISOString();
        if ( this.uploadBoxes[index].startTime ) {
          this.saveUploadHistory(this.uploadBoxes[index]);
        }        
      }
      this.removeUploadBox(index);
    },
    addUploadBox() {
      const now = new Date();
      const id = now.toISOString().replace(/[-:.TZ]/g, ""); // 작업 ID. 실제는 UUID로
      this.uploadBoxes.push({
        id,
        name : "",
        fileName: "",
        status: "대기",
        progress: 0,
        requestTime: now.toISOString(),
        startTime: null,
        endTime: null,
      });
    },
    removeUploadBox(index) {
      this.uploadBoxes.splice(index, 1);
    },
    onFileSelected(index, event) {
      const file = event.target.files[0];
      this.uploadBoxes[index].file = file;
      this.uploadBoxes[index].name = file.name;
    },
    async calculateMD5(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const wordArray = CryptoJS.lib.WordArray.create(reader.result);
          const hash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
          resolve(hash);
        };
        reader.onerror = () => reject(new Error("Failed to calculate MD5"));
        reader.readAsArrayBuffer(file);
      });
    },
    // DB 대체, 데이터를 로컬 파일에 저장장
    // saveUploadHistory() {
    //   localStorage.setItem("uploadHistory", JSON.stringify(this.uploadBoxes));
    // },
    saveUploadHistory(box) {
      const history = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
      const existingIndex = history.findIndex((entry) => entry.id === box.id);

      if (existingIndex !== -1) {
        history[existingIndex] = box; // 기존 데이터 업데이트
      } else {
        history.push(box); // 새 데이터 추가
      }

      localStorage.setItem('uploadHistory', JSON.stringify(history));
    },
    loadUploadHistory() {
      const data = localStorage.getItem("uploadHistory");
      this.uploadBoxes = data ? JSON.parse(data) : [];
      // const history = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
      // this.uploadBoxes = history.map(item => ({
      //   ...item,
      //   file : item.file,
      //   name : item.name,
      //   progress: item.progress || 0,
      //   status: item.status || '대기중',
      // }));
    },
  },
  unmounted() {
    //this.loadUploadHistory();
    // this.uploadBoxes.forEach((box, index) => {
    //     if (box.status === '업로드중') {
    //         this.startUpload(index);
    //     }
    // });
    Object.keys(this.cancelTokens).forEach((index) => {
        this.cancelTokens[index].cancel = true;
        this.uploadBoxes[index].status = '취소';
        this.saveUploadHistory(this.uploadBoxes[index]);
      });
  },
};
</script>

<style>
.upload-section {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: left;
  margin: 20px 0;
}

.upload-progress {
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 20px;
}

.upload-progress ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.upload-progress li {
  margin: 5px 0;
}
</style>
