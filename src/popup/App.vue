<template>
  <div>
    <v-toolbar dense>
      <v-toolbar-title class="title">Imgur Please</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="redirect('https://github.com/eggsywashere/imgur-please')"
        v-tippy="{ content: 'Visit GitHub repository.' }"
        small
      >
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-toolbar>

    <div class="template">
      <v-overlay :value="!loaded" absolute :opacity="0.9">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <v-card v-if="!read.update" class="card" color="#41b983" dark>
        <v-btn class="close" @click="close('update')" icon x-small>
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-card-title class="headline">Updated!</v-card-title>

        <v-card-subtitle>You've upgraded to latest version! Enjoy!</v-card-subtitle>
      </v-card>
      <v-card
        v-if="!read.projects"
        @click="redirect('https://eggsy.codes')"
        class="card"
        color="#41b983"
        dark
      >
        <v-btn class="close notitle" @click="close('projects')" icon x-small>
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-card-text>
          Hey! Would you mind checking my other projects? They're also really
          cool!
        </v-card-text>
      </v-card>

      <v-card class="card" color="#2c3e50" dark>
        <v-card-title class="headline">Total unblocks</v-card-title>

        <v-card-subtitle>{{ stats.unblocks }}</v-card-subtitle>
      </v-card>

      <v-card class="card" color="#2980b9" dark>
        <v-card-title class="headline">Latest unblock</v-card-title>

        <v-card-subtitle>
          {{ stats.latestUnblock
          ? new Date(stats.latestUnblock).toLocaleString()
          : "Never"
          }}
        </v-card-subtitle>
      </v-card>

      <v-row class="button-row" no-gutters>
        <v-col>
          <v-btn raised dark small @click="scan()">Scan Page</v-btn>
        </v-col>
        <v-col>
          <v-btn icon small @click="redirect('webstore')">
            <v-icon>mdi-star</v-icon>
          </v-btn>
          <v-btn icon small @click="redirect('https://eggsy.codes')">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-footer absolute>
      <v-row justify="space-between" class="footer-row">
        <span class="status">
          Extension is
          {{ options.extensionEnabled ? "enabled" : "disabled" }}.
        </span>

        <v-spacer></v-spacer>

        <v-btn
          :color="options.extensionEnabled ? '#c0392b' : '#41b983'"
          class="button"
          dark
          small
          @click="switchExtension()"
        >{{ options.extensionEnabled ? "Disable" : "Enable" }}</v-btn>
      </v-row>
    </v-footer>
  </div>
</template>

<style lang="scss">
@import "../public/css/root.scss";
@import "../public/css/vuetify.min.css";

body {
  width: 250px;
  max-height: 350px;
  max-width: 250px;

  * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
  }

  :focus {
    outline: 0;
  }

  .v-input__slot {
    margin-bottom: unset;
  }

  .title {
    text-transform: uppercase;
  }

  .template {
    padding: 1em;
    overflow-y: auto;
    margin-bottom: 2.5em;

    .stat {
      display: flex;
    }

    .card {
      margin-bottom: 1em;

      .close {
        position: absolute;
        right: 0;
        margin: 2em 1em;

        &.notitle {
          margin: 1em 1em;
        }
      }

      &:hover {
        box-shadow: 0 5px 3px -4px rgba(0, 0, 0, 0.2),
          0 4px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 7px 0 rgba(0, 0, 0, 0.12);
      }
    }

    .button-row {
      margin-bottom: 1em;
      text-align: center;
    }
  }

  .footer-row {
    padding: 0 1em;

    .status {
      place-self: center;
    }

    .button {
      width: 6em;
    }
  }
}

::-webkit-scrollbar {
  width: 0.7em;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}
</style>

<script>
import { get } from "../plugins/functions/storage";

export default {
  data() {
    // Setting defaults so it doesn't look floppy while popup is generating.
    return {
      loaded: false,
      notification: false,
      read: { update: true, projects: true },
      options: { extensionEnabled: true },
      stats: { latestUnblock: null, unblocks: 0 }
    };
  },
  mounted() {
    this.updateData();
    this.interval = setInterval(() => this.updateData(), 150);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    redirect(url) {
      switch (url) {
        case "webstore":
          chrome.tabs.create({
            active: true,
            url: `https://chrome.google.com/webstore/detail/${chrome.runtime.id}`
          });
          break;
        default:
          chrome.tabs.create({
            active: true,
            url: url
          });
          break;
      }
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
        options: { extensionEnabled: !this.options.extensionEnabled }
      });

      chrome.browserAction.setBadgeText({
        text: !this.options.extensionEnabled ? "" : "!"
      });
    },
    scan() {
      chrome.tabs.getSelected(null, tab => {
        chrome.tabs.executeScript(tab.id, { code: this.scanCode() }, null);
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

      return true;
    },
    scanCode() {
      return `(()=>{let{stats}=await get("stats");for(let i in document.querySelectorAll("img")){let image=document.querySelectorAll("img")[i];if(image?.attributes?.src?.textContent.includes("i.imgur.com")&&new URL(image?.attributes?.src?.textContent).hostname=="i.imgur.com"){image.attributes.src.textContent="https://proxy.duckduckgo.com/iu/?u="+image.attributes.src.textContent}chrome.storage.local.set({stats:{unblocks: ++stats.unblocks,latestUnblock:Date.now()}})}triesLeft-=1})();`;
    }
  }
};
</script>
