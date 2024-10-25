import { createSlice } from '@reduxjs/toolkit';
import {
  getTotalChatLocalDatas,
  saveTotalChatLocalDatas,
} from '@/utils/localStorage/chatData';
import type { ChatDataType, SessionType, ChatType } from '@/utils/localStorage/chatData';
import { genUniqueId } from "@/utils/common"

const initialStateObj: () => ChatDataType = () => {
  const date = new Date();
  return {
    currentIndex: 0,
    lastUpdateTime: date.valueOf(),
    sessions: [creageSessionModel()],
  }
}

const creageSessionModel = (type = 'text2img') => {
  const date = new Date();

  let model: SessionType = {
    id: genUniqueId(),
    lastUpdate: date.toLocaleString(),
    mask: {
      avatar: '',
      name: '以文生图',
      context: [
        {
          id: 'writer-0',
          date: date.toLocaleString(),
          role: 'user',
          content: '寂静都市',
        },
        {
          id: 'writer-1',
          date: date.toLocaleString(),
          role: 'robot',
          content: '',
          imgSrc:
            'https://upload.aliveawait.top/file/a333b384c405b4f5e33e5.jpg',
        },
      ],
      type: type || 'text2img',
      id: 100001,
    },
    modelConfig: {
      model: '',
    },
    messages: [

    ],
  };
  if(type == 'text2text') {
    model = {
      id: genUniqueId(),
      lastUpdate: date.toLocaleString(),
      mask: {
        avatar: '',
        name: '大语言模型',
        context: [
          { id: 'writer-0',role: "user", content: "You are a friendly assistant" },
        ],
        type: type,
        id: 100001,
      },
      modelConfig: {
        model: '',
      },
      messages: [
      ],
    };
  }
  return model;
}

const initialState: ChatDataType = {...initialStateObj()};

// 创建一个Slice
export const chatDataSlice = createSlice({
  name: 'chatData',
  initialState,
  reducers: {
    // 获取本地聊天记录
    getLocalstorage: (state) => {
      const localData = getTotalChatLocalDatas();
      if(localData) {
        if(localData.currentIndex < 0 || localData.currentIndex >= localData.sessions.length) {
          if(localData.currentIndex < 0) {
            localData.currentIndex = 0;
          } else {
            localData.currentIndex = localData.sessions.length - 1;
          }
        }
        return {
          ...state,
          ...localData,
        }
      }
    },
    // 保存本地聊天记录
    saveLocalstorage: (state) => {
      saveTotalChatLocalDatas(state);
    },
    // 获取 currentIndex
    getCurrentIndex: (state) => {
      if(state.currentIndex < 0 || state.currentIndex >= state.sessions.length) {
        if(state.currentIndex < 0) {
          state.currentIndex = 0;
        } else {
          state.currentIndex = state.sessions.length - 1;
        }
        saveTotalChatLocalDatas(state);
      }
      return state;
    },
    // 清除当前聊天记录
    clearCurChatMessage: (state) => {
      state.sessions[state.currentIndex].messages = [];
      saveTotalChatLocalDatas(state);
    },
    setCurChatIndex: (state, { payload }: { payload: number }) => {
      if (payload && payload < state.sessions.length) {
        state.currentIndex = payload;
      }
      saveTotalChatLocalDatas(state);
    },
    setCurChatMessage: (state, { payload }: { payload: Array<ChatType> }) => {
      state.sessions[state.currentIndex].messages = payload;
      saveTotalChatLocalDatas(state);
    },
    // 新的聊天
    addNewSession: (state, { payload }) => {
      const newSession = creageSessionModel(payload);
      state.sessions.unshift(newSession);
      state.currentIndex = 0;
      saveTotalChatLocalDatas(state);
      return state;
    },
    // 修改 currentIndex
    setCurrentIndex: (state, { payload }) => {
      const index = Number(payload)
      if(!isNaN(index)) {
        state.currentIndex = index;
      }
      saveTotalChatLocalDatas(state);
      return state;
    },
    // 删除指定聊天
    deleteSession: (state, { payload }) => {
      const index = Number(payload)
      if(!isNaN(index)) {
        let length = state.sessions.length;
        if(length === 1) {
          state.sessions = [creageSessionModel()];
          state.currentIndex = 0;
        } else {
          state.sessions.splice(index, 1);
          length -= 1;
          state.currentIndex = index >= length ? Math.max(0, length - 1) : index;
        }
      }
      saveTotalChatLocalDatas(state);
      return state;
    },
  },
});

// 导出方法
export const {
  getLocalstorage,
  saveLocalstorage,
  clearCurChatMessage,
  setCurChatIndex,
  setCurChatMessage,
  addNewSession,
  setCurrentIndex,
  deleteSession,
} = chatDataSlice.actions;

// 暴露reducer
export default chatDataSlice.reducer;
