<script lang="ts" setup>
const { page } = useContent()

if (!page.hasValue && process.server) {
  const event = useRequestEvent()
  event.res.statusCode = 404
}
</script>

<template>
  <div class="document-driven-page">
    <NuxtLayout :name="page?.layout || 'default'">
      <h1 class="mt-8">
        {{ page.title }}
      </h1>
      <div>
        {{ new Date(page.date).toDateString() }}
      </div>
      <hr />
      <ContentRenderer v-if="page" :key="page._id" :value="page">
        <template #empty="{ value }">
          <DocumentDrivenEmpty :value="value" />
        </template>
      </ContentRenderer>
      <DocumentDrivenNotFound v-else />
    </NuxtLayout>
  </div>
</template>

<style scoped>
</style>
