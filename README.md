![FirePHP Logo](https://github.com/firephp/firephp-for-browser-devtools/blob/master/src/skin/Logo.png?raw=true "FirePHP Logo")

FirePHP for Browser Developer Tools ![Build](https://github.com/firephp/firephp-for-browser-devtools/workflows/Build/badge.svg)
===================================

This project holds the [FirePHP Tool](http://firephp.org) in the form of a Browser Extension compatible with:

  * Mozilla Firefox - https://developer.mozilla.org/en-US/Add-ons/WebExtensions
  * Google Chrome - https://developer.chrome.com/extensions
  * Brave - (runs Google Chrome extensions)

> Log from PHP to Browser Developer Tools via HTTP Response Headers.

Supported protocols:

  * FirePHP (Wildfire based)
  * [Chrome Logger](https://craig.is/writing/chrome-logger/techspecs)

For a list of supported server libraries see [http://firephp.org](http://firephp.org).


Preview
-------

<img src="https://github.com/firephp/firephp-for-browser-devtools/blob/master/src/skin/CodeScreenshot.png?raw=true" alt="Code" width="300"> &nbsp; <img src="https://github.com/firephp/firephp-for-browser-devtools/blob/master/src/skin/PanelScreenshot.png?raw=true" alt="Panel" width="300">


Install
=======

## Published

  * Firefox: [addons.mozilla.org/en-US/firefox/addon/firephp](https://addons.mozilla.org/en-US/firefox/addon/firephp/)
  * Chrome & Brave: [chrome.google.com/webstore/detail/firephp/ikfbpappjhegehjflebknjbhdocbgkdi](https://chrome.google.com/webstore/detail/firephp/ikfbpappjhegehjflebknjbhdocbgkdi)

## Local

  * Firefox & Chrome unpacked: [firephp.zip](https://github.com/firephp/firephp-for-browser-devtools/releases) (downloads do **NOT** auto-update)

## Source

Requirements (tested on macOS):

  * [bash 4](https://www.gnu.org/software/bash/) - GNU Bash
  * [nvm](https://github.com/creationix/nvm) - Node Version Manager

Build from source:

    nvm use 13
    npm install
    npm run build

*Load unpacked Addon* from `dist/firephp.build/` into Firefox, Chrome or Brave.

Run from source:

**Status: DEV - The development experience is still work in progress!**

    nvm use 13
    npm install
    npm run dev

## Notes for build reviewers

  * Releases for this extension are built using [github.com/pinf-to/to.pinf.org.mozilla.web-ext](https://github.com/pinf-to/to.pinf.org.mozilla.web-ext).
    * The tool provides a runtime framework for browser extensions as well as a build tool.
    * The build is controlled by `./#!inf.json`.
  * The following `./dist/firephp.build` files hold extension specific code and are built from `./src` by the build tool:
    * `scripts/background.js` - webext **background.page** code
    * `scripts/devtools/dist/index.js` - webext **devtools_page** code
    * `scripts/devtools/dist/*.rep.*` - generated from `src/*.rep.js`
    * `skin`
    * `manifest.json`
  * The following `./dist/firephp.build` files belong to the runtime framework and are generated by the build tool:
    * `devtools-page.js`
    * `devtools-page.html`
    * `background.js`
    * `background.html`
    * `lib.js`
    * `default.css`
    * `scripts/devtools/dist/index.loader.js`
    * `scripts/devtools/dist/index.html`
    * `run.config.json`
  * The following `./dist/firephp.build` files are supporting libraries provisioned by the build tool:
    * `scripts/devtools/dist/dist/jquery3.min.js` - https://code.jquery.com/jquery-3.5.0.min.js
    * `scripts/devtools/dist/dist/jsonrep.js` - https://github.com/jsonrep/jsonrep
    * `scripts/devtools/dist/dist/riot.csp.js` - https://github.com/riot/riot
    * `scripts/devtools/dist/dist/reps/insight.rep.js` - https://github.com/insight/insight.domplate.reps
    * `scripts/devtools/dist/dist/reps/insight.domplate.reps/` - https://github.com/insight/insight.domplate.reps
    * `scripts/devtools/dist/fireconsole.rep.*` - https://github.com/fireconsole/fireconsole.rep.js
    * `lib/codemirror` - https://github.com/codemirror/codemirror
    * `lib/github.com~pinf~pinf-for-mozilla-web-ext/` - https://github.com/pinf/pinf-for-mozilla-web-ext
    * `lib/eventemitter3.js` - https://github.com/primus/EventEmitter3


Provenance
==========

Copyright &copy; 2016-2020 [Christoph Dorn](http://christophdorn.com).
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
