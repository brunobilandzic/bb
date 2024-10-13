import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/slices/userSlice";
import axios from "axios";

export default function AuthWrapper({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.userState?.user;
  });
  const { data: session } = useSession();

  useEffect(() => {
    const getUser = async () => {
      if (!session) return;

      const response = await axios.get("/api/user", {
        params: { email: session.user.email },
      });

      dispatch(login(response.data.user));
    };

    if (session && !user) {
      getUser();
      console.log("AuthWrapper logging user in redux global state");
    } else if (!session && user) {
      dispatch(logout());
      console.log("AuthWrapper logging user out of redux global state");
    }
  }, [session]);

  return children;
}
