import { genUniqueId } from '@/utils/common';

// 生成聊天信息骨架
export const createChatTemplate = ({
  role,
  content = '',
}: {
  role: 'user' | 'robot' | 'img';
  content?: string;
}) => {
  const newChatItem = {
    id: genUniqueId(),
    content: content,
    date: Date.now().toLocaleString(),
    imgSrc: '',
    role: role,
  };
  return newChatItem;
};