import { memo } from 'react'
import type { FC, ReactNode } from 'react'

import styles from "./styles.module.scss";

interface IProps {
  children?: ReactNode
}

const Page: FC<IProps> = () => {

  return (
    <div className={styles['loading']}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default memo(Page)