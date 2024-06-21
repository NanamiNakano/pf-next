<script setup lang="ts">
const showMenu = ref(false)

const callbackToggleMenu = (show: boolean) => {
  showMenu.value = show
}
</script>

<template>
  <div class="h-screen bg-white dark:bg-gray-950">
    <AppHeader
      class="fixed w-full top-0 z-30 bg-white dark:bg-gray-950"
      @toggle-menu="callbackToggleMenu"
    />
    <div class="flex h-full pt-14">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showMenu"
          class="fixed z-10 h-full bg-black/70 w-full md:hidden"
        >
          <LazyAppMenu class="fixed z-20 h-full flex-none bg-white dark:bg-gray-950" />
        </div>
      </Transition>
      <LazyAppMenu class="z-10 h-full flex-none hidden md:flex" />
      <div class="relative overflow-y-scroll flex flex-col w-full min-h-full justify-between">
        <div class="py-4 lg:py-6 px-4 md:px-6 lg:px-10">
          <slot />
        </div>
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
