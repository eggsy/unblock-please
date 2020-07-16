import { StorageValues, get } from "./functions/storage";

let options: { extensionEnabled: boolean } = { extensionEnabled: true };
let unblocks: number = 0;

// Intervals to update options and stats
setInterval(() => {
  chrome.storage.local.get("options", updateData);
}, 250);

setInterval(() => {
  chrome.storage.local.get("stats", updateData);
}, 1000);

// Blocked requests
chrome.webRequest.onBeforeRequest.addListener(
  function(data) {
    if (!options.extensionEnabled) return;
    else if (new URL(data.url).hostname == "i.imgur.com") {
      unblocks++;
      return {
        redirectUrl: `https://proxy.duckduckgo.com/iu/?u=${data.url}`.replace(
          /ref=.*&|ref=.*$/,
          ""
        ),
      };
    }
  },
  { urls: ["*://*.imgur.com/*"] },
  ["blocking"]
);

// Extension on install/update
chrome.runtime.onInstalled.addListener(async (details) => {
  switch (details.reason) {
    case "install":
      install();
      break;
    case "update":
      update();
      break;
    default:
      break;
  }
});

function install() {
  chrome.storage.local.set({
    read: { update: true, projects: false },
    options: { extensionEnabled: true },
    stats: { unblocks: 0, latestUnblock: null },
  });
}

async function update() {
  chrome.browserAction.setBadgeText({
    text: "NEW",
  });

  chrome.storage.sync.clear();
  chrome.storage.local.set({
    read: { update: false, projects: (await get("read")).read.projects },
  });

  const oldWay = localStorage.getItem("extActive");
  const newWay = await get("options");

  if (oldWay) {
    chrome.storage.local.set({
      options: { extensionEnabled: oldWay },
    });

    // We won't be using this anymore.
    localStorage.removeItem("extActive");
  } else if (!newWay) {
    chrome.storage.local.set({
      options: { extensionEnabled: true },
    });
  }

  if (localStorage.getItem("latestUnblock")) {
    localStorage.removeItem("imgurUnblocks");
    localStorage.removeItem("latestUnblock");
  }
}

function updateData(data: StorageValues) {
  if (data.stats && unblocks > 0) {
    chrome.storage.local.set({
      stats: {
        unblocks: data.stats.unblocks + unblocks,
        latestUnblock: Date.now(),
      },
    });

    unblocks = 0;
  } else if (data.options) {
    options = data.options;
  }
}
