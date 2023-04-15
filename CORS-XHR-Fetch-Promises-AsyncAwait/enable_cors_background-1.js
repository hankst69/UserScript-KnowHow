/*** 
  MoesifOriginAndCorsChanger_0.2.11_0 
***/

'use strict';

function isEmpty(value) {
    return value === undefined || value === null || value.trim() === '';
}

var requestOrigins = {};

function getOriginOverride() {
    var requestOrigin = localStorage.getItem('requestOrigin') || '';
    return requestOrigin;
}

function handleRequestHeaders(details) {

    var header;
    requestOrigins[details.requestId] = undefined;

    if (!details.url.startsWith('http://') && !details.url.startsWith('https://') || details.url.indexOf('moesif.com') != -1 || details.url.indexOf('apirequest.io') != -1) {
        return { requestHeaders: details.requestHeaders };
    }

    var url = new URL(details.url);

    for (var i = 0; i < details.requestHeaders.length; ++i) {
        header = details.requestHeaders[i];

        if (header.name.toLowerCase() === 'origin') {

            var originOverride = getOriginOverride(); // or get from localStorage from options.

            if (!isEmpty(originOverride)) {
                //add not empty also.
                header.value = originOverride.trim();
            }
            requestOrigins[details.requestId] = header.value;
        }
    }

    return { requestHeaders: details.requestHeaders,
        redirectUrl: details.url };
}

function handleResponseHeaders(details) {

    if (details.url.indexOf('moesif.com') != -1 || details.url.indexOf('apirequest.io') != -1) {
        return { responseHeaders: details.responseHeaders };
    }

    var header = null,
        requestOrigin = requestOrigins[details.requestId] || '',
        allowOrigin = localStorage.getItem('allowOrigin') || '*',
        allowHeaders = localStorage.getItem('allowHeaders') || '*',
        allowMethods = localStorage.getItem('allowMethods') || '*',
        allowCredentials = localStorage.getItem('allowCredentials') || 'false',
        oldAllowHeaders = '',
        responseHeaderNames = '',
        allowOriginFound = false,
        allowCredentialsFound = false,
        allowMethodsFound = false,
        allowHeadersFound = false;

    delete requestOrigins[details.requestId];

    for (var i = 0, len = details.responseHeaders.length; i < len; ++i) {
        header = details.responseHeaders[i];
        if (header.name.toLowerCase() === 'access-control-allow-credentials') {
            allowCredentialsFound = header.value.toLowerCase() === 'true';
        }
        if (header.name.toLowerCase() === 'access-control-allow-headers') {
            oldAllowHeaders = header.value;
        }
    }

    if (allowCredentials) {
        for (var i = 0, len = details.responseHeaders.length; i < len; ++i) {
            header = details.responseHeaders[i];
            responseHeaderNames += ',' + header.name;
        }
    }

    responseHeaderNames = (oldAllowHeaders.replace(/(^,)|(,$)/g, '') + ',' + responseHeaderNames.replace(/(^,)|(,$)/g, '')).replace(/(^,)|(,$)/g, '');

    for (i = 0, len = details.responseHeaders.length; i < len; ++i) {
        header = details.responseHeaders[i];
        if (header.name.toLowerCase() === 'access-control-allow-origin') {
            header.value = allowOrigin === '*' && allowCredentials === 'true' ? requestOrigin : allowOrigin;
            allowOriginFound = true;
        } else if (header.name.toLowerCase() === 'access-control-allow-headers') {
            header.value = allowHeaders === '*' ? responseHeaderNames : allowHeaders;
            allowHeadersFound = true;
        } else if (header.name.toLowerCase() === 'access-control-allow-methods') {
            header.value = allowMethods === '*' ? 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH' : allowMethods;
            allowMethodsFound = true;
        } else if (header.name.toLowerCase() === 'access-control-allow-credentials') {
            header.value = allowCredentials;
            allowCredentialsFound = true;
        }
    }

    if (!allowOriginFound) {
        details.responseHeaders.push({
            name: 'Access-Control-Allow-Origin',
            value: allowOrigin === '*' && allowCredentials === 'true' ? requestOrigin : allowOrigin
        });
    }
    if (!allowHeadersFound) {
        details.responseHeaders.push({
            name: 'Access-Control-Allow-Headers',
            value: allowHeaders === '*' ? responseHeaderNames : allowHeaders
        });
    }
    if (!allowMethodsFound) {
        details.responseHeaders.push({
            name: 'Access-Control-Allow-Methods',
            value: allowMethods === '*' ? 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH' : allowMethods
        });
    }
    if (!allowCredentialsFound) {
        details.responseHeaders.push({
            name: 'Access-Control-Allow-Credentials',
            value: allowCredentials
        });
    }

    return { responseHeaders: details.responseHeaders };
}

function setOn() {
    chrome.browserAction.setBadgeText({ text: 'on' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
    chrome.webRequest.onBeforeSendHeaders.addListener(handleRequestHeaders, { urls: ['<all_urls>'], types: ['xmlhttprequest'] }, ['blocking', 'requestHeaders']);
    chrome.webRequest.onHeadersReceived.addListener(handleResponseHeaders, { urls: ['<all_urls>'], types: ['xmlhttprequest'] }, ['blocking', 'responseHeaders']);
}
function setOff() {
    chrome.browserAction.setBadgeText({ text: 'off' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [128, 128, 128, 200] });
    chrome.webRequest.onBeforeSendHeaders.removeListener(handleRequestHeaders);
    chrome.webRequest.onHeadersReceived.removeListener(handleResponseHeaders);
}

if (localStorage.getItem('on')) {
    setOn();
} else {
    setOff();
}

// chrome.browserAction.onClicked.addListener(function () {
//     if (localStorage.getItem('on')) {
//         localStorage.setItem('on', '');
//         setOff();
//     } else {
//         localStorage.setItem('on', '1');
//         setOn();
//     }
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg === 'setOn') {
        setOn();
    }
    if (request.msg === 'setOff') {
        setOff();
    }
});

// chrome.runtime.onInstalled.addListener(details => {
//  console.log('previousVersion', details.previousVersion);
// });
//# sourceMappingURL=background.js.map
