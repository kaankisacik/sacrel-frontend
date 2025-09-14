<template>
  <div class="min-h-screen ">
    <!-- Loading State -->
    <div v-if="isLoading" class="container mx-auto px-4 py-12">
      <div class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p class="text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Hata oluştu</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink to="/products" class="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">
          Ürünlere Geri Dön
        </NuxtLink>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product?.product" class="min-h-screen ">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-4 py-4">
        <nav class="text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-black">Anasayfa</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink to="/products" class="hover:text-black">Ürünler</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-black">{{ product?.product?.title }}</span>
        </nav>
      </div>

      <!-- Product Detail Section -->
      <div class="container mx-auto px-4 pb-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- Product Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img :src="currentImage" :alt="product?.product?.title" class="w-full h-full object-cover" />
            </div>

            <!-- Thumbnail Images -->
            <div class="flex space-x-3 overflow-x-auto" v-if="productImages.length > 1">
              <button v-for="(image, index) in productImages" :key="index" @click="currentImage = image"
                class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all" :class="currentImage === image
                  ? 'border-black'
                  : 'border-gray-200 hover:border-gray-400'
                  ">
                <img :src="image" :alt="`${product?.product?.title} ${index + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Product Title and Brand -->
            <div>
              <h1 class="text-3xl font-bold text-black mb-2">
                {{ product?.product?.title }}
              </h1>
              <p class="text-gray-600 uppercase text-sm tracking-wide">
                {{ product?.product?.subtitle || "SACREL" }}
              </p>
            </div>

            <!-- Price -->
            <div class="flex items-center space-x-3">
              <span class="text-3xl font-bold text-black">{{ productPrice }} TL</span>
              <span v-if="productOriginalPrice" class="text-lg text-gray-400 line-through">
                ${{ productOriginalPrice }}
              </span>
              <span v-if="productDiscount" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                %{{ productDiscount }} İndirim
              </span>
            </div>

            <!-- Color Selection -->
            <div v-if="productColors.length > 0" class="space-y-3">
              <div class="flex items-center space-x-2">
                <span class="font-medium">Renk:</span>
                <span class="text-sm text-gray-600">({{ selectedColor.name }})</span>
              </div>

              <div class="flex space-x-3">
                <button v-for="color in productColors" :key="color.id" @click="selectedColor = color"
                  :disabled="!color.isAvailable"
                  class="w-8 h-8 rounded-full border-2 transition-all cursor-pointer relative" :class="[
                    selectedColor.id === color.id
                      ? 'border-black'
                      : 'border-gray-300 hover:border-gray-500',
                    color.class,
                    !color.isAvailable ? 'opacity-50 cursor-not-allowed' : '',
                  ]" :title="color.name + (color.isAvailable ? '' : ' (Stokta Yok)')
                    ">
                  <!-- Çizgi stokta olmayan renkler için -->
                  <span v-if="!color.isAvailable" class="absolute inset-0 flex items-center justify-center">
                    <span class="w-full h-0.5 bg-gray-400 transform rotate-45"></span>
                  </span>
                </button>
              </div>
            </div>


            <!-- Product Description -->
            <div class="space-y-2">
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ product?.product?.description }}
              </p>
            </div>

            <!-- Quantity and Add to Cart -->
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <span class="font-medium">Adet:</span>
                <div class="flex items-center border border-gray-300 rounded">
                  <button @click="quantity = Math.max(1, quantity - 1)" :disabled="quantity <= 1"
                    class="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    -
                  </button>
                  <span class="px-4 py-2 min-w-[50px] text-center">{{
                    quantity
                    }}</span>
                  <button @click="increaseQuantity" :disabled="!selectedVariant || quantity >= maxAddableQuantity
                    " class="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    +
                  </button>
                </div>
                <div v-if="selectedVariant" class="text-sm text-gray-500">
                  <div>(Stok: {{ selectedVariant.inventory_quantity }})</div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <!-- Farklı durumlar için mesajlar -->
                <div v-if="!isProductInStock" class="text-center py-4 bg-red-50 rounded border border-red-200">
                  <p class="text-red-600 font-medium">
                    Bu ürün şu anda stokta bulunmamaktadır.
                  </p>
                </div>

                <div v-else-if="maxAddableQuantity === 0"
                  class="text-center py-4 bg-orange-50 rounded border border-orange-200">
                  <p class="text-orange-600 font-medium">
                    Bu üründen sepetinizde maksimum miktar bulunmaktadır.
                  </p>
                </div>

                <button v-else @click="showSizes" :disabled="!canAddToCart"
                  class="w-full py-4 font-medium transition-colors" :class="canAddToCart
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ">
                  {{ canAddToCart ? "Sepete Ekle" : "Sepete Eklenemez" }}
                </button>

                <!-- Size Selection -->
                <div v-if="productSizes.length > 0 && sizeGuideVisible" class="space-y-12">
                  <div class="flex items-center justify-between">
                    <!-- <button class="text-sm text-gray-600 underline hover:text-black">
                  Size Guide
                </button> -->
                  </div>
                  <div class="grid grid-cols-4 gap-2">
                    <button v-for="size in productSizes" :key="size.value" @click="selectedSize = size.value;addToCart()"
                      :disabled="!size.isAvailable"
                      class="py-2 px-3 border rounded transition-all text-sm cursor-pointer relative" :class="[
                        selectedSize === size.value
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black',
                        !size.isAvailable
                          ? 'opacity-50 cursor-not-allowed bg-gray-100'
                          : '',
                      ]" :title="size.value +
                    (size.isAvailable ? '' : ' (Bu renkte stokta yok)')
                    ">
                      {{ size.value }}
                      <!-- Çizgi stokta olmayan bedenler için -->
                      <span v-if="!size.isAvailable" class="absolute inset-0 flex items-center justify-center">
                        <span class="w-full h-0.5 bg-gray-400 transform rotate-45"></span>
                      </span>
                    </button>
                  </div>
                </div>


                <button @click="toggleFavorite"
                  class="w-full border border-gray-300 py-4 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <span :class="isFavorite ? 'text-red-500' : 'text-gray-600'">♥</span>
                  <span>
                    {{ isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle" }}
                  </span>
                </button>
              </div>
            </div>


          </div>
        </div>

        <!-- Müşteri Yorumları Section -->
        <div class="mt-16 border-t pt-12">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold">Müşteri Yorumları</h2>
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <span class="flex items-center">
                <span class="text-yellow-400 mr-1">★</span>
                {{ averageRating.toFixed(1) }}
              </span>
              <span>({{ reviews.length }} yorum)</span>
            </div>
          </div>

          <!-- Loading state for reviews -->
          <div v-if="reviewsLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p class="text-gray-600">Yorumlar yükleniyor...</p>
          </div>

          <!-- No reviews state -->
          <div v-else-if="reviews.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
            <p class="text-gray-600 mb-4">
              Bu ürün için henüz yorum yapılmamış.
            </p>
            <p class="text-sm text-gray-500">İlk yorumu sen yap!</p>
          </div>

          <!-- Reviews list -->
          <div v-else class="space-y-6">
            <div v-for="review in reviews" :key="review.id" class="border-b pb-6 last:border-b-0">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div class="flex text-yellow-400">
                    <span v-for="i in 5" :key="i" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      ">
                      ★
                    </span>
                  </div>
                  <span class="font-medium">{{
                    review.customer_name || "Anonim"
                    }}</span>
                  <span v-if="review.is_verified_purchase"
                    class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Satın Alındı
                  </span>
                </div>
                <span class="text-sm text-gray-500">{{
                  formatDate(review.created_at)
                  }}</span>
              </div>

              <h4 v-if="review.title" class="font-medium text-gray-900 mb-2">
                {{ review.title }}
              </h4>
              <p class="text-gray-700 mb-3">{{ review.comment }}</p>

              <!-- <div class="flex items-center space-x-4 text-sm">
                <button
                  @click="toggleHelpful(review.id)"
                  class="text-gray-600 hover:text-black flex items-center space-x-1"
                >
                  <span>👍</span>
                  <span>Faydalı ({{ review.helpful_count || 0 }})</span>
                </button>
              </div> -->
            </div>
          </div>

          <!-- Review Form -->
          <div class="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-medium mb-4">Yorum Yaz</h3>

            <form @submit.prevent="submitReview" class="space-y-4">
              <!-- Rating -->
              <div>
                <label class="block text-sm font-medium mb-2">Puanınız</label>
                <div class="flex space-x-1">
                  <button v-for="star in 5" :key="star" type="button" @click="newReview.rating = star"
                    class="text-2xl transition-colors" :class="star <= newReview.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                      ">
                    ★
                  </button>
                </div>
              </div>

              <!-- Title -->
              <div>
                <label for="review-title" class="block text-sm font-medium mb-2">Başlık (isteğe bağlı)</label>
                <input id="review-title" v-model="newReview.title" type="text"
                  placeholder="Yorumunuza kısa bir başlık ekleyin"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
              </div>

              <!-- Comment -->
              <div>
                <label for="review-comment" class="block text-sm font-medium mb-2">Yorumunuz *</label>
                <textarea id="review-comment" v-model="newReview.comment" rows="4"
                  placeholder="Ürün hakkındaki deneyiminizi paylaşın" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"></textarea>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end">
                <button type="submit" :disabled="!newReview.rating ||
                  !newReview.comment ||
                  isSubmittingReview
                  "
                  class="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                  {{ isSubmittingReview ? "Gönderiliyor..." : "Yorum Gönder" }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Aynı Kategori Ürünleri -->
        <div v-if="sameCategoryProducts.length > 0" class="mt-16 ">
          <h2 class="   underline underline-offset-[24px] text-center text-6xl tracking-[0.2em] mb-24">▲ SANA ÖZEL ▼
          </h2>
          <ProductSlider :products="sameCategoryProducts" :slides-to-show="3" :show-dots="true" :autoplay="false" />

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Get route parameter
const route = useRoute();
const handle = route.params.handle;

// Store references
const productStore = useProductStore();
const cartStore = useCartStore();
const { product } = storeToRefs(productStore);
const productService = useProducts();

// Review composable
const { createReview, getProductReviews } = useReview();

// Reactive state
const isLoading = ref(true);
const error = ref("");
const quantity = ref(1);
const currentImage = ref("");
const selectedColor = ref({ id: "", name: "", class: "", isAvailable: true });
const selectedSize = ref("");
const selectedVariant = ref(null);
const isInitializing = ref(false);
const sameCategoryProducts = ref([]);

// Review-related state
const reviews = ref([]);
const reviewsLoading = ref(false);
const isSubmittingReview = ref(false);
const newReview = ref({
  rating: 0,
  title: "",
  comment: "",
});

// Load reviews for the product
const loadReviews = async () => {
  if (!product.value?.product?.id) return;

  try {
    reviewsLoading.value = true;
    const productReviews = await getProductReviews(product.value.product.id);
    reviews.value = productReviews;
  } catch (err) {
    console.error("Failed to load reviews:", err);
    reviews.value = [];
  } finally {
    reviewsLoading.value = false;
  }
};

// Submit a new review
const submitReview = async () => {
  if (
    !product.value?.product?.id ||
    !newReview.value.rating ||
    !newReview.value.comment
  ) {
    alert("Lütfen gerekli alanları doldurun.");
    return;
  }

  try {
    isSubmittingReview.value = true;

    const reviewData = {
      product_id: product.value.product.id,
      rating: newReview.value.rating,
      title: newReview.value.title || null,
      comment: newReview.value.comment,
    };

    await createReview(reviewData);

    // Reset form
    newReview.value = {
      rating: 0,
      title: "",
      comment: "",
    };

    // Reload reviews
    await loadReviews();

    alert("Yorumunuz başarıyla gönderildi! Onaylandıktan sonra görünecektir.");
  } catch (err) {
    console.log("Failed to submit review:", err);
    if (err.message.includes("Unauthorized")) {
      alert("Yorum yapabilmek için giriş yapmanız gerekiyor.");
    } else if (err.message.includes("Purchase verification failed")) {
      alert("Yorum yapabilmek için ürünü satın almış olmanız gerekiyor.");
    } else if (err.message.includes("Review already exists")) {
      alert("Bu ürüne daha önce yorum yapmışsınız.");
    } else {
      alert("Yorum gönderilirken bir hata oluştu.");
    }
  } finally {
    isSubmittingReview.value = false;
  }
};

// Toggle helpful for a review
const toggleHelpful = async (reviewId) => {
  try {
    // This would call updateReviewHelpfulness from the composable
    // For now, just increment locally
    const review = reviews.value.find((r) => r.id === reviewId);
    if (review) {
      review.helpful_count = (review.helpful_count || 0) + 1;
    }
  } catch (err) {
    console.error("Failed to update helpful count:", err);
  }
};

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Computed properties for product data
const productImages = computed(() => {
  if (!product.value?.product?.images) return [];
  return product.value.product.images.map((img) => img.url);
});

const productColors = computed(() => {
  if (!product.value?.product?.options) return [];
  const colorOption = product.value.product.options.find(
    (opt) => opt.title.toLowerCase() === "color"
  );
  return (
    colorOption?.values?.map((val) => ({
      id: val.id,
      name: val.value,
      class: productHelper.getColorBgTailwind(val.value.toLowerCase()),
      isAvailable:
        productHelper.getAvailableSizesForColor(
          product.value?.product,
          val.value
        ).length > 0,
    })) || []
  );
});

const productSizes = computed(() => {
  if (!product.value?.product?.options) return [];
  const sizeOption = product.value.product.options.find(
    (opt) => opt.title.toLowerCase() === "size"
  );
  return (
    sizeOption?.values?.map((val) => ({
      value: val.value,
      isAvailable: selectedColor.value.name
        ? productHelper
          .getAvailableSizesForColor(
            product.value?.product,
            selectedColor.value.name
          )
          .includes(val.value)
        : productHelper.getAvailableColorsForSize(
          product.value?.product,
          val.value
        ).length > 0,
    })) || []
  );
});

// Review computed properties
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.value.length;
});

