# tflive-layouts
On-stream [NodeCG](http://nodecg.com/) (`0.8.*`) graphics used by [TFLIVE](http://twitch.tv/tflivetv).

## Requirements
* Python 2.7
* Mumble (for `libopus`)
* `build-essentials` (or the appropriate build tools for your distribution).

## Installation
Clone this repository inside your `bundles` folder, navigate to `tflive-layouts`,
use `npm install` to build project dependencies (nodecg wouldn't do this
automatically, for some reason). Use `npm start` from the `nodecg` root directory
to start NodeCG.

## Usage
Please note that these graphics have been designed to be in-line with the rest
of TFLIVE's branding, and are thus not supposed to be used *as is* for any
other purpose. To quote [GamesDoneQuick/agdq16-layouts](https://github.com/GamesDoneQuick/agdq16-layouts):
> We are open-sourcing this bundle in hopes that people will use it as a
> learning tool and base to build from, rather than just taking and using it wholesale in their own productions.
> To reiterate, please don't just download and use this bundle as-is. Build something new from it.

## Thanks
* Wiethoofd and Shounic for the design + CSS.
* Alex Van "Lange" Camp, and everyone else in the [NodeCG Gitter](https://gitter.im/nodecg/nodecg) for the help.
