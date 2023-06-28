import { FC, useState } from "react";
import Layout from "@/components/Layout";
import { fetcher } from "@/lib/api";
import { FilmResponse } from "@/types/filmResponse";
import Films from "@/components/Films";

interface Props {
  films: FilmResponse;
}

const FilmsList: FC<Props> = ({ films }) => {
  const [pageIndex, setPageIndex] = useState(1);

  return (
    <Layout>
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
          Films
        </span>
      </h1>

      <div className="space-x-2 space-y-2">
        <Films films={films} />
      </div>
    </Layout>
  );
};

export default FilmsList;

export async function getStaticProps() {
  const filmsResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/films`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    }
  );

  return {
    props: {
      films: filmsResponse,
    },
  };
}
