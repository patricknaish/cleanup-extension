/*jslint browser: true, devel: true*/
/*global chrome*/

var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

var combinedIds = [];
var errorCount = 0;
var currentId = 0;

function setMessage(message) {
    "use strict";
    document.getElementById("info").textContent = message;
}

function processNextTab(i) {
    "use strict";

    if (i > combinedIds.length - 1) {
        if (errorCount === 0) {
            setMessage("Done. " + i + " item(s) deleted.");
        } else {
            document.getElementById("info").setAttribute("style", "width:270px");
            setMessage("Done. " + (i - errorCount) + " item(s) deleted with " + errorCount + " error(s).");
        }

        if (currentId !== 0) {
            // Restore the original tab (mostly for Firefox's benefit)
            chrome.tabs.update(currentId, {
                active: true
            });
            // Refresh to show the updated post list
            setTimeout(function () {
                chrome.tabs.reload(currentId);
            }, 3000);
        }
        return;
    }

    setMessage("Processing items... " + (i + 1) + "/" + combinedIds.length);

    var splitId = combinedIds[i].split("_");
    var groupId = splitId[0];
    var postId = splitId[1];
    var src = "https://www.facebook.com/groups/" + groupId + "/permalink/" + postId + "/?sale_post_id=" + postId;
    var options = {};
    options.url = src;
    options.active = isFirefox;
    chrome.tabs.create(
        options,
        function (tab) {
            chrome.tabs.executeScript(tab.id, {
                file: "deletePost.js"
            });
            chrome.runtime.onMessage.addListener(
                function processNext(request) {
                    if (request.action === "done") {
                        chrome.tabs.remove(tab.id);
                        chrome.runtime.onMessage.removeListener(processNext);
                        processNextTab(i + 1);
                    } else if (request.action === "error") {
                        console.warn(request.detail);
                        chrome.runtime.onMessage.removeListener(processNext);
                        errorCount += 1;
                        processNextTab(i + 1);
                    }
                }
            );
        }
    );
}

function getIds() {
    "use strict";

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        currentId = tabs[0].id;
    });

    chrome.tabs.executeScript({
        file: "getPostIds.js"
    }, function (results) {
        if (!results || results.length !== 1 || !results[0]) {
            setMessage("Could not get list of posts.");
            return;
        }
        combinedIds = results[0];
        setMessage("Processing items... 0/" + combinedIds.length);
        processNextTab(0);
    });
}

document.addEventListener("DOMContentLoaded", getIds());