import { memo } from "react"
import ReactMarkdown from "react-markdown";
import Loading from '@/components/loading/threePoints';
import type { ChatType } from '@/utils/localStorage/chatData';
import {MarkdownContent} from "@/components/markdown/markdown"
import styles from './styles.module.scss';

import robotIcon from '@/assets/icon/robot.svg';
import userIcon from '@/assets/icon/user.svg';

// user 
export const UserChatItem = memo(({ data }: {data: ChatType;}) => {
  return (
    <>
      <div className={styles['chat-desc']}>
        <img
          className={styles['avatar-icon']}
          src={userIcon}
        ></img>
        <div className={styles['desc-content']}>
          <span>{data.content}</span>
        </div>
        {data.date ? (
          <div className={styles['chat-date']}>{data.date}</div>
        ) : null}
      </div>
    </>
  )
})

// robot
export const RobotChatItem = memo(({
  data,
  loading = false,
  update,
}: {
  data: ChatType;
  loading?: boolean;
  update: () => void;
}) => {
  return (
    <>
      <div className={styles['robot-box']}>
        <img className={styles['avatar-icon']} src={robotIcon}></img>
        <div className={styles['content-box']}>
          {loading ? (
            <Loading></Loading>
          ) : data.role === 'img' ? 
          (
            <div className={styles['img-box']}>
              {
                data.imgSrc ?
                <img
                  className={styles['chat-img']}
                  src={data.imgSrc}
                  onLoad={update}
                ></img>
                : <span>已销毁</span>
              }
            </div>
          ) : 
          (
            <div className={styles['markdown-box']}>
              {/* <ReactMarkdown children={data.content}></ReactMarkdown>
               */}
              <MarkdownContent content={data.content}></MarkdownContent>
            </div>
          )}
        </div>
        {data.date ? (
          <div className={styles['chat-date']}>{data.date}</div>
        ) : null}
      </div>
    </>
  );
})