// Ürün stok durumu
const isProductInStock = computed(() => {
  return product.value?.product
    ? productHelper.isProductInStock(product.value.product)
    : false;
});

// Sepetteki mevcut miktar
const currentQuantityInCart = computed(() => {
  if (!cartStore.cart?.cart?.items || !selectedVariant.value) return 0;

  const existingItem = cartStore.cart.cart.items.find(
    (item) => item.variant_id === selectedVariant.value?.id
  );

  return existingItem ? existingItem.quantity : 0;
});

// Maksimum eklenebilir miktar
const maxAddableQuantity = computed(() => {
  if (!selectedVariant.value) return 0;
  return Math.max(
    0,
    selectedVariant.value.inventory_quantity - currentQuantityInCart.value
  );
});
const sizeGuideVisible = ref(false);
const showSizes = () => {
  sizeGuideVisible.value = true;
};

// Sepete ekleme butonunun durumu
const canAddToCart = computed(() => {
  return (
    selectedVariant.value &&
    selectedVariant.value.inventory_quantity > 0 &&
    maxAddableQuantity.value > 0 &&
    quantity.value <= maxAddableQuantity.value
  );
});

const productPrice = computed(() => {
  if (selectedVariant.value?.calculated_price) {
    return selectedVariant.value.calculated_price.calculated_amount.toFixed(2);
  }
  if (product.value?.product?.variants?.[0]?.calculated_price) {
    return product.value.product.variants[0].calculated_price.calculated_amount.toFixed(
      2
    );
  }
  return "0.00";
});

