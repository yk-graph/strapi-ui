import Layout from "@/components/Layout";
import { Inter } from "next/font/google";
import { useFetchUser } from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading}>
      home
    </Layout>
  );
}
