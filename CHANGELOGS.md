## Changelogs for updates

Here I will write down the changelogs of updates, latest to oldest, I don't think there'll be a lot changes on this project after one point but it's still fun to have this! Also, don't get confused by the version numbers, they're just numbers, I just skip some of them because I do "BIG" changes some times.

### Version 3.0.0

- Now supports Pastebin! Using [pastebinp](https://pastebinp.com/) proxy to unblock access to it, this change also applies to the name. Since we are not only unblocking Imgur image access now, we renamed our extension to "Unblock Please".
- Code rework to make it able to unblock more than just one service.

### Version 2.6.5

- Removed content script, turns out it wasn't necessary.
  - This means I have also removed the "Scan Page" button; it shouldn't be a problem on any website even if it loads images after the page is loaded, request is still sent and our background script will take care of it.
- Code cleanup; cleaned the code like _a lot_.
- Changed font, I like this one more.

### Version 2.6.0

- Moved everything to TypeScript as it'd help you to contribute easier.
- Removed MDI (material design icons) and Vuetify compeletely (I was lazy to do this before). Exension size is almost 2 times lower than the of the old versions. No more console warnings about package being too big!
  - Note: I've tried to keep everything look the same but it might look a bit uglier than the older version but believe me, it's better this way.

### Version 2.5.0

- Stats are back, you can now see how many times you got helped by the extension and when was the last time.
- You will see a new `!` icon next to the extension's icon when you disable the extension.
- Now using `chrome.storage.local` instead of `chrome.storage.sync` because we don't want to sync anymore.

### Version 2.0.0

- Complete change. Everything's moved to Vue.
- Removed statistics for the sake of my life. Seems like some Chrome listeners doesn't like async.
- Now using `chrome.storage.sync` instead of `localStorage`. They say it's much better.

### Version 1.0.6

- Changed the style of the switch (by ardasoyturk).

### Version 1.0.5

- Scan page button, now you can scan the page even if auto scanner stopped.
- GitHub hotlink in the popup, now you can visit here any time you want!
- Bug fixes, little typos, everytime.

### Version 1.0.1

- Automatic check ups after the page load; this will help in case the website you're looking at is using JavaScript (like forums etc.) to render their webpage. This will try 10 times in 15 seconds to replace all imgur images on the page. And then it'll stop.
- That's all.