const productOriginalPrice = computed(() => {
  if (selectedVariant.value?.calculated_price?.original_amount) {
    const original = selectedVariant.value.calculated_price.original_amount;
    const current = selectedVariant.value.calculated_price.calculated_amount;
    return original > current ? original.toFixed(2) : null;
  }
  return null;
});

const productDiscount = computed(() => {
  if (productOriginalPrice.value && productPrice.value) {
    const original = parseFloat(productOriginalPrice.value);
    const current = parseFloat(productPrice.value);
    return Math.round(((original - current) / original) * 100);
  }
  return null;
});

// Load products from same category
const loadSameCategoryProducts = async () => {
  if (!product.value?.product?.categories?.length) {
    sameCategoryProducts.value = [];
    return;
  }

  try {
    // Get the first category of the current product
    const categoryId = product.value.product.categories[0].id;

    // Fetch products from the same category
    const response = await productService.getProducts({
      category_id: [categoryId],
      limit: 8, // Get 8 products to show in slider
    });

    // Filter out the current product from the results
    const filteredProducts = response.products?.filter(
      (p) => p.id !== product.value?.product?.id
    ) || [];

    sameCategoryProducts.value = filteredProducts;
    console.log(`Found ${filteredProducts.length} products in same category`);
  } catch (err) {
    console.error("Failed to load same category products:", err);
    sameCategoryProducts.value = [];
  }
};

