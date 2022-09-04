<script lang="ts" setup>
const appConfig = useAppConfig()
</script>

<template>
  <div class="w-full bg-slate-800">
    <div class="flex justify-between max-w-prose px-4 py-4 mx-auto sm:px-8">
      <NuxtLink to="/">
        <h1 class="text-white font-semibold hover:text-yellow-200">
          Wes Doyle
        </h1>
      </NuxtLink>
      <div class="text-primary-700">
        <NuxtLink
          to="/"
          active-class="border-b-2 border-yellow-200 text-yellow-200"
          class="mr-6 pointer text-white hover:text-yellow-200"
        >
          Blog
        </NuxtLink>
        <NuxtLink
          to="/reading"
          active-class="border-b-2 border-yellow-200 text-yellow-200"
          class="mr-6 pointer text-white hover:text-yellow-200"
        >
          Reading List
        </NuxtLink>
        <NuxtLink
          to="/about"
          active-class="border-b-2 border-yellow-200 text-yellow-200"
          class="mr-6 pointer text-white hover:text-yellow-200"
        >
          About
        </NuxtLink>
      </div>

      <div class="space-x-3 transition text-white">
        <a
          v-if="appConfig.socials?.linkedin"
          :href="`https://linkedin.com/in/${appConfig.socials?.linkedin}`"
          title="LinkedIn"
          class="hover:text-yellow-200"
          target="_blank"
        ><Icon name="fa-brands:linkedin" class="w-5 h-5" /></a>
        <a
          v-if="appConfig.socials?.github"
          :href="`https://github.com/${appConfig.socials?.github}`"
          title="GitHub"
          class="hover:text-yellow-200"
          target="_blank"
        ><Icon name="fa-brands:github" class="w-5 h-5" /></a>
        <a
          v-if="appConfig.socials?.youtube"
          :href="`https://youtube.com/c/${appConfig.socials?.youtube}`"
          title="YouTube"
          class="hover:text-yellow-200"
          target="_blank"
        ><Icon name="fa-brands:youtube" class="w-5 h-5" /></a>
        <a
          v-if="appConfig.socials?.stackoverflow"
          :href="`https://stackoverflow.com/5278004${appConfig.socials?.stackoverflow}`"
          title="stackoverflow"
          class="hover:text-yellow-200"
          target="_blank"
        ><Icon name="fa-brands:stack-overflow" class="w-5 h-5" /></a>
        <a
          v-if="appConfig.socials?.twitter"
          :href="`https://twitter.com/${appConfig.socials?.twitter}`"
          title="Twitter"
          class="hover:text-yellow-200"
          target="_blank"
        ><Icon name="fa-brands:twitter" class="w-5 h-5" /></a>
      </div>
    </div>
  </div>
</template>
