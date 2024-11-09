import React, { memo, useEffect, useState, useRef } from 'react';
import type { FC, ReactNode } from 'react';
import { Input, Select, Button, Modal } from 'antd';
import { createChatTemplate } from '@/utils/chat';
import type { SessionType } from '@/utils/localStorage/chatData';
import { RobotChatItem, UserChatItem } from './components/ChatItem';
import { createImage, text2text, text2textBySSE } from '@/api';
import { getModelOptions } from '@/api/models';
import {
  setCurChatMessage,
  clearCurChatMessage,
  saveLocalstorage,
} from '@/store/features/chatData';
import { useAppSelector, useAppDispatch } from '@/store';
import LeftBox from './components/LeftBox';
import Title from "./components/Title"
import { useLocation } from 'react-router-dom';
import { useSetUrlHash } from "@/utils/common";

import styles from './styles.module.scss';
import sendIcon from '@/assets/icon/send.svg';
import backIncon from "@/assets/icon/back.svg";

const { confirm } = Modal;
const { TextArea } = Input;

interface IProps {
  children?: ReactNode;
}

const Page: FC<IProps> = () => {
  const location = useLocation();
  const { setUrlHash } = useSetUrlHash();
  const chatData = useAppSelector(
    (state) => state.chatData.sessions[state.chatData.currentIndex]
  );
  const currentIndex = useAppSelector(
    (state) => state.chatData.currentIndex
  );
  const dispatch = useAppDispatch();
  const chatScrollRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelOptions, setModelOptions] = useState(getModelOptions(chatData.mask.type as any));
  const selectModel = useRef(modelOptions[0].value);
  const [isMobile, setIsMobile] = useState(false);
  const [SSEValue, setSSEValue] = useState('')

  // 模型选择回调
  const onSelectModel = (model: string) => {
    if (model) {
      selectModel.current = model;
    }
  };
  // 点击发送
  const clickSend = async () => {
    if (isLoading || !inputValue) return;
    setIsLoading(true);
    setInputValue('');
    const userChatItem = createChatTemplate({
      content: inputValue,
      type: 'user',
    });
    const robotChatItem = createChatTemplate({ type: chatData.mask.type });
    const chatListTemp = [...chatData.messages, userChatItem];
    dispatch(setCurChatMessage([...chatListTemp, { ...robotChatItem }]));
    scrollPos();
    if(chatData.mask.type == 'text2text') {
      const getDatas = (value: {data: string, done: boolean}) => {
        robotChatItem.content = value?.data || ''
        dispatch(setCurChatMessage([...chatListTemp, { ...robotChatItem }]));
        setIsLoading(false);
        scrollPos();
        if(value.done) {
          dispatch(saveLocalstorage());
        }
      }
      const clearList = clearChatDataList(chatData, inputValue)
      await text2textBySSE(clearList, selectModel.current, (value) => getDatas(value))
    } else {
      const result = await createImage(inputValue, selectModel.current);
      if (result?.error) {
        robotChatItem.content = result.errorMsg;
      } else {
        robotChatItem.imgSrc = result?.imgUrl || '';
      }
    }
    dispatch(setCurChatMessage([...chatListTemp, { ...robotChatItem }]));
    setIsLoading(false);
    setTimeout(() => {
      scrollPos();
    })
  };
  // 清空聊天记录
  const clearChatDataList = (session: SessionType, describe: string) => {
    const returnList = [];
    if(session.mask.context?.length) {
      session.mask.context.map((item) => {
        returnList.push({
          role: item.role,
          content: item.content,
        })
      })
    }
    if(session.messages?.length) {
      // 最长 20 个对话
      session.messages.slice(0, 20).map((item) => {
        returnList.push({
          role: item.role,
          content: item.content,
        })
      })
    }
    returnList.push({
      role: "user",
      content: describe,
    });
    return returnList;
  }
  // 控制滚动
  const scrollPos = () => {
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    });
  };
  // 删除聊天
  const clearChat = () => {
    confirm({
      title: '提示',
      icon: '！',
      content: '确定清空该聊天',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch(clearCurChatMessage());
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 判断当前使用的 class 样式
  const getCurrentClass = () => {
    if(isMobile) {
      if(location.hash.includes('#/chat')) {
        return 'content-box-right-open';
      }
      return 'content-box-left-open';
    }
    return ''
  }
  // 媒体监听
  const mqListener = (mediaQuery: any) => {
    setIsMobile(mediaQuery.matches);
  };
  const pageInit = () => {
    const result = getModelOptions(chatData.mask.type as any);
    setModelOptions(result);
    selectModel.current = result[0].value;
  }
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 600px)');
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', mqListener);
    pageInit();
    scrollPos();
    return () => {
      mediaQuery.removeEventListener('change', mqListener);
    };
  }, []);
  // 监听 currentIndex
  useEffect(() => {
    pageInit();
    scrollPos();
  }, [chatData.mask.type])

  return (
    <div className={styles.pages}>
      <div className={`${styles['content-box']} ${styles[getCurrentClass()]}`}>
        <div className={`${styles['left-box']}`}>
          <LeftBox></LeftBox>
        </div>
        <div
          className={`${styles['right-box']}`}
        >
          <div className={styles['right-scroll']}>
            <Title></Title>
            {/* <div className={styles['scroll-title']}>
              <div className={styles['block']} onClick={() => setUrlHash('/#/')}>
                <img src={backIncon}></img>
              </div>
              <div className={styles['title-box']}>
                <div className={styles['title']} onClick={() => {}}>{chatData.mask.name}</div>
                <div
                  className={styles['subtitle']}
                >{`共 ${chatData.messages.length} 条聊天`}</div>
              </div>
              <div className={styles['block']}>
              </div>
            </div> */}
            <div className={styles['scroll-content']} ref={chatScrollRef}>
              {[...(chatData.mask.context || []), ...chatData.messages].map(
                (item, index) => {
                  return (
                    <div key={item.id}>
                      {item.role === 'user' ? (
                        <UserChatItem data={item}></UserChatItem>
                      ) : (
                        <>
                          <RobotChatItem
                            data={item}
                            loading={
                              isLoading && item.id === chatData.messages[chatData.messages.length - 1].id
                            }
                            update={() => scrollPos()}
                          ></RobotChatItem>
                        </>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
          <div className={styles['right-bottom']}>
            <div className={styles['function-box']}>
              <div>
                模型：
                <Select
                  defaultValue={modelOptions[0].value}
                  key={modelOptions[0].value}
                  style={{ width: 200 }}
                  popupMatchSelectWidth={false}
                  placement="topLeft"
                  options={modelOptions}
                  onSelect={onSelectModel}
                />
              </div>
              <Button
                className={styles['clear-btn']}
                danger
                onClick={clearChat}
              >
                清空聊天
              </Button>
            </div>
            <TextArea
              className={styles['text-area']}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请输入图片描述，建议使用英文"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
            <div className={styles['btn-fixed']} onClick={() => clickSend()}>
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
