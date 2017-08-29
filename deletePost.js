/*jslint browser: true, devel: true*/
/*global chrome*/

var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

function sendDone() {
    "use strict";

    chrome.runtime.sendMessage({
        action: "done"
    });
}

function clickButton() {
    "use strict";

    var button = document.querySelector("button[data-testid='delete_post_confirm_button']");
    if (button) {
        button.click();
    } else {
        chrome.runtime.sendMessage({
            action: "error",
            detail: "Could not get confirm button"
        });
        return;
    }
    if (isFirefox) {
        setTimeout(sendDone, 1000);
    } else {
        sendDone();
    }
}

function clickAnchor() {
    "use strict";

    // Find the A tag wrapping the delete button
    var anchor = document.querySelector("a[ajaxify*='ajax/groups/mall/delete.php?']");
    if (anchor) {
        anchor.click();
    } else {
        chrome.runtime.sendMessage({
            action: "error",
            detail: "Could not get menu item"
        });
        return;
    }

    setTimeout(clickButton, 1000);
}

// Get the menu at the top-right of the item area
var dropdown = document.querySelector("a[aria-label='Story options']");
if (!dropdown) {
    chrome.runtime.sendMessage({
        action: "error"
    });
}
dropdown.click();
// Wait for the menu to appear. This should be sufficient but may need tweaking on slower machines.
setTimeout(clickAnchor, 1000);