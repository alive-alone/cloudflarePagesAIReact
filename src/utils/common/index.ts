import { nanoid } from "nanoid";

// 返回不重复 id
export const genUniqueId = () => {
  return nanoid();
}