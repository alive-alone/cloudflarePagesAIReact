import { message } from 'antd';

export async function copyToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    message.success('内容已复制');
  } catch (error) {
    message.error('复制失败');
  }
  document.body.removeChild(textArea);
}