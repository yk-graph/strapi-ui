import { FC, useState } from "react";
import useSWR from "swr";

import Films from "@/components/Films";
import Layout from "@/components/Layout";
import { fetcher } from "@/libs/fetcher";
import { useFetchUser } from "@/providers/AuthProvider";
import { FilmResponse } from "@/types/films";

interface Props {
  films: FilmResponse;
}

const FilmsList: FC<Props> = ({ films }) => {
  const { user, loading } = useFetchUser();
  const [pageIndex, setPageIndex] = useState(1);

  // useSWRを使って第一引数に指定している値(このケースだとpageIndexの値)に変化が合った場合に再度fetcher関数を実行する
  // 第一引数 -> APIのURL
  // 第二引数 -> fetcher関数(非同期関数)を渡す※fetcherで指定するURLは第一引数の値となる
  // 第三引数 -> オプション
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/films?pagination[page]=${pageIndex}&pagination[pageSize]=5`,
    fetcher,
    {
      // fallbackData -> データ取得前に表示するデータ
      fallbackData: films,
    }
  );

  return (
    <Layout user={user} loading={loading}>
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
          Films
        </span>
      </h1>

      <div className="space-x-2 space-y-2">
        <Films films={data} />
      </div>

      <div className="space-x-2 space-y-2">
        {/* 前へ戻るボタンの制御 *pageIndexの値が1の時ボタンを比活性にする */}
        <button
          className={`md:p-2 rounded py-2 text-black p-2 ${
            pageIndex === 1 ? "bg-gray-300" : "bg-blue-400"
          }`}
          disabled={pageIndex === 1}
          onClick={() => setPageIndex(pageIndex - 1)}
        >
          {" "}
          Previous
        </button>
        {/* 次へ進むボタンの制御 *APIで返却されるpageCountの値とpageIndexの値が同じ場合はボタンを比活性にする */}
        <button
          className={`md:p-2 rounded py-2 text-black p-2 ${
            pageIndex === (data && data.meta.pagination.pageCount)
              ? "bg-gray-300"
              : "bg-blue-400"
          }`}
          disabled={pageIndex === (data && data.meta.pagination.pageCount)}
          onClick={() => setPageIndex(pageIndex + 1)}
        >
          Next
        </button>
        {/* 現在のページ数とページネーションの総数を表示 */}
        <span>{`${pageIndex} of ${
          data && data.meta.pagination.pageCount
        }`}</span>
      </div>
    </Layout>
  );
};

export default FilmsList;

export const getStaticProps = async () => {
  const filmsResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/films?pagination[page]=1&pagination[pageSize]=5`
  );

  return {
    props: {
      films: filmsResponse,
    },
  };
};
