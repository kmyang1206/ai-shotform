<template>
  <div>
    <h1>AI 숏폼 생성</h1>
    <input type="file" @change="handleFileSelection" multiple />
    <div v-if="files.length">
      <div
        v-for="(file, index) in files"
        :key="index"
        style="margin-bottom: 20px"
      >
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
    <div
      v-for="(box, index) in uploadBoxes"
      :key="index"
      class="upload-section"
    >
      <label :for="'name-' + index">이름</label>
      <input
        :id="'name-' + index"
        type="text"
        placeholder="이름을 입력하세요"
        style="display: block; margin-bottom: 20px; width: 100%"
      />
      <label :for="'file-' + index">파일 선택</label>
      <input
        :id="'file-' + index"
        type="file"
        style="display: block; margin-bottom: 20px"
        @change="onFileSelected(index, $event)"
      />
      <progress
        v-if="box.progress !== null"
        :value="box.progress"
        max="100"
        style="width: 100%; margin: 10px 0"
      ></progress>
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
      this.status = this.files.map(() => "대기 중");
      this.isUploading = this.files.map(() => false);
      this.errors = this.files.map(() => null);
    },
    async startUpload(index) {
      const box = this.uploadBoxes[index];
      if (!box.file) {
        alert("파일을 선택해주세요.");
        return;
      }

      box.progress = 0;
      box.status = "업로드 중";

      const chunkSize = 100 * 1024 * 1024; // 100MB
      const totalChunks = Math.ceil(box.file.size / chunkSize);

      const cancelToken = { cancel: false };
      this.cancelTokens[index] = cancelToken;

      try {
        const serverStatus = await checkUploadedChunks(box.file.name);
        const uploadedChunks = serverStatus.uploadedChunks || [];
        const serverChecksum = serverStatus.checksum;

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
            box.status = "취소됨";
            return;
          }
          if (uploadedChunks.includes(chunkNumber)) continue;

          const start = chunkNumber * chunkSize;
          const end = Math.min(start + chunkSize, box.file.size);
          const chunk = box.file.slice(start, end);

          await uploadChunk(chunk, box.file.name, chunkNumber, totalChunks);
          box.progress = Math.round(((chunkNumber + 1) / totalChunks) * 100);
        }

        // chunk 업로드 완료 후 merge상태 체크
        let merging = true;
        while (merging) {
          const status = await checkStatus(box.file.name);
          box.status = status.status;
          if (status.status === "done") {
            merging = false;
          }

          await new Promise((resolve) => setTimeout(resolve, 2000)); //2초마다 체크
        }
      } catch (error) {
        box.status = "오류 발생";
        console.error(`Error uploading file: ${error.message}`);
      }
    },
    cancelUpload(index) {
      if (this.cancelTokens[index]) {
        this.cancelTokens[index].cancel = true;
        this.uploadBoxes[index].status = "취소됨";
        console.log(`Upload for index ${index} has been canceled.`);
      }
      this.removeUploadBox(index);
    },
    addUploadBox() {
      this.uploadBoxes.push({
        name: "",
        file: null,
        progress: null,
        status: "대기 중"
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
    logError(fileIndex, message) {
      console.error(`[${this.uploadBoxes[fileIndex].name}] ${message}`);
      this.uploadBoxes[fileIndex].status = "오류 발생";
    }
  }
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
