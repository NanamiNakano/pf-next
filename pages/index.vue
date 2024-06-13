<script setup lang="ts">
const userData = useUserDataStore()
const announcement = useAnnouncementStore()

onMounted(async () => {
  await announcement.fetchAll()
})
</script>

<template>
  <div>
    <h1 class="text-2xl">
      {{ $t("text.index.welcome") }} {{ userData.userData.name }}
    </h1>
    <UCard>
      <template #header>
        <h2 class="text-base">
          {{ $t("text.index.latestAnnouncement") }}
        </h2>
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>
