import { nanoid } from "nanoid";
import { useNavigate, useLocation } from "react-router-dom";

// 返回不重复 id
export const genUniqueId = () => {
  return nanoid();
}
// 设置 url hash
export const useSetUrlHash = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const setUrlHash = (value: string) => {
    if(location.hash != value) {
      navigate(value);
    }
  }
  return {
    setUrlHash,
  }
}