export interface modelOptionType {
  label: string;
  value: string;
}
// 聊天模板
export const chatTemplateType: Array<modelOptionType> = [
  {
    value: 'text2img',
    label: '文生图模型',
  },
  {
    value: 'text2text',
    label: '文本大模型',
  },
];
// 文生图可用模型
export const imageModels: Array<modelOptionType> = [
  {
    value: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    label: 'stable-diffusion-xl-base-1.0',
  },
  {
    value: '@cf/black-forest-labs/flux-1-schnell',
    label: 'flux-1-schnell',
  },
  {
    value: 'https://image.pollinations.ai/prompt',
    label: 'pollinationsAI',
  },
];
// 文本生成大模型
export const textModels: Array<modelOptionType> = [
  {
    value: '@cf/google/gemma-7b-it-lora',
    label: 'gemma-7b-it-lora',
  },
];
// 获取指定模型选项
export const getModelOptions = (type: 'text2img' | 'text2text' | '') => {
  let result = imageModels;
  switch(type) {
    case 'text2img':
      result = imageModels;
      break;
    case 'text2text':
      result = textModels;
      break;
  }
  return result;
}