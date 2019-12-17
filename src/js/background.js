// This will only run when there's no record of extension's active state on localStorage.
runOnce();

chrome.webRequest.onBeforeRequest.addListener(function (data) {
    const activated = localStorage.getItem("extActive") || "true";
    const unblocks = localStorage.getItem("imgurUnblocks");

    if (!unblocks) localStorage.setItem("imgurUnblocks", 0);

    if (activated == "true" && data.url.includes("i.imgur.com") && data.url != "https://imgur.com/" && !data.url.includes("http://imgur.com/") && !data.url.includes("https://imgur.com/") && !data.url.includes("https://proxy.duckduckgo.com")) {
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
        reply(`Successfully added ${request.add} or more unblock data! Good job!`);
    } else reply("Sorry, extension was unable to replace images. Wait a while and see if they're going to change later, page will be scanned 10 times in 15 seconds.");
})

function runOnce() {
    if (!localStorage.getItem("extActive")) localStorage.setItem("extActive", true);
}

function addIfExistedOrCreateAndAdd(value) {
    const exists = localStorage.getItem("imgurUnblocks");

    if (!exists) localStorage.setItem("imgurUnblocks", value);
    else if (exists) localStorage.setItem("imgurUnblocks", (parseInt(exists) + value));
}