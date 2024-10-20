export interface modelOptionType {
  label: string;
  value: string;
}
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
// 获取指定模型选项
export const getModelOptions = (type: 'text2img' | '') => {
  let result = imageModels;
  switch(type) {
    case 'text2img':
      result = imageModels;
      break;
  }
  return result;
}