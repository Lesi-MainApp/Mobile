// hooks/useUser.js
import { useSelector } from "react-redux";

export default function useUser() {
  const user = useSelector((s) => s?.user?.user || null);
  return { user };
}
