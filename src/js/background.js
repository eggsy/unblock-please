// This will only run when there's no record of extension's active state on localStorage.
runOnce();

chrome.webRequest.onBeforeRequest.addListener(function (data) {
    const unblocks = localStorage.getItem("imgurUnblocks"),
        latestUnblock = localStorage.getItem("latestUnblock");

    if (!unblocks) localStorage.setItem("imgurUnblocks", 0);
    if (!latestUnblock) localStorage.setItem("latestUnblock", Date.now());

    const activated = localStorage.getItem("extActive") || "true";

    if (activated == "true" && data.url != "https://imgur.com/" && data.url != "http://imgur.com/" && data.url != "https://imgur.com" && data.url != "http://imgur.com" && !data.url.includes("https://proxy.duckduckgo.com")) {
        localStorage.setItem("imgurUnblocks", (parseInt(unblocks) + 1));
        localStorage.setItem("latestUnblock", Date.now());

        return { redirectUrl: `https://proxy.duckduckgo.com/iu/?u=${data.url}`.replace(/ref=.*&|ref=.*$/, "") };
    }
}, {
    urls: ["*://*.imgur.com/*"]
}, ["blocking"]);

chrome.runtime.onMessage.addListener(function (request, sender, reply) {
    if (request.method == "getStatus") reply({ status: localStorage.getItem("extActive") });
    else if (request.method == "updateStats" && request.add) {
        addIfExistedOrCreateAndAdd(request.add);
        reply(`Successfully added ${request.add} unblock data! Good job!`);
    } else reply("Sorry, unable to replace images. Wait a while and see if they're going to change later, we have 1.5 seconds delay between each changes.");
});

function runOnce() {
    if (!localStorage.getItem("extActive")) localStorage.setItem("extActive", true);
}

function addIfExistedOrCreateAndAdd(value) {
    const exists = localStorage.getItem("imgurUnblocks");

    if (!exists) localStorage.setItem("imgurUnblocks", value);
    else if (exists) localStorage.setItem("imgurUnblocks", (parseInt(exists) + value));
}