import type { StoreProduct } from "@medusajs/types";

export interface FavoriteActivity {
  id: string;
  productId: string;
  action: 'added' | 'removed';
  timestamp: Date;
  productTitle?: string;
  productImage?: string;
  productPrice?: number;
}

export interface FavoritesState {
  favorites: string[];
  favoriteProducts: StoreProduct[];
  activities: FavoriteActivity[];
  isLoading: boolean;
  error: string;
}

export interface FavoriteProductData {
  title?: string;
  image?: string;
  price?: number;
}

export interface FavoriteActivityPayload {
  id: string;
  productId: string;
  action: 'added' | 'removed';
  timestamp: Date;
  productTitle?: string;
  productImage?: string;
  productPrice?: number;
}

export interface StoredFavoriteActivity {
  id: string;
  productId: string;
  action: 'added' | 'removed';
  timestamp: string; // ISO string when stored in localStorage
  productTitle?: string;
  productImage?: string;
  productPrice?: number;
}
