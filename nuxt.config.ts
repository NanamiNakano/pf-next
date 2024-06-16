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
      sentry: {
        dsn: "https://05960be87337ac4e4f1406b17c80b692@o4506035537510400.ingest.us.sentry.io/4507439376498688",
        environment: "development",
      },
    },
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  modules: [
    "@nuxt/eslint",
    "nuxt-zod-i18n",
    "@nuxtjs/i18n",
    "@nuxt/ui",
    "@pinia/nuxt",
  ],

  eslint: {
    config: {
      stylistic: {
        quotes: "double",
      },
    },
  },

  i18n: {
    strategy: "no_prefix",
    defaultLocale: "zh-CN",
    langDir: "./locales",
    locales: [
      {
        code: "en-GB",
        dir: "ltr",
        file: "en-GB.json",
        flag: "gb",
        isCatchallLocale: true,
        iso: "en-GB",
        name: "English",
      },
      {
        code: "zh-CN",
        dir: "ltr",
        file: "zh-CN.json",
        flag: "cn",
        iso: "zh-CN",
        name: "中文",
      },
    ],
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  ui: {
    icons: ["tabler"],
  },
})
