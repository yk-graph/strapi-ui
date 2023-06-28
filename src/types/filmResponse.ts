export interface FilmResponse {
  data: {
    id: number;
    attributes: {
      title: string;
      released: Date;
      director: string;
      plot?: string;
      slug?: string;
      createdAt: Date;
      updatedAt: Date;
      publishedAt: Date;
    };
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
