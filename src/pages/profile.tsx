import { useFetchUser } from "@/providers/AuthProvider";
import Layout from "@/components/Layout";

const Profile = () => {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading}>
      <h1 className="text-5xl font-bold">
        Welcome back{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          {user}
        </span>
        <span>👋</span>
      </h1>
    </Layout>
  );
};

export default Profile;
