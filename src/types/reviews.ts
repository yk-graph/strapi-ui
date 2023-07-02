export type ReviewData = {
  id: number;
  attributes: {
    review: string;
    reviewer: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
  };
};

export interface ReviewResponse {
  data: ReviewData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
