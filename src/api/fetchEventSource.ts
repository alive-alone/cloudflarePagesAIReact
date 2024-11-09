// 测试前端SSE调用
import { fetchEventSource as MFetchEventSource } from '@microsoft/fetch-event-source';
import { REQUEST_TIMEOUT_MS } from "@/utils/constant"

export const fetchEventSource = async (
  url: string,
  body: any,
  callback: (value: {data: string, done: boolean}) => void
) => {
  const controller = new AbortController();
  let responseText = "";
  let remainText = "";
  let finished = false;
  const finish = () => {
    if (!finished) {
      finished = true;
      callback({data: responseText + remainText, done: true});
    }
  };
  controller.signal.onabort = finish;
  const requestTimeoutId = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  const animateResponseText = () => {
    // console.log(remainText)
    if (finished || controller.signal.aborted) {
      responseText += remainText;
      console.log("[Response Animation] finished");
      if (responseText?.length === 0) {
        // options.onError?.(new Error("empty response from server"));
      }
      return;
    }

    if (remainText.length > 0) {
      const fetchCount = Math.max(1, Math.round(remainText.length / 60));
      const fetchText = remainText.slice(0, fetchCount);
      responseText += fetchText;
      remainText = remainText.slice(fetchCount);
      callback({data: responseText, done: false});
    }

    requestAnimationFrame(animateResponseText);
  }

  await MFetchEventSource(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: controller.signal,
    async onopen(response) {
      clearTimeout(requestTimeoutId);
      animateResponseText();
      if (
        response.ok &&
        response.headers.get('content-type') === 'text/event-stream'
      ) {
        console.log('请求符合');
        return;
      } else if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        console.log('请求错误');
      } else {
        console.log('其他错误');
      }
    },
    async onmessage(event) {
      // 表示整体结束
      if (event.data === '[DONE]') {
        return finish();
      }
      const jsonData = JSON.parse(event.data);
      remainText += jsonData.response;
      // responseText += jsonData.response;
      // callback({data: responseText, done: false});
    },
    async onerror(error) {
      console.error('SSE Error:', error);
    },
    async onclose() {
      // if the server closes the connection unexpectedly, retry:
      console.log('SSE 关闭连接');
      finish()
    },
  });
};
