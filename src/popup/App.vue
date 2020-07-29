<template>
  <div>
    <header class="toolbar">
      <div class="content">
        <div class="title">Imgur Please</div>
        <div class="spacer"></div>
        <a
          title="Visit GitHub page"
          href="https://github.com/eggsywashere/imgur-please"
          target="_blank"
        >
          <img
            class="icon"
            :src="require('../assets/icons/github.svg')"
            :style="{ width: '26px', height: '26px' }"
          />
        </a>
      </div>
    </header>

    <div class="overlay" v-if="!loaded"></div>

    <div class="body-content">
      <div class="cards">
        <div
          title="Click to dismiss"
          class="card clickable"
          v-if="!read.update"
          @click="close('update')"
          :style="{ backgroundColor: '#27ae60' }"
        >
          <h1 class="title">Updated!</h1>
          <p class="subtitle">You've upgraded to latest version! Enjoy!</p>
        </div>

        <div
          title="Click to dismiss"
          class="card clickable"
          v-if="!read.projects"
          @click="redirect('https://eggsy.xyz'); close('projects');"
          :style="{ backgroundColor: '#16a085' }"
        >
          <p class="subtitle single">
            Hey! Would you mind checking my other projects? They're also really
            cool!
          </p>
        </div>

        <div class="card" :style="{ backgroundColor: 'rgb(44, 62, 80)' }">
          <h1 class="title">Total unblocks</h1>
          <p class="subtitle">{{ stats.unblocks }}</p>
        </div>

        <div class="card" :style="{ backgroundColor: 'rgb(41, 128, 185)' }">
          <h1 class="title">Latest unblock</h1>
          <p class="subtitle">
            {{ stats.latestUnblock
            ? new Date(stats.latestUnblock).toLocaleString()
            : "Never"
            }}
          </p>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="flex">
        <span>Extension is {{ options.extensionEnabled ? "enabled" : "disabled" }}.</span>
        <button
          :class="`button btn-${options.extensionEnabled ? 'green' : 'red'}`"
          @click="switchExtension"
        >{{ options.extensionEnabled ? "Disable" : "Enable" }}</button>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
  font-family: "lexend Deca", "Segoe UI", sans-serif;
  width: 250px;
  max-height: 350px;
  max-width: 250px;

  .body-content {
    padding: 0.25em 1em;
  }

  .toolbar {
    display: block;
    flex: 1 1 auto;
    max-width: 100%;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
      left 0.2s cubic-bezier(0.4, 0, 0.2, 1),
      right 0.2s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
      max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2),
      0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);

    .title {
      font-family: "Segoe UI", sans-serif;
      text-transform: uppercase;
      font-size: 1.25rem;
      line-height: 1.5;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .content,
    .extension {
      height: 38px;
      align-items: center;
      display: flex;
      position: relative;
      padding: 4px 16px;
    }
  }

  .cards {
    margin-top: 1em;

    .card {
      display: block;
      max-width: 100%;
      overflow-wrap: break-word;
      position: relative;
      white-space: normal;
      transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: box-shadow;
      color: #fff;
      margin: 1em 0 1em 0;
      border-radius: 4px;
      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

      .title {
        padding: 16px 16px 0 16px;
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        font-size: 1.25rem;
        font-weight: 500;
        letter-spacing: 0.0125em;
        line-height: 2rem;
        word-break: break-all;
        margin-bottom: 0;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      .subtitle {
        color: hsla(0, 0%, 100%, 0.7);
        padding: 1em;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.375rem;
        letter-spacing: 0.007em;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-top: -1em;

        &.single {
          margin-top: 1em;
        }
      }

      &:hover {
        box-shadow: 0 5px 3px -4px rgba(0, 0, 0, 0.2),
          0 4px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 7px 0 rgba(0, 0, 0, 0.12);
      }
    }
  }

  .footer {
    background-color: #f5f5f5;
    color: rgba(0, 0, 0, 0.87);
    height: 3em;
    padding: 0 1em;

    * {
      align-self: center;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .button {
      width: 6.5em;
    }
  }

  .button {
    align-items: center;
    border-radius: 4px;
    flex: 0 0 auto;
    font-weight: 500;
    justify-content: center;
    outline: 0;
    position: relative;
    text-transform: uppercase;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 0.75rem;
    color: #fff;
    padding: 0.25em 0.75em;
    height: 28px;
    min-width: 50px;
    border: 0;
    cursor: pointer;
    transition: opacity 0.2s, box-shadow 0.2s;

    &:hover {
      opacity: 0.95;
      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    }

    span {
      align-items: center;
      color: inherit;
      display: flex;
      flex: 1 0 auto;
      justify-content: inherit;
      line-height: normal;
      position: relative;
    }
  }

  .btn-black {
    background-color: #272727;
  }

  .btn-green {
    background-color: #27ae60;
  }

  .btn-red {
    background-color: #c0392b;
  }

  .icon {
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.75;
    }
  }

  .block {
    width: 100%;
  }

  .spacer {
    flex-grow: 1 !important;
  }

  .flex {
    display: flex;
    justify-content: space-between;
    height: 100%;
  }

  .clickable {
    cursor: pointer;
  }
}
</style>

<script>
import { get } from "../functions/storage";

export default {
  data() {
    // Setting defaults so it doesn't look floppy while popup is generating.
    return {
      loaded: false,
      notification: false,
      read: { update: true, projects: true },
      options: { extensionEnabled: true },
      stats: { latestUnblock: null, unblocks: 0 },
    };
  },
  mounted() {
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
      let { options } = await get("options");
      let { read } = await get("read");
      let { stats } = await get("stats");

      if (options) this.options = options;
      if (read) this.read = read;
      if (stats) this.stats = stats;

      this.loaded = navigator.onLine;
    },
    async switchExtension() {
      chrome.storage.local.set({
        options: { extensionEnabled: !this.options.extensionEnabled },
      });

      chrome.browserAction.setBadgeText({
        text: !this.options.extensionEnabled ? "" : "!",
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
