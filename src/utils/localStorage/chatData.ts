import localStorage from "./index";
import type { Storable } from "./index";

export const CHAT_DATA_LIST = "chat_data_list";

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

// 获取所有聊天数据
export const getTotalChatLocalDatas = () => {
  return localStorage.get(CHAT_DATA_LIST);
};
// 获取指定聊天信息
export const getChatLocalDatas = () => {
  return localStorage.get(CHAT_DATA_LIST);
};
// 赋值聊天信息
export const setChatLocalDatas = (value: Storable) => {
  return localStorage.set(CHAT_DATA_LIST, value);
};
// 清空聊天记录
export const removeChatLocalDatas = () => {
  localStorage.remove(CHAT_DATA_LIST);
  return localStorage.remove(CHAT_DATA_LIST);
};
