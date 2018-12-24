// Content script -- content.js
// Deletes the system requirements banner on the LEARN homepage
// By: Sean Miller
// 2018-12-21

let xpath = "//div[contains(@class, 'results') and contains(string(), 'Your computer does not meet the system requirements')]";
let bannerElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

// destroy the banner
bannerElement.style.background = "#C0C0C0";