import { StorageValues, OptionValues, get } from "./functions/storage";

let options: OptionValues = {
  unblock: {
    imgur: true,
    pastebin: true,
  },
};

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
    if (!getProxyUrl(data.url).proxyEnabled) return;
    else if (getProxyUrl(data.url).hasProxy) {
      unblocks++;
      return {
        redirectUrl: getProxyUrl(data.url).proxyUrl,
      };
    }
  },
  { urls: ["*://*.imgur.com/*", "*://pastebin.com/*"] },
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
    options: {
      unblock: {
        imgur: true,
        pastebin: true,
      },
    },
    stats: { unblocks: 0, latestUnblock: null },
  });
}

async function update() {
  const readProjects = (await get("read")).read.projects;
  const oldWay = {
    enabled: localStorage.getItem("extActive"),
    unblocks:
      localStorage.getItem("imgurUnblocks") ||
      (await get("stats")).stats?.unblocks ||
      0,
    latestUnblock:
      localStorage.getItem("latestUnblock") ||
      (await get("stats")).stats?.latestUnblock,
  };

  // Clear old settings;
  chrome.storage.sync.clear();
  chrome.storage.local.clear();

  chrome.storage.local.set({
    read: { update: false, projects: readProjects },
    options: {
      unblock: {
        imgur: oldWay.enabled || true,
        pastebin: oldWay.enabled || true,
      },
    },
    stats: {
      unblocks: oldWay.unblocks || 0,
      latestUnblock: oldWay.latestUnblock || null,
    },
  });

  if (localStorage.getItem("latestUnblock")) {
    localStorage.removeItem("imgurUnblocks");
    localStorage.removeItem("latestUnblock");
  }

  chrome.browserAction.setBadgeText({
    text: "NEW",
  });
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

function getProxyUrl(
  url
): { hasProxy: boolean; proxyEnabled?: boolean; proxyUrl?: string } {
  const willProxy = ["i.imgur.com", "pastebin.com"];

  try {
    if (!url) return { hasProxy: false };
    else if (!willProxy.some((u) => url.includes(u)))
      return {
        hasProxy: false,
      };

    const hostname = new URL(url).hostname;
    if (!willProxy.some((u) => u === hostname)) return { hasProxy: false };

    let proxyUrl = "";
    let key = "";

    switch (hostname) {
      case "i.imgur.com":
        proxyUrl = `https://proxy.duckduckgo.com/iu/?u=${url}`.replace(
          /ref=.*&|ref=.*$/,
          ""
        );
        key = "imgur";
        break;
      case "pastebin.com":
        proxyUrl = url.replace("pastebin.com", "pastebinp.com");
        key = "pastebin";
        break;
    }

    if (proxyUrl && key)
      return {
        hasProxy: true,
        proxyEnabled: !!options.unblock[key],
        proxyUrl,
      };
    else
      return {
        hasProxy: false,
      };
  } catch (err) {
    return { hasProxy: false };
  }
}
