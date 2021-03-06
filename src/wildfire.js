

const EVENTS = require("eventemitter2");
const ENCODER = require("insight-for-js/lib/encoder/default");

exports.Client = function (comp, options) {
    options = options || {};

    const API = new EVENTS();

    API.console = console;
    API.BROWSER = comp.browser;
    API.VERBOSE = options.verbose || false;
    API.WILDFIRE = require("wildfire-for-js");

    const REQUEST_OBSERVER = require("./adapters/http-request-observer").forAPI(API);
    const RESPONSE_OBSERVER = require("./adapters/http-response-observer").forAPI(API);


    let forceEnabled = false;
    API.forcedEnable = function (oo) {
        forceEnabled = oo;
    }


    comp.on("changed.context", function () {
        comp.contextChangeAcknowledged();
        syncListeners();
    });    
    comp.on("changed.setting", function () {
        syncListeners();
    });
    async function syncListeners () {
        const enabled = await comp.isEnabled();
        if (enabled) {
            ensureListenersHooked(comp.currentContext);
        } else {
            ensureListenersUnhooked(comp.currentContext);
        }
    }


    function ensureListenersHooked (currentContext) {
        requestObserver.ensureHooked(currentContext);
        responseObserver.ensureHooked(currentContext);
    }

    function ensureListenersUnhooked (currentContext) {
        requestObserver.ensureUnhooked(currentContext);
        responseObserver.ensureUnhooked(currentContext);
    }


    const encoder = ENCODER.Encoder();
    encoder.setOption("maxObjectDepth", 1000);
    encoder.setOption("maxArrayDepth", 1000);
    encoder.setOption("maxOverallDepth", 1000);

    function onChromeLoggerMessage (message, context) {
        try {
            let i,ic,j,jc;
            for (i=0,ic=message.rows.length ; i<ic ; i++) {
                let log = {};
                for (j=0,jc=message.columns.length ; j<jc ; j++) {
                    log[message.columns[j]] = message.rows[i][j];        
                }
                const meta = {
                    "msg.preprocessor": "FirePHPCoreCompatibility",
                    "lang.id" : "registry.pinf.org/cadorn.org/github/renderers/packages/php/master",
                    "priority": log.type
                };
                if (log.backtrace) {
                    let m = log.backtrace.match(/^([^:]+?)(\s*:\s*(\d+))?$/);
                    if (m) {
                        meta.file = m[1];
                        if (m[3] !== '') {
                            meta.line = parseInt(m[3]);
                        }
                    }
                }
                if (log.log.length === 1) {
                    log.log = log.log[0];
                }
                let dataNode = encoder.encode(log.log, {
                    "lang": "php"
                }, {
                    "jsonEncode": false
                });
                let node = dataNode.origin;
                Object.keys(meta).forEach(function (name) {
                    node.meta[name] = meta[name];
                });
                let msg = {
                    "context": context,
                    "sender": "https://github.com/ccampbell/chromelogger",
                    "receiver": "https://gi0.FireConsole.org/rep.js/InsightTree/0.1",
                    "meta": "{}",
                    "data": node
                };
                API.emit("message.firephp", msg);
            }
        } catch (err) {
            console.error("Error formatting chromelogger message:", err);
        }
    }


    API.on.transport = async function (message, request) {
        let info = {
            request: request,
            data: JSON.parse(message.data)
        };

        API.emit("message.transport", info);

//console.log("make backend request", JSON.stringify(info, null, 4));

        info.request.context.serverUrl = info.data.url;

        let url = info.data.url;
        if (url.indexOf("x-insight=transport") !== -1) {
            return;
        }

        if (url.indexOf("?") === -1) {
            url += "?";
        } else {
            url += "&";
        }
        url += "x-insight=transport";
        const response = await fetch(url, {
            method: 'POST',
            mode: 'same-origin',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'x-insight': 'transport'
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(info.data.payload)
        });

        const body = await response.text();

console.log("BODY", body);
//console.log("info.request", info.request);

        /*
        info.request: {
            "id": "80",
            "context": {
                "frameId": 0,
                "tabId": 1,
                "url": "http://127.0.0.1:8080/FirePHP.php",
                "hostname": "127.0.0.1",
                "requestId": "80",
                "requestType": "main_frame",
                "timeStamp": 1570337910009,
                "pageUrl": "http://127.0.0.1:8080/FirePHP.php",
                "pageTimeStamp": 1570337910009,
                "pageUid": "{\"url\":\"http://127.0.0.1:8080/FirePHP.php\",\"tabId\":1}",
                "requestUid": "{\"url\":\"http://127.0.0.1:8080/FirePHP.php\",\"timeStamp\":1570337910009,\"frameId\":0,\"tabId\":1}"
            },
            "status": 200
        },
        */

        httpHeaderChannel.parseReceived(body, {
            "id": info.request.id,
            "url": info.request.context.url,
            "hostname": info.request.context.hostname,
            "context": info.request.context,
            "port": 0,
            "method": "",
            "status": "",
            "contentType": "",
            "requestHeaders": ""
        });
    }


    API.callServer = async function (serverUrl, payload) {
        let url = serverUrl;
        if (url.indexOf("?") === -1) {
            url += "?";
        } else {
            url += "&";
        }
        url += "x-insight=serve";

console.log("Sending", payload, "to", url);

        var announceMessage = getAnnounceMessageForRequest(serverUrl.replace(/^https?:\/\/([^\/]+)\/.*$/, '$1'));
console.log("announceMessage", announceMessage);        

        var headers = {
            'Content-Type': 'application/json',
            'x-insight': 'serve'
        };

        if (announceMessage) {

            // dispatch announce message
            announceDispatcher.dispatch(announceMessage);

            // flush channel
            httpHeaderChannel.flush({
                setMessagePart: function (name, value) {
                    headers[name] = ('' + value);
                },
                getMessagePart: function (name) {
                    return headers[name];
                }
            });            
        }

console.log("headers::", headers);

        /*
        curl \
            --header "Content-Type: application/json" \
            --header "x-insight: serve" \
            --header "x-request-id: 157336719818551" \
            --header "x-wf-1-1: 875||{\"authkey\":\"mykey\",\"receivers\":[\"http://meta.firephp.org/Wildfire/Structure/FirePHP/FirebugConsole/0.1\",\"http://meta.firephp.org/Wildfire/Structure/FirePHP/Dump/0.1\",\"http://registry.pinf.org/cadorn.org/wildfire/@meta/receiver/transport/0\",\"http://registry.pinf.org/cadorn.org/insight/@meta/receiver/insight/controller/0\",\"http://registry.pinf.org/cadorn.org/insight/@meta/receiver/insight/plugin/0\",\"http://registry.pinf.org/cadorn.org/insight/@meta/receiver/insight/package/0\",\"http://registry.pinf.org/cadorn.org/insight/@meta/receiver/insight/selective/0\",\"http://registry.pinf.org/cadorn.org/insight/@meta/receiver/console/request/0\",\"http://registry.pinf.org/cadorn.org/insight/@meta/receiver/console/page/0\",\"http://registry.pinf.org/cadorn.org/insight/@meta/receiver/console/process/0\",\"http://registry.pinf.org/cadorn.org/insight/@meta/receiver/console/firephp/0\"]}|" \
            --header "x-wf-1-index: 1" \
            --header "x-wf-protocol-1: http://registry.pinf.org/cadorn.org/wildfire/@meta/protocol/announce/0.1.0" \
            --request POST \
            --data '{"target": "Insight_Plugin_FileViewer", "action": "GetFile", "args": {"path": "/christoph/projects/gi0.FirePHP.org/insight/demo/FirePHP.php"}}' \
            127.0.0.1:8080/FirePHP.php?x-insight=serve
        */

        const response = await fetch(url, {
            method: 'POST',
            mode: 'same-origin',
            cache: 'no-cache',
            credentials: 'include',
            headers: headers,
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(payload)
        });

console.log("response in wildfire", response);

        const body = await response.text();

console.log("BODY", body);

        return body;
    }


    var httpHeaderChannel = API.httpHeaderChannel = API.WILDFIRE.HttpHeaderChannel({
        "enableTransport": false,
        onError: function (err) {
            console.error("HttpHeaderChannel error:", err);
            API.emit("error", err);
        }
    });
    httpHeaderChannel.setNoReceiverCallback(function(id) {
        API.console.error("trying to log to unknown receiver (extension): " + id);
    });

    httpHeaderChannel.addListener({
        afterChannelOpen: function (context) {
    
            if (API.VERBOSE) console.log("[wildfire] httpHeaderChannel -| afterChannelOpen (context):", context);
    
            API.emit("response", {
                context: context.context
            });
        }
    });
    



    var transportReceiver1 = API.WILDFIRE.Receiver();
    transportReceiver1.setId("http://meta.firephp.org/Wildfire/Structure/FirePHP/FirebugConsole/0.1");
    transportReceiver1.addListener({
	    onMessageReceived: function(request, message) {
            message.context = request.context;
            API.emit("message.firephp", message);
        }
	});
    API.httpHeaderChannel.addReceiver(transportReceiver1);


    var transportReceiver2 = API.WILDFIRE.Receiver();
    transportReceiver2.setId("http://meta.firephp.org/Wildfire/Structure/FirePHP/Dump/0.1");
    transportReceiver2.addListener({
        onMessageReceived: function(request, message) {
            message.context = request.context;
            API.emit("message.firephp", message);
	    }
	});
    API.httpHeaderChannel.addReceiver(transportReceiver2);



    const receivers = {
        "http://registry.pinf.org/cadorn.org/wildfire/@meta/receiver/transport/0": {
            messageHandler: "transport"
        },
        "http://registry.pinf.org/cadorn.org/insight/@meta/receiver/insight/controller/0": {},
        "http://registry.pinf.org/cadorn.org/insight/@meta/receiver/insight/plugin/0": {},
        "http://registry.pinf.org/cadorn.org/insight/@meta/receiver/insight/package/0": {},
        "http://registry.pinf.org/cadorn.org/insight/@meta/receiver/insight/selective/0": {
            messageEvent: "message.insight.selective"
        },
        "http://registry.pinf.org/cadorn.org/insight/@meta/receiver/console/request/0": {
            messageEvent: "message.insight.request"
        },
        "http://registry.pinf.org/cadorn.org/insight/@meta/receiver/console/page/0": {
            messageEvent: "message.firephp"
        },
        "http://registry.pinf.org/cadorn.org/insight/@meta/receiver/console/process/0": {},

        "http://registry.pinf.org/cadorn.org/insight/@meta/receiver/console/firephp/0": {
            messageEvent: "message.firephp"
        }
    };
    Object.keys(receivers).forEach(function (uri) {

        var receiver = API.WILDFIRE.Receiver();
        receiver.setId(uri);
        receiver.addListener({
            onMessageReceived: function (request, message) {
                try {
                    message.context = request.context;
                    //API.console.log("INSIGHT MESSAGE [" + uri + "] onMessageReceived !1", message);
                    //API.console.log("INSIGHT MESSAGE API.on", API.on);
                    if (
                        receivers[uri].messageHandler &&
                        API.on &&
                        API.on[receivers[uri].messageHandler]
                    ) {
                        API.on[receivers[uri].messageHandler](message, request);
                    } else
                    if (receivers[uri].messageEvent) {
                        API.emit(receivers[uri].messageEvent, message);
                    } else {
    console.log("IGNORING insight MESSAGE:", uri, message);
                    }
                } catch (err) {
                    API.console.error(err);
                }
            }
        });
        API.httpHeaderChannel.addReceiver(receiver);
    });


    // FireConsole 0.x compatibility
    var announceDispatcher = API.WILDFIRE.Dispatcher();
    announceDispatcher.setProtocol('http://registry.pinf.org/cadorn.org/wildfire/@meta/protocol/announce/0.1.0');
    announceDispatcher.setChannel(httpHeaderChannel);
    function getAnnounceMessageForRequest (request) {

        if (!getAnnounceMessageForRequest._forHostnames) {
            getAnnounceMessageForRequest._forHostnames = {};
        }
        var cache = getAnnounceMessageForRequest._forHostnames;

        // TODO: Don't just use `request.hostname` for cache.
        // TODO: If config changes this announceMessage needs to be reset

        if (cache[request.hostname]) {
            return cache[request.hostname];
        }

        cache[request.hostname] = new API.WILDFIRE.Message();
        cache[request.hostname].setData(JSON.stringify({
            // TODO: Populate crypto-based key
            "authkey": "mykey",
            "receivers": httpHeaderChannel.receivers.map(function (receiver) {
                return receiver.getId();
            })
        }));

        return cache[request.hostname];
    }
    
    
    let hostnameSettings = {};  
//    API.hostnameSettings = hostnameSettings;
    

    const requestObserver = new REQUEST_OBSERVER(function (request) {
        // Firefox allows returning a promise since version 52
        // @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest
        // Chrome requires a sync return
        // @see https://developer.chrome.com/extensions/webRequest#event-onBeforeSendHeaders
    
        const settings = comp._getHostnameSettingsForSync(request.hostname);
    
        if (API.VERBOSE) console.log("[wildfire] forceEnabled:", forceEnabled);
        if (API.VERBOSE) console.log("[wildfire] request domain settings for '" + request.hostname + "':", settings);
    
        hostnameSettings[request.hostname] = settings;
        
        if (
            !forceEnabled &&
            !settings.enabled
        ) {
            return {};
        }
    
        if (
            forceEnabled ||
            settings.enableUserAgentHeader
        ) {
            if (!request.headers["User-Agent"].match(/\sFirePHP\/([\.|\d]*)\s?/)) {
                request.headers["User-Agent"] = request.headers["User-Agent"] + " FirePHP/0.5";
            }
        }
    
        if (
            forceEnabled ||
            settings.enableFirePHPHeader
        ) {
            request.headers["X-FirePHP-Version"] = "0.4";
        }

        if (API.VERBOSE) console.log("[wildfire] updated request headers:", request.headers);


        // FireConsole 0.x compatibility
        var announceMessage = getAnnounceMessageForRequest(request);
        if (announceMessage) {

            // dispatch announce message
            announceDispatcher.dispatch(announceMessage);

            // flush channel
            httpHeaderChannel.flush({
                setMessagePart: function (name, value) {
                    request.headers[name] = ('' + value);
                },
                getMessagePart: function (name) {
                    return request.headers[name];
                }
            });

        //} else {
        //    // TODO: Use a proper unique ID + counter.
        //    request.httpChannel.setRequestHeader("x-request-id", ""+(new Date().getTime()) + "" + Math.floor(Math.random()*1000+1), false);
        }

        return {
            requestHeaders: request.headers
        };
    });


    const responseObserver = new RESPONSE_OBSERVER(function (response) {
    
        var settings = hostnameSettings[response.request.context.hostname];
    
        if (
            !settings ||
            (
                !forceEnabled &&
                !settings.enabled
            )
        ) {
            return;
        }

        if (API.VERBOSE) console.log("[wildfire] response domain settings for '" + response.request.context.hostname + "':", settings);

        if (settings.enableChromeLoggerData) {
            let chromeLoggerMessage = response.headers.filter(function (header) {
                return (header.name === "X-ChromeLogger-Data");
            });
            if (chromeLoggerMessage.length > 0) {
                chromeLoggerMessage.forEach(function (header) {
                    try {
                        // @see https://craig.is/writing/chrome-logger/techspecs
                        var message = decodeURIComponent(escape(atob(header.value)));
                        message = JSON.parse(message);
        
                        onChromeLoggerMessage(message, response.request.context);
                    } catch (err) {
                        console.error("header", header);
                        console.error("Error processing message:", err);
                    }
                });
            }
        }
    
        //dump("RESPONSE IN EXTENSION2", response);
        //console.log("RESPONSE IN EXTENSION4", response);
        httpHeaderChannel.parseReceived(response.headers, {
            "id": response.request.id,
            "url": response.request.url,
            "hostname": response.request.hostname,
            "context": response.request.context,
            "port": response.request.port,
            "method": response.request.method,
            "status": response.status,
            "contentType": response.contentType,
            "requestHeaders": response.request.headers
        });
    });

    return API;
}
