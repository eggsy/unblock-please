## Changelogs for updates

Here I will write down the changelogs of updates, latest to oldest, I don't think there'll be a lot changes on this project after one point but it's still fun to have this! Also, don't get confused by the version numbers, they're just numbers, I just skip some of them because I do "BIG" changes some times.

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
