// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css", "~/assets/css/transition.css"],

  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },

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
    locales: [{
      code: "cn",
      iso: "zh-CN",
    }, {
      code: "en",
      iso: "en-US",
    }],
    strategy: "no_prefix",
    defaultLocale: "cn",
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
