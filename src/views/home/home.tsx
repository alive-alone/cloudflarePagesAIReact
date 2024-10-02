import React, { memo, useRef, createRef} from 'react'
import { increment, decrement } from '@/store/features/counterSlice'
import type { FC, ReactNode } from 'react'
// import { IRootState } from '@/store'
import { useAppSelector ,useAppDispatch} from '@/store'
interface IProps {
  children?: ReactNode
}

const Page: FC<IProps> = () => {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()
  const InputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <h1>count</h1>
      <div style={{ width: 100, margin: '10px' }}>
        <input ref = { InputRef } type="text"/>
        <button onClick={() => dispatch(increment(InputRef.current?.value))}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>

        <span>{count}</span>
      </div>
    </div> 
  )
}

export default memo(Page)