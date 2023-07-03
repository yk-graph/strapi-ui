import { ChangeEvent, FC, FormEvent, useState } from "react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "node:querystring";

import Layout from "@/components/Layout";
import {
  getTokenFromLocalCookie,
  getTokenFromServerCookie,
  getUserFromLocalCookie,
} from "@/libs/auth";
import { fetcher } from "@/libs/fetcher";
import { markdownToHtml } from "@/libs/markdownToHtml";
import { useFetchUser } from "@/providers/AuthProvider";
import { FilmData } from "@/types/films";
import { useRouter } from "next/router";

// Paramsの型を定義し、ParsedUrlQueryをextendsする
interface Params extends ParsedUrlQuery {
  slug: string;
}
type Props = {
  film?: FilmData;
  plot: string;
  jwt: string | null;
  error?: string | undefined;
};

const Film: FC<Props> = ({ film, plot, jwt, error }) => {
  const router = useRouter();
  const { user, loading } = useFetchUser();
  const [review, setReview] = useState({ value: "" });

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReview((prevReview) => ({ ...prevReview, value: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          review: review.value,
          reviewer: getUserFromLocalCookie(),
          Film: film!.id,
        }),
      });
      router.reload();
    } catch (error) {
      console.error(error);
    }
  };

  if (!film) {
    return (
      <Layout user={user} loading={loading}>
        <p>{error}</p>
      </Layout>
    );
  } else {
    return (
      <Layout user={user} loading={loading}>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
            {film.attributes.title}
          </span>
        </h1>
        <p>
          Directed by{" "}
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            {film.attributes.director}
          </span>
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tighter mb-4 mt-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
            Plot
          </span>
        </h2>
        <div
          className="tracking-wide font-normal text-sm"
          dangerouslySetInnerHTML={{ __html: plot }}
        ></div>
        {user && (
          <>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tighter mb-4 mt-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
                Reviews
              </span>
              <form onSubmit={handleSubmit}>
                <textarea
                  className="w-full text-sm px-3 py-2 text-gray-700 border border-teal-400 rounded-lg focus:outline-none"
                  rows={4}
                  value={review.value}
                  onChange={handleChange}
                  placeholder="Add your review"
                ></textarea>
                <button
                  className="md:p-2 rounded py-2 text-black bg-purple-200 p-2"
                  type="submit"
                >
                  Add Review
                </button>
              </form>
            </h2>
            <ul>
              {film.attributes.reviews && <span>No reviews yet</span>}
              {film.attributes.reviews &&
                film.attributes.reviews.data.map((review) => {
                  return (
                    <li key={review.id}>
                      <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        {review.attributes.reviewer}
                      </span>{" "}
                      said &quot;{review.attributes.review}&quot;
                    </li>
                  );
                })}
            </ul>
          </>
        )}
      </Layout>
    );
  }
};

export default Film;

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
  req,
  params,
}) => {
  const slug = params!.slug;

  const jwt =
    typeof window !== "undefined"
      ? getTokenFromLocalCookie()
      : getTokenFromServerCookie(req);

  const filmResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/slugify/slugs/film/${slug}?populate=*`,
    jwt
      ? {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      : undefined
  );

  if (filmResponse.data) {
    const plot = await markdownToHtml(filmResponse.data.attributes.plot);
    return {
      props: {
        film: filmResponse.data,
        plot,
        jwt: jwt || null,
        error: undefined,
      },
    };
  } else {
    return {
      props: {
        film: filmResponse.data,
        plot: "",
        jwt: null,
        error: filmResponse.error.message,
      },
    };
  }
};
