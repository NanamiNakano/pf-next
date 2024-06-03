// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiEndpoint: "",
    },
  },

  modules: ["@nuxt/eslint", "@nuxtjs/i18n"],

  eslint: {
    config: {
      stylistic: {
        quotes: "double",
      },
    },
  },
})