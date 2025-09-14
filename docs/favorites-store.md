# Favorites Store

The favorites store is a comprehensive Pinia store for managing user's favorite products and tracking their favorites activities in a Nuxt.js application.

## Features

- **Persistent Storage**: Favorites are stored in localStorage and synchronized across browser sessions
- **Activity Tracking**: Tracks all add/remove operations with timestamps and product details
- **Product Management**: Automatically fetches and caches product details for favorited items
- **Type Safety**: Full TypeScript support with proper type definitions
- **Error Handling**: Robust error handling with automatic cleanup of invalid product IDs

## Installation

The store is automatically initialized when the app starts via the `plugins/favorites.client.ts` plugin.

## Usage

### Basic Usage

```typescript
// In a Vue component
const favoritesStore = useFavoritesStore();

// Check if a product is favorited
const isFavorite = favoritesStore.isInFavorites(productId);

// Add a product to favorites
await favoritesStore.addToFavorites(productId, {
  title: 'Product Name',
  image: 'product-image-url',
  price: 29.99
});

// Remove from favorites
await favoritesStore.removeFromFavorites(productId);

// Toggle favorite status
const wasAdded = await favoritesStore.toggleFavorite(productId, productData);
```

### State

The store provides the following reactive state:

- `favorites`: Array of favorite product IDs
- `favoriteProducts`: Array of full product objects for favorited items
- `activities`: Array of recent favorite activities
- `isLoading`: Loading state for async operations
- `error`: Error messages from failed operations

### Computed Properties

- `favoriteCount`: Number of favorited products
- `recentActivities`: Last 10 activities sorted by timestamp
- `hasActivities`: Boolean indicating if any activities exist

### Actions

#### Core Actions

- `initializeFavorites()`: Initialize the store from localStorage
- `loadFavoriteProducts()`: Fetch product details for all favorited items
- `addToFavorites(productId, productData?, trackActivity?)`: Add a product to favorites
- `removeFromFavorites(productId, trackActivity?)`: Remove a product from favorites
- `toggleFavorite(productId, productData?)`: Toggle favorite status
- `isInFavorites(productId)`: Check if product is favorited
- `clearAllFavorites()`: Remove all favorites

#### Activity Actions

- `clearActivities()`: Clear all activity history
- `removeActivity(activityId)`: Remove a specific activity

#### Utility Actions

- `getFavoriteProduct(productId)`: Get a favorited product by ID
- `syncWithLocalStorage()`: Sync store state with localStorage

## Activity Tracking

The store automatically tracks all favorite operations with the following data:

```typescript
interface FavoriteActivity {
  id: string;
  productId: string;
  action: 'added' | 'removed';
  timestamp: Date;
  productTitle?: string;
  productImage?: string;
  productPrice?: number;
}
```

Activities are automatically:
- Timestamped when created
- Limited to the last 50 entries
- Persisted to localStorage
- Displayed in a user-friendly format

## Components

### FavoritesIcon Component

A header/navigation component that displays the favorites count:

```vue
<template>
  <FavoritesIcon />
</template>
```

Features:
- Heart icon with hover effects
- Badge showing favorite count
- Links to favorites page
- Responsive design

### Favorites Page

A complete favorites management page at `/profile/favorites/` with:
- Tabbed interface (Products / Activities)
- Product grid with remove functionality
- Activity timeline with filtering
- Empty states and loading indicators

## Integration with Product Pages

The store integrates seamlessly with product detail pages:

```vue
<script setup>
const favoritesStore = useFavoritesStore();
const product = ref(/* your product data */);

const isFavorite = computed(() => {
  return favoritesStore.isInFavorites(product.value.id);
});

const toggleFavorite = async () => {
  const productData = {
    title: product.value.title,
    image: product.value.images?.[0]?.url,
    price: product.value.variants?.[0]?.calculated_price?.calculated_amount,
  };

  const wasAdded = await favoritesStore.toggleFavorite(
    product.value.id, 
    productData
  );
  
  // Show feedback to user
  const action = wasAdded ? "eklendi" : "çıkarıldı";
  alert(`Ürün favorilerinize ${action}!`);
};
</script>
```

## Error Handling

The store includes comprehensive error handling:

- Invalid product IDs are automatically removed from favorites
- Network errors are caught and reported via the `error` state
- LocalStorage corruption is detected and cleaned up
- Failed product fetches trigger automatic cleanup

## Performance Considerations

- Products are fetched lazily when needed
- Activities are limited to 50 entries to prevent memory issues
- LocalStorage operations are debounced to prevent excessive writes
- Store state is reactive and optimized for Vue's reactivity system

## Type Safety

Full TypeScript support with interfaces for:
- `FavoriteActivity`
- `FavoritesState`
- `FavoriteProductData`
- `StoredFavoriteActivity`

## Browser Compatibility

- Works in all modern browsers that support localStorage
- Gracefully degrades if localStorage is not available
- Automatically syncs across browser tabs

## Migration from Old Favorites System

If you're migrating from the `useFavorites` composable:

1. Replace `useFavorites()` calls with `useFavoritesStore()`
2. Update method calls to use the new async API
3. Replace direct localStorage access with store methods
4. Update components to use reactive store state

## Example: Complete Product Card with Favorites

```vue
<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.title" />
    <h3>{{ product.title }}</h3>
    <p>{{ formatPrice(product.price) }}</p>
    
    <button 
      @click="toggleFavorite"
      :class="{ 'favorited': isFavorite }"
    >
      <span>{{ isFavorite ? '♥' : '♡' }}</span>
      {{ isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle' }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps(['product']);
const favoritesStore = useFavoritesStore();

const isFavorite = computed(() => 
  favoritesStore.isInFavorites(props.product.id)
);

const toggleFavorite = async () => {
  try {
    await favoritesStore.toggleFavorite(props.product.id, {
      title: props.product.title,
      image: props.product.image,
      price: props.product.price
    });
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
};
</script>
```
