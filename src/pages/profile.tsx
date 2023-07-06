import { ChangeEvent, FC, useState } from "react";
import { NextApiRequest } from "next";

import Layout from "@/components/Layout";
import { getTokenFromServerCookie } from "@/libs/auth";
import { fetcher } from "@/libs/fetcher";
import { useFetchUser } from "@/providers/AuthProvider";
import { UserData } from "@/types/auth";

interface Props {
  avatar: string | null;
}
type RequestType = {
  req: NextApiRequest;
};

const Profile: FC<Props> = ({ avatar }) => {
  const { user, loading } = useFetchUser();
  const [image, setImage] = useState<File | null>(null);

  const uploadToClient = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const tmpImage = e.target.files[0];
      setImage(tmpImage);
    }
  };

  const uploadToServer = async () => {
    const formData = new FormData();
    const file = image;
    formData.append("inputFile", file!);
    formData.append("user_id", "");

    try {
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  return (
    <Layout user={user} loading={loading}>
      <h1 className="text-5xl font-bold">
        Welcome back{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          {user}
        </span>
        <span>👋</span>
      </h1>
      {avatar === "default_avatar" && (
        <div>
          <h4>Select an image to upload</h4>
          <input type="file" onChange={uploadToClient} />
          <button
            className="md:p-2 rounded py-2 text-black bg-purple-200 p-2"
            type="submit"
            onClick={uploadToServer}
          >
            Set Profile Image
          </button>
        </div>
      )}
    </Layout>
  );
};

export default Profile;

export const getServerSideProps = async ({ req }: RequestType) => {
  const jwt = getTokenFromServerCookie(req);

  if (!jwt) {
    return {
      redirect: {
        destination: "/",
      },
    };
  } else {
    const responseData: UserData = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    const avatar = responseData.avatar ? responseData.avatar : "default_avatar";
    return {
      props: {
        avatar,
      },
    };
  }
};
