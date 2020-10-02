#!/usr/bin/env bash

set -e

# TODO: Get rid of this file once issues are fixed in underlying libraries.

[ ! -e '.~/gi0.PINF.it~build~v0' ] || rm -Rf '.~/gi0.PINF.it~build~v0'
[ ! -e 'dist/firephp.build.firefox' ] || rm -Rf 'dist/firephp.build.firefox'
[ ! -e 'dist/firephp.build.chrome' ] || rm -Rf 'dist/firephp.build.chrome'

[ -e '.~lib.json' ] || node_modules/.bin/lib.json from node_modules > '.~lib.json'
