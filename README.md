EndOfLine
=========

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/zokugun.endofline?label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=zokugun.endofline)
[![Open VSX Version](https://img.shields.io/open-vsx/v/zokugun/endofline?label=Open%20VSX)](https://open-vsx.org/extension/zokugun/endofline)
[![Donation](https://img.shields.io/badge/donate-ko--fi-green)](https://ko-fi.com/daiyam)
[![Donation](https://img.shields.io/badge/donate-liberapay-green)](https://liberapay.com/daiyam/donate)
[![Donation](https://img.shields.io/badge/donate-paypal-green)](https://paypal.me/daiyam99)

With [EndOfLine](https://github.com/zokugun/vscode-endofline), let's display the end-of-line characters with yours symbols and styles.

Configuration
-------------

In your settings:

```jsonc
{
    "endofline.cr.symbol": "←",
	"endofline.crlf.symbol": "↵",
	"endofline.lf.symbol": ".",
	"endofline.style": {
		"color": "#009999",
		"opacity": 0.5
	},
}
```

Settings
--------

| Setting                  | Description                                                                                                                               | Default |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `endofline.cr.symbol`    | Symbol displayed for CR (`\r`), the end-of-line sequence for Classic Mac.                                                                 | `¤`     |
| `endofline.cr.style`     | Style attributes (e.g., color, opacity) used to display this EOL symbol.                                                                  | `{}`    |
| `endofline.crlf.symbol`  | Symbol displayed for CRLF (`\r\n`), the end-of-line sequence for Windows.                                                                 | `¤¬`    |
| `endofline.crlf.style`   | Style attributes (e.g., color, opacity) used to display this EOL symbol.                                                                  | `{}`    |
| `endofline.enabled`      | Controls whether to display the EOL symbols or not.                                                                                       | `true`  |
| `endofline.lf.symbol`    | Symbol displayed for LF (`\n`), the end-of-line sequence for Linux and macOS.                                                             | `¬¤`    |
| `endofline.lf.style`     | Style attributes (e.g., color, opacity) used to display this EOL symbol.                                                                  | `{}`    |
| `endofline.notification` | Display notification when a new version is installed                                                                                      | `minor` |
| `endofline.style`        | Style attributes (e.g., color, opacity) used to display any EOL symbols. Ex: `"endofline.style" { "color" : "#009999", "opacity" : 0.7 }` | `{}`    |

Donations
---------

Support this project by becoming a financial contributor.

<table>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_kofi.png" alt="Ko-fi" width="80px" height="80px"></td>
        <td><a href="https://ko-fi.com/daiyam" target="_blank">ko-fi.com/daiyam</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_liberapay.png" alt="Liberapay" width="80px" height="80px"></td>
        <td><a href="https://liberapay.com/daiyam/donate" target="_blank">liberapay.com/daiyam/donate</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_paypal.png" alt="PayPal" width="80px" height="80px"></td>
        <td><a href="https://paypal.me/daiyam99" target="_blank">paypal.me/daiyam99</a></td>
    </tr>
</table>

**Enjoy!**
