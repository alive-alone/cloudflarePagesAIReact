import { Suspense, useEffect } from "react";
import { useRoutes } from 'react-router-dom';
import './App.css'
import routes from './router';
import { getLocalstorage, saveLocalstorage } from '@/store/features/chatData'
import { useAppDispatch} from '@/store'
import "@/styles/markdown.scss"
import "@/styles/highlight.scss"

// https://juejin.cn/post/7235074521777700901#heading-10

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // 页面加载获取聊天信息
    dispatch(getLocalstorage());
    return () => {
      dispatch(saveLocalstorage());
    }
  }, [])
  return (
    <>
      <Suspense>
        {useRoutes(routes)}
      </Suspense>
    </>
  )
}

export default App
