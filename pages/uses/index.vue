<template>
  <div class="px-4 py-4 mx-auto sm:px-8 max-w-3xl">
    <div class="flex flex-col min-h-screen overflow-hidden">
      <h1 class="font-bold my-8 text-2xl text-slate-600">
        What I Use
      </h1>
      <p class="mb-4">
        I'm fairly agnostic when it comes to hardware and programming languages.
        However, I strongly prefer Unix-like operating systems and working
        in the terminal with tmux + vim. I
        <a href="https://github.com/wesdoyle/dotfiles" target="_blank" class="text-blue-500 underline">
          version control my dotfiles here.
        </a>
      </p>
      <h2 class="text-2xl font-semibold mt-4">
        Output
      </h2>
      <p class="my-2">
        These are the tools I use for day-to-day software development and content production.
      </p>
      <div class="grow mx-auto text-lg grid grid-cols-2 w-full">
        <div class="my-2 p-2">
          <h4 class="font-semibold text-blue-400">
            Workstation
          </h4>
          <ul class="p-0 mb-8 text-sm">
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:apple-logo-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-blue-500"
              />
              Computer: MacBook Pro (16-inch, 2021)
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:keyboard-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-blue-500"
              />
              Keyboard: CODE V3 87-Key + Cherry MX Clear
            </li>
          </ul>
          <h4 class="font-semibold text-red-400">
            Content Production Hardware
          </h4>
          <p class="text-slate-400 text-sm">
            This is the gear I currently use to produce content for YouTube and ProductiveDev.
          </p>
          <ul class="p-0 mb-8 text-sm">
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:camera-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-red-500"
              />
              Camera: Sony a6400
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:camera-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-red-500"
              />
              Lens: Sony SEL16F28 16mm f/2.8 Wide-Angle
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:microphone-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-red-500"
              />
              Mic: Shure SM7B
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:record-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-red-500"
              />
              DAW: Focusrite Scarlett 4i4
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:sun-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-red-500"
              />
              Lighting: 2X NEEWER 660
            </li>
          </ul>
          <h4 class="font-semibold text-amber-400">
            Course Production
          </h4>
          <p class="text-slate-400 text-sm">
            This is the software I currently use to produce course content.
          </p>
          <ul class="p-0 mb-8 text-sm">
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:file-video-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-amber-500"
              />
              Video Editing: Adobe Premiere
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:file-audio-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-amber-500"
              />
              Audio Editing: Adobe Audition
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:picture-in-picture-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-amber-500"
              />
              Thumbnails: Canva
            </li>
          </ul>
        </div>
        <div class="my-2 p-2">
          <h4 class="font-semibold text-indigo-400">
            Tools / Environments
          </h4>
          <ul class="p-0 mb-8 text-sm">
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:note-pencil-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-indigo-500"
              />
              Editing: tmux + vim
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:terminal-window-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-indigo-500"
              />
              Terminal Emulator: iTerm2
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:terminal-bold"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-indigo-500"
              />
              Shell: zsh
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:lightning-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-indigo-500"
              />
              IDEs: JetBrains
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:cloud-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-indigo-500"
              />
              Cloud: AWS
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:computer-tower-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-indigo-500"
              />
              VMs: Debian
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:rainbow-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-indigo-500"
              />
              Themes: PaperColor, OceanicNext, hydrangea
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:lightning-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-indigo-500"
              />
              Hashicorp tools
            </li>
          </ul>
          <h4 class="font-semibold text-emerald-400">
            Greenfield Stack
          </h4>
          <p class="text-slate-400 text-sm">
            Given a choice, these are my typical go-to languages, frameworks, and platforms for new projects.
          </p>
          <ul class="p-0 mb-8 text-sm">
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:terminal-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-emerald-500"
              />
              Web: .NET, Vue.js, TypeScript, Cypress
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:database-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-emerald-500"
              />
              ML / Data: Python ecosystem, Spark, Airflow, SQL
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:cloud-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-emerald-500"
              />
              Infrastructure: AWS, Terraform, containerd
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:robot-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-emerald-500"
              />
              CI / CD: GitHub Actions
            </li>
          </ul>
        </div>
      </div>

      <h2 class="text-2xl font-semibold mt-4">
        Input
      </h2>

      <p class="my-2">
        These are the things I interact with to learn, recharge, and find inspiration.
      </p>
      <div class="grow mx-auto text-lg grid grid-cols-3 w-full">
        <div class="my-2 p-2">
          <h4 class="font-semibold text-blue-400">
            At Work
          </h4>
          <p class="text-slate-400 text-sm">
            I enjoy working in-person as part of an engineering-focused culture.
            Remote is OK, too, but it's tough to replace in-person interaction.
          </p>
          <ul class="p-0 mb-8 text-sm">
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:apple-logo-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-blue-500"
              />
              Demo Days
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:keyboard-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-blue-500"
              />
              Lunch-and-Learns
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:keyboard-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-blue-500"
              />
              1:1's
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:tennis-ball-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-blue-500"
              />
              The ping pong table
            </li>
          </ul>
        </div>
        <div class="my-2 p-2">
          <h4 class="font-semibold text-blue-400">
            Outside Work
          </h4>
          <p class="text-slate-400 text-sm">
            Some of the best ideas come on walks
          </p>
          <ul class="p-0 mb-8 text-sm">
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:tree-evergreen-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-blue-500"
              />
              State Parks
            </li>
          </ul>
        </div>
        <div class="my-2 p-2">
          <h4 class="font-semibold text-blue-400">
            Reading
          </h4>
          <p class="text-slate-400 text-sm">
            There are few luxuries in life as valuable as reading.
          </p>
          <ul class="p-0 mb-8 text-sm">
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:book-open-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-blue-500"
              />
              O'Reilly Books
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:file-audio-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-blue-500"
              />
              Audible
            </li>
            <li class="flex pl-0 space-x-2 my-2">
              <Icon
                name="ph:monitor-duotone"
                class="flex-shrink-0 w-6 h-6 mr-2 mt-1 text-blue-500"
              />
              A Cloud Guru
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
