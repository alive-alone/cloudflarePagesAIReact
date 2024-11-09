import { memo, useState } from "react";
import { Modal } from "antd";
import {
  addNewSession,
  setCurrentIndex,
  deleteSession,
  getLocalstorage,
} from "@/store/features/chatData";
import { removeAllChatLocalDatas } from "@/utils/localStorage/chatData";
import { useAppSelector, useAppDispatch } from "@/store";
import { useNavigate, useLocation } from "react-router-dom";
import { chatTemplateType } from "@/api/models";
import type { modelOptionType } from "@/api/models";

import styles from "./styles.module.scss";
import userIcon from "@/assets/icon/user.svg";
import addNewChatIcon from "@/assets/icon/addNewChat.svg";
import closeIcon from "@/assets/icon//close.svg";

const { confirm } = Modal;

const Template = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentIndex = useAppSelector((state) => state.chatData.currentIndex);
  const chatList = useAppSelector((state) => state.chatData.sessions);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // 设置 url hash
  const setUrlHash = (value: string) => {
    if (location.hash != value) {
      navigate(value);
    }
  };
  // 切换聊天
  const changeIndex = (index: number) => {
    setUrlHash("/#/chat");
    dispatch(setCurrentIndex(index));
  };
  // 新增聊天
  const newChat = (type: string) => {
    dispatch(addNewSession(type));
  };
  // 删除聊天
  const deleteChat = (index: number) => {
    confirm({
      title: "提示",
      icon: "！",
      content: "确定删除该聊天",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        dispatch(deleteSession(index));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  // 选择模型
  const selectModel = (model: modelOptionType) => {
    newChat(model.value);
    setShowNewChatModal(false);
  };
  // 清空数据
  const clearAllData = () => {
    confirm({
      title: "提示",
      icon: "！",
      content: "确定清空所有数据",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        removeAllChatLocalDatas();
        window.location.reload();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return (
    <>
      <div className={styles["body"]}>
        <div className={styles["header"]}>
          <div className={styles["info"]}>
            <img src={userIcon}></img>
            <div className={styles["info-desc"]}>
              <h2 className={styles["info-name"]}>SerendipityChat</h2>
              <div className={styles["info-subname"]}>
                Enjoy using your own AI assistant.
              </div>
            </div>
          </div>
        </div>
        <div className={styles["main"]} onClick={() => setUrlHash("/#/")}>
          <div className={styles["chat-list"]}>
            {chatList.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className={`${styles["chat-item"]} ${
                    currentIndex === index ? styles["chat-item_active"] : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeIndex(index);
                  }}
                >
                  <div className={styles["title"]}>
                    {item.mask.name || "新的聊天"}
                  </div>
                  <div className={styles["chat-info"]}>
                    <span>{`${item.messages.length}条聊天`}</span>
                    <span className="flex-shrink-0">{item.lastUpdate}</span>
                  </div>
                  <div
                    className={styles["close-btn"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(index);
                    }}
                  >
                    <img src={closeIcon}></img>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles["footer"]}>
          <div
            className={`${styles["btn"]} ${styles["clear-data-btn"]}`}
            onClick={() => {
              clearAllData();
            }}
          >
            清除数据
          </div>
          <div
            className={styles["btn"]}
            onClick={() => {
              setShowNewChatModal(true);
            }}
          >
            <img src={addNewChatIcon}></img>
            <span>新的聊天</span>
          </div>
        </div>
      </div>
      <Modal
        centered
        open={showNewChatModal}
        title="可选模板"
        onCancel={() => {
          setShowNewChatModal(false);
        }}
        footer={null}
        classNames={{
          content: styles["chat-type-modal"],
          header: styles["modal-title"],
        }}
        className={styles["modal-title"]}
      >
        <div className={styles["chat-type-list"]}>
          {chatTemplateType.map((item) => {
            return (
              <div
                onClick={() => {
                  selectModel(item);
                }}
                className={styles["type-item"]}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default memo(Template);
