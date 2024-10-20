import React, { memo, useEffect, useState, useRef } from "react";
import type { FC, ReactNode } from "react";
import { Input, Select, Button, Modal } from "antd";
import {
  getChatLocalDatas,
  setChatLocalDatas,
  removeChatLocalDatas,
} from "@/utils/localStorage/chatData";
import { createChatTemplate } from "@/utils/chat";
import { RobotChatItem, UserChatItem } from "./components/ChatItem";
import { createImage } from "@/api/createImage";
import { getModelOptions } from "@/api/models";

import styles from "./styles.module.scss";
import sendIcon from "@/assets/icon/send.svg";

const { confirm } = Modal;
const { TextArea } = Input;

interface IProps {
  children?: ReactNode;
}
export interface chatType {
  id: string;
  content: string;
  imgSrc?: string;
  date?: string;
  role: string;
}

export interface modelOptionType {
  label: string;
  value: string;
}

const Page: FC<IProps> = () => {
  const chatScrollRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatDatasRef = useRef({
    currentIndex: 0,
    lastUpdateTime: 1729217853,
    sessions: [
      {
        id: "1729167664123",
        lastUpdate: "2024/10/9 17:45:09",
        mask: {
          avatar: "",
          name: "以文生图",
          context: [],
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
            content: "海市蜃楼",
          },
          {
            id: "gkwmik7C5qmIKQyd8fFdvdf",
            date: "2024/10/9 17:45:09",
            role: "robot",
            content:
              "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/df47fcd7-46be-4b8c-a9e1-4475e22e87fc/width=450/31277664.jpeg",
          },
        ],
      },
    ],
  });
  // const [chatList, setChatList] = useState<Array<chatType>>([
  //   {
  //     id: 'exampledf47fcd7',
  //     describe: `海市蜃楼`,
  //     imgSrc:
  //       'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/df47fcd7-46be-4b8c-a9e1-4475e22e87fc/width=450/31277664.jpeg',
  //     date: '2024/10/9 17:45:09'
  //   },
  // ]);
  const [chatList, setChatList] = useState<Array<chatType>>([
    {
      id: "gkwmik7C5qmIKQyd8fFqt",
      date: "2024/10/9 17:45:09",
      role: "user",
      content: "寂静都市",
    },
    {
      id: "gkwmik7C5qmIKQyd8fFdvdf",
      date: "2024/10/9 17:45:09",
      role: "robot",
      content: "",
      imgSrc: "https://upload.aliveawait.top/file/a333b384c405b4f5e33e5.jpg",
    },
  ]);

  const modelOptions = getModelOptions("text2img");
  const selectModel = useRef(modelOptions[0].value);
  // 模型选择回调
  const onSelectModel = (model: string) => {
    if (model) {
      selectModel.current = model;
    }
  };
  // 点击发送
  const clickSend = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setInputValue("");
    const userChatItem = createChatTemplate({
      content: inputValue,
      role: "user",
    });
    const robotChatItem = createChatTemplate({ role: "img" });
    const chatListTemp = [...chatList, userChatItem];
    setChatList([...chatListTemp, robotChatItem]);
    scrollPos();
    const result = await createImage(inputValue, selectModel.current);
    if (result?.error) {
      robotChatItem.content = result.errorMsg;
    } else {
      robotChatItem.imgSrc = result?.imgUrl || "";
      setChatList([...chatListTemp, robotChatItem]);
    }
    setIsLoading(false);
    scrollPos();
  };
  // 控制滚动
  const scrollPos = () => {
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    });
  };
  // 获取本地聊天记录
  const getChatDatas = () => {
    const datas = getChatLocalDatas() || [];
    setChatList(datas as any);
  };
  // 保存聊天记录
  const saveChatDatas = () => {
    const list = [...chatList];
    list.map((item) => {
      const copyItem = { ...item };
      copyItem.imgSrc = "";
      return copyItem;
    });
    setChatLocalDatas(list as any);
  };
  const clearChat = () => {
    confirm({
      title: "提示",
      icon: "！",
      content: "确定清空该聊天",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        removeChatLocalDatas();
        setTimeout(() => {
          getChatDatas();
        }, 50);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  // 页面初始化
  useEffect(() => {
    getChatDatas();
  }, []);
  // 监听数据
  useEffect(() => {
    saveChatDatas();
  }, [chatList]);

  return (
    <div className={styles.pages}>
      <div className={styles["content-box"]}>
        <div className={styles["left-box"]}></div>
        <div className={styles["right-box"]}>
          <div className={styles["right-scroll"]}>
            <div className={styles["scroll-title"]}>
              <div></div>
              <div></div>
            </div>
            <div className={styles["scroll-content"]} ref={chatScrollRef}>
              {chatList.map((item, index) => {
                return (
                  <div key={item.id}>
                    {item.role === "user" ? (
                      <UserChatItem data={item}></UserChatItem>
                    ) : (
                      <RobotChatItem
                        data={item}
                        loading={isLoading && index === chatList.length - 1}
                        update={() => scrollPos()}
                      ></RobotChatItem>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles["right-bottom"]}>
            <div className={styles["function-box"]}>
              <div>
                模型：
                <Select
                  defaultValue={modelOptions[0].value}
                  style={{ width: 200 }}
                  popupMatchSelectWidth={false}
                  placement="topLeft"
                  options={modelOptions}
                  onSelect={onSelectModel}
                />
              </div>
              {/* <div className={styles["clear-btn"]}>清空聊天</div> */}
              <Button
                className={styles["clear-btn"]}
                danger
                onClick={clearChat}
              >
                清空聊天
              </Button>
            </div>
            <TextArea
              className={styles["text-area"]}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请输入图片描述，建议使用英文"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
            <div className={styles["btn-fixed"]} onClick={() => clickSend()}>
              <img src={sendIcon}></img>
              <span>发送</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Page);
