export interface ImageVariant {
  url: string;
  width: number;
  height: number;
}

export interface Image {
  id: string;
  variants: ImageVariant[];
}

export interface SearchResultItem {
  id: string;
  title: string;
  city: string;
  price: number;
  age: number;
  images: Image[];
}

export interface SearchMeta {
  page: number;
  perPage: number;
  total: number;
}

export interface SearchFacets {
  age?: Record<string, number>;
  city?: Record<string, number>;
  [key: string]: Record<string, number> | undefined;
}

export interface SearchFilters {
  applied: Record<string, any>; // Record of applied filter values
  facets: SearchFacets;
}

export interface SearchResponse {
  data: SearchResultItem[];
  meta: SearchMeta;
  filters: SearchFilters;
}
