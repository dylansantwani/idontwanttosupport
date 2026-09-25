# I Don't Want to Support

A small Chrome extension for dismissing a support or ad-blocker prompt on the page you are viewing.

## What it does

Open the extension and select **Run on this page**. It looks for the first visible, enabled button or link whose text exactly matches one of these phrases:

- I don't want to support
- I do not want to support
- Continue without supporting this time
- Continue without supporting us
- Continue without disabling
- Continue with ad blocker
- Proceed without support

It clicks at most one match per press and then shows whether it clicked an option, found none, or could not access the page.

## Install from source

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose this repository folder.
5. Pin the extension, then press **Run on this page** when a supported prompt appears.

Chrome grants temporary page access when you open the extension. It executes only
after you press **Run on this page** and does not request access to every site.

## Development

Run the no-dependency tests with:

```sh
node --test test/*.test.js
```

## License

MIT. See [LICENSE](LICENSE).
