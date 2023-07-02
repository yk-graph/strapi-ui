import { FC, ReactNode } from "react";
import Head from "next/head";
import Nav from "./Nav";
import { AuthProvider } from "@/providers/AuthProvider";

interface Props {
  user: string | undefined;
  loading: boolean;
  children: ReactNode;
}

const Layout: FC<Props> = ({ user, loading, children }) => (
  <AuthProvider value={{ user, loading }}>
    <Head>
      <title>Film Database</title>
    </Head>

    <Nav />
    <main className="px-4">
      <div
        className="
          flex
          justify-center
          items-center
          bg-white
          mx-auto
          w-2/4
          rounded-lg
          my-16
          p-16
        "
      >
        <div className="text-2xl font-medium">{children}</div>
      </div>
    </main>
  </AuthProvider>
);

export default Layout;
