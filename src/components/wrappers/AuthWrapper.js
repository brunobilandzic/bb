import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/slices/userSlice";

export default function AuthWrapper({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.userState?.user;
  });
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !user) {
      dispatch(login(session.user));
      console.log("AuthWrapper logging user in redux global state");
    } else if (!session && user) {
      dispatch(logout());
      console.log("AuthWrapper logging user out of redux global state");
    }
  }, [session]);

  return children;
}
