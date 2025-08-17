export interface ProductTagsModel {
  limit: number;
  offset: number;
  count: number;
  product_tags: ProductTagModel[];
}

export interface ProductTagModel {
  id: string;
  value: string;
  created_at: Date;
  updated_at: Date;
}