// Watch for color changes and update available sizes
// Watch for color changes and update available sizes
watch(selectedColor, (newColor, oldColor) => {
  // İlk yükleme sırasında watch'ı tetikleme
  if (isInitializing.value || (!oldColor.name && newColor.name)) return;

  if (product.value?.product && newColor.name) {
    // Renk değiştiğinde ilk mevcut bedeni seç
    const firstAvailableSize = productHelper.getFirstAvailableSize(
      product.value.product,
      newColor.name
    );
    if (firstAvailableSize) {
      selectedSize.value = firstAvailableSize;
    } else {
      selectedSize.value = "";
    }
  }
});

// Watch for variant selection changes
// Watch for variant selection changes
watch(
  [selectedColor, selectedSize],
  ([newColor, newSize], [oldColor, oldSize]) => {
    // İlk yükleme sırasında watch'ı tetikleme
    if (
      isInitializing.value ||
      (!oldColor?.name && !oldSize && (newColor?.name || newSize))
    )
      return;

    console.log("Variant selection changed:", {
      newColor: newColor?.name,
      newSize,
      oldColor: oldColor?.name,
      oldSize,
    });

    if (product.value?.product?.variants) {
      const variant = product.value.product.variants.find((v) => {
        const colorMatch =
          !newColor?.name ||
          v.options?.some(
            (opt) =>
              opt.option.title.toLowerCase() === "color" &&
              opt.value === newColor.name
          );
        const sizeMatch =
          !newSize ||
          v.options?.some(
            (opt) =>
              opt.option.title.toLowerCase() === "size" && opt.value === newSize
          );
        return colorMatch && sizeMatch;
      });

      console.log("Found variant:", variant);

      if (variant) {
        selectedVariant.value = variant;
        // Eğer mevcut quantity stoktan fazlaysa, stoktaki maksimum değere ayarla
        if (quantity.value > variant.inventory_quantity) {
          quantity.value = Math.max(1, variant.inventory_quantity);
        }
      }
    }
  }
);

