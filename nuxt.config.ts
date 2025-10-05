// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@nuxtjs/medusa",
    "@pinia/nuxt",
  ],
  vite: {
    optimizeDeps: {
      include: ["qs"],
    },
    define: {
      global: "globalThis",
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },

  nitro: {
    experimental: {
      wasm: true,
    },
  },

  medusa: {
    baseUrl: process.env.NUXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
    publishableKey: process.env.NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    auth: {
      type: "jwt",
      jwtTokenStorageMethod: "local",
    },
  },

  runtimeConfig: {
    public: {
      medusaUrl: process.env.NUXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
      medusaPublishableKey:
        process.env.NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    },
  },

  css: ["~/assets/css/tailwind.css"],

  app: {
    head: {
      title: "Sacrel - Modern Moda",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Modern ve şık koleksiyonlarımızı keşfedin",
        },
      ],
    },
  },
});
