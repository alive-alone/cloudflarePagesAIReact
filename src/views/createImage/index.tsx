import React, { memo, useEffect, useState, useRef } from 'react';
import type { FC, ReactNode } from 'react';
import { Input, Select } from 'antd';
import Loading from '@/components/loading/threePoints';
import styles from './styles.module.scss';
import {
  getChatLocalDatas,
  setChatLocalDatas,
} from '@/utils/localStorage/chatData';
import { genUniqueId } from '@/utils/common';

import robotIcon from '@/assets/icon/robot.svg';
import userIcon from '@/assets/icon/user.svg';
import sendIcon from '@/assets/icon/send.svg';

const { TextArea } = Input;

interface IProps {
  children?: ReactNode;
}

interface chatType {
  id: string;
  content: string;
  imgSrc?: string;
  date?: string;
  role: string;
}

interface modelOptionType {
  label: string;
  value: string;
}

const ChatItem = ({
  data,
  loading = false,
  update,
}: {
  data: chatType;
  loading?: boolean;
  update: () => void;
}) => {
  return (
    <>
      <div className={styles['robot-box']}>
        <img className={styles['avatar-icon']} src={robotIcon}></img>
        <div className={styles['img-box']}>
          {loading ? (
            <Loading></Loading>
          ) : !data.imgSrc ? (
            <span> {data.content}</span>
          ) : (
            <img
              className={styles['chat-img']}
              src={data.imgSrc}
              onLoad={update}
            ></img>
          )}
        </div>
        {data.date ? (
          <div className={styles['chat-date']}>{data.date}</div>
        ) : null}
      </div>
    </>
  );
};

const Page: FC<IProps> = () => {
  const chatScrollRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatDatasRef = useRef({
    currentIndex: 0,
    lastUpdateTime: 1729217853,
    sessions: [
      {
        id: '1729167664123',
        lastUpdate: '2024/10/9 17:45:09',
        mask: {
          avatar: '',
          name: '以文生图',
          context: [],
          id: 100001,
        },
        modelConfig: {
          model: 'gpt-3.5-turbo',
        },
        messages: [
          {
            id: 'gkwmik7C5qmIKQyd8fFqt',
            date: '2024/10/9 17:45:09',
            role: 'user',
            content: '海市蜃楼',
          },
          {
            id: 'gkwmik7C5qmIKQyd8fFdvdf',
            date: '2024/10/9 17:45:09',
            role: 'robot',
            content:
              'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/df47fcd7-46be-4b8c-a9e1-4475e22e87fc/width=450/31277664.jpeg',
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
      id: 'gkwmik7C5qmIKQyd8fFqt',
      date: '2024/10/9 17:45:09',
      role: 'user',
      content: '海市蜃楼',
    },
    {
      id: 'gkwmik7C5qmIKQyd8fFdvdf',
      date: '2024/10/9 17:45:09',
      role: 'robot',
      content: '',
      imgSrc:
        'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/df47fcd7-46be-4b8c-a9e1-4475e22e87fc/width=450/31277664.jpeg',
    },
  ]);

  const modelOptions: Array<modelOptionType> = [
    {
      value: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
      label: 'stable-diffusion-xl-base-1.0',
    },
    {
      value: '@cf/black-forest-labs/flux-1-schnell',
      label: 'flux-1-schnell',
    },
    {
      value: 'https://image.pollinations.ai/prompt',
      label: 'pollinationsAI',
    },
  ];
  const selectModel = useRef(modelOptions[0].value);
  // 模型选择回调
  const onSelectModel = (model: string) => {
    if (model) {
      selectModel.current = model;
    }
  };
  // 生成聊天信息骨架
  const createChatTemplate = ({
    role,
    content = '',
  }: {
    role: 'user' | 'robot' | 'img';
    content?: string;
  }) => {
    const newChatItem = {
      id: genUniqueId(),
      content: content,
      date: Date.now().toLocaleString(),
      imgSrc: '',
      role: role,
    };
    return newChatItem;
  };
  // 生成图片
  const createImage = async (describe: string) => {
    if (inputValue) {
      const datas = {
        prompt: describe,
        model: selectModel.current,
      };
      const result = await fetch(`/api/createImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datas),
      });
      const response = {
        error: false,
        errorMsg: '',
        imgUrl: '',
      };
      if (result && result.status === 200) {
        const contentType = result.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
          const datas = (await result?.json()) as { image: string };
          if (datas['image']) {
            response.imgUrl = `data:image/png;base64,${datas['image']}`;
          }
        } else {
          const blob = await result.blob();
          //再转为URL
          response.imgUrl = URL.createObjectURL(blob);
        }
      } else {
        response.error = true;
        response.errorMsg = 'error';
      }
      return response;
    }
  };
  // 点击发送
  const clickSend = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setInputValue('');
    const userChatItem = createChatTemplate({
      content: inputValue,
      role: 'user',
    });
    const robotChatItem = createChatTemplate({ role: 'img' });
    const chatListTemp = [...chatList, userChatItem];
    setChatList([...chatListTemp, robotChatItem]);
    scrollPos();
    const result = await createImage(inputValue);
    if (result?.error) {
      robotChatItem.content = result.errorMsg;
    } else {
      robotChatItem.imgSrc = result?.imgUrl || '';
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
    const datas = getChatLocalDatas();
    if (datas) {
      setChatList(datas as any);
    }
  };
  // 保存聊天记录
  const saveChatDatas = () => {
    let list = [...chatList];
    list.map((item) => {
      let copyItem = { ...item };
      copyItem.imgSrc = '';
      return copyItem;
    });
    setChatLocalDatas(list as any);
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
      <div className={styles['content-box']}>
        <div className={styles['left-box']}></div>
        <div className={styles['right-box']}>
          <div className={styles['right-scroll']}>
            <div className={styles['scroll-title']}>
              <div></div>
              <div></div>
            </div>
            <div className={styles['scroll-content']} ref={chatScrollRef}>
              {chatList.map((item) => {
                return (
                  <div key={item.id}>
                    {item.role === 'user' ? (
                      <div className={styles['chat-desc']}>
                        <img
                          className={styles['avatar-icon']}
                          src={userIcon}
                        ></img>
                        <div className={styles['desc-content']}>
                          <span>{item.content}</span>
                        </div>
                        {item.date ? (
                          <div className={styles['chat-date']}>{item.date}</div>
                        ) : null}
                      </div>
                    ) : (
                      <ChatItem
                        data={item}
                        loading={isLoading}
                        update={() => scrollPos()}
                      ></ChatItem>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles['right-bottom']}>
            <div className={styles['function-box']}>
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
