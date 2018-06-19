/*jslint browser: true, for: true*/

var combinedIds = [];

function getPostIds() {
    "use strict";

    // Get main "feed" div - this contains the first few items people will see
    var feed = document.querySelector("div[role=feed]");

    // Get the parent of the "feed" div, which also contains the items people will see when they scroll down
    var postList = feed.parentElement;

    var titleDiv; // The title DIV
    var soldText; // The first part of the post title
    var href; // Post URL
    var post; // Post ID
    var group; // Group ID
    var i; // Loop iterator

    // First, iterate through the "feed" items
    var initialPosts = feed.children;
    for (i = 0; i < initialPosts.length; i += 1) {
        titleDiv = initialPosts[i].children[0].children[1].children[0];
        // Check for (SOLD) before item name, to avoid accidentally deleting other stuff!
        // soldText = titleDiv.children[0].children[0].children[0].innerText.toUpperCase();
        // if (soldText === "(SOLD)") {
            // Get the href from the A tag wrapping the item title
            href = titleDiv.children[0].href;
            post = href.split("?sale_post_id=")[1];
            group = href.split("/groups/")[1].split("/permalink/")[0];
            combinedIds.push(group + "_" + post);
        // }
    }

    // Now iterate over the remaining items
    var otherPosts = postList.children;
    for (i = 1; i < otherPosts.length; i += 1) {
        titleDiv = otherPosts[i].children[0].children[1].children[0];
        // Check for (SOLD) before item name, to avoid accidentally deleting other stuff!
        // soldText = titleDiv.children[0].children[0].children[0].innerText.toUpperCase();
        // if (soldText === "(SOLD)") {
            // Get the href from the A tag wrapping the item title
            href = titleDiv.children[0].href;
            post = href.split("?sale_post_id=")[1];
            group = href.split("/groups/")[1].split("/permalink/")[0];
            combinedIds.push(group + "_" + post);
        // }
    }
}

getPostIds();

// Return the combined IDs to the background script
combinedIds;