// Watch quantity changes to ensure it doesn't exceed available stock
watch(quantity, (newQuantity) => {
  if (isInitializing.value) return;

  if (newQuantity > maxAddableQuantity.value) {
    quantity.value = maxAddableQuantity.value;
  }
  if (newQuantity < 1) {
    quantity.value = 1;
  }
});

// Initialize values
const initializeProduct = () => {
  if (product.value?.product) {
    isInitializing.value = true;

    console.log("Initializing product:", product.value.product.title);
    console.log("Available variants:", product.value.product.variants);

    // Set first image
    if (productImages.value.length > 0) {
      currentImage.value = productImages.value[0];
    }

    // İlk stokta olan varyantı bul
    if (product.value.product.variants?.length > 0) {
      const availableVariant = product.value.product.variants.find(
        (v) => v.inventory_quantity > 0
      );

      console.log("First available variant:", availableVariant);

      if (availableVariant) {
        selectedVariant.value = availableVariant;

        // Bu varyantın renk ve beden bilgilerini al
        const colorOption = availableVariant.options?.find(
          (opt) => opt.option.title.toLowerCase() === "color"
        );
        const sizeOption = availableVariant.options?.find(
          (opt) => opt.option.title.toLowerCase() === "size"
        );

        console.log("Color option:", colorOption);
        console.log("Size option:", sizeOption);

        // Rengi ayarla
        if (colorOption && productColors.value.length > 0) {
          const matchingColor = productColors.value.find(
            (color) => color.name === colorOption.value
          );
          if (matchingColor) {
            selectedColor.value = matchingColor;
            console.log("Selected color:", matchingColor);
          }
        }

        // Bedeni ayarla
        if (sizeOption) {
          selectedSize.value = sizeOption.value;
          console.log("Selected size:", sizeOption.value);
        }

        // Quantity'yi stok miktarına göre ayarla
        quantity.value = Math.min(1, availableVariant.inventory_quantity);
      } else {
        // Hiçbir varyant stokta değilse ilk varyantı seç
        selectedVariant.value = product.value.product.variants[0];

        console.log(
          "No available variant, using first:",
          selectedVariant.value
        );

        // İlk varyantın renk ve beden bilgilerini al
        const colorOption = selectedVariant.value.options?.find(
          (opt) => opt.option.title.toLowerCase() === "color"
        );
        const sizeOption = selectedVariant.value.options?.find(
          (opt) => opt.option.title.toLowerCase() === "size"
        );

        if (colorOption && productColors.value.length > 0) {
          const matchingColor = productColors.value.find(
            (color) => color.name === colorOption.value
          );
          if (matchingColor) {
            selectedColor.value = matchingColor;
          }
        }

        if (sizeOption) {
          selectedSize.value = sizeOption.value;
        }

        quantity.value = 1;
      }
    }

    // Fallback: Eğer hiç varyant yoksa sadece renkleri ayarla
    if (!selectedColor.value.name && productColors.value.length > 0) {
      const firstAvailableColor = productColors.value.find(
        (color) => color.isAvailable
      );
      selectedColor.value = firstAvailableColor || productColors.value[0];
      console.log("Fallback color selection:", selectedColor.value);
    }

    console.log("Final selections:", {
      variant: selectedVariant.value,
      color: selectedColor.value,
      size: selectedSize.value,
      quantity: quantity.value,
    });

    nextTick(() => {
      isInitializing.value = false;
    });
  }
};

