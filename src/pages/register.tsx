import { useFetchUser } from "@/providers/AuthProvider";
import Layout from "@/components/Layout";
import { default as RegisterComponent } from "@/components/Register";

const Register = () => {
  const { user, loading } = useFetchUser();
  return (
    <Layout user={user} loading={loading}>
      <RegisterComponent />
    </Layout>
  );
};

export default Register;
