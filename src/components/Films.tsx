import Link from "next/link";
import { FilmResponse } from "@/types/films";
import { FC } from "react";

interface Props {
  films: FilmResponse;
}

const Films: FC<Props> = ({ films }) => {
  return (
    <>
      <ul className="list-none space-y-4 text-4xl font-bold mb-3">
        {films &&
          films.data.map((film) => {
            return (
              <li key={film.id}>
                <Link href={`film/` + film.attributes.slug}>
                  {film.attributes.title}
                </Link>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default Films;
