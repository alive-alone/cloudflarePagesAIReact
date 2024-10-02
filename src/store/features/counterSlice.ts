import { createSlice } from '@reduxjs/toolkit'

// 创建一个Slice
export const counterSlice = createSlice({
  name: 'counter',
  initialState:{
    value: 0,
  },
  reducers: {
    // 定义一个加的方法
    increment:(state,{payload})  => { 
      state.value += parseInt(payload)
    },
    // 定义一个减的方法
    decrement: state => {
      state.value -= 1
    },
  },
})

// 导出加减方法
export const { increment, decrement } = counterSlice.actions

// 暴露reducer
export default counterSlice.reducer