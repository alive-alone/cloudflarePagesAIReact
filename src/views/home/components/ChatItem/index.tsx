import { memo } from "react"
import Loading from '@/components/loading/threePoints';
import type { chatType } from "@/views/home/home";
import styles from './styles.module.scss';

import robotIcon from '@/assets/icon/robot.svg';
import userIcon from '@/assets/icon/user.svg';

// user 
export const UserChatItem = memo(({ data }: {data: chatType;}) => {
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
})