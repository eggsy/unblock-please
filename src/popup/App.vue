<template>
  <div class="w-64">
    <header
      class="px-4 py-2 bg-gray-200 border-b-2 border-gray-800 border-opacity-5"
    >
      <div class="flex items-center justify-between">
        <div class="text-lg font-medium">Unblock Please</div>
        <a
          title="Visit GitHub page"
          class="p-1 text-white bg-gray-300 rounded-full hover:shadow-lg"
          href="https://github.com/eggsy/unblock-please"
          target="_blank"
        >
          <img
            class="w-6 h-6 text-white"
            :src="require('../assets/icons/github.svg')"
          />
        </a>
      </div>
    </header>

    <div
      v-if="!loaded"
      class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-75"
    >
      <h1 class="text-lg text-white">Loading...</h1>
    </div>

    <div class="px-3 py-5 bg-gray-100">
      <div class="grid gap-2">
        <div
          v-if="!read.update"
          title="Click to dismiss"
          class="relative p-4 text-white bg-green-600 rounded-md shadow-sm cursor-pointer group"
          @click="close('update')"
        >
          <div
            class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center transition bg-black bg-opacity-75 rounded-md opacity-0 pointer-events-none group-hover:opacity-100"
          >
            Click to dismiss
          </div>

          <div>
            <h1 class="text-base font-medium">Updated!</h1>
            <p class="text-sm">You've upgraded to latest version! Enjoy!</p>
          </div>
        </div>

        <div
          v-if="!read.projects"
          title="Click to dismiss"
          class="relative p-4 text-white bg-green-600 rounded-md shadow-sm cursor-pointer group"
          @click="
            redirect('https://eggsy.xyz');
            close('projects');
          "
        >
          <div
            class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center transition bg-black bg-opacity-75 rounded-md opacity-0 pointer-events-none group-hover:opacity-100"
          >
            Click to open and dismiss
          </div>

          <p class="text-sm">
            Hey! Would you mind checking my other projects? They're also really
            cool!
          </p>
        </div>

        <div class="p-4 text-white bg-indigo-900 rounded-md shadow-sm">
          <h1 class="text-xl font-medium">Total unblocks</h1>
          <span class="text-base font-light text-gray-100">{{
            stats.unblocks
          }}</span>
        </div>

        <div class="p-4 text-white bg-indigo-900 rounded-md shadow-sm">
          <h1 class="text-xl font-medium">Latest unblock</h1>
          <span class="text-base font-light text-gray-100">
            {{
              stats.latestUnblock
                ? new Date(stats.latestUnblock).toLocaleString()
                : "Never"
            }}
          </span>
        </div>
      </div>
    </div>

    <footer
      class="grid gap-1 px-4 py-2 bg-gray-200 border-t-2 border-gray-800 border-opacity-5"
    >
      <button
        :class="{
          'relative px-4 py-2 text-center text-white transition bg-red-800 rounded-md cursor-pointer focus:outline-none hover:bg-red-900 group': true,
          'bg-green-600 hover:bg-green-700': options.unblock.imgur,
        }"
        @click="disableUnblock('imgur')"
      >
        <div
          class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center transition bg-black bg-opacity-75 rounded-md opacity-0 pointer-events-none group-hover:opacity-100"
        >
          Click to {{ options.unblock.imgur ? "disable" : "enable" }}
        </div>

        Imgur
      </button>

      <button
        :class="{
          'relative px-4 py-2 text-center text-white transition bg-red-800 rounded-md cursor-pointer focus:outline-none hover:bg-red-900 group': true,
          'bg-green-600 hover:bg-green-700': options.unblock.pastebin,
        }"
        @click="disableUnblock('pastebin')"
      >
        <div
          class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center transition bg-black bg-opacity-75 rounded-md opacity-0 pointer-events-none group-hover:opacity-100"
        >
          Click to {{ options.unblock.pastebin ? "disable" : "enable" }}
        </div>

        Pastebin
      </button>
    </footer>
  </div>
</template>

<script>
import { get } from "../functions/storage";

export default {
  data() {
    // Setting defaults so it doesn't look floppy while popup is generating.
    return {
      loaded: false,
      notification: false,
      read: { update: true, projects: true },
      options: {
        unblock: {
          imgur: true,
          pastebin: true,
        },
      },
      stats: { latestUnblock: null, unblocks: 0 },
    };
  },
  mounted() {
    this.options.unblock = localStorage.getItem("unblocks")
      ? JSON.parse(localStorage.getItem("unblocks"))
      : this.options.unblock;

    this.updateData();
    this.interval = setInterval(this.updateData, 150);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    redirect(url) {
      chrome.tabs.create({
        active: true,
        url: url,
      });
    },
    async updateData() {
      let { read } = await get("read");
      let { stats } = await get("stats");

      if (read) this.read = read;
      if (stats) this.stats = stats;

      chrome.storage.local.set({
        options: {
          unblock: { ...this.options.unblock },
        },
      });

      this.loaded = navigator.onLine;
    },
    async disableUnblock(platform) {
      this.options.unblock[platform] = !this.options.unblock[platform];

      localStorage.setItem(
        "unblocks",
        JSON.stringify({ ...this.options.unblock })
      );

      if (!this.options.unblock.imgur && !this.options.unblock.pastebin)
        chrome.browserAction.setBadgeText({
          text: "!",
        });
      else
        chrome.browserAction.setBadgeText({
          text: "",
        });
    },
    close(type) {
      switch (type) {
        case "update":
          this.read["update"] = true;
          chrome.storage.local.set({ read: this.read });
          chrome.browserAction.setBadgeText({ text: "" });
          break;
        case "projects":
          this.read["projects"] = true;
          chrome.storage.local.set({ read: this.read });
          break;
        default:
          break;
      }
    },
  },
};
</script>
