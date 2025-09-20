# ProductSlider Component Usage

The `ProductSlider` component now supports a `showCard` prop that controls how many product cards are displayed.

## Props

- `products`: Array of StoreProduct objects
- `slidesToShow`: Number of slides to show (default: 3)
- `showCard`: Number of product cards to display (default: 3)
- `showDots`: Whether to show navigation dots (default: true)
- `autoplay`: Whether to auto-advance slides (default: false)
- `autoplayDelay`: Delay between auto-advances in ms (default: 3000)

## Examples

### Show 5 products
```vue
<ProductSlider
  :products="products"
  :show-card="5"
  :show-dots="false"
  :autoplay="false"
/>
```

### Show 1 product
```vue
<ProductSlider
  :products="products"
  :show-card="1"
  :show-dots="true"
  :autoplay="true"
  :autoplay-delay="4000"
/>
```

### Show 3 products (default)
```vue
<ProductSlider
  :products="products"
  :slides-to-show="3"
  :show-dots="false"
  :autoplay="false"
/>
```

## Responsive Behavior

The component automatically adjusts the number of displayed cards based on screen size:
- Mobile (< 640px): Max 1 card, respects `showCard` if it's 1
- Tablet (640px - 768px): Max 2 cards, respects `showCard` if it's ≤ 2
- Desktop (≥ 768px): Uses the `showCard` value up to the `slidesToShow` limit

## CSS Grid Classes

The component automatically applies appropriate CSS grid classes based on the `showCard` value:
- 1 card: `grid-cols-1`
- 2 cards: `grid-cols-1 sm:grid-cols-2`
- 3 cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- 4 cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- 5 cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`
