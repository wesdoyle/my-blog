<script lang="ts" setup>
const appConfig = useAppConfig()
</script>

<template>
  <div class="w-full bg-slate-800">
    <div class="flex justify-between max-w-3xl px-2 py-8 mx-auto flex-col sm:flex-row sm:px-0">
      <a href="/">
        <h1 class="text-white font-semibold hover:text-yellow-200 p-4 flex text-center">
          Wes Doyle
        </h1>
      </a>
      <div class="text-primary-700 flex justify-between p-4">
        <a
          href="/"
          class="mr-6 pointer text-white hover:text-yellow-200"
        >
          Blog
        </a>
        <a
          href="/reading"
          class="mr-6 pointer text-white hover:text-yellow-200"
        >
          Reading List
        </a>
        <a
          href="/videos"
          class="mr-6 pointer text-white hover:text-yellow-200"
        >
          Videos
        </a>
        <a
          href="/about"
          class="mr-6 pointer text-white hover:text-yellow-200"
        >
          About
        </a>
        <a
          href="/uses"
          class="mr-6 pointer text-white hover:text-yellow-200"
        >
          Uses
        </a>
      </div>

      <div class="space-x-3 transition text-white flex justify-between my-3 px-4">
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
