#!/usr/bin/env bash.origin.script

# TODO: Move to '#!inf.json' once pinf.it/build/v0 executes instructions in sequence.

function removeFiles {

    # Remove files that we do not need
    # TODO: Do this in a better way and coordinate with .gitignore
    rm -Rf scripts/devtools/dist/dist/riot.min.js
    rm -Rf scripts/devtools/dist/dist/riot.js
    rm -Rf scripts/devtools/dist/dist/babel-regenerator-runtime.js
    rm -Rf scripts/devtools/dist/dist/reps/insight.domplate.reps/dist/reps/dist/domplate.browser.js
    rm -Rf scripts/devtools/dist/dist/reps/insight.domplate.reps/dist/reps/dist/domplate-eval.browser.js
    rm -Rf lib/github.com~pinf~pinf-for-mozilla-web-ext/scripts/lib/pinf-loader-core.browser.js
    rm -Rf lib/github.com~pinf~pinf-for-mozilla-web-ext/scripts/lib/babel-regenerator-runtime.js
    rm -Rf scripts/devtools/dist/dist/reps/insight.domplate.reps/dist/reps/*/*.preview.htm
    rm -Rf scripts/devtools/dist/dist/reps/insight.domplate.reps/dist/reps/reps.json
    rm -Rf scripts/devtools/dist/dist/reps/io.shields.img.rep.js
    rm -Rf scripts/devtools/dist/dist/reps/div.rep.js
    rm -Rf scripts/devtools/dist/dist/reps/golden-layout.rep.js
    rm -Rf skin/box.png
    rm -Rf run.config.json
}


pushd "dist/firephp.build.firefox" > /dev/null

    removeFiles

    # Remove signed archive as it needs to be re-signed
    # rm -f ../firephp.build.xpi 2> /dev/null || true
popd > /dev/null

pushd "dist/firephp.build.chrome" > /dev/null
    removeFiles
popd > /dev/null


pushd "dist" > /dev/null

    filename="firephp-"
    if [ ! -z "${SM_ACT_GIT_BRANCH}" ]; then
        filename="${filename}-${SM_ACT_GIT_BRANCH}-${SM_ACT_GIT_SHA7}"
    else
        filename="${filename}-${SM_ACT_GIT_TAG}"
    fi

    echo "::set-env name=FIREPHP_BUILD_FILENAME_PREFIX::${filename}"

    pushd "firephp.build.firefox" > /dev/null
        zip -r -FS "../${filename}-firefox-flat.zip" * --exclude '.DS_Store'
    popd > /dev/null

    cp -R firephp.build.firefox "${filename}-firefox"
    zip -r "${filename}-firefox.zip" "${filename}-firefox/"

    pushd "firephp.build.chrome" > /dev/null
        zip -r -FS "../${filename}-chrome-flat.zip" * --exclude '.DS_Store'
    popd > /dev/null

    cp -R firephp.build.chrome "${filename}-chrome"
    zip -r "${filename}-chrome.zip" "${filename}-chrome/"

popd > /dev/null

BO_cecho "\nBuilt extension source can be found at 'dist/firephp.build.firefox/' and 'dist/firephp.build.chrome/'" YELLOW BOLD
BO_cecho "This source can be loaded into a browser when running in extension development mode.\n" YELLOW BOLD
