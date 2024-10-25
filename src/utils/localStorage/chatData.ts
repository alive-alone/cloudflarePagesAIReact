import localStorage from "./index";

export const CHAT_DATA_LIST = "chat_data_list";

export interface ChatDataType {
  currentIndex: number;
  lastUpdateTime: number;
  sessions: Array<SessionType>;
}
export interface SessionType {
  id: string;
  lastUpdate: string;
  mask: {
    avatar?: string;
    name: string;
    context?: Array<ChatType>;
    id?: string | number;
    type: string;
  };
  modelConfig?: {
    model: string;
  };
  messages: Array<ChatType>;
}
export interface ChatType {
  id: string;
  content: string;
  imgSrc?: string;
  date?: string;
  role: string;
}

const datasTemp = {
  currentIndex: 0,
  lastUpdateTime: 1729217853,
  sessions: [
    {
      id: "1729167664123",
      lastUpdate: "2024/10/9 17:45:09",
      mask: {
        avatar: "1f638",
        name: "文案写手",
        context: [
          {
            id: "writer-0",
            role: "user",
            content: "我希望你充当文案专员。",
            date: "",
          },
        ],
        lang: "cn",
        builtin: true,
        createdTime: 1688899480511,
        id: 100001,
      },
      modelConfig: {
        model: "gpt-3.5-turbo",
      },
      messages: [
        {
          id: "gkwmik7C5qmIKQyd8fFqt",
          date: "2024/10/9 17:45:09",
          role: "user",
          content: "11",
        },
        {
          id: "wI9rJC9RaojylopewrH7N",
          date: "2024/10/9 17:45:09",
          role: "assistant",
          content:
            '\n\n```json\n{\n  "error": {\n    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.",\n    "type": "insufficient_quota",\n    "param": null,\n    "code": "insufficient_quota"\n  }\n}\n```',
          streaming: false,
          model: "gpt-3.5-turbo",
        },
      ],
    },
  ],
};

let localStorageCache = {} as ChatDataType;

// 获取所有聊天数据
export const getTotalChatLocalDatas = () => {
  const result = localStorage.get<ChatDataType>(CHAT_DATA_LIST);
  if (
    !result ||
    result.currentIndex == undefined ||
    result.sessions == undefined ||
    result.sessions.length == 0
  ) {
    removeAllChatLocalDatas();
    return null;
  }
  return result;
};
// 保存所有聊天数据
export const saveTotalChatLocalDatas = (value: ChatDataType) => {
  const sessionsList = [...value.sessions];
  sessionsList.map((item) => {
    if (item.mask.type == "text2img") {
      item.messages.map((mes) => {
        return {
          ...mes,
          imgSrc: "",
        };
      });
    }
  });
  value.sessions = sessionsList;
  localStorage.set(CHAT_DATA_LIST, value);
  localStorageCache = value;
  return localStorageCache;
};
// 获取指定聊天信息
export const getChatLocalDatas = (index: number) => {
  const datas = getTotalChatLocalDatas();
  const sessions = datas?.sessions || [];
  if (sessions.length > index) {
    return sessions[index];
  }
  return sessions;
};
// 赋值聊天信息
export const setChatLocalDatas = (index: number, value: SessionType) => {
  const datas = getTotalChatLocalDatas();
  const sessions = datas?.sessions || [];
  if (sessions.length > index) {
    sessions[index] = value;
    saveTotalChatLocalDatas(datas);
  }
  return datas;
};
// 清空聊天记录
export const removeAllChatLocalDatas = () => {
  return localStorage.remove(CHAT_DATA_LIST);
};
