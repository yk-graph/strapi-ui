/* eslint-disable react-hooks/exhaustive-deps */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import useAuth from "@/libs/useAuth";

interface AuthContextProps {
  user: string | undefined;
  loading: boolean;
}
interface AuthProviderProps {
  value: AuthContextProps;
  children: ReactNode;
}

// ログインしていたらブラウザのCookieにあるusernameの値が格納される ※初期値はundefinedとする
let userState: string | undefined;

const AuthContext = createContext<AuthContextProps>({
  user: undefined,
  loading: false,
});

// ログインしている場合のuserの情報とローディング中かどうかの情報をAuthProviderコンポーネントのvalueに渡す
export const AuthProvider = ({ value, children }: AuthProviderProps) => {
  const { user } = value;

  useEffect(() => {
    if (!userState && user) {
      userState = user;
    }
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

// useFetchUser関数が呼ばれたらブラウザのCookieの中のユーザー情報を取得してuser情報とloading情報を返す
export const useFetchUser = () => {
  // ブラウザのCookieの中のユーザー情報を取得する関数
  const { getUserFromLocalCookie } = useAuth();

  const [data, setUser] = useState<AuthContextProps>({
    user: userState || undefined,
    loading: userState === undefined, // userStateがundefinedの場合はローディング中として扱う
  });

  useEffect(() => {
    console.log("userState!!!!", userState);

    // userStateに値がある場合は既にログイン済みと判定して早期Returnする
    if (userState) return;

    let isMounted = true;
    const user = getUserFromLocalCookie();
    console.log("user!!!!", user);

    if (isMounted) {
      setUser({ user, loading: false });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
};