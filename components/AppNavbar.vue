<script lang="ts" setup>
const appConfig = useAppConfig()
</script>

<template>
  <div class="w-full bg-slate-900">
    <div class="flex justify-between max-w-6xl pt-3 pb-2 py-1 mx-auto flex-col sm:flex-row sm:px-0 items-center">
      <a href="/">
        <h1 class="text-white font-semibold hover:text-green-200 p-4 sm:flex sm:text-center block">
          <img
            src="public/sign.png"
            alt="doodle"
            class="h-[33px] pb-1 mr-2 inline"
          >
          Wes Doyle
        </h1>
      </a>
      <div class="text-primary-700 flex justify-between p-4">
        <a
          href="/"
          class="mr-6 pointer text-white hover:text-green-200"
        >
          Blog
        </a>
        <a
          href="/reading"
          class="mr-6 pointer text-white hover:text-green-200"
        >
          Reading
          <span class="hidden sm:inline">
            List
          </span>
        </a>
        <a
          href="/videos"
          class="mr-6 pointer text-white hover:text-green-200"
        >
          Videos
        </a>
        <a
          href="/about"
          class="mr-6 pointer text-white hover:text-green-200"
        >
          About
        </a>
        <a
          href="/uses"
          class="mr-6 pointer text-white hover:text-green-200"
        >
          Uses
        </a>
      </div>

      <div class="space-x-3 transition text-white flex justify-between my-3 px-4">
        <a
          v-if="appConfig.socials?.linkedin"
          :href="`https://linkedin.com/in/${appConfig.socials?.linkedin}`"
          title="LinkedIn"
          class="hover:text-green-200"
          target="_blank"
        ><Icon name="fa-brands:linkedin" class="w-5 h-5" /></a>
        <a
          v-if="appConfig.socials?.github"
          :href="`https://github.com/${appConfig.socials?.github}`"
          title="GitHub"
          class="hover:text-green-200"
          target="_blank"
        ><Icon name="fa-brands:github" class="w-5 h-5" /></a>
        <a
          v-if="appConfig.socials?.youtube"
          :href="`https://youtube.com/c/${appConfig.socials?.youtube}`"
          title="YouTube"
          class="hover:text-green-200"
          target="_blank"
        ><Icon name="fa-brands:youtube" class="w-5 h-5" /></a>
        <a
          v-if="appConfig.socials?.stackoverflow"
          :href="`https://stackoverflow.com/5278004${appConfig.socials?.stackoverflow}`"
          title="stackoverflow"
          class="hover:text-green-200"
          target="_blank"
        ><Icon name="fa-brands:stack-overflow" class="w-5 h-5" /></a>
        <a
          v-if="appConfig.socials?.twitter"
          :href="`https://twitter.com/${appConfig.socials?.twitter}`"
          title="Twitter"
          class="hover:text-green-200"
          target="_blank"
        ><Icon name="fa-brands:twitter" class="w-5 h-5" /></a>
      </div>
    </div>
  </div>
</template>
