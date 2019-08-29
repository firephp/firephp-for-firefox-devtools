![FirePHP Logo](https://github.com/firephp/firephp-for-browser-devtools/blob/master/src/skin/Logo.png?raw=true "FirePHP Logo")

FirePHP for Browser Developer Tools
===================================

This project holds the [FirePHP Tool](http://firephp.org) in the form of a Browser Extension compatible with:

  * Mozilla Firefox - https://developer.mozilla.org/en-US/Add-ons/WebExtensions
  * Google Chrome - https://developer.chrome.com/extensions

> Log from PHP to Browser Developer Tools via HTTP Response Headers.

Supported protocols:

  * Wildfire (FirePHP)
  * Chrome Logger

For a list of supported server libraries see [http://firephp.org](http://firephp.org).


Install
-------

### Published

  * Firefox: [addons.mozilla.org/en-US/firefox/addon/firephp](https://addons.mozilla.org/en-US/firefox/addon/firephp/)
  * Chrome: [chrome.google.com/webstore/detail/firephp/ikfbpappjhegehjflebknjbhdocbgkdi](https://chrome.google.com/webstore/detail/firephp/ikfbpappjhegehjflebknjbhdocbgkdi)

### Local

**NOTE:** These downloads do **NOT** auto-update!

  * Firefox: [dist/firephp.xpi](https://github.com/firephp/firephp-for-browser-devtools/raw/master/dist/firephp.xpi)
  * Chrome: [dist/firephp.build](https://github.com/firephp/firephp-for-browser-devtools/raw/master/dist/firephp.build)

### Source

Requirements:

  * [bash 4](https://www.gnu.org/software/bash/) - GNU Bash
  * [nvm](https://github.com/creationix/nvm) - Node Version Manager

Build from source:

**Status: DEV - Commands will currently not run for you!**

    rm -Rf dist/        # Optional to verify build
    nvm use 9
    npm install
    npm run build       # Append '--ignore-dirty' if you removed 'dist/'
    git diff            # Optional to verify build
        # Only the `version` property in `dist/firephp.build/manifest.json` should have changed.

*Load Addon* from `dist/firephp.build/` into Firefox or Chrome.

Preview
-------

<img src="https://github.com/firephp/firephp-for-browser-devtools/blob/master/src/skin/CodeScreenshot.png?raw=true" alt="Code" width="300"> &nbsp; <img src="https://github.com/firephp/firephp-for-browser-devtools/blob/master/src/skin/PanelScreenshot.png?raw=true" alt="Panel" width="300">

Provenance
==========

Copyright 2016 [Christoph Dorn](http://christophdorn.com).
Licensed under the [Open Software License (OSL 3.0)](https://opensource.org/licenses/OSL-3.0).
Contributions must be licensed under the [Academic Free License (AFL 3.0)](https://opensource.org/licenses/AFL-3.0).
Learn about the OSL & AFL Licenses [here](http://rosenlaw.com/OSL3.0-explained.htm).

```
Open Software License (OSL) 3.0

You are free to:
    Use Commercially, Distribute, Modify, Use Patents, Use Privately

Under the following terms:
    Disclose source, License and copyright notice, Network use is distribution, Same license

You cannot:
    Use trademark, Hold liable, Claim warranty
```
```
Academic Free License (AFL) 3.0

You are free to:
    Use Commercially, Distribute, Modify, Use Patents, Use Privately

Under the following terms:
    License and copyright notice

You cannot:
    Use trademark, Hold liable, Claim warranty
```

> Well-crafted Contributions are Welcome.

**INTENDED USE:** The *Logic and Code contained within* forms a **Developer Tool** and is intended to operate as part of a *Web Software Development Toolchain* on which a *Production System* operates indirectly. It is **NOT INTENDED FOR USE IN HIGH-LOAD ENVIRONMENTS** as there is *little focus on Runtime Optimization* in order to *maximize API Utility, Compatibility and Flexibility*.

If you *need more* than what is contained within, study the Code, understand the Logic, and build your *Own Implementation* that is *API Compatible*. Share it with others who follow the same *Logic* and *API Contract* specified within. This Community of Users may want to use Your Work in their own *Software Development Toolchains*.
