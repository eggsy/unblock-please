const { get } = require("./plugins/functions/storage");

let options = { extensionEnabled: true };
setInterval(() => chrome.storage.sync.get("options", updateData), 250);

chrome.webRequest.onBeforeRequest.addListener(
  function(data) {
    if (!options.extensionEnabled) return;
    else if (new URL(data.url).hostname == "i.imgur.com") {
      return {
        redirectUrl: `https://proxy.duckduckgo.com/iu/?u=${data.url}`.replace(
          /ref=.*&|ref=.*$/,
          ""
        )
      };
    }
  },
  { urls: ["*://*.imgur.com/*"] },
  ["blocking"]
);

chrome.runtime.onInstalled.addListener(async details => {
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

function updateData(data) {
  options = data.options;
}

function install() {
  chrome.storage.sync.clear();

  chrome.storage.sync.set({
    read: { update: true, projects: false },
    options: { extensionEnabled: true }
  });
}

async function update() {
  chrome.storage.sync.set({ read: { update: false, projects: false } });

  let oldWay = localStorage.getItem("extActive");
  let newWay = await get("options");

  if (oldWay) {
    chrome.storage.sync.set({
      options: { extensionEnabled: oldWay }
    });

    // We won't be using this anymore.
    localStorage.removeItem("extActive");
  } else if (!newWay) {
    chrome.storage.sync.set({
      options: { extensionEnabled: true }
    });
  }

  if (localStorage.getItem("latestUnblock")) {
    localStorage.removeItem("imgurUnblocks");
    localStorage.removeItem("latestUnblock");
  }
}
