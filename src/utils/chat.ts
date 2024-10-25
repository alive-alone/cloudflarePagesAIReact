import { genUniqueId } from '@/utils/common';

// 生成聊天信息骨架
export const createChatTemplate = ({
  role,
  content = '',
}: {
  role: 'user' | 'robot' | 'img';
  content?: string;
}) => {
  const day = new Date();
  let newChatItem = {
    id: genUniqueId(),
    content: content,
    date: day.toLocaleString(),
    imgSrc: '',
    role: role,
  };
  return newChatItem;
};