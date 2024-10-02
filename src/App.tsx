import { Suspense } from "react";
import { useRoutes } from 'react-router-dom';
import './App.css'
import routes from './router';

// https://juejin.cn/post/7235074521777700901#heading-10

function App() {

  return (
    <>
      <Suspense>
        {useRoutes(routes)}
      </Suspense>
    </>
  )
}

export default App