// Load product data
const loadProduct = async () => {
  try {
    isLoading.value = true;
    error.value = "";
    await productStore.getProductByHandle(handle);
    initializeProduct();
    // Load reviews after product is loaded
    await loadReviews();
    // Load same category products
    await loadSameCategoryProducts();
  } catch (err) {
    console.error("Failed to load product:", err);
    error.value = "Ürün yüklenirken bir hata oluştu.";
  } finally {
    isLoading.value = false;
  }
};

// Methods
const increaseQuantity = () => {
  if (quantity.value < maxAddableQuantity.value) {
    quantity.value++;
  }
};

const addToCart = async () => {
  try {
    if (!selectedVariant.value) {
      alert("Lütfen ürün seçeneklerini belirleyin.");
      return;
    }

    if (selectedVariant.value.inventory_quantity === 0) {
      alert("Bu ürün stokta bulunmamaktadır.");
      return;
    }

    if (quantity.value > selectedVariant.value.inventory_quantity) {
      alert(
        `Maksimum ${selectedVariant.value.inventory_quantity} adet sipariş verebilirsiniz.`
      );
      return;
    }

    // Get current cart to check existing quantity
    await cartStore.getCart();
    let currentQuantityInCart = 0;

    if (cartStore.cart?.cart?.items) {
      const existingItem = cartStore.cart.cart.items.find(
        (item) => item.variant_id === selectedVariant.value?.id
      );
      currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    }

    // Check if adding new quantity would exceed inventory
    const totalQuantity = currentQuantityInCart + quantity.value;

    if (totalQuantity > selectedVariant.value.inventory_quantity) {
      const remainingStock =
        selectedVariant.value.inventory_quantity - currentQuantityInCart;

      if (remainingStock <= 0) {
        alert(
          "Bu üründen sepetinizde zaten maksimum stok miktarı bulunmaktadır."
        );
        return;
      } else {
        alert(
          `Bu üründen sepetinizde ${currentQuantityInCart} adet var. En fazla ${remainingStock} adet daha ekleyebilirsiniz.`
        );
        return;
      }
    }

    // Add to cart using cart store
    await cartStore.addToCart(selectedVariant.value.id, quantity.value);
    alert(
      `${quantity.value} adet ${product.value?.product?.title} sepete eklendi!`
    );
  } catch (err) {
    console.error("Failed to add to cart:", err);

    // Handle specific inventory error from API
    if (err.message && err.message.includes("insufficient_inventory")) {
      alert(
        "Stokta yeterli ürün bulunmamaktadır. Sepetinizdeki mevcut miktarla birlikte stok limiti aşılıyor."
      );
    } else {
      alert("Sepete eklenirken bir hata oluştu.");
    }
  }
};

// Favorites functionality
const favoritesService = useFavorites();
const isFavorite = computed(() => {
  return product.value?.product ? favoritesService.isInFavorites(product.value.product.id) : false;
});

const toggleFavorite = () => {
  if (!product.value?.product) return;
  
  try {
    const wasAdded = favoritesService.toggleFavorite(product.value.product.id);
    const action = wasAdded ? "eklendi" : "çıkarıldı";
    alert(`Ürün favorilerinize ${action}!`);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    alert("Favori işlemi sırasında bir hata oluştu.");
  }
};

// Load product on component mount
onMounted(async () => {
  await loadProduct();
  // Load cart to check existing quantities
  await cartStore.getCart();
});



// SEO
useHead(() => ({
  title: product.value?.product
    ? `${product.value.product.title} - Your Store`
    : "Product Detail - Your Store",
  meta: [
    {
      name: "description",
      content: product.value?.product?.description || "Product detail page",
    },
  ],
}));
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1/1;
}
</style>
