// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],

  runtimeConfig: {
    public: {
      apiEndpoint: "",
    },
  },

  modules: ["@nuxt/eslint", "@nuxtjs/i18n", "@nuxt/ui"],

  eslint: {
    config: {
      stylistic: {
        quotes: "double",
      },
    },
  },

  i18n: {
    locales: ["cn", "en"],
    strategy: "prefix_except_default",
    defaultLocale: "cn",
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
