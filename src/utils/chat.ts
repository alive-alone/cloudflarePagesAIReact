import { genUniqueId } from '@/utils/common';

// 生成聊天信息骨架
export const createChatTemplate = ({
  type,
  content = '',
}: {
  type: string;
  content?: string;
}) => {
  const day = new Date();
  let role = '';
  switch(type) {
    case 'user':
      role = 'user';
      break;
    case 'text2text':
      role = 'assistant';
      break;
    case 'text2img':
      role = 'img';
      break;
  }
  let newChatItem = {
    id: genUniqueId(),
    content: content,
    date: day.toLocaleString(),
    imgSrc: '',
    role: role,
  };
  return newChatItem;
};