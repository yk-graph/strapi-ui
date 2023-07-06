# Strapi _ NextJS _ TypeScript

## StrapiAPI

| 内容           | METHOD | URL                                                      | BODY                                                   | RES                         | PARAMS                                                                | 認可※ |
| :------------- | :----- | :------------------------------------------------------- | :----------------------------------------------------- | :-------------------------- | :-------------------------------------------------------------------- | :---- |
| jwt 取得       | POST   | http://localhost:1337/api/auth/local                     | identifier: string,<br>password: string                | jwt: string<br>user: object |                                                                       |       |
| サインアップ   | POST   | http://localhost:1337/api/local/register                 | username: string,<br>email: string<br>password: string | jwt: string<br>user: object |                                                                       |       |
| film 一覧取得  | GET    | http://localhost:1337/api/films                          |                                                        | data: array<br>meta: object | pagination[page]=number<br>pagination[pageSize]=number<br>populate=\* |       |
| film 取得 slug | GET    | http://localhost:1337/api/slugify/slugs/:modelName/:slug |                                                        | data: array<br>meta: object |                                                                       |       |

**※ 認可 : RequestHeader に jwt が必要かどうか**

必要な場合 ↓

```
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${jwt}`,
}
```

## import したライブラリ

| パッケージ名      | 用途                               | URL                                               |
| :---------------- | :--------------------------------- | :------------------------------------------------ |
| useSWR            | ページネーションの実装             | https://swr.vercel.app/ja                         |
| js-cookie         | Cookie の管理                      | https://github.com/js-cookie/js-cookie            |
| @types/js-cookie  | Cookie の管理                      | npm i --save-dev @types/js-cookie                 |
| tailwindcss/forms | CSS の form 部分を本来の UI にする | https://github.com/tailwindlabs/tailwindcss-forms |

## Tips

### fetch 用の関数を切り出し管理する

films-ui/src/libs/fetcher.tsx

```
export const fetcher = async (url: string, options?: {}) => {
  let response;

  if (!options) {
    response = await fetch(url);
  } else {
    response = await fetch(url, options);
  }

  const data = await response.json();
  return data;
};
```

### useSWR を使って URL の値が変わる度にデータを fetch するようにする

films-ui/src/pages/films.tsx

```
const { data } = useSWR(
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/films?pagination[page]=${pageIndex}&pagination[pageSize]=5`, // ${pageIndex}の値が変わる度にfetchが走る
  fetcher,
  {
    // fallbackData -> データ取得前に表示するデータ
    fallbackData: films,
  }
);
```

### slug を使えるようにするための Strapi 側の設定

1. strapi 側のディレクトリで `yarn add strapi-plugin-slugify`
2. films/config/plugins.ts を追加

```
module.exports = ({ env }) => ({
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        film: {
          field: "slug",
          references: "title",
        },
      },
    },
  },
});
```

3. strapi 再起動 `yarn develop`

### サーバーサイド側の処理かどうかを判定する

`typeof window` が `undefined` で だったらサーバーサイド側の処理として判定できる
[参考](https://dev-k.hatenablog.com/entry/how-to-access-the-window-object-in-nextjs-dev-k)

films-ui/src/pages/film/[slug].tsx

```
const jwt = typeof window !== "undefined" ? getTokenFromLocalCookie() : getTokenFromServerCookie(req);
```

### 【要調査】 getServerSideProps で req オブジェクトを送る

サーバーサイド側の処理としてリクエストを送りたいときは下記のように指定する

films-ui/src/pages/film/[slug].tsx

```
export const getServerSideProps: GetServerSideProps<Props> = async ({
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
};
```

films-ui/src/libs/auth.tsx

jwt の値を取得する処理
渡ってくる req は `IncomingMessage` って型だといいらしい

```
export const getTokenFromServerCookie = (req: IncomingMessage) => {
  if (!req.headers.cookie || "") return undefined;

  const jwtCookie = req.headers.cookie
    .split(";")
    .find((c: string) => c.trim().startsWith("jwt="));

  if (!jwtCookie) return undefined;

  const jwt = jwtCookie.split("=")[1];
  return jwt;
};
```

### フォーム部分の UI を tailwindcss のクセをとる方法

1. tailwindcss/forms のインストール
2. films-ui/tailwind.config.js に記述

```
plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
```
