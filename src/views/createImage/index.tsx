import React, { memo, useEffect, useState, useRef } from 'react'
import type { FC, ReactNode } from 'react'
import { Input, Button } from 'antd';

import Loading from "@/components/loading/threePoints"

import styles from "./styles.module.scss";

import robotIcon from "@/assets/icon/robot.svg";
import userIcon from "@/assets/icon/user.svg";
import sendIcon from "@/assets/icon/send.svg"

const { TextArea } = Input;

interface IProps {
  children?: ReactNode
}

interface chatType {
  describe: string
  imgSrc: any
  loading?: boolean
  error?: boolean
  errorMessage?: string
}

const ChatItem = ({ data, update }: { data: chatType, update: () => void }) => {
  return (
    <>
      <div className={styles['robot-box']}>
        <img  className={styles['avatar-icon']} src={robotIcon}></img>
        <div className={styles['img-box']}>
          {
            data.loading ? <Loading></Loading> :
            (
              data.error ? <span> {data.errorMessage}</span> :
              <img className={styles['chat-img']} src={data.imgSrc} onLoad={update}></img>
            )
          }
        </div>
      </div>
    </>
  )
}


const Page: FC<IProps> = () => {
  const chatScrollRef = useRef<any>(null)
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatList, setChatList] = useState<Array<chatType>>([{
    describe: '海市蜃楼',
    imgSrc: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/df47fcd7-46be-4b8c-a9e1-4475e22e87fc/width=450/31277664.jpeg'
  }]);

  // 生成图片
  const createImage = async (describe: string) => {
    if(inputValue) {
      const datas = {
        prompt: describe,
      }
      const result = await fetch(`/api/createImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datas)
      })
      return result;
    }
  }
  // 点击发送
  const clickSend = async () => {
    if(isLoading) return;
    setIsLoading(true);
    setInputValue('');
    const newChatItem = {
      describe: inputValue,
      imgSrc: '',
      loading: true,
      error: false,
      errorMessage: '',
    }
    const chatListTemp = [...chatList];
    setChatList([...chatListTemp, newChatItem]);
    scrollPos();
    const result = await createImage(inputValue);
    if(result && result.status === 200) {
      //返回的是流，用fetch的内置函数blob()转一下
      const blob = await result.blob()
      //再转为URL
      const url = URL.createObjectURL(blob)
      newChatItem.loading = false;
      newChatItem.imgSrc = url;
      setChatList([...chatListTemp, newChatItem]);
    } else {
      newChatItem.loading = false;
      newChatItem.error = true;
      newChatItem.errorMessage = 'error';
    }
    setIsLoading(false);
    scrollPos();
  }
  
  // 控制滚动
  const scrollPos = () => {
    setTimeout(() => {
      if(chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    })
  }

  return (
    <div className={styles.pages}>
      <div className={styles['content-box']}>
        <div className={styles['left-box']}>
          
        </div>
          <div className={styles['right-box']}>
            <div className={styles['right-scroll']}>
              <div className={styles['scroll-title']}>
                <div></div>
                <div></div>
              </div>
              <div className={styles['scroll-content']} ref={chatScrollRef}>
                {
                  chatList.map((item) => {
                    return <>
                      <div className={styles['chat-desc']}>
                        <img className={styles['avatar-icon']} src={userIcon}></img>
                        <div className={styles['desc-content']}>
                          <span>{item.describe}</span>
                        </div>
                      </div>
                      <ChatItem data={item} update={() => scrollPos()}></ChatItem>
                      {/* <div className={styles['robot-box']}>
                        <img  className={styles['avatar-icon']} src={robotIcon}></img>
                        <div className={styles['img-box']}>
                          <img className={styles['chat-img']} src={item.imgSrc}></img>
                        </div>
                      </div> */}
                    </>
                  })
                }
              </div>
            </div>
            <div className={styles['right-bottom']}>
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
  )
}

export default memo(Page)