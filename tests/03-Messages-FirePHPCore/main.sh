#!/usr/bin/env bash.origin.script

depend {
    "webext": "@com.github/pinf-to/to.pinf.org.mozilla.web-ext#s1",
    "php": "@com.github/bash-origin/bash.origin.php#s1",
    "process": "@com.github/bash-origin/bash.origin.process#s1"
}

echo "TEST_MATCH_IGNORE>>>"

CALL_php composer install


local port="$(CALL_process free_port)"
echo "PHP server port: ${port}"

CALL_php start "${port}"


CALL_webext run {
    "homepage": ":${port}/",
    "manifest": {
        "permissions": [
            "webRequest",
            "webRequestBlocking",
            "<all_urls>"
        ],
        "background": {
            "scripts": [
                {
                    "worker.js": {
                        "@it.pinf.org.mochajs#s1": {
                            "suite": "worker",
                            "apiBaseUrl": "/tests",
                            "tests": {
                                "01-HelloWorld": function /* CodeBlock */ () {

                                    var WILDFIRE = require("$__DIRNAME__/../../src/wildfire");

                                    describe('Wait for messages', function () {
                                        this.timeout(5 * 1000);

                                        it('received', function (done) {

                                            WILDFIRE.once("error", done);

                                            var messages = {
                                                expected: [
                                                    "\"Hello World\"",
                                                    "\"Log message\"",
                                                    "\"Info message\"",
                                                    "\"Warn message\"",
                                                    "\"Error message\"",
                                                    "\"Message with label\"",
                                                    "{\"key1\":\"val1\",\"key2\":[[\"v1\",\"v2\"],\"v3\"]}",
                                                    "{\"data\":[[\"SELECT * FROM Foo\",\"0.02\",[\"row1\",\"row2\"]],[\"SELECT * FROM Bar\",\"0.04\",[\"row1\",\"row2\"]]],\"header\":[\"SQL Statement\",\"Time\",\"Result\"],\"title\":\"2 SQL queries took 0.06 seconds\"}",
                                                    "{\"RequestHeaders\":{\"key1\":\"val1\",\"key2\":[[\"v1\",\"v2\"],\"v3\"]}}"
                                                ],
                                                actual: []
                                            }

                                            WILDFIRE.on("message.firephp", function (message) {

                                                chai.assert.equal(message.sender, "http://meta.firephp.org/Wildfire/Plugin/FirePHP/Library-FirePHPCore/0.3");

                                                messages.actual.push(message.data);

                                                if (messages.actual.length === messages.expected.length) {

                                                    chai.assert.equal(message.receiver, "http://meta.firephp.org/Wildfire/Structure/FirePHP/Dump/0.1");
                                                    
                                                    messages.expected.forEach(function (expected, i) {

                                                        chai.assert.equal(messages.actual[i], expected);
                                                    });

                                                    done();

                                                } else {
                                                    chai.assert.equal(message.receiver, "http://meta.firephp.org/Wildfire/Structure/FirePHP/FirebugConsole/0.1");
                                                }
                                            });

                                            browser.tabs.reload();
                                        });
                                    });
                                }
                            }
                        }
                    }
                }
            ]
        }
    },
    "routes": {
        "^/tests": {
            "@it.pinf.org.mochajs#s1": {}
        }
    },
    "expect": {
        "exit": true,
        "conditions": [
            {
                "@it.pinf.org.mochajs#s1": {
                    "suites": [
                        "worker"
                    ]
                }
            }        
        ]
    }
}

echo "<<<TEST_MATCH_IGNORE"

echo "OK"

echo "TEST_MATCH_IGNORE>>>"

CALL_php stop "${port}"
