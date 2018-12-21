// Content script -- content.js
// Deletes the system requirements banner on the LEARN homepage
// By: Sean Miller
// 2018-12-21

  // this is the dreaded HTML element which encompasses 
  // the failed requirements field
  const bannerElement = document.querySelector(
    "body > div.d2l-page-main.d2l-max-width.d2l-min-width.d2l-home > div.d2l-page-main-padding > div.d2l-homepage > div > div > div > div.homepage-col-4 > div.d2l-widget.d2l-tile.d2l-custom-widget"
  );

  // destroy the banner
  bannerElement.parentNode.removeChild(bannerElement);
