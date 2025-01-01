import { createStore } from "vuex";

const store = createStore({
  state: {
    uploadHistory: [], // 업로드된 파일의 히스토리 저장
  },
  mutations: {
    ADD_UPLOAD_HISTORY(state, payload) {
      state.uploadHistory.push(payload);
    },
  },
  actions: {
    addUploadHistory({ commit }, data) {
      commit("ADD_UPLOAD_HISTORY", data);
    },
  },
});

export default store;

  