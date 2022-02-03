## Unstated

A simple stateless password manager, inspired by [LessPass](https://lesspass.com).

[Try it here](https://cubified.github.io/unstated)

### Screenshot

![screenshot](https://github.com/Cubified/unstated/blob/master/screenshot.png)

### Technical Explanation

Password generation is a two-step process:
1. A combination of the site name, username, and master password is SHA512/224 hashed.
2. The output hash is encoded using a modified form of the Base64 encoding algorithm, mapping 3 character input segments to 4 characters of output.

### Chrome Extension

Included in the `chrome_extension/` folder is a simple extension capable of automatically filling password fields on websites using Unstated's password generation algorithm.  It also supports adding exceptions (either through the extension's options page or on the webpage for Unstated itself) to username, allowed characters, length, and any other property configurable on the Unstated web app.

To install the extension, navigate to [chrome://extensions](chrome://extensions) and ensure that "Developer mode" is enabled.  Next, click "Load unpacked" and select the `chrome_extension/` folder.

Before using, the master password must be saved in the extension.  To do this, either open the extension's options page (click the puzzle piece in the top right, then the three dots next to Unstated, then "Options") or navigate to [Unstated](https://cubified.github.io/unstated) and enter it there.
