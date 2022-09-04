<script lang="ts" setup>
const appConfig = useAppConfig()
</script>

<template>
  <div class="w-full bg-slate-800">
    <div class="flex justify-between max-w-3xl px-4 py-4 mx-auto sm:px-8">
      <NuxtLink to="/">
        <h1 class="text-white">
          Wes Doyle
        </h1>
      </NuxtLink>
      <div class="text-primary-700 dark:text-primary-200">
        <NuxtLink
          to="/"
          active-class="font-bold"
          class="mr-6 pointer"
        >
          Blog
        </NuxtLink>
        <NuxtLink
          to="reading"
          active-class="font-bold"
          class="mr-6 pointer"
        >
          Reading List
        </NuxtLink>
        <NuxtLink
          to="about"
          active-class="font-bold"
          class="mr-6 pointer"
        >
          About
        </NuxtLink>
      </div>

      <div class="space-x-3 transition text-primary-500">
        <a v-if="appConfig.socials?.linkedin" :href="`https://linkedin.com/in/${appConfig.socials?.linkedin}`" title="LinkedIn" class="dark:text-primary-100 hover:text-primary-700 dark:hover:text-primary-300"><Icon name="fa-brands:linkedin" class="w-5 h-5" /></a>
        <a v-if="appConfig.socials?.github" :href="`https://github.com/${appConfig.socials?.github}`" title="GitHub" class="dark:text-primary-100 hover:text-primary-700 dark:hover:text-primary-300"><Icon name="fa-brands:github" class="w-5 h-5" /></a>
        <a v-if="appConfig.socials?.youtube" :href="`https://youtube.com/c/${appConfig.socials?.youtube}`" title="YouTube" class="dark:text-primary-100 hover:text-primary-700 dark:hover:text-primary-300"><Icon name="fa-brands:youtube" class="w-5 h-5" /></a>
        <a v-if="appConfig.socials?.stackoverflow" :href="`https://stackoverflow.com//${appConfig.socials?.stackoverflow}`" title="stackoverflow" class="dark:text-primary-100 hover:text-primary-700 dark:hover:text-primary-300"><Icon name="fa-brands:stack-overflow" class="w-5 h-5" /></a>
        <a v-if="appConfig.socials?.twitter" :href="`https://twitter.com/${appConfig.socials?.twitter}`" title="Twitter" class="dark:text-primary-100 hover:text-primary-700 dark:hover:text-primary-300"><Icon name="fa-brands:twitter" class="w-5 h-5" /></a>
      </div>
    </div>
  </div>
</template>
