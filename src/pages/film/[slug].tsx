import { FC } from "react";

import Layout from "@/components/Layout";
import fetcher from "@/libs/useFetch";
import { FilmData } from "@/types/films";
import { useFetchUser } from "@/providers/AuthProvider";

type PageProps = {
  params: {
    slug: string;
  };
};
type Props = {
  film: FilmData;
};

const Film: FC<Props> = ({ film }) => {
  const { user, loading } = useFetchUser();
  return (
    <Layout user={user} loading={loading}>
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
          {film.attributes.title}
        </span>
      </h1>
    </Layout>
  );
};

export default Film;

export async function getServerSideProps({ params }: PageProps) {
  const { slug } = params;
  const filmResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/slugify/slugs/film/${slug}`
  );

  return {
    props: {
      film: filmResponse.data,
    },
  };
}
